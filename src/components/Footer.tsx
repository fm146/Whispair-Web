import { SiSpotify, SiYoutube, SiInstagram, SiTiktok, SiWhatsapp, SiX, SiYoutubemusic, SiApplemusic } from "react-icons/si";
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-deep text-cool mt-20 pt-16 pb-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex flex-col text-center md:text-left flex-shrink-0">
          <Link href="/" className="group block mx-auto md:mx-0">
            <Image 
              src="/logo.png" 
              alt="Whispair" 
              width={200}
              height={60}
              className="w-[130px] h-auto md:w-[173px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-300"
            />
          </Link>
          <p className="mt-4 text-sm text-gray-400 font-sans tracking-wide">
            © {new Date().getFullYear()} Whispair. All rights reserved.
          </p>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto mt-8 md:mt-0">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500">Follow Us</span>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex gap-6 items-center">
              <SocialLink href="https://www.instagram.com/whispair_" icon={SiInstagram} title="Instagram" hoverColor="hover:text-[#E4405F]" />
              <SocialLink href="https://www.tiktok.com/@make_whispair" icon={SiTiktok} title="TikTok" hoverColor="hover:text-[#010101]" />
              <SocialLink href="https://www.youtube.com/@Whispairband" icon={SiYoutube} title="YouTube" hoverColor="hover:text-[#FF0000]" />
              <SocialLink href="https://wa.me/6285184003842" icon={SiWhatsapp} title="WhatsApp" hoverColor="hover:text-[#25D366]" />
              <SocialLink href="https://x.com/MakeW7660?s=09" icon={SiX} title="X" hoverColor="hover:text-white" />
            </div>
            <div className="hidden sm:block h-4 w-[1px] bg-white/10 mx-1" />
            <div className="flex gap-6 items-center">
              <SocialLink href="https://open.spotify.com/artist/7kZeWIy0BTHJfBRcYOQVFR" icon={SiSpotify} title="Spotify" hoverColor="hover:text-[#1DB954]" />
              <SocialLink href="#" icon={SiYoutubemusic} title="YouTube Music" hoverColor="hover:text-[#FF0000]" />
              <SocialLink href="#" icon={SiApplemusic} title="Apple Music" hoverColor="hover:text-[#FC3C44]" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon: Icon, title, hoverColor }: { href: string; icon: any; title: string; hoverColor: string }) {
  return (
    <a 
      href={href} 
      className={`text-gray-400 ${hoverColor} transition-all hover:scale-110 duration-300`} 
      title={title}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon className="w-6 h-6" />
    </a>
  );
}
