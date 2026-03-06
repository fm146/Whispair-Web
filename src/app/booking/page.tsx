"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { submitBooking } from "@/lib/api";
import { useState } from "react";

export default function BookingPage() {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function bookHandler(formData: FormData) {
    setLoading(true);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const datetime = formData.get("datetime") as string;
    const venue = formData.get("venue") as string;
    const message = formData.get("message") as string;
    const type = formData.get("type") as string;

    try {
      await submitBooking({ name, phone, date: datetime, venue, message, type });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to send booking request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep text-cool">
      <Header />
      
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-32 pb-20 fade-in">
        
        <div className="bg-charcoal rounded-3xl p-8 md:p-12 shadow-2xl border border-border">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold uppercase mb-4 text-white text-center">
            Book Whispair
          </h1>
          <p className="text-gray-400 font-sans text-center mb-10 max-w-xl mx-auto">
            Ready to bring the noise? Fill out the form below with the details of your event, and our management will get back to you.
          </p>

          {success ? (
            <div className="bg-royal/10 text-electric p-8 rounded-2xl text-center border border-royal/20 mb-8 font-sans font-medium">
              <span className="text-4xl block mb-4">🤘</span>
              <h2 className="text-2xl text-white mb-2">Request Sent!</h2>
              <p>Your booking request has been sent successfully. We'll be in touch soon.</p>
              <Button 
                variant="outline" 
                className="mt-6" 
                onClick={() => setSuccess(false)}
              >
                Send Another Request
              </Button>
            </div>
          ) : (
            <form action={bookHandler} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-400 ml-1">Full Name</label>
                  <input required name="name" type="text" className="w-full bg-deep border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-royal transition-all font-sans text-white focus:bg-deep-black text-sm font-bold uppercase tracking-widest" placeholder="Whispair Fan" />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-400 ml-1">Phone Number</label>
                  <input required name="phone" type="tel" className="w-full bg-deep border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-royal transition-all font-sans text-white focus:bg-deep-black text-sm font-bold uppercase tracking-widest" placeholder="+62 812 3456 7890" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-400 ml-1">Event Type</label>
                  <select name="type" className="w-full bg-deep border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-royal transition-all font-sans text-white appearance-none uppercase text-sm font-bold tracking-widest cursor-pointer">
                    <option className="bg-charcoal text-white font-sans uppercase">Festival</option>
                    <option className="bg-charcoal text-white font-sans uppercase">Club Show</option>
                    <option className="bg-charcoal text-white font-sans uppercase">Private Event</option>
                    <option className="bg-charcoal text-white font-sans uppercase">Corporate</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase tracking-wider text-gray-400 ml-1">Event Date & Time</label>
                  <DateTimePicker name="datetime" required placeholder="Pick a date & time" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-400 ml-1">Venue / Location</label>
                <input required type="text" name="venue" className="w-full bg-deep border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-royal transition-all font-sans text-white focus:bg-deep-black text-sm font-bold uppercase tracking-widest" placeholder="City, Country or Venue Name" />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold uppercase tracking-wider text-gray-400 ml-1">Tell us more about the event</label>
                <textarea name="message" rows={5} className="w-full bg-deep border border-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-royal transition-all font-sans text-white resize-none" placeholder="Venue, expected capacity, duration, etc..."></textarea>
              </div>

              <Button type="submit" size="full" className="mt-8" disabled={loading}>
                {loading ? "Sending..." : "Submit Request"}
              </Button>
            </form>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}
