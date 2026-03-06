import Image from "next/image";
import { getLatestRelease, getSmartlinkConfig, getInstagramPhotos } from "@/lib/api";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { Button } from "@/components/ui/Button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiSpotify, SiYoutubemusic, SiApplemusic } from "react-icons/si";

export const revalidate = 0; // Fresh randomization on every refresh

const PlatformConfig: Record<string, { icon: React.ElementType; color: string; bg: string; shadow: string }> = {
  spotify: { icon: SiSpotify, color: "group-hover:text-[#1DB954] group-active:text-[#1DB954]", bg: "group-hover:bg-[#1DB954] group-active:bg-[#1DB954]", shadow: "hover:shadow-[#1DB954]/20" },
  youtube: { icon: SiYoutubemusic, color: "group-hover:text-[#FF0000] group-active:text-[#FF0000]", bg: "group-hover:bg-[#FF0000] group-active:bg-[#FF0000]", shadow: "hover:shadow-[#FF0000]/20" },
  apple: { icon: SiApplemusic, color: "group-hover:text-[#FA243C] group-active:text-[#FA243C]", bg: "group-hover:bg-[#FA243C] group-active:bg-[#FA243C]", shadow: "hover:shadow-[#FA243C]/20" },
};

export default async function SmartlinkPage() {
  const [latestRelease, links, instagramPhotos] = await Promise.all([
    getLatestRelease(),
    getSmartlinkConfig(),
    getInstagramPhotos(10)
  ]);

  const sortedLinks = links.sort((a, b) => a.order - b.order);

  return (
    <div className="flex flex-col min-h-screen bg-deep text-cool">
      <main className="flex-1 fade-in">
        {/* Hero Section */}
        <section className="relative bg-navy pt-20 pb-32 w-full flex flex-col items-center justify-center overflow-hidden text-center px-4">
          <HeroBackground photos={instagramPhotos} />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent pointer-events-none z-0" />
          
          <div className="relative z-10 flex flex-col items-center">
            {latestRelease?.albumArt ? (
              <div className="w-56 h-56 md:w-80 md:h-80 relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-6 mt-2 group">
                <div className="absolute inset-0 bg-royal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
                <Image 
                  src={latestRelease.albumArt}
                  alt={latestRelease.title || "Album Art"}
                  fill
                  sizes="(max-width: 768px) 224px, 320px"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
               <div className="w-56 h-56 bg-gray-800 rounded-2xl mb-6 mt-2 border border-white/10 flex items-center justify-center">
                 <span className="text-gray-500 font-heading tracking-widest uppercase text-xs">Artwork</span>
               </div>
            )}
            
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold !text-white uppercase tracking-tighter mb-2 [text-shadow:0_4px_20px_rgba(0,0,0,1)]">
              {latestRelease?.title || "Latest Release"}
            </h1>
            
            {latestRelease?.releaseDate && (
              <p className="text-gray-400 font-sans tracking-[0.1em] uppercase text-[10px] md:text-sm font-bold mb-2 drop-shadow-md">
                Released: {new Date(latestRelease.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}

            <p className="text-white font-sans tracking-[0.2em] uppercase text-sm font-black mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] opacity-90">
              Out Now
            </p>
          </div>
        </section>

        {/* Links Section */}
        <section className="max-w-2xl mx-auto px-4 -mt-16 relative z-20 space-y-4 mb-16">
          {sortedLinks.length > 0 ? (
            sortedLinks.map((link, idx) => {
              const platform = link.icon.toLowerCase();
              const config = PlatformConfig[platform] || { 
                icon: () => <span>🎵</span>, 
                color: "group-hover:text-royal group-active:text-royal", 
                bg: "group-hover:bg-royal group-active:bg-royal",
                shadow: "hover:shadow-royal/10"
              };
              const Icon = config.icon;

              return (
                <a 
                  key={idx} 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full bg-charcoal rounded-3xl p-6 md:p-8 shadow-2xl ${config.shadow} hover:-translate-y-1.5 active:-translate-y-1 active:scale-[0.98] transition-all duration-300 border border-border flex items-center justify-between group`}
                >
                  <div className="flex items-center gap-6 md:gap-8 min-w-0">
                    <div className={`text-gray-400 ${config.color} transition-colors duration-300 shrink-0`}>
                      <Icon className="w-8 h-8 md:w-10 md:h-10" />
                    </div>
                    <span className="font-heading font-bold text-xl md:text-2xl text-white truncate whitespace-nowrap">
                      {link.title}
                    </span>
                  </div>
                  <div className={`px-8 py-3 rounded-full border border-white/10 text-white font-bold tracking-widest text-xs md:text-sm uppercase transition-all duration-300 ${config.bg} group-hover:border-transparent group-active:border-transparent group-hover:scale-110 group-active:scale-105 shadow-lg shrink-0 ml-4`}>
                    Listen
                  </div>
                </a>
              );
            })
          ) : (
            <div className="block w-full bg-charcoal rounded-3xl p-12 shadow-lg border border-border text-center">
               <span className="font-heading font-bold text-2xl text-white">Links configuration is empty</span>
            </div>
          )}

          {/* Additional Booking Link */}
          <a 
            href="/booking"
            className="block w-full bg-royal/10 rounded-3xl p-5 md:p-8 shadow-2xl hover:shadow-royal/20 hover:-translate-y-1.5 active:-translate-y-1 active:scale-[0.98] transition-all duration-300 border border-royal/30 flex items-center justify-between group"
          >
            <div className="flex items-center gap-4 md:gap-8 min-w-0">
              <div className="text-royal transition-colors duration-300 shrink-0">
                <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="font-heading font-bold text-lg md:text-2xl text-white truncate whitespace-nowrap">
                Booking / Inquiry
              </span>
            </div>
            <div className="px-6 md:px-8 py-3 rounded-full bg-royal text-white font-bold tracking-widest text-[10px] md:text-sm uppercase transition-all duration-300 group-hover:scale-110 group-active:scale-105 shadow-lg shrink-0 ml-2 md:ml-4">
              Contact
            </div>
          </a>
        </section>

        {/* Merch Preview */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-white/5 text-center">
          <h2 className="text-3xl font-heading font-extrabold uppercase mb-12 text-white">Exclusive Merch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Merch items placeholder */}
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-charcoal rounded-2xl shadow-xl border border-border overflow-hidden group">
                <div className="w-full aspect-square bg-navy/20 flex items-center justify-center overflow-hidden relative">
                  <Image 
                    src="/merch_shirt.png"
                    alt={`Whispair Tee 0${item}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg mb-2 text-white">Whispair Tee 0{item}</h3>
                  <Button size="sm" variant="outline" className="w-full border-white/20 text-gray-300 hover:text-white hover:bg-white/5">Coming Soon</Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
