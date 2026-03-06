import { getLatestRelease, getReleases, getInstagramPhotos } from "@/lib/api";
import { MusicContent } from "./MusicContent";

// Force fresh data on every request, ensuring synchronization with Instagram and Spotify
export const revalidate = 0;

export default async function MusicPage() {
  const [latestRelease, releases, instagramPhotos] = await Promise.all([
    getLatestRelease(),
    getReleases(12),
    getInstagramPhotos(10)
  ]);

  return (
    <MusicContent 
      latestRelease={latestRelease} 
      releases={releases} 
      instagramPhotos={instagramPhotos} 
    />
  );
}
