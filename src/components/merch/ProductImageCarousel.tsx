"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageCarouselProps {
  images: string[];
  alt: string;
}

export function ProductImageCarousel({ images, alt }: ProductImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="relative w-full h-full group bg-navy/20 overflow-hidden">
      {/* Carousel */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((src, index) => (
            <div 
              key={index} 
              className="relative flex-[0_0_100%] min-w-0 h-full"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}
            >
              {/* Normal Image */}
              <Image
                src={src}
                alt={`${alt} - ${index + 1}`}
                fill
                className={`object-cover transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
                priority={index === 0}
              />
              
              {/* Zoomed Image */}
              {isHovering && (
                <div 
                  className="absolute inset-0 z-10 w-full h-full pointer-events-none overflow-hidden"
                  style={{
                    backgroundImage: `url(${src})`,
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundSize: '250%',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={scrollPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
          >
            <ChevronRight size={20} />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 px-3 py-1.5 bg-black/20 backdrop-blur-md rounded-full">
            {images.map((_, i) => (
              <div 
                key={i} 
                className="w-1.5 h-1.5 rounded-full bg-white/40"
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
