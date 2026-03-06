"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";

interface Product {
  id: number;
  title: string;
  price: string;
  image: string;
  description: string;
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [product]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-deep/90 backdrop-blur-md fade-in"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-charcoal rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh] animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 text-white rounded-full transition-colors backdrop-blur-sm"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Product Image Section */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative bg-navy/20">
          <Image 
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Details Section */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          <span className="text-royal font-bold tracking-widest uppercase text-xs mb-4 block">Official Merch</span>
          <h2 className="text-3xl md:text-4xl font-heading font-extrabold uppercase text-white mb-2">
            {product.title}
          </h2>
          <p className="text-2xl font-sans font-bold text-electric mb-6">{product.price}</p>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Description</h4>
              <p className="text-gray-300 font-sans leading-relaxed">
                {product.description}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Select Size</h4>
              <div className="flex gap-3">
                {['S', 'M', 'L', 'XL', '2XL'].map(size => (
                  <button 
                    key={size}
                    className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center text-sm font-bold text-gray-400 hover:border-royal hover:text-white transition-all"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <Button size="lg" className="w-full py-6 text-lg">Add to Cart</Button>
              <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">
                Secure SSL Encryption • International Shipping Available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
