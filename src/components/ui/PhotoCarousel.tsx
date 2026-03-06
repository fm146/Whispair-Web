"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Instagram } from "lucide-react";
import { InstagramPhoto } from "@/lib/api";
import { SmartImage } from "./SmartImage";

interface PhotoCarouselProps {
  initialPhotos?: InstagramPhoto[];
}

export function PhotoCarousel({ initialPhotos = [] }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());

  // Logika Filter: Hanya tampilkan jika SUDAH LULUS deteksi atau belum didepak
  const displayPhotos = useMemo(() => {
    const photos = initialPhotos.length > 0 ? initialPhotos : [];
    return photos.filter(p => !rejectedIds.has(p.id));
  }, [initialPhotos, rejectedIds]);

  const handleFaceResult = useCallback((id: string, hasFace: boolean) => {
    if (!hasFace) {
      setRejectedIds(prev => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    }
  }, []);

  const nextSlide = useCallback(() => {
    if (displayPhotos.length <= 1) return;
    setCurrentIndex((prev) => (prev >= displayPhotos.length - 1 ? 0 : prev + 1));
  }, [displayPhotos.length]);

  const prevSlide = useCallback(() => {
    if (displayPhotos.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? displayPhotos.length - 1 : prev - 1));
  }, [displayPhotos.length]);

  useEffect(() => {
    if (displayPhotos.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, displayPhotos.length]);

  // Jaga index tetap valid
  useEffect(() => {
    if (currentIndex >= displayPhotos.length && displayPhotos.length > 0) {
      setCurrentIndex(0);
    }
  }, [displayPhotos.length, currentIndex]);

  if (displayPhotos.length === 0) return null;

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 group">
      <div className="relative aspect-[3/4] md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/5 bg-navy/20">
        
        {/* Render semua foto di background (hanya untuk deteksi), tampilan dikontrol opacity */}
        {initialPhotos.map((photo, index) => {
          const isRejected = rejectedIds.has(photo.id);
          const activeItemIndex = displayPhotos.findIndex(p => p.id === photo.id);
          const isActive = !isRejected && activeItemIndex === currentIndex;

          return (
            <div
              key={photo.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <SmartImage 
                src={photo.url} 
                alt={photo.caption || "Whispair Photo"}
                fill
                priority={index === 0}
                sizes="1200px"
                onFaceResult={(hasFace) => handleFaceResult(photo.id, hasFace)}
              />
              
              {!isRejected && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent opacity-80" />
                  <div className={`absolute bottom-8 left-8 right-8 z-20 flex justify-between items-end transition-all duration-700 ${isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                    <div className="max-w-xl">
                      <p className="text-white font-sans text-sm md:text-base line-clamp-2 opacity-90 leading-relaxed italic">
                        "{photo.caption}"
                      </p>
                    </div>
                    {photo.permalink !== "#" && (
                      <a 
                        href={photo.permalink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-royal/80 hover:bg-royal text-white rounded-full backdrop-blur-md transition-all hover:scale-110 shadow-lg"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Navigation - Hanya muncul jika ada lebih dari 1 foto yang lolos sensor */}
        {displayPhotos.length > 1 && (
          <>
            <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-royal">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-royal">
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Indicators */}
        {displayPhotos.length > 1 && (
          <div className="absolute bottom-6 left-8 z-30 flex gap-2">
            {displayPhotos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 transition-all duration-300 rounded-full ${
                  index === currentIndex ? "bg-royal w-8" : "bg-white/30 hover:bg-white/50 w-3"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
