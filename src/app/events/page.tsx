import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";

// Dummy data for upcoming events
const UPCOMING_EVENTS = [
  {
    id: 1,
    date: "OCT 24",
    venue: "The Roxy Theatre",
    location: "Los Angeles, CA",
    ticketLink: "#",
    status: "On Sale",
  },
  {
    id: 2,
    date: "OCT 28",
    venue: "Brooklyn Steel",
    location: "Brooklyn, NY",
    ticketLink: "#",
    status: "Selling Fast",
  },
  {
    id: 3,
    date: "NOV 05",
    venue: "Metro Chicago",
    location: "Chicago, IL",
    ticketLink: "#",
    status: "Sold Out",
  },
  {
    id: 4,
    date: "NOV 12",
    venue: "The Fillmore",
    location: "San Francisco, CA",
    ticketLink: "#",
    status: "On Sale",
  },
];

export default function EventsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-deep text-cool">
      <Header />
      
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 fade-in">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold uppercase tracking-tighter text-white mb-4">
            Live Dates
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-sans max-w-2xl mx-auto">
            Witness the raw energy live. Get your tickets before they're gone.
          </p>
        </div>

        <div className="bg-charcoal rounded-3xl shadow-2xl border border-border overflow-hidden">
          <ul className="divide-y divide-white/5">
            {UPCOMING_EVENTS.map((event) => (
              <li key={event.id} className="p-6 md:p-8 hover:bg-white/5 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-12 flex-1">
                  
                  {/* Date Column */}
                  <div className="flex flex-col text-left md:text-center shrink-0 w-24">
                    <span className="text-royal font-bold uppercase tracking-widest text-sm mb-1">
                      {event.date.split(" ")[0]}
                    </span>
                    <span className="text-3xl font-heading font-extrabold text-white leading-none">
                      {event.date.split(" ")[1]}
                    </span>
                  </div>
                  
                  {/* Venue & Location Col */}
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-heading font-bold text-white group-hover:text-royal transition-colors">
                      {event.venue}
                    </h3>
                    <p className="text-gray-400 font-sans mt-1">
                      {event.location}
                    </p>
                  </div>
                </div>

                {/* Ticket Button Col */}
                <div className="flex items-center gap-4 shrink-0">
                  {event.status === "Sold Out" ? (
                    <Button variant="secondary" size="md" className="w-full md:w-auto opacity-50 cursor-not-allowed bg-deep border-none text-white/40">
                      Sold Out
                    </Button>
                  ) : (
                    <Button variant="primary" size="md" className="w-full md:w-auto">
                      Tickets
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-400 font-sans mb-6">Want to bring Whispair to your city?</p>
          <Button variant="outline" size="lg" className="border-white/20 text-gray-300 hover:text-white hover:bg-white/5">
            <a href="/booking">Request a Show</a>
          </Button>
        </div>

      </main>

      <Footer />
    </div>
  );
}
