import React from 'react';
import { motion } from 'motion/react';
import { TrendUp, Users, BookOpen, CalendarBlank, Coin } from '@phosphor-icons/react';
import heroLibraryImg from '../assets/hero-library.png';
import { ContactSection } from './ContactSection';
import { LocationMap } from './LocationMap';
import type { Book, LibraryEvent } from '../data/mockDb';

interface LandingPageProps {
  books: Book[];
  events: LibraryEvent[];
  user: { name: string; id: string; role?: string } | null;
  setCurrentView: (view: 'home' | 'catalog' | 'dashboard' | 'about' | 'events' | 'settings' | 'admin_books' | 'admin_members' | 'admin_transactions' | 'admin_reports') => void;
  onLoginClick: () => void;
  onRSVP: (title: string) => void;
}

const formatEventDate = (dateStr: string) => {
  const parts = dateStr.split(' ');
  if (parts.length >= 3) {
    const dayOfWeek = parts[0];
    const day = parts[1];
    const month = parts[2];
    return `${dayOfWeek} ${month} ${day}`;
  }
  return dateStr;
};

export const LandingPage: React.FC<LandingPageProps> = ({
  books,
  events,
  user,
  setCurrentView,
  onLoginClick,
  onRSVP
}) => {
  return (
    <>
      {/* Wix-inspired Split Hero Section */}
      <section className="w-full bg-[#FAF6F0] py-16 relative z-10 font-sans text-left">
        <div className="max-w-7xl mx-auto px-6 relative">
          {/* Floating Donate button top right */}
          <div className="absolute top-0 right-6 z-20 hidden lg:block">
            <div className="w-24 h-24 rounded-full border border-[#FA0F00] bg-white hover:bg-[#FA0F00] text-[#FA0F00] hover:text-white flex flex-col items-center justify-center text-[10px] uppercase font-bold tracking-widest shadow-lg cursor-pointer transition-all duration-300 btn-pressable">
              <span>Donate</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-8">
            {/* Left Side: Large Library Image */}
            <div className="lg:col-span-7 relative min-h-[350px] lg:min-h-[520px] rounded-sm overflow-hidden border border-[#D3D3D3] shadow-lg">
              <img
                src={heroLibraryImg}
                alt="AtmaLibrary Interior"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Subtle vignette gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Right Side: Welcome Content Card (Dark Overlapping Box) */}
            <div className="lg:col-span-5 bg-[#3D1E1E] text-white border border-[#2A1515] rounded-sm p-8 lg:p-12 flex flex-col justify-center text-left shadow-2xl lg:-ml-24 z-10 my-8 relative">
              {/* Headline */}
              <h1 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight leading-[1.1] mb-6 text-balance">
                Welcome to <br /> Atma Library
              </h1>

              {/* Subtext */}
              <p className="text-sm text-white/80 leading-relaxed font-medium mb-8 text-pretty">
                Layanan peminjaman sirkulasi mandiri digital kini tersedia. Telusuri katalog kami secara instan, ikuti acara literasi eksklusif, dan pinjam buku favorit Anda.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                {!user ? (
                  <>
                    <button
                      onClick={onLoginClick}
                      className="bg-[#FA0F00] hover:bg-[#E00D00] text-white font-semibold px-6 py-3 rounded-sm text-xs uppercase tracking-wider shadow-sm transition-all duration-130 btn-pressable flex items-center gap-2"
                    >
                      Masuk untuk Meminjam
                    </button>
                    <button 
                      onClick={() => setCurrentView('catalog')}
                      className="bg-transparent border border-white hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-sm text-xs uppercase tracking-wider shadow-sm transition-all duration-130 btn-pressable"
                    >
                      Jelajahi Katalog
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setCurrentView('catalog')}
                    className="bg-[#FA0F00] hover:bg-[#E00D00] text-white font-semibold px-6 py-3 rounded-sm text-xs uppercase tracking-wider shadow-sm transition-all duration-130 btn-pressable"
                  >
                    Jelajahi Katalog Buku
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Social Proof / Trending Ticker */}
      <div className="w-full bg-[#1B1B1B] text-white border-y border-[#333333] overflow-hidden py-3 flex items-center relative z-20">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          className="flex whitespace-nowrap items-center gap-8 text-[11px] uppercase tracking-widest font-bold font-mono min-w-max"
        >
          <span className="flex items-center gap-2"><TrendUp className="w-4 h-4 text-[#FA0F00]" /> 145 Peminjaman Hari Ini</span>
          <span className="text-[#6E6E6E]">•</span>
          <span className="flex items-center gap-2">Buku Terpopuler: Atomic Habits</span>
          <span className="text-[#6E6E6E]">•</span>
          <span className="flex items-center gap-2"><Users className="w-4 h-4 text-[#0265DC]" /> 12 Anggota Baru Bergabung</span>
          <span className="text-[#6E6E6E]">•</span>
          <span className="flex items-center gap-2"><TrendUp className="w-4 h-4 text-[#FA0F00]" /> 145 Peminjaman Hari Ini</span>
          <span className="text-[#6E6E6E]">•</span>
          <span className="flex items-center gap-2">Buku Terpopuler: Atomic Habits</span>
          <span className="text-[#6E6E6E]">•</span>
          <span className="flex items-center gap-2"><Users className="w-4 h-4 text-[#0265DC]" /> 12 Anggota Baru Bergabung</span>
        </motion.div>
      </div>

      {/* Home Section 1: Library Statistics Strip */}
      <section className="w-full max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white border border-[#D3D3D3] rounded-lg p-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-left shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-[#FA0F00] mb-1">
              <BookOpen className="w-5 h-5" />
              <span className="font-display font-bold text-2xl text-[#1B1B1B]">12k+</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-[#6E6E6E] tracking-wider font-mono">Koleksi Buku</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[#0265DC] mb-1">
              <Users className="w-5 h-5" />
              <span className="font-display font-bold text-2xl text-[#1B1B1B]">3.2k+</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-[#6E6E6E] tracking-wider font-mono">Anggota Aktif</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[#0265DC] mb-1">
              <CalendarBlank className="w-5 h-5" />
              <span className="font-display font-bold text-2xl text-[#1B1B1B]">14 Hari</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-[#6E6E6E] tracking-wider font-mono">Batas Sirkulasi</p>
          </div>
          <div>
            <div className="flex items-center gap-2 text-[#0265DC] mb-1">
              <Coin className="w-5 h-5" />
              <span className="font-display font-bold text-2xl text-[#1B1B1B]">Rp 0</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-[#6E6E6E] tracking-wider font-mono">Tanpa Biaya Admin</p>
          </div>
        </div>
      </section>

      {/* Wix-inspired Safety / Info Banner */}
      <section className="w-full bg-[#FAF9F9] py-12 relative z-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="font-display font-bold text-xl md:text-2xl text-[#1B1B1B] mb-4">
            Sirkulasi Mandiri Cepat & Aman
          </h3>
          <p className="text-sm text-[#6E6E6E] leading-relaxed font-medium max-w-2xl mx-auto text-pretty">
            Untuk mendukung efisiensi waktu, sirkulasi buku fisik kini berjalan penuh secara mandiri. Gunakan fitur **Scan QR** pada aplikasi setelah masuk akun untuk melakukan peminjaman kilat langsung di loket digital perpustakaan.
          </p>
        </div>
      </section>

      {/* Wix-inspired New Additions Section */}
      <section className="w-full bg-white py-24 relative z-20">
        <div className="max-w-5xl mx-auto px-6 text-center relative">
          {/* Floating Donate button right side */}
          <div className="absolute top-0 right-0 z-20 hidden lg:block">
            <div className="w-24 h-24 rounded-full border border-[#FA0F00] bg-white hover:bg-[#FA0F00] text-[#FA0F00] hover:text-white flex flex-col items-center justify-center text-[10px] uppercase font-bold tracking-widest shadow-lg cursor-pointer transition-all duration-300 btn-pressable">
              <span>Donate</span>
            </div>
          </div>

          <span className="text-[10px] font-mono tracking-widest text-[#0265DC] uppercase block mb-2 font-bold">
            REKOMENDASI BUKU
          </span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#1B1B1B] mb-4">
            New Additions
          </h2>
          <p className="text-sm text-[#6E6E6E] max-w-xl mx-auto mb-16 font-medium">
            Koleksi literatur terpilih yang baru saja ditambahkan ke dalam sirkulasi perpustakaan bulan ini.
          </p>

          {/* Grid of Books - Minimalist 4x2 covers only */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {books.slice(0, 8).map((book) => (
              <div 
                key={book.id}
                onClick={() => setCurrentView('catalog')}
                className="group cursor-pointer"
              >
                {/* Book Cover Container with hover lift */}
                <div className="relative w-full aspect-[3/4] bg-[#F5F5F5] border border-[#D3D3D3] rounded-sm overflow-hidden shadow-sm group-hover:shadow-md group-hover:translate-y-[-6px] transition-all duration-300 ease-out">
                  <img 
                    src={`https://picsum.photos/seed/${book.coverSeed}/400/500`}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Interactive overlay on hover */}
                  <div className="absolute inset-0 bg-[#FA0F00]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>

          {/* Action button */}
          <button
            onClick={() => setCurrentView('catalog')}
            className="bg-white border border-[#D3D3D3] hover:bg-[#F5F5F5] text-[#1B1B1B] font-semibold px-6 py-3 rounded-sm text-xs uppercase tracking-wider shadow-sm transition-all duration-130 btn-pressable inline-flex items-center gap-2"
          >
            Lihat Semua Koleksi
          </button>
        </div>
      </section>

      <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />

      {/* Wix-inspired Virtual Events Section */}
      <section className="w-full bg-white py-24 relative z-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-[#1B1B1B] tracking-tight mb-4">
              Virtual Events
            </h2>
            <p className="text-sm text-[#6E6E6E] font-medium max-w-lg mx-auto">
              Join us for our virtual programming, live streams, and community events. RSVP to get the access details.
            </p>
          </div>

          {/* Vertical Event List */}
          <div className="border-t border-[#D3D3D3] divide-y divide-[#D3D3D3]">
            {events.map((evt) => (
              <div key={evt.id} className="py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                {/* Date Column */}
                <div className="w-36 shrink-0 font-display font-bold text-sm text-[#6E6E6E]">
                  {formatEventDate(evt.dateStr)}
                </div>
                
                {/* Title & Location Column */}
                <div className="flex-1 text-left">
                  <h4 className="font-display font-semibold text-base md:text-lg text-[#1B1B1B] hover:text-[#FA0F00] transition-colors duration-150 cursor-pointer">
                    {evt.title} <span className="text-[#6E6E6E] font-normal">/ {evt.location}</span>
                  </h4>
                </div>
                
                {/* RSVP Button */}
                <button 
                  onClick={() => onRSVP(evt.title)}
                  className="shrink-0 border border-[#FA0F00] text-[#FA0F00] hover:bg-[#FA0F00] hover:text-white px-6 py-2 text-xs uppercase font-bold tracking-wider rounded-sm transition-all duration-200 btn-pressable"
                >
                  RSVP
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />

      {/* Wix-inspired Parallax About Us Section */}
      <section 
        className="relative w-full min-h-[550px] flex items-center justify-center bg-fixed bg-cover bg-center py-24 z-20 text-center"
        style={{ backgroundImage: `url(${heroLibraryImg})` }}
      >
        {/* Translucent background overlay */}
        <div className="absolute inset-0 bg-black/15 pointer-events-none" />

        {/* Centered Translucent Pinkish/Beige Content Box */}
        <div className="relative z-10 bg-[#E5D7D7]/90 border border-[#CBB8B8] backdrop-blur-md p-10 md:p-14 max-w-2xl mx-4 text-center rounded-sm shadow-xl">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-[#1B1B1B] mb-6">
            About Our Library
          </h2>
          <p className="text-sm md:text-base text-[#4A4A4A] leading-relaxed font-medium mb-8">
            AtmaLibrary hadir sebagai pilar literasi digital modern, menghubungkan Anda dengan ribuan koleksi literatur berkualitas tinggi, ruang baca kolaboratif, dan program komunitas terpadu. Kami berdedikasi untuk mendorong inklusivitas ilmu pengetahuan bagi semua kalangan.
          </p>
          <button 
            onClick={() => setCurrentView('about')}
            className="bg-[#FA0F00] hover:bg-[#E00D00] text-white font-semibold px-8 py-3 rounded-sm text-xs uppercase tracking-wider shadow-sm transition-all duration-130 btn-pressable"
          >
            Learn More
          </button>
        </div>

        {/* Floating circular Donate button top right */}
        <div className="absolute top-8 right-8 md:top-12 md:right-12 z-20">
          <div className="w-24 h-24 rounded-full border border-[#FA0F00] bg-white hover:bg-[#FA0F00] text-[#FA0F00] hover:text-white flex flex-col items-center justify-center text-[10px] uppercase font-bold tracking-widest shadow-lg cursor-pointer transition-all duration-300 btn-pressable">
            <span>Donate</span>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />

      {/* Shared Footer & Map */}
      <ContactSection />
      <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />
      <LocationMap />
    </>
  );
};
