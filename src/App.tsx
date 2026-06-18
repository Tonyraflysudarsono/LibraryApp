import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { QRScannerModal } from './components/QRScannerModal';
import { BookCatalog } from './components/BookCatalog';
import { MemberDashboard } from './components/MemberDashboard';
import { mockDb } from './data/mockDb';
import type { Book, BorrowRequest, LibraryEvent } from './data/mockDb';
import heroLibraryImg from './assets/hero-library.png';
import aboutLibraryTeamImg from './assets/about-library-team.png';
import { 
  BookOpen, 
  Users, 
  CalendarBlank, 
  Coin,
  TrendUp
} from '@phosphor-icons/react';

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

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'dashboard' | 'about' | 'events'>('home');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [user, setUser] = useState<{ name: string; id: string } | null>(null);
  
  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<BorrowRequest[]>([]);
  const [events, setEvents] = useState<LibraryEvent[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);



  // Mouse move parallax values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });



  const handlePointerMove = (e: React.PointerEvent) => {
    const x = e.clientX - window.innerWidth / 2;
    const y = e.clientY - window.innerHeight / 2;
    mouseX.set(x * 0.08); 
    mouseY.set(y * 0.08);
  };

  // Scroll listener to toggle navbar states
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('lib_session_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      setBorrows(mockDb.getBorrowRequests(user.id));
    } else {
      setBorrows([]);
      if (currentView === 'dashboard') {
        setCurrentView('home');
      }
    }
  }, [user]);

  const fetchData = () => {
    setBooks(mockDb.getBooks());
    setEvents(mockDb.getEvents());
    if (user) {
      setBorrows(mockDb.getBorrowRequests(user.id));
    }
  };

  const handleLoginSuccess = (loggedInUser: { name: string; id: string }) => {
    setUser(loggedInUser);
    localStorage.setItem('lib_session_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lib_session_user');
  };

  const handleBorrow = (bookId: string) => {
    if (!user) return { success: false, message: 'Please log in first.' };
    const res = mockDb.borrowBook(bookId, user.id);
    if (res.success) {
      fetchData();
    }
    return res;
  };

  const handleReturnRequest = (borrowId: string) => {
    const res = mockDb.requestReturn(borrowId);
    if (res.success) {
      fetchData();
    }
    return res;
  };

  const handleRSVP = (evtTitle: string) => {
    alert(`Terima kasih! Pendaftaran RSVP Anda untuk "${evtTitle}" telah berhasil.`);
  };

  return (
    <main 
      onPointerMove={handlePointerMove}
      className="overflow-x-hidden w-full max-w-full min-h-dvh bg-white relative flex flex-col justify-between selection:bg-[#FA0F00] selection:text-white"
    >
      {/* Light Mode Parallax Ambient Red Spotlight */}
      <motion.div 
        style={{ x: springX, y: springY }}
        className="mouse-parallax-blob absolute top-[10%] left-[25%] -translate-x-1/2 -translate-y-1/2"
      />

      {/* Main Content Layout */}
      <div className="relative z-10 pt-14">
        <Navbar
          isScrolled={isScrolled}
          currentView={currentView}
          setCurrentView={setCurrentView}
          user={user}
          onLoginClick={() => setIsLoginOpen(true)}
          onLogout={handleLogout}
          onQRScannerClick={() => setIsQROpen(true)}
        />

        {/* --- RESTORED HOME PAGE --- */}
        {currentView === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Wix-inspired Split Hero Section */}
            <section className="w-full bg-[#FAF6F0] py-16 relative z-10">
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
                            onClick={() => setIsLoginOpen(true)}
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
                      <button className="shrink-0 border border-[#FA0F00] text-[#FA0F00] hover:bg-[#FA0F00] hover:text-white px-6 py-2 text-xs uppercase font-bold tracking-wider rounded-sm transition-all duration-200 btn-pressable">
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
              className="relative w-full min-h-[550px] flex items-center justify-center bg-fixed bg-cover bg-center py-24 z-20"
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
                <button className="bg-[#FA0F00] hover:bg-[#E00D00] text-white font-semibold px-8 py-3 rounded-sm text-xs uppercase tracking-wider shadow-sm transition-all duration-130 btn-pressable">
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

            {/* Wix-inspired Contact Section */}
            <section className="w-full bg-[#FAF9F9] py-24 relative z-20">
              <div className="max-w-6xl mx-auto px-6 relative">
                {/* Floating Donate button right side */}
                <div className="absolute top-0 right-6 z-20 hidden md:block">
                  <div className="w-24 h-24 rounded-full border border-[#FA0F00] bg-white hover:bg-[#FA0F00] text-[#FA0F00] hover:text-white flex flex-col items-center justify-center text-[10px] uppercase font-bold tracking-widest shadow-lg cursor-pointer transition-all duration-300 btn-pressable">
                    <span>Donate</span>
                  </div>
                </div>

                <div className="text-center md:text-left mb-16 max-w-2xl">
                  <h2 className="font-display font-bold text-4xl text-[#1B1B1B] tracking-tight mb-4">
                    Contact
                  </h2>
                  <p className="text-sm text-[#6E6E6E] font-medium leading-relaxed">
                    Hubungi kami untuk mempelajari lebih lanjut tentang rilis koleksi buku terbaru, event virtual, serta layanan peminjaman sirkulasi mandiri digital.
                  </p>
                </div>

                {/* 3-Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  {/* Col 1: Address */}
                  <div className="md:col-span-3 text-left">
                    <h3 className="font-display font-bold text-lg text-[#1B1B1B] mb-6 tracking-wide">
                      Address
                    </h3>
                    <p className="text-sm text-[#6E6E6E] leading-relaxed font-medium mb-6">
                      Jl. Babarsari No.44, <br />
                      Janti, Caturtunggal, Depok, <br />
                      Sleman, Yogyakarta 55281
                    </p>
                    <p className="text-sm text-[#6E6E6E] leading-relaxed font-medium">
                      Telp: 123-456-7890 <br />
                      Email: info@atmalibrary.org
                    </p>
                  </div>

                  {/* Col 2: Opening Hours & Socials */}
                  <div className="md:col-span-3 text-left">
                    <h3 className="font-display font-bold text-lg text-[#1B1B1B] mb-6 tracking-wide">
                      Opening Hours
                    </h3>
                    <p className="text-sm text-[#6E6E6E] leading-relaxed font-medium mb-8">
                      Mon - Fri: 8am - 8pm <br />
                      Saturday: 9am - 7pm <br />
                      Sunday: 9am - 8pm
                    </p>
                    
                    {/* Social Icons */}
                    <div className="flex gap-4 items-center">
                      <a href="#" className="w-8 h-8 rounded-full border border-[#D3D3D3] hover:border-[#FA0F00] hover:text-[#FA0F00] flex items-center justify-center text-[#6E6E6E] transition-all">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                        </svg>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full border border-[#D3D3D3] hover:border-[#FA0F00] hover:text-[#FA0F00] flex items-center justify-center text-[#6E6E6E] transition-all">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full border border-[#D3D3D3] hover:border-[#FA0F00] hover:text-[#FA0F00] flex items-center justify-center text-[#6E6E6E] transition-all">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Col 3: Ask Us Anything Form */}
                  <div className="md:col-span-6 text-left">
                    <h3 className="font-display font-bold text-lg text-[#1B1B1B] mb-6 tracking-wide">
                      Ask Us Anything
                    </h3>
                    <form onSubmit={(e) => { e.preventDefault(); alert('Pesan Anda telah terkirim. Terima kasih!'); }} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">First Name *</label>
                          <input required type="text" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Last Name *</label>
                          <input required type="text" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Email *</label>
                          <input required type="email" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Subject</label>
                          <input type="text" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Leave us a message...</label>
                        <textarea rows={3} className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none resize-none" />
                      </div>

                      <button type="submit" className="bg-[#FA0F00] hover:bg-[#E00D00] text-white px-8 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-130 btn-pressable">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>

            <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />

            {/* Wix-inspired Location Map Section */}
            <section className="w-full relative z-20 h-[450px] overflow-hidden">
              {/* OpenStreetMap iframe */}
              <iframe 
                src="https://www.openstreetmap.org/export/embed.html?bbox=110.4130%2C-7.7835%2C110.4190%2C-7.7785&amp;layer=mapnik"
                title="AtmaLibrary Location Map"
                className="w-full h-full border-none grayscale contrast-115 hover:grayscale-0 transition-all duration-700 ease-in-out"
              />

              {/* Location Pin Overlay Popup */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120px] bg-white border border-[#D3D3D3] p-4 pr-10 shadow-xl rounded-sm z-30 min-w-[200px]">
                <button 
                  onClick={(e) => { e.currentTarget.parentElement?.remove(); }}
                  className="absolute top-2 right-2 text-[#9E9E9E] hover:text-[#1B1B1B] text-xs font-bold font-mono transition-colors"
                  title="Close"
                >
                  ✕
                </button>
                <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#FA0F00] mb-1">
                  ATMA LIBRARY
                </h4>
                <p className="text-[10px] font-mono font-bold text-[#6E6E6E]">
                  Yogyakarta, Indonesia
                </p>
                {/* Marker indicator triangle pointing down */}
                <div className="absolute bottom-[-6px] left-[20px] w-3 h-3 bg-white border-r border-b border-[#D3D3D3] rotate-45" />
              </div>
            </section>
          </div>
        )}

        {/* --- ABOUT PAGE --- */}
        {currentView === 'about' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
            {/* About Us Split Header Section */}
            <section className="w-full bg-[#FAF6F0] py-16 relative z-10">
              <div className="max-w-7xl mx-auto px-6 relative">
                {/* Floating Donate button top right */}
                <div className="absolute top-0 right-6 z-20 hidden lg:block">
                  <div className="w-24 h-24 rounded-full border border-[#FA0F00] bg-white hover:bg-[#FA0F00] text-[#FA0F00] hover:text-white flex flex-col items-center justify-center text-[10px] uppercase font-bold tracking-widest shadow-lg cursor-pointer transition-all duration-300 btn-pressable">
                    <span>Donate</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-8">
                  {/* Left Side: Collaboration Image */}
                  <div className="lg:col-span-6 relative min-h-[350px] lg:min-h-[480px] rounded-sm overflow-hidden border border-[#D3D3D3] shadow-lg">
                    <img
                      src={aboutLibraryTeamImg}
                      alt="AtmaLibrary Team & Visitors"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Subtle vignette gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                  </div>

                  {/* Right Side: Content Panel (Overlap Box) */}
                  <div className="lg:col-span-6 bg-[#E5D7D7]/90 text-[#1B1B1B] border border-[#CBB8B8] rounded-sm p-8 lg:p-14 flex flex-col justify-center text-left shadow-2xl lg:-ml-16 z-10 my-6 relative">
                    <h2 className="font-display font-bold text-4xl text-[#1B1B1B] tracking-tight leading-[1.1] mb-6">
                      Our Library
                    </h2>
                    <p className="text-sm text-[#4A4A4A] leading-relaxed font-medium mb-6">
                      AtmaLibrary adalah pusat pembelajaran kolaboratif yang didirikan dengan visi untuk memberdayakan komunitas Sleman dan Yogyakarta melalui penyediaan akses literasi tanpa batas. Kami mengintegrasikan teknologi sirkulasi digital mandiri dengan kenyamanan ruang baca fisik yang inklusif.
                    </p>
                    <p className="text-sm text-[#4A4A4A] leading-relaxed font-medium">
                      Setiap sudut perpustakaan dirancang untuk memfasilitasi diskusi, penelitian mendalam, dan kreasi bersama. Kami menyelenggarakan berbagai program virtual dan fisik mingguan untuk menghubungkan pembaca, penulis, serta profesional lintas bidang.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />

            {/* Staff & Board Members Section */}
            <section className="w-full bg-[#FAF9F9] py-24 relative z-20">
              <div className="max-w-4xl mx-auto px-6 relative">
                {/* Floating Donate button right side */}
                <div className="absolute top-0 right-[-32px] z-20 hidden xl:block">
                  <div className="w-24 h-24 rounded-full border border-[#FA0F00] bg-white hover:bg-[#FA0F00] text-[#FA0F00] hover:text-white flex flex-col items-center justify-center text-[10px] uppercase font-bold tracking-widest shadow-lg cursor-pointer transition-all duration-300 btn-pressable">
                    <span>Donate</span>
                  </div>
                </div>

                <div className="text-center mb-16">
                  <h2 className="font-display font-bold text-3xl md:text-4xl text-[#1B1B1B] tracking-tight mb-4">
                    Staff & Board Members
                  </h2>
                  <p className="text-sm text-[#6E6E6E] max-w-lg mx-auto font-medium leading-relaxed">
                    Kenali tim profesional dan dewan pengarah yang berdedikasi tinggi dalam mengelola layanan, program sirkulasi, dan pengembangan berkelanjutan AtmaLibrary.
                  </p>
                </div>

                {/* Staff & Board List Card Box */}
                <div className="bg-white border border-[#D3D3D3] rounded-sm p-12 shadow-sm relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-center">
                    {/* Column 1: Staff */}
                    <div>
                      <h3 className="font-display font-bold text-xl text-[#1B1B1B] border-b border-[#D3D3D3] pb-4 mb-8 uppercase tracking-wider">
                        Staff
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-display font-bold text-base text-[#1B1B1B]">Casey Lennon</h4>
                          <p className="text-xs text-[#6E6E6E] font-mono mt-0.5">Library Director</p>
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-base text-[#1B1B1B]">Daniel Wright</h4>
                          <p className="text-xs text-[#6E6E6E] font-mono mt-0.5">Library Assistant</p>
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-base text-[#1B1B1B]">Nora Gracia</h4>
                          <p className="text-xs text-[#6E6E6E] font-mono mt-0.5">Library Assistant</p>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Board */}
                    <div>
                      <h3 className="font-display font-bold text-xl text-[#1B1B1B] border-b border-[#D3D3D3] pb-4 mb-8 uppercase tracking-wider">
                        Board
                      </h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-display font-bold text-base text-[#1B1B1B]">Madison Thomas</h4>
                          <p className="text-xs text-[#6E6E6E] font-mono mt-0.5">Chair</p>
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-base text-[#1B1B1B]">Gabriel Clark</h4>
                          <p className="text-xs text-[#6E6E6E] font-mono mt-0.5">Vice Chair</p>
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-base text-[#1B1B1B]">Taylor Young</h4>
                          <p className="text-xs text-[#6E6E6E] font-mono mt-0.5">Council Representative</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />

            {/* Wix-inspired Contact Section */}
            <section className="w-full bg-[#FAF9F9] py-24 relative z-20">
              <div className="max-w-6xl mx-auto px-6 relative">
                {/* Floating Donate button right side */}
                <div className="absolute top-0 right-6 z-20 hidden md:block">
                  <div className="w-24 h-24 rounded-full border border-[#FA0F00] bg-white hover:bg-[#FA0F00] text-[#FA0F00] hover:text-white flex flex-col items-center justify-center text-[10px] uppercase font-bold tracking-widest shadow-lg cursor-pointer transition-all duration-300 btn-pressable">
                    <span>Donate</span>
                  </div>
                </div>

                <div className="text-center md:text-left mb-16 max-w-2xl">
                  <h2 className="font-display font-bold text-4xl text-[#1B1B1B] tracking-tight mb-4">
                    Contact
                  </h2>
                  <p className="text-sm text-[#6E6E6E] font-medium leading-relaxed">
                    Hubungi kami untuk mempelajari lebih lanjut tentang rilis koleksi buku terbaru, event virtual, serta layanan peminjaman sirkulasi mandiri digital.
                  </p>
                </div>

                {/* 3-Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  {/* Col 1: Address */}
                  <div className="md:col-span-3 text-left">
                    <h3 className="font-display font-bold text-lg text-[#1B1B1B] mb-6 tracking-wide">
                      Address
                    </h3>
                    <p className="text-sm text-[#6E6E6E] leading-relaxed font-medium mb-6">
                      Jl. Babarsari No.44, <br />
                      Janti, Caturtunggal, Depok, <br />
                      Sleman, Yogyakarta 55281
                    </p>
                    <p className="text-sm text-[#6E6E6E] leading-relaxed font-medium">
                      Telp: 123-456-7890 <br />
                      Email: info@atmalibrary.org
                    </p>
                  </div>

                  {/* Col 2: Opening Hours & Socials */}
                  <div className="md:col-span-3 text-left">
                    <h3 className="font-display font-bold text-lg text-[#1B1B1B] mb-6 tracking-wide">
                      Opening Hours
                    </h3>
                    <p className="text-sm text-[#6E6E6E] leading-relaxed font-medium mb-8">
                      Mon - Fri: 8am - 8pm <br />
                      Saturday: 9am - 7pm <br />
                      Sunday: 9am - 8pm
                    </p>
                    
                    {/* Social Icons */}
                    <div className="flex gap-4 items-center">
                      <a href="#" className="w-8 h-8 rounded-full border border-[#D3D3D3] hover:border-[#FA0F00] hover:text-[#FA0F00] flex items-center justify-center text-[#6E6E6E] transition-all">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                        </svg>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full border border-[#D3D3D3] hover:border-[#FA0F00] hover:text-[#FA0F00] flex items-center justify-center text-[#6E6E6E] transition-all">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full border border-[#D3D3D3] hover:border-[#FA0F00] hover:text-[#FA0F00] flex items-center justify-center text-[#6E6E6E] transition-all">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Col 3: Ask Us Anything Form */}
                  <div className="md:col-span-6 text-left">
                    <h3 className="font-display font-bold text-lg text-[#1B1B1B] mb-6 tracking-wide">
                      Ask Us Anything
                    </h3>
                    <form onSubmit={(e) => { e.preventDefault(); alert('Pesan Anda telah terkirim. Terima kasih!'); }} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">First Name *</label>
                          <input required type="text" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Last Name *</label>
                          <input required type="text" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Email *</label>
                          <input required type="email" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Subject</label>
                          <input type="text" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Leave us a message...</label>
                        <textarea rows={3} className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none resize-none" />
                      </div>

                      <button type="submit" className="bg-[#FA0F00] hover:bg-[#E00D00] text-white px-8 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-130 btn-pressable">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>

            <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />

            {/* Wix-inspired Location Map Section */}
            <section className="w-full relative z-20 h-[450px] overflow-hidden">
              {/* OpenStreetMap iframe */}
              <iframe 
                src="https://www.openstreetmap.org/export/embed.html?bbox=110.4130%2C-7.7835%2C110.4190%2C-7.7785&amp;layer=mapnik"
                title="AtmaLibrary Location Map"
                className="w-full h-full border-none grayscale contrast-115 hover:grayscale-0 transition-all duration-700 ease-in-out"
              />

              {/* Location Pin Overlay Popup */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120px] bg-white border border-[#D3D3D3] p-4 pr-10 shadow-xl rounded-sm z-30 min-w-[200px]">
                <button 
                  onClick={(e) => { e.currentTarget.parentElement?.remove(); }}
                  className="absolute top-2 right-2 text-[#9E9E9E] hover:text-[#1B1B1B] text-xs font-bold font-mono transition-colors"
                  title="Close"
                >
                  ✕
                </button>
                <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#FA0F00] mb-1">
                  ATMA LIBRARY
                </h4>
                <p className="text-[10px] font-mono font-bold text-[#6E6E6E]">
                  Yogyakarta, Indonesia
                </p>
                {/* Marker indicator triangle pointing down */}
                <div className="absolute bottom-[-6px] left-[20px] w-3 h-3 bg-white border-r border-b border-[#D3D3D3] rotate-45" />
              </div>
            </section>
          </div>
        )}

        {/* --- EVENTS PAGE --- */}
        {currentView === 'events' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
            {/* Header Section */}
            <section className="w-full bg-[#FAF6F0] py-20 text-center relative z-10">
              <div className="max-w-4xl mx-auto px-6">
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
            <section className="w-full bg-white py-24 relative z-20">
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
                            onClick={() => handleRSVP(evt.title)}
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

            {/* Wix-inspired Contact Section */}
            <section className="w-full bg-[#FAF9F9] py-24 relative z-20">
              <div className="max-w-6xl mx-auto px-6 relative">
                {/* Floating Donate button right side */}
                <div className="absolute top-0 right-6 z-20 hidden md:block">
                  <div className="w-24 h-24 rounded-full border border-[#FA0F00] bg-white hover:bg-[#FA0F00] text-[#FA0F00] hover:text-white flex flex-col items-center justify-center text-[10px] uppercase font-bold tracking-widest shadow-lg cursor-pointer transition-all duration-300 btn-pressable">
                    <span>Donate</span>
                  </div>
                </div>

                <div className="text-center md:text-left mb-16 max-w-2xl">
                  <h2 className="font-display font-bold text-4xl text-[#1B1B1B] tracking-tight mb-4">
                    Contact
                  </h2>
                  <p className="text-sm text-[#6E6E6E] font-medium leading-relaxed">
                    Hubungi kami untuk mempelajari lebih lanjut tentang rilis koleksi buku terbaru, event virtual, serta layanan peminjaman sirkulasi mandiri digital.
                  </p>
                </div>

                {/* 3-Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  {/* Col 1: Address */}
                  <div className="md:col-span-3 text-left">
                    <h3 className="font-display font-bold text-lg text-[#1B1B1B] mb-6 tracking-wide">
                      Address
                    </h3>
                    <p className="text-sm text-[#6E6E6E] leading-relaxed font-medium mb-6">
                      Jl. Babarsari No.44, <br />
                      Janti, Caturtunggal, Depok, <br />
                      Sleman, Yogyakarta 55281
                    </p>
                    <p className="text-sm text-[#6E6E6E] leading-relaxed font-medium">
                      Telp: 123-456-7890 <br />
                      Email: info@atmalibrary.org
                    </p>
                  </div>

                  {/* Col 2: Opening Hours & Socials */}
                  <div className="md:col-span-3 text-left">
                    <h3 className="font-display font-bold text-lg text-[#1B1B1B] mb-6 tracking-wide">
                      Opening Hours
                    </h3>
                    <p className="text-sm text-[#6E6E6E] leading-relaxed font-medium mb-8">
                      Mon - Fri: 8am - 8pm <br />
                      Saturday: 9am - 7pm <br />
                      Sunday: 9am - 8pm
                    </p>
                    
                    {/* Social Icons */}
                    <div className="flex gap-4 items-center">
                      <a href="#" className="w-8 h-8 rounded-full border border-[#D3D3D3] hover:border-[#FA0F00] hover:text-[#FA0F00] flex items-center justify-center text-[#6E6E6E] transition-all">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                        </svg>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full border border-[#D3D3D3] hover:border-[#FA0F00] hover:text-[#FA0F00] flex items-center justify-center text-[#6E6E6E] transition-all">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                      <a href="#" className="w-8 h-8 rounded-full border border-[#D3D3D3] hover:border-[#FA0F00] hover:text-[#FA0F00] flex items-center justify-center text-[#6E6E6E] transition-all">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Col 3: Ask Us Anything Form */}
                  <div className="md:col-span-6 text-left">
                    <h3 className="font-display font-bold text-lg text-[#1B1B1B] mb-6 tracking-wide">
                      Ask Us Anything
                    </h3>
                    <form onSubmit={(e) => { e.preventDefault(); alert('Pesan Anda telah terkirim. Terima kasih!'); }} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">First Name *</label>
                          <input required type="text" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Last Name *</label>
                          <input required type="text" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Email *</label>
                          <input required type="email" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Subject</label>
                          <input type="text" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Leave us a message...</label>
                        <textarea rows={3} className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none resize-none" />
                      </div>

                      <button type="submit" className="bg-[#FA0F00] hover:bg-[#E00D00] text-white px-8 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-130 btn-pressable">
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>

            <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />

            {/* Wix-inspired Location Map Section */}
            <section className="w-full relative z-20 h-[450px] overflow-hidden">
              {/* OpenStreetMap iframe */}
              <iframe 
                src="https://www.openstreetmap.org/export/embed.html?bbox=110.4130%2C-7.7835%2C110.4190%2C-7.7785&amp;layer=mapnik"
                title="AtmaLibrary Location Map"
                className="w-full h-full border-none grayscale contrast-115 hover:grayscale-0 transition-all duration-700 ease-in-out"
              />

              {/* Location Pin Overlay Popup */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120px] bg-white border border-[#D3D3D3] p-4 pr-10 shadow-xl rounded-sm z-30 min-w-[200px]">
                <button 
                  onClick={(e) => { e.currentTarget.parentElement?.remove(); }}
                  className="absolute top-2 right-2 text-[#9E9E9E] hover:text-[#1B1B1B] text-xs font-bold font-mono transition-colors"
                  title="Close"
                >
                  ✕
                </button>
                <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#FA0F00] mb-1">
                  ATMA LIBRARY
                </h4>
                <p className="text-[10px] font-mono font-bold text-[#6E6E6E]">
                  Yogyakarta, Indonesia
                </p>
                {/* Marker indicator triangle pointing down */}
                <div className="absolute bottom-[-6px] left-[20px] w-3 h-3 bg-white border-r border-b border-[#D3D3D3] rotate-45" />
              </div>
            </section>
          </div>
        )}

        {/* Main Catalog View */}
        {(currentView === 'catalog' || currentView === 'dashboard') && (
          <section className="relative z-10 bg-[#F5F5F5] min-h-screen">
            {currentView === 'catalog' && (
              <BookCatalog
                books={books}
                user={user}
                onBorrow={handleBorrow}
                onLoginRequest={() => setIsLoginOpen(true)}
                refreshBooks={fetchData}
                globalSearchQuery={globalSearchQuery}
                setGlobalSearchQuery={setGlobalSearchQuery}
              />
            )}
            {currentView === 'dashboard' && (
              <MemberDashboard
                user={user}
                borrows={borrows}
                onReturnRequest={handleReturnRequest}
                onBrowseBooks={() => setCurrentView('catalog')}
                refreshBorrows={fetchData}
              />
            )}
          </section>
        )}
      </div>

      {/* Main Footer */}
      <footer className="w-full bg-[#1B1B1B] text-white py-12 border-t border-[#333333] relative z-20 text-center">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center justify-center gap-4 text-xs font-mono tracking-wider text-[#9E9E9E]">
          <p>© 2026 by ATMA LIBRARY. Powered and secured by Wix</p>
        </div>
      </footer>

      {/* Login Modal Overlay */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* QR Scanner Modal Overlay */}
      <QRScannerModal
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        onScanSuccess={() => {
          if (user) {
            // Mock self-checkout with a hardcoded popular book ID
            const res = mockDb.borrowBook('6', user.id); 
            if (res.success) {
              alert('Self-Checkout Berhasil: Atomic Habits dipinjam.');
              fetchData();
            } else {
              alert('Self-Checkout Gagal: ' + res.message);
            }
          }
        }}
      />
    </main>
  );
}

export default App;
