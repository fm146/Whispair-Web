"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/CartContext";
import { Trash2, Plus, Minus, CreditCard, Tag, CheckCircle, ArrowLeft, Printer, ShoppingCart, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { API_URL, API_KEY } from "@/lib/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CheckoutPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Cart/Details, 2: Payment/Success
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState<{code: string, amount: number} | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showDownloadNotif, setShowDownloadNotif] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    shipping: "standard",
  });

  const shippingCost = formData.shipping === "express" ? 15 : 5;
  const finalTotal = cartTotal + shippingCost - discount;

  // Auto-download receipt when step 2 is reached
  useEffect(() => {
    if (step === 2 && orderData) {
      // Small delay to ensure the receipt component is fully rendered
      const timer = setTimeout(() => {
        handleDownloadPDF(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, orderData]);

  const handleDownloadPDF = async (isAuto = false) => {
    if (!receiptRef.current) return;
    
    setIsDownloading(true);
    if (isAuto) setShowDownloadNotif(true);

    try {
      const original = receiptRef.current;
      
      // 1. Wait for everything to load
      await new Promise(resolve => setTimeout(resolve, 800));

      // 2. Create a "Safe Clone" with inlined, sanitized styles
      // This bypasses html2canvas crashing on external oklch/lab colors
      const clone = original.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.width = '800px'; 
      document.body.appendChild(clone);

      const copyStyles = (src: HTMLElement, dest: HTMLElement) => {
        const styles = window.getComputedStyle(src);
        const props = [
          'display', 'flex-direction', 'justify-content', 'align-items', 'grid-template-columns', 'gap',
          'padding', 'margin', 'width', 'height', 'background-color', 'color', 'font-family', 'font-size',
          'font-weight', 'text-transform', 'letter-spacing', 'border', 'border-radius', 'border-bottom',
          'position', 'top', 'right', 'bottom', 'left', 'opacity', 'line-height', 'text-align', 'font-style',
          'box-shadow', 'overflow', 'border-style', 'border-width', 'border-color', 'object-fit', 'max-width',
          'z-index', 'pointer-events'
        ];

        props.forEach(prop => {
          let val = styles.getPropertyValue(prop);
          
          // Sanitize: Replace oklch/lab/var with fallbacks for html2canvas
          if (val && (val.includes('oklch') || val.includes('lab') || val.includes('var'))) {
            if (prop.includes('color')) {
              if (src.classList.contains('text-royal') || src.classList.contains('bg-royal')) val = '#063188';
              else if (src.classList.contains('text-electric') || src.classList.contains('bg-electric')) val = '#00e5ff';
              else if (prop === 'background-color') val = '#ffffff';
              else val = '#1a1a1a';
            } else if (prop.includes('font-family')) {
              val = "'Inter', sans-serif";
            }
          }
          dest.style.setProperty(prop, val);
        });

        // Forced fixes for Logo and Typography
        if (src.tagName === 'IMG') {
          dest.style.maxWidth = '100%';
          dest.style.height = 'auto';
        }
        if (src.classList.contains('opacity-5')) {
          dest.style.opacity = '0.05';
        }

        // Recursively copy for children
        for (let i = 0; i < src.children.length; i++) {
          copyStyles(src.children[i] as HTMLElement, dest.children[i] as HTMLElement);
        }
      };

      copyStyles(original, clone);

      // 3. Render the sanitized clone
      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      
      const imgData = canvas.toDataURL("image/png");
      
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "b4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Whispair-Receipt-${orderData.orderCode}.pdf`);
      
      // Cleanup
      document.body.removeChild(clone);

      if (isAuto) {
        setTimeout(() => setShowDownloadNotif(false), 2000);
      }
    } catch (error) {
      console.error("PDF Download Error:", error);
      if (!isAuto) alert("Manual download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleApplyVoucher = async () => {
    try {
      const res = await fetch(`${API_URL}?action=check_voucher&code=${voucherCode}&key=${API_KEY}`);
      const data = await res.json();
      
      if (data.status === 200 && data.data.valid) {
        const v = data.data;
        let amount = 0;
        if (v.discountPercent) amount = cartTotal * (v.discountPercent / 100);
        else if (v.discountNominal) amount = v.discountNominal;
        
        setDiscount(amount);
        setAppliedVoucher({ code: voucherCode, amount });
        alert(`Voucher Applied: ${v.eventName}`);
      } else {
        alert(data.data?.message || "Invalid Voucher Code");
      }
    } catch (e) {
      console.error(e);
      alert("Error checking voucher");
    }
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    
    const payload = {
      action: "submit_order",
      key: API_KEY,
      payload: {
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        shipping: formData.shipping,
        items: cart.map(item => `${item.title} (${item.size}) x${item.quantity}`).join(", "),
        subtotal: cartTotal,
        shippingCost,
        discount,
        total: finalTotal,
        voucher: appliedVoucher?.code || "",
        orderCode: "WP-" + Math.random().toString(36).substring(2, 9).toUpperCase()
      }
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.status === 200 || data.status === 201) {
        setOrderData(payload.payload);
        setStep(2);
        clearCart();
      } else {
        alert("Failed to submit order. Please try again.");
      }
    } catch (e) {
      console.error(e);
      // Fallback for demo
      setOrderData(payload.payload);
      setStep(2);
      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0 && step === 1) {
    return (
      <div className="flex flex-col min-h-screen bg-deep text-cool">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
           <div className="text-center space-y-6">
             <div className="w-24 h-24 bg-navy/50 rounded-full flex items-center justify-center mx-auto">
               <ArrowLeft size={48} className="text-gray-600" />
             </div>
             <h1 className="text-3xl font-heading font-extrabold text-white uppercase">Your cart is empty</h1>
             <Link href="/shop">
               <Button size="lg">Return to Shop</Button>
             </Link>
           </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep text-cool">
      <Header />

      {/* Download Notification Overlay */}
      {showDownloadNotif && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in slide-in-from-bottom duration-300">
          <div className="bg-electric text-deep px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 font-bold border border-white/10">
            {isDownloading ? (
               <Loader2 className="animate-spin" size={20} />
            ) : (
               <CheckCircle size={20} />
            )}
            <div>
               <p className="text-sm">Downloading Receipt...</p>
               <p className="text-[10px] opacity-70 uppercase tracking-widest">Saving as PDF B4 automatically</p>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {step === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left: Cart Items & Form */}
            <div className="lg:col-span-8 space-y-12">
              <section>
                <h2 className="text-3xl font-heading font-extrabold text-white uppercase mb-8 flex items-center gap-3">
                  <ShoppingCart className="text-electric" /> Shopping Cart
                </h2>
                
                <div className="space-y-4">
                  {cart.map((item, idx) => (
                    <div key={`${item.id}-${item.size}`} className="bg-charcoal rounded-2xl p-4 md:p-6 border border-white/5 flex gap-4 md:gap-8 items-center">
                       <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-xl overflow-hidden shrink-0">
                         <Image src={item.image} alt={item.title} fill className="object-cover" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h3 className="text-lg md:text-xl font-heading font-bold text-white truncate">{item.title}</h3>
                          <p className="text-royal font-bold tracking-widest text-xs uppercase mb-2">Size: {item.size}</p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center bg-navy/50 rounded-lg p-1 border border-white/5">
                              <button onClick={() => updateQuantity(item.id, item.size, -1)} className="p-1 hover:text-white transition-colors"><Minus size={14} /></button>
                              <span className="w-8 text-center font-bold text-sm text-white">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.size, 1)} className="p-1 hover:text-white transition-colors"><Plus size={14} /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id, item.size)} className="text-gray-500 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                       </div>
                       <div className="text-right shrink-0">
                          <p className="text-xl font-bold text-white mb-1">
                            ${(parseFloat(item.price.replace('$','')) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 font-sans">Unit: {item.price}</p>
                       </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-charcoal rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
                <h2 className="text-2xl font-heading font-extrabold text-white uppercase mb-8 flex items-center gap-3">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                    <input 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-deep border border-border rounded-xl px-5 py-3 focus:ring-2 focus:ring-royal text-white text-sm" 
                      placeholder="John Doe" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                    <input 
                      required 
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-deep border border-border rounded-xl px-5 py-3 focus:ring-2 focus:ring-royal text-white text-sm" 
                      placeholder="john@example.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
                    <input 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-deep border border-border rounded-xl px-5 py-3 focus:ring-2 focus:ring-royal text-white text-sm" 
                      placeholder="+62 8..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Shipping Method</label>
                    <select 
                      value={formData.shipping}
                      onChange={(e) => setFormData({...formData, shipping: e.target.value})}
                      className="w-full bg-deep border border-border rounded-xl px-5 py-3 focus:ring-2 focus:ring-royal text-white text-sm"
                    >
                      <option value="standard">Standard (5-7 days) - $5.00</option>
                      <option value="express">Express (1-2 days) - $15.00</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Shipping Address</label>
                    <textarea 
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      rows={3}
                      className="w-full bg-deep border border-border rounded-xl px-5 py-3 focus:ring-2 focus:ring-royal text-white text-sm resize-none" 
                      placeholder="Street name, City, Zip Code..." 
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Right: Summary & Checkout */}
            <div className="lg:col-span-4">
              <div className="bg-charcoal rounded-3xl p-8 border border-white/10 shadow-2xl sticky top-32">
                <h3 className="text-xl font-heading font-extrabold text-white uppercase mb-6">Order Summary</h3>
                
                <div className="space-y-4 pb-6 border-b border-white/5 font-sans">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-electric group">
                      <span>Discount ({appliedVoucher?.code})</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="py-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input 
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value)}
                        placeholder="Voucher Code" 
                        className="w-full bg-deep border border-border rounded-xl pl-11 pr-4 py-3 text-sm focus:ring-1 focus:ring-royal text-white" 
                      />
                    </div>
                    <Button variant="outline" size="sm" onClick={handleApplyVoucher} disabled={!voucherCode}>Apply</Button>
                  </div>
                </div>

                <div className="pt-2 pb-8 flex justify-between items-center">
                  <span className="text-lg font-heading font-extrabold text-white uppercase">Total Price</span>
                  <span className="text-3xl font-sans font-black text-electric">${finalTotal.toFixed(2)}</span>
                </div>

                <Button 
                  size="lg" 
                  className="w-full py-8 text-lg font-bold uppercase tracking-widest shadow-xl shadow-royal/20"
                  onClick={handleSubmitOrder}
                  disabled={isSubmitting || !formData.name || !formData.address}
                >
                  {isSubmitting ? "Processing..." : "I've Paid & Complete Order"}
                </Button>
                
                <p className="mt-4 text-[10px] text-gray-500 text-center uppercase tracking-widest leading-relaxed">
                  By clicking, you confirm that you have transferred the amount to Whispair's bank account.
                </p>
              </div>
            </div>

          </div>
        ) : (
          /* Receipt Step */
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
               <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-500 mb-6 animate-bounce">
                 <CheckCircle size={48} />
               </div>
               <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white uppercase tracking-tighter">Order Received!</h1>
               <p className="text-gray-400">Your order is being processed. Keep this receipt for tracking.</p>
            </div>

            {/* Printable Receipt Card */}
            <div ref={receiptRef} id="receipt" className="bg-white text-black p-8 md:p-12 rounded-lg shadow-2xl font-sans relative overflow-hidden mx-auto w-full max-w-2xl">
               {/* Watermark/Logo - Positioned behind order code */}
               <div className="absolute -top-10 right-10 opacity-[0.03] w-64 h-64 pointer-events-none flex items-center justify-center">
                 <img src="/logo.png" alt="Logo" className="w-full h-auto object-contain" />
               </div>

               <div className="border-b-2 border-dashed border-gray-200 pb-8 mb-8 flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
                 <div className="flex flex-col">
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Whispair Merchandise Store</p>
                   <h3 className="text-xl font-black uppercase tracking-tight text-black leading-none">Whispair Official Merchandise</h3>
                   <p className="text-sm text-gray-500 uppercase font-bold tracking-widest mt-2">Official Receipt</p>
                 </div>
                 <div className="text-left md:text-right">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Code</p>
                   <p className="text-xl font-black text-royal leading-none">{orderData?.orderCode}</p>
                   <p className="text-xs text-gray-400 mt-2">{new Date().toLocaleString()}</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                 <div className="space-y-4">
                   <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Customer Details</h4>
                   <div>
                     <p className="font-bold text-lg">{orderData?.customerName}</p>
                     <p className="text-sm text-gray-600">{orderData?.phone}</p>
                     <p className="text-sm text-gray-600">{orderData?.email}</p>
                   </div>
                   <div className="pt-2">
                     <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Shipping Address</p>
                     <p className="text-sm border-l-2 border-gray-100 pl-4">{orderData?.address}</p>
                   </div>
                 </div>
                 
                 <div className="space-y-4">
                   <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-2">Shipping Method</h4>
                   <p className="bg-gray-50 p-3 rounded-lg font-bold uppercase text-sm inline-block">
                     {orderData?.shipping === 'express' ? 'Express Delivery (1-2 Days)' : 'Standard Shipping (5-7 Days)'}
                   </p>
                   <div className="pt-4 space-y-1 italic text-[10px] text-gray-500 whitespace-nowrap overflow-visible">
                     <p>Note: Delivery times may vary based on location.</p>
                     <p>Contact us: makewhispair@gmail.com | +62 851 8400 3842</p>
                   </div>
                 </div>
               </div>

               <div className="mb-12">
                 <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 border-b border-gray-100 pb-4 mb-4">Purchased Items</h4>
                 <div className="space-y-4">
                    {orderData?.items.split(',').map((item: string, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-medium">{item.trim()}</span>
                        <span className="font-bold tracking-tight">Included</span>
                      </div>
                    ))}
                 </div>
               </div>

               <div className="bg-gray-50 p-6 md:p-8 rounded-2xl relative">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>${orderData?.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Shipping Fee</span>
                      <span>${orderData?.shippingCost.toFixed(2)}</span>
                    </div>
                    {orderData?.discount > 0 && (
                      <div className="flex justify-between text-green-600 font-bold">
                        <span>Discount ({orderData?.voucher})</span>
                        <span>-${orderData?.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-4 mt-4 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                       <span className="text-lg font-black uppercase italic">Grand Total Paid</span>
                       <span className="text-3xl font-black text-royal">${orderData?.total.toFixed(2)}</span>
                    </div>
                  </div>
               </div>

               <div className="mt-12 text-center space-y-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-bold">Thank you for supporting Whispair</p>
                  <p className="text-[9px] text-gray-300 italic max-w-sm mx-auto">Jika paket belum sampai dalam estimasi waktu, silahkan hubungi nomor aduan pelanggan di atas dengan melampirkan kode order Anda.</p>
               </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 no-print text-center">
               <div className="space-y-4 w-full max-w-md mx-auto">
                 <Button 
                   variant="outline" 
                   className="gap-2 w-full py-6" 
                   onClick={() => handleDownloadPDF(false)}
                   disabled={isDownloading}
                 >
                    {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                    {isDownloading ? "Generating PDF..." : "Save Receipt (PDF)"}
                 </Button>
                 <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                   If download doesn't start, please click the button above.
                 </p>
                 <Link href="/shop" className="block">
                    <Button className="gap-2 w-full py-6" variant="outline">
                       Back to Shop
                    </Button>
                 </Link>
               </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
      
      <style jsx global>{`
        @media print {
          @page {
            size: B4;
            margin: 0;
          }
          .no-print, header, footer { display: none !important; }
          body { 
            background: white !important; 
            padding: 0 !important; 
            margin: 0 !important;
          }
          #receipt { 
            box-shadow: none !important; 
            border: none !important; 
            margin: 0 !important; 
            width: 100% !important; 
            max-width: none !important;
            padding: 20mm !important;
          }
        }
      `}</style>
    </div>
  );
}
