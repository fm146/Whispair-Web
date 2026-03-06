"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Music2, BookOpen, Clock, Users, ExternalLink, CircleHelp } from "lucide-react";
import { getTrackFacts, TrackFacts, Release } from "@/lib/api";
import { Button } from "./Button";

interface TrackFactsModalProps {
  release: Release;
  isOpen: boolean;
  onClose: () => void;
}

export function TrackFactsModal({ release, isOpen, onClose }: TrackFactsModalProps) {
  const [facts, setFacts] = useState<TrackFacts | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"lyrics" | "story">("lyrics");

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getTrackFacts(release.title).then(data => {
        setFacts(data);
        setLoading(false);
      });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, release.title]);

  const renderLyrics = (lyrics: string) => {
    if (!lyrics) return "Lyrics for this track are not available yet.";
    const sections = ["Verse", "Chorus", "Pre Chorus", "Interlude", "Ending", "Outro", "Solo", "Bridge"];
    
    return lyrics.split('\n').map((line, i) => {
      const trimmedLine = line.trim();
      const isSectionHeader = sections.some(s => trimmedLine.startsWith(s));
      
      if (isSectionHeader) {
        return (
          <span key={i} className="block mt-8 mb-3 text-electric font-bold not-italic tracking-[0.2em] uppercase text-xs border-l-2 border-electric pl-3">
            {line}
          </span>
        );
      }
      return <span key={i} className="block min-h-[1.5em]">{line}</span>;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-deep/40 backdrop-blur-[40px] animate-in fade-in duration-500" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-charcoal rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-navy/30">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden shadow-xl border border-white/20">
              <Image src={release.albumArt} alt={release.title} fill className="object-cover" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-heading font-extrabold text-white uppercase tracking-tight line-clamp-1">
                {release.title}
              </h2>
              <div className="flex items-center gap-2">
                <CircleHelp size={12} className="text-electric" />
                <p className="text-electric font-sans font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                  About This Song
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/60 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Tabs */}
        <div className="flex border-b border-white/5 bg-navy/20">
          <button 
            onClick={() => setActiveTab("lyrics")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border-b-2 ${
              activeTab === "lyrics" ? "text-electric border-electric bg-white/5" : "text-gray-400 border-transparent hover:text-gray-200"
            }`}
          >
            <Music2 size={14} />
            Lyrics
          </button>
          <button 
            onClick={() => setActiveTab("story")}
            className={`flex-1 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border-b-2 ${
              activeTab === "story" ? "text-electric border-electric bg-white/5" : "text-gray-400 border-transparent hover:text-gray-200"
            }`}
          >
            <BookOpen size={14} />
            The Story
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar bg-gradient-to-b from-navy/10 to-transparent">
          {loading ? (
            <div className="h-40 flex items-center justify-center">
              <span className="text-white/40 font-bold uppercase tracking-widest text-xs">Loading Facts...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Left: Main Content */}
              <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                {activeTab === "lyrics" ? (
                  <div className="font-medium text-white text-lg md:text-xl leading-relaxed font-sans italic">
                    {renderLyrics(facts?.lyrics || "")}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-heading font-bold text-white uppercase tracking-tight">The Inspiration</h3>
                    <p className="text-gray-200 text-lg leading-relaxed font-sans border-l-2 border-white/10 pl-6">
                      {facts?.story || "The story behind this track is being written down by the band. Check back soon!"}
                    </p>
                  </div>
                )}
              </div>

              {/* Right: Metadata */}
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6 animate-in slide-in-from-right-4 duration-500">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] border-b border-white/10 pb-3">Technical Data</h4>
                  
                  <div className="space-y-4">
                    <MetaItem icon={Users} label="Artist" value={release.artist} />
                    <MetaItem icon={Clock} label="Released" value={new Date(release.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} />
                    <MetaItem icon={Music2} label="Format" value={release.type.toUpperCase()} />
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function MetaItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="p-2 bg-white/10 rounded-xl text-white shadow-inner">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-sm font-extrabold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}
