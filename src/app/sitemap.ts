import { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://whispair.com";

  // Base routes
  const routes = ["", "/smartlink", "/booking", "/merch", "/blog", "/events", "/contact"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Blog posts
  try {
    const posts = await getBlogPosts();
    const postRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));
    return [...routes, ...postRoutes];
  } catch (e) {
    return routes;
  }
}
