"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Plus, Minus, ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect } from "react";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { ProductImageCarousel } from "./ProductImageCarousel";

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
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCart();
  const router = useRouter();

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

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: quantity
    });
    onClose();
  };

  const handleBuyNow = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: quantity
    });
    onClose();
    router.push('/checkout');
  };

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
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative">
          <ProductImageCarousel 
            images={[product.image]} 
            alt={product.title} 
          />
        </div>

        {/* Product Details Section */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-start overflow-y-auto">
          <span className="text-royal font-bold tracking-widest uppercase text-[10px] mb-2 block">Official Merch</span>
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold uppercase text-white mb-1">
            {product.title}
          </h2>
          <p className="text-xl font-sans font-bold text-electric mb-4">{product.price}</p>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Description</h4>
              <p className="text-gray-300 font-sans leading-relaxed text-xs md:text-sm">
                {product.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Size</h4>
                <div className="flex gap-2">
                  {['S', 'M', 'L', 'XL', '2XL'].map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-xl border flex items-center justify-center text-xs font-bold transition-all ${
                        selectedSize === size 
                        ? 'border-electric bg-electric/10 text-electric shadow-lg shadow-electric/20' 
                        : 'border-white/10 text-gray-400 hover:border-white/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">Quantity</h4>
                <div className="flex items-center gap-4 bg-navy/30 rounded-xl p-1 border border-white/5">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-white w-4 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-2 hover:bg-white/5 rounded-lg text-gray-400 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={handleAddToCart}
                variant="outline"
                size="md" 
                className="flex-1 py-3 text-xs md:text-sm gap-2 border-white/20"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
              <Button 
                onClick={handleBuyNow}
                size="md" 
                className="flex-1 py-3 text-xs md:text-sm gap-2"
              >
                <Zap className="w-4 h-4" />
                Buy Now
              </Button>
            </div>
            <p className="text-[10px] text-gray-500 text-center uppercase tracking-widest">
              Secure SSL Encryption • International Shipping Available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
