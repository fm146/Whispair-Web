"use client";

import { useState, useCallback } from "react";
import { InstagramPhoto } from "@/lib/api";
import { SmartImage } from "./SmartImage";

interface HeroBackgroundProps {
  photos: InstagramPhoto[];
}

export function HeroBackground({ photos }: HeroBackgroundProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [triedIndices, setTriedIndices] = useState<Set<number>>(new Set([0]));

  const currentPhoto = photos.length > 0 ? photos[currentIndex] : null;
  const heroSrc = currentPhoto ? currentPhoto.url : "/concert_bg.png";

  const handleFaceResult = useCallback((hasFace: boolean) => {
    // If no face detected and we have more photos to try
    if (!hasFace && photos.length > 1 && triedIndices.size < photos.length) {
      // Find a random index we hasn't tried yet
      let nextIndex = Math.floor(Math.random() * photos.length);
      while (triedIndices.has(nextIndex) && triedIndices.size < photos.length) {
        nextIndex = (nextIndex + 1) % photos.length;
      }
      
      setTriedIndices(prev => new Set(prev).add(nextIndex));
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex, photos, triedIndices]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      <SmartImage 
        key={heroSrc} // Force re-mount/detect when we switch
        src={heroSrc} 
        alt="Live Concert" 
        fill 
        className="opacity-30 grayscale brightness-75 scale-105"
        sizes="100vw"
        priority 
        onFaceResult={handleFaceResult}
      />
    </div>
  );
}
