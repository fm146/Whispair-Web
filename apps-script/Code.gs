/**
 * Whispair Backend - Google Apps Script
 * Refactored for Modular Data Management & Enhanced Blog CMS
 */

// === CONFIGURATION ===
const CONFIG = {
  SPOTIFY_CLIENT_ID: "YOUR_SPOTIFY_CLIENT_ID",
  SPOTIFY_CLIENT_SECRET: "YOUR_SPOTIFY_CLIENT_SECRET",
  SPOTIFY_ARTIST_ID: "7kZeWIy0BTHJfBRcYOQVFR",
  SPREADSHEET_ID: "YOUR_GOOGLE_SHEET_ID",
  API_KEY: "whispair_secret_key", // Match with your .env
};

/**
 * Main Routing Engine (GET)
 */
function doGet(e) {
  const action = e.parameter.action;
  const key = e.parameter.key;

  if (key !== CONFIG.API_KEY) return createJsonResponse({ error: "Unauthorized" }, 401);

  try {
    switch (action) {
      // --- SPREADSHEET DATA ---
      case "latest_release": return createJsonResponse(SheetManager.getLatestRelease());
      case "releases": return createJsonResponse(SheetManager.getReleases(e.parameter.limit));
      case "track_facts": return createJsonResponse(SheetManager.getTrackFacts(e.parameter.title));
      case "shop_items": return createJsonResponse(SheetManager.getShopItems());
      
      // --- BLOG (GOOGLE DOCS) ---
      case "blog_posts": return createJsonResponse(BlogManager.getAllPosts());
      case "blog_post": return createJsonResponse(BlogManager.getPostContent(e.parameter.slug));
      
      default: return createJsonResponse({ error: "Invalid action" }, 400);
    }
  } catch (error) {
    return createJsonResponse({ error: error.message }, 500);
  }
}

/**
 * Main Routing Engine (POST)
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.key !== CONFIG.API_KEY) return createJsonResponse({ error: "Unauthorized" }, 401);

    switch (data.action) {
      case "submit_booking": return createJsonResponse(SheetManager.saveBooking(data.payload));
      case "submit_order": return createJsonResponse(SheetManager.saveOrder(data.payload));
      default: return createJsonResponse({ error: "Invalid POST action" }, 400);
    }
  } catch (error) {
    return createJsonResponse({ error: error.message }, 500);
  }
}

// ==========================================
// 1. BLOG MANAGER (GOOGLE DOCS LOGIC)
// ==========================================
const BlogManager = {
  /**
   * Scans Registry and returns ON status posts
   */
  getAllPosts: function() {
    const registry = SheetManager.getTable("BlogRegistry");
    const posts = [];

    registry.forEach(row => {
      if (!row.docId) return;
      const meta = this.parsePostMetadata(row.docId);
      if (meta && meta.STATUS === "ON") {
        posts.push({
          slug: row.slug,
          title: meta.TITLE,
          description: meta.DESC,
          date: meta.RELEASE_DATE,
          author: meta.AUTHOR || "Whispair",
          status: meta.STATUS
        });
      }
    });
    return posts;
  },

  /**
   * Only returns content if STATUS is ON
   */
  getPostContent: function(slug) {
    const registry = SheetManager.getTable("BlogRegistry");
    const postEntry = registry.find(p => p.slug === slug);
    if (!postEntry) throw new Error("Post not found");

    const doc = DocumentApp.openById(postEntry.docId);
    const meta = this.parsePostMetadata(postEntry.docId);
    
    if (meta.STATUS !== "ON") throw new Error("Post is currently offline");

    return {
      meta: {
        slug: slug,
        title: meta.TITLE,
        description: meta.DESC,
        date: meta.RELEASE_DATE,
        author: meta.AUTHOR || "Whispair"
      },
      content: this.parseDocToHtmlSection(doc.getBody())
    };
  },

  /**
   * Regex based metadata parser for <start> config
   */
  parsePostMetadata: function(docId) {
    const doc = DocumentApp.openById(docId);
    const text = doc.getBody().getText();
    
    const extract = (key) => {
      const regex = new RegExp(key + "\\s*:\\s*\\{(.+?)\\}", "i");
      const match = text.match(regex);
      return match ? match[1].trim() : "";
    };

    return {
      TITLE: extract("TITLE"),
      DESC: extract("DESC"),
      RELEASE_DATE: extract("RELEASE DATE"),
      STATUS: extract("STATUS").toUpperCase(),
      AUTHOR: extract("AUTHOR")
    };
  },

  /**
   * Advanced Parser for <start> <end> including Images
   */
  parseDocToHtmlSection: function(body) {
    const numChildren = body.getNumChildren();
    let html = "";
    let reading = false;

    for (let i = 0; i < numChildren; i++) {
          const element = body.getChild(i);
          const type = element.getType();
          const text = (type === DocumentApp.ElementType.PARAGRAPH || type === DocumentApp.ElementType.LIST_ITEM) 
                       ? element.asText().getText().trim() : "";

          if (text.toLowerCase() === "<start>") { reading = true; continue; }
          if (text.toLowerCase() === "<end>") { reading = false; continue; }
          if (!reading) continue;

          if (type === DocumentApp.ElementType.PARAGRAPH) {
            if (text === "" || text.includes("TITLE :") || text.includes("STATUS :")) continue;
            html += `<p>${this.formatElement(element)}</p>`;
          } else if (type === DocumentApp.ElementType.INLINE_IMAGE) {
            html += this.processImage(element);
          } else if (type === DocumentApp.ElementType.LIST_ITEM) {
            html += `<li>${this.formatElement(element)}</li>`;
          }
    }
    return html;
  },

  formatElement: function(el) {
    // Basic link formatting helper
    return el.asText().getText(); 
  },

  processImage: function(img) {
    try {
      const blob = img.asInlineImage().getBlob();
      const base64 = Utilities.base64Encode(blob.getBytes());
      return `<img src="data:${blob.getContentType()};base64,${base64}" class="blog-image" />`;
    } catch (e) { return ""; }
  }
};

