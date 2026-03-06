"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CircleHelp } from "lucide-react";
import { SiSpotify, SiYoutubemusic, SiApplemusic } from "react-icons/si";
import { Release, InstagramPhoto } from "@/lib/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { TrackFactsModal } from "@/components/ui/TrackFactsModal";

interface MusicContentProps {
  latestRelease: Release | null;
  releases: Release[];
  instagramPhotos: InstagramPhoto[];
}

export function MusicContent({ latestRelease, releases, instagramPhotos }: MusicContentProps) {
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);

  // Filter out the latest release from the previous releases list
  const previousReleases = releases.filter((r: Release) => r.title !== latestRelease?.title);

  return (
    <div className="flex flex-col min-h-screen bg-deep text-cool">
      <Header />

      <main className="flex-1 fade-in">
        {/* Hero - Latest Release */}
        <section className="relative pt-32 pb-24 px-4 min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden">
          <HeroBackground photos={instagramPhotos} />
          <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-deep via-navy/80 to-transparent pointer-events-none z-0" />

          <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
            <span className="text-white font-sans font-bold uppercase tracking-[0.4em] text-xs mb-6 opacity-80">
              Latest Release
            </span>

            {latestRelease?.albumArt && (
              <div 
                className="w-56 h-56 md:w-72 md:h-72 relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-8 group cursor-pointer"
                onClick={() => setSelectedRelease(latestRelease)}
              >
                <div className="absolute inset-0 bg-royal/40 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                  <div className="p-3 bg-white text-royal rounded-full shadow-xl scale-90 group-hover:scale-100 transition-transform">
                    <CircleHelp size={28} />
                  </div>
                  <span className="text-white font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    About this song
                  </span>
                </div>
                <Image
                  src={latestRelease.albumArt}
                  alt={latestRelease.title || "Album Art"}
                  fill
                  sizes="(max-width: 768px) 224px, 288px"
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  priority
                />
              </div>
            )}

            <h1 className="text-4xl md:text-6xl font-heading font-extrabold uppercase tracking-tighter text-white mb-3 [text-shadow:0_4px_20px_rgba(0,0,0,0.8)]">
              {latestRelease?.title || "Latest Release"}
            </h1>

            {latestRelease?.releaseDate && (
              <p className="text-gray-400 font-sans text-sm uppercase tracking-widest mb-8">
                Released{" "}
                {new Date(latestRelease.releaseDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}

            {/* Streaming links */}
            <div className="flex flex-wrap justify-center gap-4">
              {latestRelease?.spotifyLink && (
                <a
                  href={latestRelease.spotifyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/10 rounded-full text-white font-bold font-sans text-sm uppercase tracking-widest hover:scale-105 hover:bg-[#1DB954] hover:border-[#1DB954] transition-all group"
                >
                  <SiSpotify className="w-5 h-5 text-[#1DB954] group-hover:text-white transition-colors" />
                  Spotify
                </a>
              )}
              <a 
                href="https://music.youtube.com/watch?v=JjGxaru57Po&si=p27tqQmn8b___dnm" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/10 rounded-full text-white font-bold font-sans text-sm uppercase tracking-widest hover:scale-105 hover:bg-[#FF0000] hover:border-[#FF0000] transition-all group"
              >
                <SiYoutubemusic className="w-5 h-5 text-[#FF0000] group-hover:text-white transition-colors" />
                YouTube Music
              </a>
              <a 
                href="https://music.apple.com/us/song/different-path/1882066901" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/10 rounded-full text-white font-bold font-sans text-sm uppercase tracking-widest hover:scale-105 hover:bg-[#FA243C] hover:border-[#FA243C] transition-all group"
              >
                <SiApplemusic className="w-5 h-5 text-[#FA243C] group-hover:text-white transition-colors" />
                Apple Music
              </a>
            </div>
          </div>
        </section>

        {/* Previous Releases Section */}
        {previousReleases.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
            <h2 className="text-2xl font-heading font-extrabold uppercase tracking-widest text-white mb-10 text-center md:text-left">
              Previous Releases
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {previousReleases.map((release: Release, index: number) => (
                <div 
                  key={index}
                  className="bg-charcoal/40 hover:bg-charcoal border border-white/5 rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col"
                >
                  <div 
                    className="aspect-square relative overflow-hidden shrink-0 border-b border-white/5 cursor-pointer"
                    onClick={() => setSelectedRelease(release)}
                  >
                    <Image 
                      src={release.albumArt} 
                      alt={release.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-royal/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2">
                       <div className="bg-white text-royal p-2 rounded-full shadow-xl scale-90 group-hover:scale-100 transition-transform">
                        <CircleHelp className="w-5 h-5" />
                      </div>
                      <span className="text-white font-bold text-[10px] uppercase tracking-widest">
                        About Song
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-white font-heading font-bold text-base leading-tight group-hover:text-royal transition-colors line-clamp-2">
                        {release.title}
                      </h3>
                      <a href={release.spotifyLink} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#1DB954] transition-colors shrink-0">
                        <SiSpotify className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-gray-500 font-sans text-xs mt-2 uppercase tracking-wider">
                      {release.artist} &bull; {new Date(release.releaseDate).getFullYear()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />

      {/* Facts Modal */}
      {selectedRelease && (
        <TrackFactsModal 
          release={selectedRelease} 
          isOpen={!!selectedRelease} 
          onClose={() => setSelectedRelease(null)} 
        />
      )}
    </div>
  );
}
