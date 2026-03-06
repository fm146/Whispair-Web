/**
 * Whispair API Proxy - Google Apps Script
 * Deploy as Web App, execute as "Me", access "Anyone".
 */

// === CONFIGURATION ===
// Replace these with your actual IDs and credentials
const CONFIG = {
  SPOTIFY_CLIENT_ID: "YOUR_SPOTIFY_CLIENT_ID",
  SPOTIFY_CLIENT_SECRET: "YOUR_SPOTIFY_CLIENT_SECRET",
  SPOTIFY_ARTIST_ID: "7kZeWIy0BTHJfBRcYOQVFR", // Whispair's Spotify Artist ID
  SPREADSHEET_ID: "YOUR_GOOGLE_SHEET_ID",
  API_KEY: "whispair_secret_key", // simple auth for requests
};

/**
 * Handle GET requests
 */
function doGet(e) {
  const action = e.parameter.action;
  const key = e.parameter.key;

  if (key !== CONFIG.API_KEY) {
    return createJsonResponse({ error: "Unauthorized" }, 401);
  }

  try {
    switch (action) {
      case "latest_release":
        return createJsonResponse(getLatestRelease());
      case "smartlink_config":
        return createJsonResponse(getSmartlinkConfig());
      case "blog_posts":
        return createJsonResponse(getBlogPosts());
      case "blog_post":
        return createJsonResponse(getBlogPost(e.parameter.slug));
      case "releases":
        return createJsonResponse(getReleases(e.parameter.limit || 10));
      case "track_facts":
        return createJsonResponse(getTrackFacts(e.parameter.title));
      default:
        return createJsonResponse({ error: "Invalid action" }, 400);
    }
  } catch (error) {
    return createJsonResponse({ error: error.message }, 500);
  }
}

/**
 * Fetch lyrics and story from a "TrackFacts" sheet
 */
function getTrackFacts(title) {
  if (!title) throw new Error("Title is required");

  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(
    "TrackFacts",
  );
  if (!sheet) return null;

  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const rows = data.slice(1);

  const fact = rows.find(
    (row) => row[0].toString().toLowerCase() === title.toLowerCase(),
  );
  if (!fact) return null;

  let obj = {};
  headers.forEach((header, i) => {
    obj[header] = fact[i];
  });
  return obj;
}

/**
 * Handle POST requests (Booking form)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (data.key !== CONFIG.API_KEY) {
      return createJsonResponse({ error: "Unauthorized" }, 401);
    }

    if (data.action === "submit_booking") {
      const sheet = SpreadsheetApp.openById(
        CONFIG.SPREADSHEET_ID,
      ).getSheetByName("Bookings");
      if (!sheet) throw new Error("Bookings sheet not found");

      // Appending: [Timestamp, Name, Phone, Type, Date, Venue, Message]
      sheet.appendRow([
        new Date().toISOString(),
        data.payload.name || "",
        data.payload.phone || "",
        data.payload.type || "",
        data.payload.date || "",
        data.payload.venue || "",
        data.payload.message || "",
      ]);

      return createJsonResponse({
        success: true,
        message: "Booking submitted",
      });
    }

    return createJsonResponse({ error: "Invalid action" }, 400);
  } catch (error) {
    return createJsonResponse({ error: error.message }, 500);
  }
}

/**
 * Helper to return JSON Response
 */
