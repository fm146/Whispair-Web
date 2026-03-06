export const API_URL = process.env.API_URL || "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";
export const API_KEY = process.env.API_KEY || "whispair_secret_key";

export const REVALIDATE_INTERVAL = 21600; // 6 hours

export interface Release {
  title: string;
  artist: string;
  releaseDate: string;
  albumArt: string;
  spotifyLink: string;
  type: string;
  totalTracks: number;
}

export interface LatestRelease extends Release {}

export interface SmartlinkConfig {
  active: boolean | string;
  title: string;
  url: string;
  icon: string;
  order: number;
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  date: string;
  author: string;
  status: string;
}

export interface BlogPost {
  meta: BlogPostMeta;
  content: string;
}

export interface InstagramPhoto {
  id: string;
  url: string;
  caption: string;
  permalink: string;
  timestamp: string;
}

export interface TrackFacts {
  title: string;
  lyrics: string;
  story: string;
  artist?: string;
  releaseDate?: string;
  spotifyLink?: string;
}

/**
 * Helper to fetch from Apps Script securely
 */
async function fetchFromApi(action: string, payload?: any, method: "GET" | "POST" = "GET", revalidate: number = REVALIDATE_INTERVAL) {
  try {
    const url = new URL(API_URL);
    
    let options: RequestInit = {
      method,
      headers: {
        "Accept": "application/json"
      }
    };

    if (method === "GET") {
      url.searchParams.append("action", action);
      url.searchParams.append("key", API_KEY);
      
      if (payload) {
        Object.keys(payload).forEach(k => url.searchParams.append(k, payload[k]));
      }

      options.next = { revalidate }; 
    } else {
      // POST
      options.body = JSON.stringify({
        action,
        key: API_KEY,
        payload
      });
      // Do not cache POST requests
      options.cache = "no-store";
    }

    const res = await fetch(url.toString(), options);
    
    if (!res.ok) {
      console.warn(`API fetch [${action}] failed: ${res.statusText} (${res.status}). Ensure API_URL is correctly configured.`);
      return null;
    }

    const json = await res.json();
    if (json.status !== 200) {
      console.warn(`API [${action}] returned error: ${json.data?.error || "Unknown error"}`);
      return null;
    }

    return json.data;
  } catch (error) {
    console.error(`Error fetching [${action}]:`, error);
    return null;
  }
}

// ==========================================
// EXPORTED API METHODS
// ==========================================

export async function getLatestRelease(): Promise<LatestRelease | null> {
  const data = await fetchFromApi("latest_release", undefined, "GET", 21600); // 6 hours
  if (!data) {
    return {
      title: "Different Path",
      artist: "Whispair",
      releaseDate: "2026-02-20",
      albumArt: "https://i.scdn.co/image/ab67616d00001e0201d605ea8178d6f0bad9b71d",
      spotifyLink: "https://open.spotify.com/album/2ivd2uEXo4Gv2THhhqfpFd",
      type: "single",
      totalTracks: 1
    };
  }
  return data;
}

export async function getReleases(limit: number = 10): Promise<Release[]> {
  const data = await fetchFromApi("releases", { limit }, "GET", 21600); // 6 hours
  if (!data || data.length === 0) {
    return [
      {
        title: "Different Path",
        artist: "Whispair",
        releaseDate: "2026-02-20",
        albumArt: "https://i.scdn.co/image/ab67616d00001e0201d605ea8178d6f0bad9b71d",
        spotifyLink: "https://open.spotify.com/album/2ivd2uEXo4Gv2THhhqfpFd",
        type: "single",
        totalTracks: 1
      }
    ];
  }
  return data;
}

export async function getSmartlinkConfig(): Promise<SmartlinkConfig[]> {
  const result = await fetchFromApi("smartlink_config", undefined, "GET", 3600); // 1 hour for smartlinks
  if (!result || result.length === 0) {
    return [
      { active: true, title: "Spotify", url: "https://open.spotify.com/artist/7kZeWIy0BTHJfBRcYOQVFR", icon: "spotify", order: 1 },
      { active: true, title: "Apple Music", url: "#", icon: "apple", order: 2 },
      { active: true, title: "YouTube", url: "#", icon: "youtube", order: 3 },
    ];
  }
  return result;
}

export async function getBlogPosts(): Promise<BlogPostMeta[]> {
  const result = await fetchFromApi("blog_posts", undefined, "GET", 43200); // 12 hours
  if (!result || result.length === 0) {
    return [
      { slug: "tour-announcement", title: "New Tour Dates Announced", description: "Get ready for the loudest shows of the year. Tickets on sale this Friday.", keywords: "tour, live", date: "2026-03-01", author: "Management", status: "Published" },
      { slug: "single-release", title: "Behind the new single 'Different Path'", description: "A deeper look into the studio sessions and raw energy driving our new sound.", keywords: "music, release", date: "2026-02-21", author: "Whispair", status: "Published" },
    ];
  }
  return result;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const data = await fetchFromApi("blog_post", { slug }, "GET", 43200); // 12 hours
  if (!data) {
    return {
      meta: { slug, title: slug === "tour-announcement" ? "New Tour Dates Announced" : "Behind the new single 'Different Path'", description: "Detailed blog post content...", keywords: "music", date: "2026-02-21", author: "Whispair", status: "Published" },
      content: "<h2>The Next Chapter</h2><p>This is placeholder content for 'Different Path'. Once you link the Google Docs CMS via the Apps Script, your document content will seamlessly appear here.</p>"
    };
  }
  return data;
}

