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

const MERCH_ITEMS: Product[] = [
  {
    id: 1,
    title: "Whispair Classic Tee",
    price: "$35.00",
    image: "/merch_shirt.png",
    description: "Our signature heavyweight cotton tee. Features the classic Whispair logo on the chest and a raw-edge finish. Built for the pit, styled for the street."
  },
  {
    id: 2,
    title: "Different Path Hoodie",
    price: "$65.00",
    image: "/merch_shirt.png",
    description: "Premium fleece hoodie celebrating the latest single 'Different Path'. Oversized fit with high-density puff print graphics on the back."
  },
  {
    id: 3,
    title: "Noise Junkie Cap",
    price: "$28.00",
    image: "/merch_shirt.png",
    description: "Distressed dad hat with 3D embroidery. adjustable strap with antique brass buckle. Perfect for hiding post-gig hair."
  },
  {
    id: 4,
    title: "Raw Energy Vinyl",
    price: "$40.00",
    image: "/merch_shirt.png",
    description: "Limited edition 180g blood-red marbled vinyl. Includes a 12-page lyric booklet and exclusive behind-the-scenes photography."
  }
];

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
                  className="opacity-0 group-hover:opacity-100 transition-opacity border-white/20 text-gray-300 hover:text-white hover:bg-white/5"
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

      </main>

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
      />

      <Footer />
    </div>
  );
}
