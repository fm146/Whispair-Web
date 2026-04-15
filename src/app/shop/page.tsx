"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { ProductModal } from "@/components/merch/ProductModal";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  description: string;
}

const MERCH_ITEMS: Product[] = [];

export default function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-deep text-cool">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 fade-in">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-heading font-extrabold uppercase tracking-tight text-white mb-4">
            Official Store
          </h1>
          <p className="text-lg text-gray-300 font-sans max-w-2xl mx-auto">
            Grab the latest Whispair gear. High quality apparel, physical releases, and exclusive accessories.
          </p>
        </div>

        {MERCH_ITEMS.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {MERCH_ITEMS.map((product) => (
              <div 
                key={product.id} 
                className="bg-charcoal rounded-2xl shadow-sm border border-border overflow-hidden group hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="w-full aspect-[4/5] bg-navy/20 flex items-center justify-center overflow-hidden relative">
                  <Image 
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-navy text-white text-xs font-bold uppercase py-1 px-3 rounded-full">
                    New
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg mb-1 text-white truncate">{product.title}</h3>
                  <p className="text-royal font-bold font-sans mb-4">{product.price}</p>
                  <Button 
                    size="full" 
                    variant="outline" 
                    className="border-white/20 text-gray-300 hover:text-white hover:bg-white/5"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                    }}
                  >
                    View Item
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-white/10 rounded-3xl bg-charcoal/30 backdrop-blur-sm">
            <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-navy/20 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-royal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-3xl font-heading font-bold text-white mb-3">Coming Soon</h2>
            <p className="text-gray-400 font-sans max-w-sm">
              We're preparing the next drop. Stay tuned for exclusive Whispair merchandise and physical releases.
            </p>
          </div>
        )}

      </main>

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <Footer />
    </div>
  );
}