function createJsonResponse(data, status = 200) {
  return ContentService.createTextOutput(
    JSON.stringify({
      status: status,
      data: data,
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
// SPOTIFY API
// ==========================================

function getSpotifyToken() {
  const cache = CacheService.getScriptCache();
  const cachedToken = cache.get("spotify_token");
  if (cachedToken) return cachedToken;

  const authString = Utilities.base64Encode(
    CONFIG.SPOTIFY_CLIENT_ID + ":" + CONFIG.SPOTIFY_CLIENT_SECRET,
  );
  const response = UrlFetchApp.fetch("https://accounts.spotify.com/api/token", {
    method: "post",
    headers: {
      Authorization: "Basic " + authString,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    payload: "grant_type=client_credentials",
  });

  const json = JSON.parse(response.getContentText());
  const token = json.access_token;
  // Spotify token expires in 1 hour (3600s), cache for 50 minutes (3000s)
  cache.put("spotify_token", token, 3000);
  return token;
}

function getLatestRelease() {
  const token = getSpotifyToken();
  const response = UrlFetchApp.fetch(
    `https://api.spotify.com/v1/artists/${CONFIG.SPOTIFY_ARTIST_ID}/albums?limit=1&include_groups=album,single`,
    {
      headers: { Authorization: "Bearer " + token },
    },
  );

  const data = JSON.parse(response.getContentText());
  if (!data.items || data.items.length === 0) return null;

  const latest = data.items[0];
  return {
    artist:
      latest.artists && latest.artists[0] ? latest.artists[0].name : "Whispair",
    releaseDate: latest.release_date,
    albumArt: latest.images && latest.images[0] ? latest.images[0].url : "",
    spotifyLink: latest.external_urls ? latest.external_urls.spotify : "",
    type: latest.album_type,
    totalTracks: latest.total_tracks || 1,
  };
}

function getReleases(limit = 10) {
  const token = getSpotifyToken();
  const response = UrlFetchApp.fetch(
    `https://api.spotify.com/v1/artists/${CONFIG.SPOTIFY_ARTIST_ID}/albums?limit=${limit}&include_groups=album,single`,
    {
      headers: { Authorization: "Bearer " + token },
    },
  );

  const data = JSON.parse(response.getContentText());
  if (!data.items || data.items.length === 0) return [];

  return data.items.map((item) => ({
    title: item.name,
    artist: item.artists && item.artists[0] ? item.artists[0].name : "Whispair",
    releaseDate: item.release_date,
    albumArt: item.images && item.images[0] ? item.images[0].url : "",
    spotifyLink: item.external_urls ? item.external_urls.spotify : "",
    type: item.album_type,
    totalTracks: item.total_tracks || 1,
  }));
}

// ==========================================
// SMARTLINK & SPREADSHEET
// ==========================================

function getSmartlinkConfig() {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(
    "Smartlink",
  );
  if (!sheet) throw new Error("Smartlink sheet not found");

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  const headers = data[0];
  const rows = data.slice(1);

  return rows
    .map((row) => {
      let obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    })
    .filter((item) => item.active === true || item.active === "TRUE");
}

// ==========================================
// BLOG CMS (GOOGLE DOCS)
// ==========================================

function getBlogPosts() {
  const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(
    "BlogPosts",
  );
  if (!sheet) throw new Error("BlogPosts sheet not found");

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];

  const headers = data[0];
  const rows = data.slice(1);

  return rows
    .map((row) => {
      let obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] || "";
      });
      return obj;
    })
    .filter((post) => post.status === "Published");
}

function getBlogPost(slug) {
  if (!slug) throw new Error("Slug is required");

  const posts = getBlogPosts();
  const postInfo = posts.find((p) => p.slug === slug);

  if (!postInfo) throw new Error("Post not found");
  if (!postInfo.docId) throw new Error("Doc ID not configured for this post");

  const doc = DocumentApp.openById(postInfo.docId);
  const body = doc.getBody();

  // Extract text and convert valid formatting to HTML
  const htmlContent = parseDocToHtml(body);

  return {
    meta: postInfo, // includes slug, title, description, keywords, date, author
    content: htmlContent,
  };
}

/**
 * Parses Google Document finding content strictly between <start> and <end>
 * and converts to semantic HTML
 */
function parseDocToHtml(body) {
  const numChildren = body.getNumChildren();
  let readingStarted = false;
  let html = "";

  for (let i = 0; i < numChildren; i++) {
    const element = body.getChild(i);
    const type = element.getType();
    const text = element.asText().getText().trim();

    if (text === "<start>") {
      readingStarted = true;
      continue;
    }

    if (text === "<end>") {
      readingStarted = false;
      break;
    }

    if (!readingStarted) continue;

    if (type === DocumentApp.ElementType.PARAGRAPH) {
      if (text === "") {
        continue;
      }
      const heading = element.getHeading();
      let tag = "p";

      switch (heading) {
        case DocumentApp.ParagraphHeading.HEADING1:
          tag = "h1";
          break;
        case DocumentApp.ParagraphHeading.HEADING2:
          tag = "h2";
          break;
        case DocumentApp.ParagraphHeading.HEADING3:
          tag = "h3";
          break;
        case DocumentApp.ParagraphHeading.HEADING4:
          tag = "h4";
          break;
        case DocumentApp.ParagraphHeading.HEADING5:
          tag = "h5";
          break;
        case DocumentApp.ParagraphHeading.HEADING6:
          tag = "h6";
          break;
      }

      html += `<${tag}>${formatTextWithLinks(element)}</${tag}>`;
    } else if (type === DocumentApp.ElementType.LIST_ITEM) {
      // Basic list handling
      html += `<ul><li>${formatTextWithLinks(element)}</li></ul>`;
      // Note: For a robust implementation, consecutive list items should be grouped
      // under a single <ul>. This is a simplified version suitable for basic blogs.
    }
  }

  // Group adjacent <ul> tags
  html = html.replace(/<\/ul><ul>/g, "");

  return html;
}

function formatTextWithLinks(element) {
  const textElement = element.asText();
  const rawText = textElement.getText();
  if (!rawText) return "";

  let result = "";
  let currentStart = 0;
  let inLink = false;
  let currentUrl = null;

  for (let i = 0; i < rawText.length; i++) {
    const url = textElement.getLinkUrl(i);

    // Transition points
    if (url !== currentUrl) {
      if (currentUrl) {
        // End of previous link
        result += `<a href="${currentUrl}" target="_blank" rel="noopener noreferrer">${rawText.substring(currentStart, i)}</a>`;
      } else if (currentStart < i) {
        // End of plain text
        result += rawText.substring(currentStart, i);
      }

      currentUrl = url;
      currentStart = i;
    }
  }

  // Handle remaining text
  if (currentUrl) {
    result += `<a href="${currentUrl}" target="_blank" rel="noopener noreferrer">${rawText.substring(currentStart)}</a>`;
  } else if (currentStart < rawText.length) {
    result += rawText.substring(currentStart);
  }

  return result;
}
