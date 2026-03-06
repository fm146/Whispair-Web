"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 z-[60] w-full transition-all duration-300 ${
          isScrolled 
            ? "bg-deep/95 backdrop-blur-md border-b border-white/5 py-3 shadow-lg" 
            : "bg-transparent border-b border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 md:h-16">
            
            {/* Mobile: Hamburger/Menu Button Left */}
            <div className="flex md:hidden items-center gap-3">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>

              {/* Logo on Mobile (next to menu) */}
              <Link href="/" className="flex-shrink-0 group">
                <Image 
                  src="/logo.png" 
                  alt="Whispair" 
                  width={140}
                  height={36}
                  className="w-[90px] h-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                  priority
                />
              </Link>
            </div>

            {/* Desktop Logo (Left aligned) */}
            <div className="hidden md:flex flex-shrink-0">
              <Link href="/" className="flex-shrink-0 group">
                <Image 
                  src="/logo.png" 
                  alt="Whispair" 
                  width={160}
                  height={40}
                  className="w-[130px] h-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                  priority
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <NavLink href="/music">Music</NavLink>
              <NavLink href="/events">Events</NavLink>
              <NavLink href="/blog">Blog</NavLink>
              <NavLink href="/shop">Shop</NavLink>
              <NavLink href="/contact">Contact</NavLink>
              <Link href="/booking">
                <Button size="sm">Book Us</Button>
              </Link>
            </nav>

            {/* Mobile: Book Us Button Right */}
            <div className="md:hidden flex items-center">
              <Link href="/booking">
                <Button size="sm" className="bg-deep border-transparent text-xs px-3 h-9 min-h-0">Book Us</Button>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[55] bg-deep/98 backdrop-blur-xl transition-all duration-500 md:hidden ${
          isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8 px-6 pt-20">
          <MobileNavLink href="/music" onClick={() => setIsMenuOpen(false)}>Music</MobileNavLink>
          <MobileNavLink href="/events" onClick={() => setIsMenuOpen(false)}>Events</MobileNavLink>
          <MobileNavLink href="/blog" onClick={() => setIsMenuOpen(false)}>Blog</MobileNavLink>
          <MobileNavLink href="/shop" onClick={() => setIsMenuOpen(false)}>Shop</MobileNavLink>
          <MobileNavLink href="/contact" onClick={() => setIsMenuOpen(false)}>Contact</MobileNavLink>
          <div className="w-12 h-[1px] bg-white/10 my-2" />
          <Link href="/booking" onClick={() => setIsMenuOpen(false)} className="w-full max-w-[200px]">
            <Button size="lg" className="w-full">Book Us Now</Button>
          </Link>
        </nav>
      </div>
    </>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="text-3xl font-heading font-extrabold text-white uppercase tracking-tighter hover:text-royal transition-colors"
    >
      {children}
    </Link>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-base font-medium text-gray-300 hover:text-white transition-colors font-sans"
    >
      {children}
    </Link>
  );
}
