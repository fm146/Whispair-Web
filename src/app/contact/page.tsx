import ContactPage from "./ContactContent";
import { getInstagramPhotos } from "@/lib/api";

export const revalidate = 0;

export default async function Page() {
  const instagramPhotos = await getInstagramPhotos(10);
  
  return <ContactPage instagramPhotos={instagramPhotos} />;
}
