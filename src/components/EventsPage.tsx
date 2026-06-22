import React from 'react';
import { ContactSection } from './ContactSection';
import { LocationMap } from './LocationMap';
import type { LibraryEvent } from '../data/mockDb';

interface EventsPageProps {
  events: LibraryEvent[];
  onRSVP: (evtTitle: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ events, onRSVP }) => {
  return (
    <>
      {/* Header Section */}
      <section className="w-full bg-[#FAF6F0] py-20 text-center relative z-10 font-sans">
        <div className="max-w-4xl mx-auto px-6 text-left md:text-center">
          <span className="text-[11px] font-mono tracking-widest text-[#0265DC] uppercase block mb-3 font-bold">
            Agenda Perpustakaan
          </span>
          <h1 className="font-display font-medium text-5xl md:text-6xl text-[#3D1E1E] mb-6">
            Upcoming Events
          </h1>
          <div className="w-12 h-[2px] bg-[#3D1E1E] mx-auto mb-6" />
          <p className="text-sm md:text-base text-[#6E6E6E] max-w-xl mx-auto font-medium leading-relaxed">
            Bergabunglah dengan rangkaian acara literasi, bedah buku, dan kelas komunitas kami. Silakan lakukan RSVP untuk mengamankan tempat Anda.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />

      {/* Events List Section */}
      <section className="w-full bg-white py-24 relative z-20 font-sans text-left">
        <div className="max-w-5xl mx-auto px-6 space-y-16">
          {events.map((evt, index) => {
            const isEven = index % 2 === 0;
            return (
              <div 
                key={evt.id} 
                className="grid grid-cols-1 lg:grid-cols-12 border border-[#3D1E1E] rounded-none overflow-hidden items-stretch bg-white shadow-sm"
              >
                {/* Image Column */}
                <div className={`lg:col-span-6 relative min-h-[300px] lg:min-h-[400px] overflow-hidden ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                  <img 
                    src={`https://picsum.photos/seed/${evt.coverSeed}/600/400`}
                    alt={evt.title}
                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Content Column */}
                <div className={`lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between text-left bg-white ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                  <div>
                    {/* Date and Category */}
                    <div className="flex items-center gap-3 mb-4 text-xs font-mono font-bold text-[#6E6E6E]">
                      <span className="text-[#0265DC] uppercase tracking-wider">{evt.category}</span>
                      <span>|</span>
                      <span>{evt.dateStr}</span>
                    </div>

                    {/* Event Title */}
                    <h3 className="font-display font-medium text-3xl text-[#3D1E1E] leading-tight mb-4">
                      {evt.title}
                    </h3>

                    {/* Time & Location Details */}
                    <div className="space-y-1.5 text-xs text-[#6E6E6E] font-medium">
                      <p className="flex items-center gap-2">
                        <span className="font-mono">Waktu:</span> {evt.timeStr}
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-mono">Lokasi:</span> {evt.location}
                      </p>
                    </div>
                  </div>

                  {/* RSVP button */}
                  <div className="mt-8 pt-6 border-t border-[#F0F0F0]">
                    <button 
                      onClick={() => onRSVP(evt.title)}
                      className="border border-[#3D1E1E] text-[#3D1E1E] hover:bg-[#3D1E1E] hover:text-white transition-colors duration-200 py-2.5 px-8 uppercase text-[10px] tracking-wider font-semibold rounded-none btn-pressable cursor-pointer"
                    >
                      RSVP NOW
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />
      <ContactSection />
      <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />
      <LocationMap />
    </>
  );
};
