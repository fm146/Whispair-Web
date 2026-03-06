"use client";

// @ts-ignore
import smartcrop from "smartcrop";
import { useState, useCallback, useRef } from "react";
import Image, { ImageProps } from "next/image";

interface SmartImageProps extends Omit<ImageProps, "onLoadingComplete"> {
  fallbackPosition?: string;
  onFaceResult?: (hasFace: boolean) => void;
}

/**
 * SmartImage Component v4 (Powered by Smartcrop API + Next.js Server Optimization)
 */
export function SmartImage({ 
  src, 
  alt, 
  fallbackPosition = "center 15%",
  onFaceResult,
  className = "",
  style = {},
  unoptimized,
  ...props 
}: SmartImageProps) {
  const [objectPosition, setObjectPosition] = useState(fallbackPosition);
  const imgRef = useRef<HTMLImageElement>(null);

  const calculateOptimalCrop = useCallback(async (imgElement: HTMLImageElement) => {
    try {
      // Smartcrop analyzes edge density, colors, and faces to find the most "interesting" region.
      // We pass 21:9 aspect ratio which matches our ultrawide carousels perfectly.
      const result = await smartcrop.crop(imgElement, { width: 21, height: 9 });
      
      if (result && result.topCrop) {
        const topCrop = result.topCrop;
        const imgHeight = imgElement.naturalHeight;
        const imgWidth = imgElement.naturalWidth;
        const isPortrait = imgHeight > imgWidth;

        // X = center of the most interesting cropped region
        // let xPercent = ((topCrop.x + topCrop.width / 2) / imgWidth) * 100;

        // Y = the top-third of the interesting region (to leave headroom for subjects)
        const focalY = topCrop.y + (topCrop.height * 0.25);
        let yPercent = (focalY / imgHeight) * 100;

        // Safeties to prevent heads from clipping
        yPercent = Math.max(0, yPercent - 5);
        if (isPortrait) {
          yPercent = Math.min(yPercent, 25);
        } else {
          yPercent = Math.min(yPercent, 35); // Center-ish for landscape
        }

        setObjectPosition(`center ${yPercent}%`);

        // We assume smartcrop always finds something interesting.
        // It's less stringent than strict face detector, but far more robust in keeping heads in view
        if (onFaceResult) onFaceResult(true);
      } else {
        if (onFaceResult) onFaceResult(false);
      }
    } catch (err) {
      // Fallback
      if (onFaceResult) onFaceResult(true); 
      const ratio = imgElement.naturalWidth / imgElement.naturalHeight;
      if (ratio > 1.2) {
         setObjectPosition("center 30%"); 
      } else {
         setObjectPosition("center 15%"); 
      }
    }
  }, [onFaceResult]);

  // Tunnel external images through our CORS proxy so `smartcrop` can access pixel data via Canvas API securely
  const isExternal = typeof src === 'string' && src.startsWith('http');
  const secureSrc = isExternal ? `/api/proxy?url=${encodeURIComponent(src)}` : src;
  const finalUnoptimized = unoptimized ?? isExternal; 

  return (
    <Image
      ref={imgRef}
      src={secureSrc}
      alt={alt}
      {...props}
      unoptimized={finalUnoptimized}
      crossOrigin="anonymous" // Required to draw onto canvas securely
      className={`object-cover transition-all duration-1000 ease-in-out ${className}`}
      style={{ ...style, objectPosition }}
      onLoadingComplete={(img) => {
        calculateOptimalCrop(img);
      }}
    />
  );
}
