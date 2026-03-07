"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import Link from "next/link";
import { SiInstagram, SiX, SiYoutube, SiWhatsapp, SiTiktok } from "react-icons/si";
import { HeroBackground } from "@/components/ui/HeroBackground";
import { InstagramPhoto } from "@/lib/api";

function SocialIcon({ href, icon: Icon, hoverColor }: { href: string; icon: any; hoverColor: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`text-gray-400 ${hoverColor} transition-all duration-300 transform hover:scale-125`}
    >
      <Icon className="w-8 h-8 md:w-10 md:h-10" />
    </a>
  );
}

export default function ContactPage({ instagramPhotos = [] }: { instagramPhotos?: InstagramPhoto[] }) {
  return (
    <div className="flex flex-col min-h-screen bg-deep text-cool">
      <Header />
      
      <main className="flex-1 fade-in">
        
        {/* Banner Section with HeroBackground */}
        <section className="relative pt-32 pb-24 flex flex-col items-center text-center overflow-hidden">
          <HeroBackground photos={instagramPhotos} />
          <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/60 to-transparent z-0" />

          <div className="relative z-10 px-4 w-full">
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold uppercase tracking-tighter text-white mb-4 [text-shadow:0_4px_20px_rgba(0,0,0,0.8)]">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-gray-400 font-sans max-w-2xl mx-auto">
              Get in touch with the team. For bookings, press, or general inquiries.
            </p>
          </div>
        </section>

        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20 mt-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 bg-charcoal rounded-3xl p-8 md:p-12 shadow-2xl border border-border">
          
          {/* Contact Info */}
          <div className="space-y-8 lg:pr-8 lg:border-r border-white/5">
            <div>
              <h2 className="text-2xl font-heading font-extrabold text-white uppercase mb-2">Management & Press</h2>
              <p className="text-gray-300 font-sans font-medium hover:text-royal transition-colors">
                <a href="mailto:makewhispair@gmail.com">makewhispair@gmail.com</a>
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-heading font-extrabold text-white uppercase mb-2">Booking & Tours</h2>
              <p className="text-gray-400 font-sans text-sm mb-6 max-w-xs">
                For live performances and appearance requests, please use our official booking system.
              </p>
              <Link href="/booking">
                <Button variant="outline" size="sm" className="border-white/20 text-gray-300 hover:text-white hover:bg-royal hover:border-royal transition-all duration-300 px-6">
                  Use Booking Form
                </Button>
              </Link>
            </div>

            <div className="pt-4">
              <h2 className="text-2xl font-heading font-extrabold text-white uppercase mb-4">Socials</h2>
              <div className="flex gap-6 items-center">
                <SocialIcon href="https://www.instagram.com/whispair_" icon={SiInstagram} hoverColor="hover:text-[#E4405F]" />
                <SocialIcon href="https://www.tiktok.com/@make_whispair" icon={SiTiktok} hoverColor="hover:text-[#010101]" />
                <SocialIcon href="https://x.com/MakeW7660?s=09" icon={SiX} hoverColor="hover:text-white" />
                <SocialIcon href="https://www.youtube.com/@Whispairband" icon={SiYoutube} hoverColor="hover:text-[#FF0000]" />
                <SocialIcon href="https://wa.me/6285184003842" icon={SiWhatsapp} hoverColor="hover:text-[#25D366]" />
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div>
            <h2 className="text-2xl font-heading font-extrabold text-white uppercase mb-6">Send a Message</h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wide text-gray-400">Name</label>
                <input required type="text" className="w-full bg-deep border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-royal transition-all font-sans text-white focus:bg-deep-black text-sm font-bold uppercase tracking-widest" placeholder="Your Name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wide text-gray-400">Email</label>
                <input required type="email" className="w-full bg-deep border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-royal transition-all font-sans text-white focus:bg-deep-black text-sm font-bold uppercase tracking-widest" placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wide text-gray-400">Preferred Date & Time</label>
                <DateTimePicker name="datetime" placeholder="Pick a date & time" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wide text-gray-400">Message</label>
                <textarea required rows={4} className="w-full bg-deep border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-royal transition-all font-sans resize-none text-white focus:bg-deep-black" placeholder="What's on your mind?"></textarea>
              </div>
              <Button type="button" size="full" onClick={() => alert("This is a demo form.")}>
                Send Message
              </Button>
            </form>
          </div>

        </div>
      </div>
    </main>

      <Footer />
    </div>
  );
}
