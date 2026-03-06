import React from "react";

export const SpotifyIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.508 17.302c-.22.36-.67.48-1.03.26-2.83-1.73-6.39-2.12-10.58-1.16-.41.1-.83-.15-.93-.56-.1-.41.15-.83.56-.93 4.58-1.04 8.52-.6 11.69 1.34.36.22.48.67.26 1.05zm1.47-3.26c-.28.45-.87.59-1.32.31-3.24-1.99-8.18-2.58-12.01-1.41-.51.15-1.04-.14-1.19-.65-.15-.51.14-1.04.65-1.19 4.39-1.33 9.84-.66 13.56 1.63.45.27.59.86.31 1.32zm.12-3.41c-3.89-2.31-10.31-2.52-14.07-1.38-.6.18-1.24-.16-1.42-.76-.18-.6.16-1.24.76-1.42 4.31-1.31 11.39-1.06 15.82 1.57.54.32.72 1.02.4 1.56-.32.54-1.02.72-1.49.43z"/>
  </svg>
);

export const YouTubeMusicIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 21.05c-5 0-9.05-4.05-9.05-9.05S7 2.95 12 2.95s9.05 4.05 9.05 9.05-4.05 9.05-9.05 9.05zM12 5.8a6.2 6.2 0 100 12.4 6.2 6.2 0 000-12.4zm-1.68 8.94V9.26L15.1 12l-4.78 2.74z"/>
  </svg>
);

export const AppleMusicIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0C5.38 0 0 5.38 0 12s5.38 12 12 12 12-5.38 12-12S18.62 0 12 0zm4.77 15.7s-1.87.5-2.73.5c-.86 0-1.12-.41-1.12-1.35V8.4s0-.5.44-.73c.43-.22 1.43-.64 2.15-.86.71-.22.86.13.86.41v7.65s0 .63-.6 1zM9.43 18.23c-1.42 0-2.58-1.15-2.58-2.57 0-1.42 1.16-2.57 2.58-2.57.37 0 .7.08 1 .22v2.24c0 .82.72 1.48 1.6 1.48.24 0 .47-.05.67-.15a2.55 2.55 0 01-2.69 1.35z"/>
  </svg>
);

export const InstagramIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);