/**
 * HELPER: Run this from GS Editor to generate a new post template quickly
 */
function createNewBlogTemplate() {
  const doc = DocumentApp.getActiveDocument() || DocumentApp.create("New Whispair Article");
  const body = doc.getBody();
  
  body.appendParagraph("<start>");
  body.appendParagraph("TITLE : {Judul Artikel Disini}");
  body.appendParagraph("DESC : {Meta deskripsi singkat untuk SEO}");
  body.appendParagraph("RELEASE DATE : {" + new Date().toLocaleDateString() + "}");
  body.appendParagraph("STATUS : {OFF}");
  body.appendParagraph("AUTHOR : {Whispair}");
  body.appendParagraph("");
  body.appendParagraph("Tulis konten artikel Anda di sini...");
  body.appendParagraph("");
  body.appendParagraph("<end>");
  
  Logger.log("Template generated. Link: " + doc.getUrl());
}

// ==========================================
// 2. SPREADSHEET MANAGER (DATABASE LOGIC)
// ==========================================
const SheetManager = {
  getTable: function(sheetName) {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName(sheetName);
    if (!sheet) return [];
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    return data.slice(1).map(row => {
      let obj = {};
      headers.forEach((h, i) => obj[h] = row[i]);
      return obj;
    });
  },

  getLatestRelease: function() {
    return this.getTable("Music")[0] || null;
  },

  getReleases: function(limit = 10) {
    return this.getTable("Music").slice(0, limit);
  },

  getTrackFacts: function(title) {
    const facts = this.getTable("MusicFacts");
    return facts.find(f => f.title.toLowerCase() === title.toLowerCase()) || null;
  },

  getShopItems: function() {
    return this.getTable("Shop").filter(item => item.active === true || item.active === "TRUE");
  },

  saveBooking: function(payload) {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName("Bookings");
    sheet.appendRow([new Date(), payload.name, payload.phone, payload.date, payload.venue, payload.message, "NEW"]);
    return { success: true };
  },

  saveOrder: function(payload) {
    const sheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID).getSheetByName("Orders");
    sheet.appendRow([new Date(), payload.productId, payload.productName, payload.price, payload.customerName, payload.address, payload.phone, "UNPAID"]);
    return { success: true };
  }
};

/**
 * Global Utility
 */
function createJsonResponse(data, status = 200) {
  return ContentService.createTextOutput(JSON.stringify({ status, data })).setMimeType(ContentService.MimeType.JSON);
}
