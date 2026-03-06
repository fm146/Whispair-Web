import Image from "next/image";
import Link from "next/link";
import { getLatestRelease, getInstagramPhotos } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PhotoCarousel } from "@/components/ui/PhotoCarousel";
import { HeroBackground } from "@/components/ui/HeroBackground";

// Force static rendering, ISR will revalidate based on fetch cache in api.ts
// Set revalidate to 0 to ensure fresh randomization on every refresh
export const revalidate = 0;

export default async function HomePage() {
  const [latestRelease, instagramPhotos] = await Promise.all([
    getLatestRelease(),
    getInstagramPhotos(10)
  ]);



  return (
    <div className="flex flex-col min-h-screen bg-deep">
      <Header />

      <main className="flex-1 fade-in">
        <section className="relative w-full min-h-screen bg-navy text-white overflow-hidden flex items-center justify-center">
          <HeroBackground photos={instagramPhotos} />
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-deep via-navy/80 to-transparent pointer-events-none z-0" />
          
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center pt-32 lg:pt-0">
            
            {/* Right Column: Album Art (Reordered to top on mobile) */}
            <div className="flex justify-center lg:justify-end order-first lg:order-last">
              {latestRelease?.albumArt ? (
                <div className="w-full max-w-[90%] md:max-w-md aspect-square rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,10,30,0.8)] border border-gray-800 group relative">
                  <div className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 MixBlendMode-overlay" />
                  <Image 
                    src={latestRelease.albumArt} 
                    alt={latestRelease.title || "Latest Release"}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    priority
                  />
                </div>
              ) : (
                <div className="w-full max-w-[90%] md:max-w-md aspect-square bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700 shadow-2xl">
                  <span className="text-gray-500 font-heading text-xl uppercase tracking-widest">
                    Artwork
                  </span>
                </div>
              )}
            </div>

            {/* Left Column: Text Content */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left space-y-6">
              <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tighter uppercase leading-[1.05]">
                <span className="text-electric block mb-2">New Sound.</span>
                Raw Energy.
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-xl font-sans">
                Experience the latest era of Whispair. Bold, unfiltered, and louder than ever.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                {latestRelease?.spotifyLink ? (
                  <Link href={latestRelease.spotifyLink} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full sm:w-auto">Listen Now</Button>
                  </Link>
                ) : (
                  <Link href="/smartlink">
                    <Button size="lg" className="w-full sm:w-auto">Listen Now</Button>
                  </Link>
                )}
                <Link href="/booking">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-600 text-gray-300 hover:text-white hover:bg-gray-800 hover:border-gray-500">
                    Book Us
                  </Button>
                </Link>
              </div>
            </div>
            
          </div>
        </section>

        {/* Gallery Section - Carousel */}
        <section className="py-24 bg-deep/50 border-t border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
            <span className="text-royal font-bold tracking-[0.3em] uppercase text-xs mb-4 block">Visuals</span>
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold uppercase text-white">
              The Experience
            </h2>
          </div>
          <PhotoCarousel initialPhotos={instagramPhotos} />
        </section>

        {/* Booking CTA Section */}
        <section className="py-24 bg-navy/30 border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold uppercase mb-6 text-white text-shadow-lg">
              Bring the Noise
            </h2>
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-sans leading-relaxed">
              Available for festivals, club shows, and private events. Get in touch to book Whispair for your next gig.
            </p>
            <Link href="/booking">
              <Button size="lg" className="px-12">Contact for Booking</Button>
            </Link>
          </div>
        </section>
        
      </main>

      <Footer />
    </div>
  );
}
