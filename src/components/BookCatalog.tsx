import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { MagnifyingGlass, BookOpen, Clock, CalendarBlank, BookmarkSimple, Quotes, ArrowLeft } from '@phosphor-icons/react';
import { mockDb } from '../data/mockDb';
import type { Book, Bookmark } from '../data/mockDb';
import collectionsHeroImg from '../assets/library-collections-hero.png';

interface BookCatalogProps {
  books: Book[];
  user: { name: string; id: string } | null;
  onBorrow: (bookId: string) => Promise<{ success: boolean; message: string }> | any;
  onLoginRequest: () => void;
  refreshBooks: () => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
}

interface BookCardProps {
  book: Book;
  isFeatured: boolean;
  idx: number;
  onClick: () => void;
  viewMode: 'grid' | 'list';
  isBookmarked: boolean;
  onBookmarkToggle: (e: React.MouseEvent) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, isFeatured, idx, onClick, viewMode, isBookmarked, onBookmarkToggle }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Scroll parallax effect on image
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.25, ease: [0.45, 0, 0.40, 1], delay: Math.min(idx * 0.03, 0.15) }}
      onClick={onClick}
      className={`group cursor-pointer ${
        viewMode === 'list'
          ? 'w-full flex'
          : isFeatured
            ? 'md:col-span-2 flex flex-col md:flex-row gap-6'
            : 'flex flex-col'
      }`}
    >
      <div className="adobe-card w-full h-full">
        <div className={`flex h-full ${
          viewMode === 'list' 
            ? 'flex-row gap-4 md:gap-6 p-4 items-center' 
            : isFeatured ? 'flex-col md:flex-row gap-6 p-6' : 'flex-col p-5'
        }`}>
          
          {/* Cover Section with Scroll Parallax (4px rounded container) */}
          <div className={`relative overflow-hidden rounded-md bg-[#F5F5F5] border border-[#D3D3D3] flex-shrink-0 ${
            viewMode === 'list' ? 'w-20 md:w-28 aspect-[2/3]' :
            isFeatured ? 'w-full md:w-48 aspect-[2/3]' : 'w-full aspect-[2/3]'
          }`}>
            <motion.img
              style={{ y }}
              src={`https://picsum.photos/seed/${book.coverSeed}/400/600`}
              alt={book.title}
              loading="lazy"
              className="w-full h-full object-cover scale-115 opacity-95 group-hover:scale-120 transition-transform duration-250"
            />
            {/* Tag (2px rounded radius) */}
            <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-sm text-[10px] uppercase font-bold tracking-wider bg-white/95 border border-[#D3D3D3] text-[#1B1B1B] z-10 shadow-sm">
              {book.category}
            </div>

            {/* Bookmark Button */}
            <button 
              onClick={onBookmarkToggle}
              className={`absolute top-3 left-3 p-1.5 rounded-full backdrop-blur-md transition-colors z-10 border shadow-sm ${
                isBookmarked ? 'bg-[#1B1B1B] border-[#1B1B1B] text-white' : 'bg-white/80 border-[#D3D3D3] text-[#6E6E6E] hover:bg-white hover:text-[#1B1B1B]'
              }`}
              title="Simpan Buku"
            >
              <BookmarkSimple className="w-4 h-4" weight={isBookmarked ? 'fill' : 'bold'} />
            </button>
          </div>

          {/* Meta Section */}
          <div className="flex flex-col flex-grow text-left mt-4 md:mt-0 justify-between h-full">
            <div className="flex-grow">
              <span className="text-[10px] font-mono tracking-widest text-[#6E6E6E] uppercase block mb-1">
                {book.author}
              </span>
              <h4 className="font-display font-bold text-base md:text-lg text-[#1B1B1B] group-hover:text-[#FA0F00] transition-colors duration-130 line-clamp-2 leading-snug">
                {book.title}
              </h4>
              <p className={`text-xs text-[#6E6E6E] mt-2 line-clamp-2 md:line-clamp-3 leading-relaxed ${
                viewMode === 'list' ? 'hidden md:block' : isFeatured ? 'md:block' : 'hidden'
              }`}>
                {book.description}
              </p>
            </div>

            {/* Stock indicator bottom panel */}
            <div className="flex items-center justify-between border-t border-[#D3D3D3] pt-4 mt-6">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${book.stock > 0 ? 'bg-[#008000]' : 'bg-[#FA0F00]'}`} />
                <span className="text-[11px] font-bold text-[#1B1B1B] tracking-wide">
                  {book.stock > 0 ? `${book.stock} Tersedia` : 'Habis'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#6E6E6E]">{book.year}</span>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const BookCatalog: React.FC<BookCatalogProps> = ({
  books,
  user,
  onBorrow,
  onLoginRequest,
  refreshBooks,
  globalSearchQuery,
  setGlobalSearchQuery
}) => {
  const [subView, setSubView] = useState<'landing' | 'search'>('landing');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [actionFeedback, setActionFeedback] = useState<{ success?: boolean; message: string } | null>(null);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  React.useEffect(() => {
    if (user) {
      setBookmarks(mockDb.getBookmarks(user.id));
    } else {
      setBookmarks([]);
    }
  }, [user]);

  const handleToggleBookmark = (e: React.MouseEvent, bookId: string) => {
    e.stopPropagation();
    if (!user) {
      onLoginRequest();
      return;
    }
    mockDb.toggleBookmark(bookId, user.id);
    setBookmarks(mockDb.getBookmarks(user.id));
  };

  const handleCopyCitation = (format: 'APA' | 'MLA') => {
    if (!selectedBook) return;
    let citation = '';
    if (format === 'APA') {
      citation = `${selectedBook.author}. (${selectedBook.year}). ${selectedBook.title}. ${selectedBook.publisher}.`;
    } else {
      citation = `${selectedBook.author}. ${selectedBook.title}. ${selectedBook.publisher}, ${selectedBook.year}.`;
    }
    navigator.clipboard.writeText(citation);
    alert('Sitasi disalin ke clipboard:\n\n' + citation);
  };

  const dbCategories = Array.from(new Set(books.map(b => b.category)));
  const categories = [
    'Semua', 
    'Children', 
    'Teen', 
    'Adult', 
    ...dbCategories.filter(cat => cat !== 'Children' && cat !== 'Teen' && cat !== 'Adult')
  ];

  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(globalSearchQuery.toLowerCase());
    
    let matchesCategory = false;
    if (selectedCategory === 'Semua') {
      matchesCategory = true;
    } else if (selectedCategory === 'Adult') {
      matchesCategory = book.category !== 'Children' && book.category !== 'Teen';
    } else {
      matchesCategory = book.category === selectedCategory;
    }
    
    const matchesAvailability = showAvailableOnly ? book.stock > 0 : true;
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const handleBorrowClick = async (book: Book) => {
    if (!user) {
      onLoginRequest();
      return;
    }

    setIsBorrowing(true);
    setActionFeedback(null);

    try {
      const res = await onBorrow(book.id);
      setActionFeedback(res);
      setIsBorrowing(false);
      
      if (res.success) {
        refreshBooks();
        setSelectedBook(prev => prev && prev.id === book.id ? { ...prev, stock: prev.stock - 1 } : prev);
      }
    } catch {
      setIsBorrowing(false);
    }
  };

  const handleReserveClick = (book: Book) => {
    if (!user) {
      onLoginRequest();
      return;
    }
    setIsBorrowing(true);
    setActionFeedback(null);
    setTimeout(() => {
      const res = mockDb.reserveBook(book.id, user.id);
      setActionFeedback(res);
      setIsBorrowing(false);
    }, 600);
  };

  if (subView === 'landing') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
        {/* Collections Hero Section */}
        <section className="w-full bg-[#FAF6F0] py-16 relative z-10">
          <div className="max-w-7xl mx-auto px-6 relative">
            
            {/* Floating Donate button top right */}
            <div className="absolute top-0 right-6 z-20 hidden lg:block">
              <div 
                onClick={() => alert('Terima kasih atas dukungan Anda! Fitur donasi akan segera hadir.')}
                className="w-24 h-24 rounded-full border border-[#FA0F00] bg-white hover:bg-[#FA0F00] text-[#FA0F00] hover:text-white flex flex-col items-center justify-center text-[10px] uppercase font-bold tracking-widest shadow-lg cursor-pointer transition-all duration-300 btn-pressable"
              >
                <span>Donate</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-8">
              {/* Left Side: Illustration Image */}
              <div className="lg:col-span-6 relative min-h-[350px] lg:min-h-[480px] rounded-sm overflow-hidden border border-[#D3D3D3] shadow-lg">
                <img
                  src={collectionsHeroImg}
                  alt="AtmaLibrary Collections"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
              </div>

              {/* Right Side: Content Panel (Overlap Box) */}
              <div className="lg:col-span-6 bg-[#E5D7D7]/90 text-[#1B1B1B] border border-[#CBB8B8] rounded-sm p-8 lg:p-14 flex flex-col justify-center text-left shadow-2xl lg:-ml-16 z-10 my-6 relative">
                <h2 className="font-display font-bold text-4xl text-[#1B1B1B] tracking-tight leading-[1.1] mb-6">
                  Library Collections
                </h2>
                <p className="text-sm text-[#4A4A4A] leading-relaxed font-medium mb-8">
                  Jelajahi koleksi buku lengkap AtmaLibrary. Kami menyediakan ribuan bahan pustaka digital terkurasi untuk segala jenjang usia — mulai dari buku anak interaktif, novel remaja inspiratif, hingga literatur profesional dewasa.
                </p>
                <button 
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setSubView('search');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-[#FA0F00] hover:bg-[#E00D00] text-white font-semibold px-8 py-3.5 rounded-sm text-xs uppercase tracking-wider shadow-sm transition-all duration-130 btn-pressable self-start"
                >
                  Full Catalog
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />

        {/* Category Cards Section */}
        <section className="w-full bg-[#FAF9F9] py-24 relative z-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-col gap-12">
              
              {/* Children Card */}
              <div className="bg-white border border-[#3D1E1E] rounded-none p-12 md:p-20 flex flex-col justify-between items-center text-center max-w-3xl w-full mx-auto">
                <div className="flex flex-col items-center">
                  <h3 className="font-display font-medium text-4xl md:text-5xl text-[#3D1E1E] mb-6">Children</h3>
                  {/* Children custom girl avatar SVG */}
                  <svg className="w-24 h-24 mx-auto mb-6 text-[#3D1E1E]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M25 35c-5-8-12-3-10 5s8 5 10-5M75 35c5-8 12-3 10 5s-8 5-10-5" />
                    <circle cx="50" cy="48" r="22" fill="white" />
                    <path d="M28 40c8-8 15-5 22-5s14-3 22 5" />
                    <circle cx="41" cy="48" r="7" />
                    <circle cx="59" cy="48" r="7" />
                    <line x1="48" y1="48" x2="52" y2="48" />
                    <path d="M44 60c3 3 9 3 12 0" />
                    <path d="M50 70 L38 78 L34 78 L38 88 L62 88 L66 78 L62 78 Z" fill="white" />
                    <circle cx="50" cy="74" r="1.5" fill="currentColor" />
                  </svg>
                  <p className="text-sm md:text-base text-[#3D1E1E]/80 font-medium leading-relaxed md:leading-loose mb-10 max-w-xl mx-auto text-pretty">
                    Koleksi buku anak-anak yang dirancang untuk merangsang imajinasi, kreativitas, dan kegemaran membaca sejak usia dini. Dilengkapi dengan ilustrasi yang menarik.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedCategory('Children');
                    setSubView('search');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="border border-[#3D1E1E] text-[#3D1E1E] hover:bg-[#3D1E1E] hover:text-white px-8 py-3 text-sm font-semibold rounded-none transition-all duration-200 btn-pressable"
                >
                  View Children's Catalog
                </button>
              </div>

              {/* Teen Card */}
              <div className="bg-white border border-[#3D1E1E] rounded-none p-12 md:p-20 flex flex-col justify-between items-center text-center max-w-3xl w-full mx-auto">
                <div className="flex flex-col items-center">
                  <h3 className="font-display font-medium text-4xl md:text-5xl text-[#3D1E1E] mb-6">Teen</h3>
                  {/* Teen custom boy cap/sunglasses SVG */}
                  <svg className="w-24 h-24 mx-auto mb-6 text-[#3D1E1E]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M32 46 C32 62 38 68 50 68 C62 68 68 62 68 46 L68 40 L32 40 Z" fill="white" />
                    <path d="M30 44 L70 44 M34 44 C34 49 43 49 43 44 M57 44 C57 49 66 49 66 44" fill="currentColor" />
                    <path d="M32 40 C32 26 68 26 68 40 Z" fill="currentColor" />
                    <path d="M30 38 L20 35 L22 32 L32 35 Z" fill="currentColor" />
                    <path d="M47 58 Q52 59 55 56" />
                    <path d="M43 68 L43 74 M57 68 L57 74" />
                    <path d="M30 88 L38 74 L50 80 L62 74 L70 88 Z" fill="white" />
                  </svg>
                  <p className="text-sm md:text-base text-[#3D1E1E]/80 font-medium leading-relaxed md:leading-loose mb-10 max-w-xl mx-auto text-pretty">
                    Temukan novel petualangan, fiksi ilmiah, pengembangan diri remaja, serta literatur pendukung sekolah yang disesuaikan dengan minat dan fase tumbuh kembang usia remaja.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedCategory('Teen');
                    setSubView('search');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="border border-[#3D1E1E] text-[#3D1E1E] hover:bg-[#3D1E1E] hover:text-white px-8 py-3 text-sm font-semibold rounded-none transition-all duration-200 btn-pressable"
                >
                  View Teen Catalog
                </button>
              </div>

              {/* Adult Card */}
              <div className="bg-white border border-[#3D1E1E] rounded-none p-12 md:p-20 flex flex-col justify-between items-center text-center max-w-3xl w-full mx-auto">
                <div className="flex flex-col items-center">
                  <h3 className="font-display font-medium text-4xl md:text-5xl text-[#3D1E1E] mb-6">Adult</h3>
                  {/* Adult custom mustache gentleman SVG */}
                  <svg className="w-24 h-24 mx-auto mb-6 text-[#3D1E1E]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="50" cy="46" r="20" fill="white" />
                    <path d="M30 40 C30 28 48 24 50 32 C52 24 70 28 70 40" />
                    <circle cx="42" cy="44" r="1.5" fill="currentColor" />
                    <circle cx="58" cy="44" r="1.5" fill="currentColor" />
                    <path d="M38 52 C42 48 48 50 50 52 C52 50 58 48 62 52 C66 54 66 57 62 55 C58 53 52 54 50 56 C48 54 42 53 38 55 C34 57 34 54 38 52 Z" fill="currentColor" />
                    <path d="M46 66 L46 72 M54 66 L54 72" />
                    <path d="M36 88 L40 76 L44 76 L50 82 L56 76 L60 76 L64 88 Z" fill="white" />
                    <path d="M45 74 L42 71 L42 77 Z M55 74 L58 71 L58 77 Z" fill="currentColor" />
                    <circle cx="50" cy="74" r="2" fill="currentColor" />
                  </svg>
                  <p className="text-sm md:text-base text-[#3D1E1E]/80 font-medium leading-relaxed md:leading-loose mb-10 max-w-xl mx-auto text-pretty">
                    Bahan bacaan dewasa yang mencakup akademis, teknologi, bisnis, sejarah, fiksi populer, hingga pengembangan diri profesional untuk mendukung pembelajaran sepanjang hayat.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setSelectedCategory('Adult');
                    setSubView('search');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="border border-[#3D1E1E] text-[#3D1E1E] hover:bg-[#3D1E1E] hover:text-white px-8 py-3 text-sm font-semibold rounded-none transition-all duration-200 btn-pressable"
                >
                  View Adult Catalog
                </button>
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
              <div 
                onClick={() => alert('Terima kasih atas dukungan Anda! Fitur donasi akan segera hadir.')}
                className="w-24 h-24 rounded-full border border-[#FA0F00] bg-white hover:bg-[#FA0F00] text-[#FA0F00] hover:text-white flex flex-col items-center justify-center text-[10px] uppercase font-bold tracking-widest shadow-lg cursor-pointer transition-all duration-300 btn-pressable"
              >
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

                  <button type="submit" className="bg-[#FA0F00] hover:bg-[#E00D00] text-white px-8 py-3.5 rounded-sm text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-130 btn-pressable">
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
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 md:py-16">
      
      {/* Back to overview button */}
      <div className="mb-6">
        <button 
          onClick={() => { setSubView('landing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#6E6E6E] hover:text-[#FA0F00] transition-colors group font-mono uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Galeri Koleksi
        </button>
      </div>

      {/* Search & Filter Header */}
      <div className="flex flex-col gap-6 mb-12">
        <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E6E6E]" />
            <input
              type="text"
              value={globalSearchQuery}
              onChange={e => setGlobalSearchQuery(e.target.value)}
              placeholder="Cari buku berdasarkan judul, pengarang, atau kategori..."
              className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md pl-12 pr-4 py-2.5 text-sm text-[#1B1B1B] placeholder-[#6E6E6E]/60 focus:outline-none focus:border-[#0265DC] focus:bg-white transition-all duration-130 shadow-sm"
              aria-label="Cari buku di katalog"
            />
          </div>

          {/* Additional Toggles */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={showAvailableOnly}
                  onChange={(e) => setShowAvailableOnly(e.target.checked)}
                  aria-label="Tampilkan hanya buku yang tersedia"
                />
                <div className={`w-10 h-5 rounded-full transition-colors duration-250 ${showAvailableOnly ? 'bg-[#008000]' : 'bg-[#D3D3D3]'}`}></div>
                <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-250 shadow-sm ${showAvailableOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
              <span className="text-xs font-semibold text-[#6E6E6E] group-hover:text-[#1B1B1B] transition-colors">Hanya Tersedia</span>
            </label>

            <div className="flex items-center border border-[#D3D3D3] rounded-md overflow-hidden bg-[#F5F5F5]">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-[#6E6E6E] hover:text-[#1B1B1B]'}`}
                aria-label="Tampilan Grid"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M104,48v56a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H96A8,8,0,0,1,104,48Zm112-8H160a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8h56a8,8,0,0,0,8-8V48A8,8,0,0,0,216,40ZM104,152v56a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V152a8,8,0,0,1,8-8H96A8,8,0,0,1,104,152Zm112-8H160a8,8,0,0,0-8,8v56a8,8,0,0,0,8,8h56a8,8,0,0,0,8-8V152A8,8,0,0,0,216,144Z"></path></svg>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-[#6E6E6E] hover:text-[#1B1B1B]'}`}
                aria-label="Tampilan Baris"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,60A12,12,0,1,0,56,72,12,12,0,0,0,44,60Zm0,56a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,56a12,12,0,1,0,12,12A12,12,0,0,0,44,172Z"></path></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filters Chips (Adobe Pill Tag style) */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-130 ${
                selectedCategory === cat
                  ? 'bg-[#1B1B1B] text-white shadow-sm'
                  : 'bg-[#F5F5F5] text-[#6E6E6E] border border-[#D3D3D3] hover:text-[#1B1B1B] hover:bg-[#E8E8E8]'
              }`}
              aria-pressed={selectedCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-5"}>
          {filteredBooks.map((book, idx) => {
            const isFeatured = viewMode === 'grid' && idx === 0 && globalSearchQuery === '' && selectedCategory === 'Semua' && !showAvailableOnly;

            return (
              <BookCard
                key={book.id}
                book={book}
                isFeatured={isFeatured}
                idx={idx}
                onClick={() => {
                  setSelectedBook(book);
                  setActionFeedback(null);
                }}
                viewMode={viewMode}
                isBookmarked={bookmarks.some(b => b.bookId === book.id)}
                onBookmarkToggle={(e) => handleToggleBookmark(e, book.id)}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-white border border-[#D3D3D3] rounded-lg p-8 max-w-md mx-auto shadow-sm">
          <BookOpen className="w-12 h-12 text-[#D3D3D3] mx-auto mb-4" />
          <h4 className="text-[#1B1B1B] font-display font-semibold text-lg">Tidak ada buku ditemukan</h4>
          <p className="text-xs text-[#6E6E6E] mt-2">
            Coba gunakan kata kunci pencarian lain atau pilih kategori yang berbeda.
          </p>
        </div>
      )}

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBook(null)}
              className="absolute inset-0 bg-[#1B1B1B]/40 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: [0.45, 0, 0.40, 1] }}
              className="relative w-full max-w-2xl z-10"
            >
              <div className="bg-white border border-[#D3D3D3] rounded-lg shadow-xl p-6 md:p-8 text-left">
                {/* Close button */}
                <button
                  onClick={() => setSelectedBook(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-md bg-[#F5F5F5] hover:bg-[#E8E8E8] border border-[#D3D3D3] flex items-center justify-center text-[#6E6E6E] hover:text-[#1B1B1B] transition-all duration-130 font-semibold"
                >
                  Batal
                </button>

                <div className="flex flex-col md:flex-row gap-8 mt-4">
                  {/* Left image column */}
                  <div className="w-full md:w-56 aspect-[2/3] rounded-md overflow-hidden bg-[#F5F5F5] border border-[#D3D3D3] shrink-0 shadow-sm">
                    <img
                      src={`https://picsum.photos/seed/${selectedBook.coverSeed}/400/600`}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Right content details column */}
                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      {/* Author Eyebrow */}
                      <span className="text-xs font-mono tracking-widest text-[#0265DC] uppercase block mb-1 font-bold">
                        {selectedBook.author}
                      </span>
                      {/* Title */}
                      <h3 className="font-display font-bold text-xl md:text-2xl text-[#1B1B1B] tracking-tight leading-snug">
                        {selectedBook.title}
                      </h3>

                      {/* Metadata Tag Row (2px rounded corner) */}
                      <div className="flex flex-wrap gap-2 mt-4 mb-6">
                        <span className="px-3 py-0.5 bg-[#F5F5F5] border border-[#D3D3D3] rounded-sm text-[10px] font-bold text-[#1B1B1B]">
                          {selectedBook.category}
                        </span>
                        <span className="px-3 py-0.5 bg-[#F5F5F5] border border-[#D3D3D3] rounded-sm text-[10px] font-bold text-[#1B1B1B] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#6E6E6E]" />
                          14 Hari Pinjam
                        </span>
                        <span className="px-3 py-0.5 bg-[#F5F5F5] border border-[#D3D3D3] rounded-sm text-[10px] font-bold text-[#1B1B1B] flex items-center gap-1">
                          <CalendarBlank className="w-3.5 h-3.5 text-[#6E6E6E]" />
                          Rilis {selectedBook.year}
                        </span>
                      </div>

                      {/* Synopsis Description */}
                      <p className="text-xs text-[#6E6E6E] leading-relaxed">
                        {selectedBook.description}
                      </p>

                      {/* Specifications strip */}
                      <div className="grid grid-cols-2 gap-4 border-t border-[#D3D3D3] pt-4 mt-6 text-xs text-[#6E6E6E] font-mono">
                        <div>
                          <span className="text-[#6E6E6E] block text-[9px] uppercase font-bold">Penerbit:</span>
                          {selectedBook.publisher}
                        </div>
                        <div>
                          <span className="text-[#6E6E6E] block text-[9px] uppercase font-bold">Ketersediaan:</span>
                          {selectedBook.stock} dari {selectedBook.maxStock} Unit
                        </div>
                      </div>

                      {/* Citation Actions */}
                      <div className="flex gap-2 mt-4 pt-4 border-t border-[#D3D3D3]">
                        <button onClick={() => handleCopyCitation('APA')} className="px-3 py-1.5 bg-[#F5F5F5] hover:bg-[#E8E8E8] rounded text-[10px] uppercase font-bold tracking-wider text-[#6E6E6E] hover:text-[#1B1B1B] transition-colors flex items-center gap-1.5 border border-[#D3D3D3]">
                          <Quotes className="w-3.5 h-3.5" /> Salin APA
                        </button>
                        <button onClick={() => handleCopyCitation('MLA')} className="px-3 py-1.5 bg-[#F5F5F5] hover:bg-[#E8E8E8] rounded text-[10px] uppercase font-bold tracking-wider text-[#6E6E6E] hover:text-[#1B1B1B] transition-colors flex items-center gap-1.5 border border-[#D3D3D3]">
                          <Quotes className="w-3.5 h-3.5" /> Salin MLA
                        </button>
                      </div>
                    </div>

                    {/* Action response and submit buttons */}
                    <div className="mt-8 pt-6 border-t border-[#D3D3D3]">
                      <AnimatePresence>
                        {actionFeedback && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className={`flex items-center gap-2 px-4 py-3 rounded-md mb-4 border ${
                              actionFeedback.success
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : 'bg-red-50 border-red-200 text-[#FA0F00]'
                            }`}
                          >
                            <span className="text-xs font-semibold">{actionFeedback.message}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex gap-3">
                        {selectedBook.stock > 0 ? (
                          <button
                            disabled={isBorrowing}
                            onClick={() => handleBorrowClick(selectedBook)}
                            className="flex-grow bg-[#FA0F00] hover:bg-[#E00D00] text-white font-semibold py-3.5 rounded-md shadow-sm transition-all duration-130 btn-pressable text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                          >
                            {isBorrowing ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <BookmarkSimple className="w-4 h-4" weight="bold" />
                                Ajukan Peminjaman Buku
                              </>
                            )}
                          </button>
                        ) : (
                          <button
                            disabled={isBorrowing}
                            onClick={() => handleReserveClick(selectedBook)}
                            className="flex-grow bg-[#1B1B1B] hover:bg-[#333333] text-white font-semibold py-3.5 rounded-md shadow-sm transition-all duration-130 btn-pressable text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                          >
                            {isBorrowing ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <Clock className="w-4 h-4" weight="bold" />
                                Masuk Antrean Waitlist
                              </>
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedBook(null)}
                          className="px-6 py-3.5 bg-white border border-[#D3D3D3] text-[#1B1B1B] hover:bg-[#F5F5F5] rounded-md transition-all duration-130 text-xs font-semibold uppercase tracking-wider"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