export async function submitBooking(data: { name: string; phone: string; date: string; venue: string; message: string; type?: string }) {
  return fetchFromApi("submit_booking", data, "POST");
}

export async function getTrackFacts(title: string): Promise<TrackFacts | null> {
  // If on client, call our safe proxy route to avoid exposing keys
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/facts?title=${encodeURIComponent(title)}`, { cache: 'no-store' });
      if (!res.ok) throw new Error("Proxy error");
      const json = await res.json();
      if (json.status === 200) return json.data;
    } catch (e) {
      console.warn("Client-side facts fetch failed, attempting fallback.");
    }
  } else {
    // Server-side: call directly
    const data = await fetchFromApi("track_facts", { title }, "GET", 86400); // 24 hours
    if (data) return data;
  }
  
  // Fallback for Different Path if both fail or if it is the target
  if (title.toLowerCase() === "different path") {
    return {
      title: "Different Path",
      artist: "Whispair",
      releaseDate: "2026-02-20",
      spotifyLink: "https://open.spotify.com/album/2ivd2uEXo4Gv2THhhqfpFd",
      story: "“Different Paths” lahir dari sebuah cerita sederhana namun dekat dengan banyak orang: kembali ke tempat yang penuh kenangan, hanya untuk menyadari bahwa waktu telah mengubah segalanya. Tempat yang dulu dipenuhi tawa dan kebersamaan kini terasa asing, seakan dua orang yang pernah berjalan bersama harus melanjutkan perjalanan masing-masing.",
      lyrics: `Verse 1\nIm back in this place \na place filled with love and laughter\nyou're still getting used to...someone\nand i'm feeling like a stranger\n\nPre Chorus\nhuuuuu....2x\n\nChorus\nFeels like everything has changed (i know)\nNow we walk on different paths (and right now)\nTime has pulled us apart\nI'll be waiting for you\nI'll be waiting for you\n\nVerse 2\nLike the goods in the store\nOnly to be seen and ignored\nand you choose the pain\nmake you hesitate to be loved\n\nInterlude\nThough we may not meet again (I'll remember you)\nEvery promise we once made (etched in time)\nIn my heart, you'll always reside (though our paths never align)\nI'll be waiting for you\nI'll be waiting for you\n\nChorus\nFeels like everything has changed (i know)\nNow we walk on different paths (and right now)\nTime has pulled us apart\nI'll be waiting for you\nI'll be waiting for you\n\nEnding\nFeels like everything has changed (i know)\nNow we walk on different paths (and right now)\nTime has pulled us apart\nI'll be waiting for you\nI'll be waiting for you`
    };
  }
  
  return null;
}

export async function getInstagramPhotos(limit: number = 10): Promise<InstagramPhoto[]> {
  const token = process.env.INSTAGRAM_TOKEN;
  
  if (!token) {
    console.warn("INSTAGRAM_TOKEN not found in environment variables. Using fallback photos.");
    return getFallbackPhotos();
  }

  try {
    const fields = "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,children{media_url,media_type}";
    const url = `https://graph.instagram.com/me/media?fields=${fields}&access_token=${token}&limit=50`;
    
    const res = await fetch(url, { cache: 'no-store' }); 
    
    if (!res.ok) throw new Error(`Instagram API error: ${res.statusText}`);
    
    const json = await res.json();
    if (!json.data) return getFallbackPhotos();
    
    let allPhotos: InstagramPhoto[] = [];
    
    json.data.forEach((item: any) => {
      if (item.media_type === "IMAGE") {
        allPhotos.push({
          id: item.id,
          url: item.media_url,
          caption: item.caption || "",
          permalink: item.permalink,
          timestamp: item.timestamp
        });
      } else if (item.media_type === "CAROUSEL_ALBUM" && item.children && item.children.data) {
        // Unpack carousel images
        item.children.data.forEach((child: any, index: number) => {
          if (child.media_type === "IMAGE") {
            allPhotos.push({
              id: `${item.id}_${index}`,
              url: child.media_url,
              caption: item.caption || "", // Use parent caption for all children
              permalink: item.permalink,
              timestamp: item.timestamp
            });
          }
        });
      } else if (item.media_type === "CAROUSEL_ALBUM") {
        // Fallback for carousels without children data in response
        allPhotos.push({
          id: item.id,
          url: item.media_url,
          caption: item.caption || "",
          permalink: item.permalink,
          timestamp: item.timestamp
        });
      }
    });
    
    // Randomize and limit to precisely 10 as requested
    return allPhotos.sort(() => Math.random() - 0.5).slice(0, limit);
  } catch (error) {
    console.error("Error fetching Instagram photos:", error);
    return getFallbackPhotos();
  }
}

function getFallbackPhotos(): InstagramPhoto[] {
  return [
    { id: "f1", url: "/gallery/photo1.png", caption: "Whispair Live", permalink: "#", timestamp: "2026-03-01" },
    { id: "f2", url: "/gallery/photo2.png", caption: "Studio Session", permalink: "#", timestamp: "2026-02-28" },
    { id: "f3", url: "/gallery/photo3.png", caption: "Band Portrait", permalink: "#", timestamp: "2026-02-15" },
    { id: "f4", url: "/gallery/photo4.png", caption: "Gear Closeups", permalink: "#", timestamp: "2026-02-10" },
  ];
}
