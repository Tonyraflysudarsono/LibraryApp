import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MagnifyingGlass, 
  Plus, 
  Pencil, 
  Trash, 
  XCircle,
  SquaresFour,
  List as ListIcon,
  Funnel,
  Star,
  Globe,
  CaretDown,
  CaretLeft,
  CaretRight,
  BookOpen,
  ArrowLeft
} from '@phosphor-icons/react';
import type { Book, BorrowRequest, UserAccount } from '../../data/mockDb';

interface AdminBooksProps {
  books: Book[];
  allTransactions: BorrowRequest[];
  members: UserAccount[];
  handleBookSubmit: (e: React.FormEvent, newBookData: any, editingBook: Book | null) => void;
  handleBookDelete: (bookId: string) => void;
}

interface ActivityHistoryItem {
  id: string;
  memberName: string;
  memberId: string;
  borrowDate: string;
  dueDate: string;
  returnDate: string;
  overdue: string;
  fine: number;
}

// Helper to generate realistic details based on book metadata
const getExtraBookDetails = (book: Book) => {
  const hash = book.title.charCodeAt(0) + book.title.length + parseInt(book.id || '0') * 7;
  
  const languages = ['English', 'Indonesian', 'English', 'English'];
  const language = languages[hash % languages.length];
  
  const ratingBase = 4.2 + (hash % 8) / 10;
  const rating = `${ratingBase.toFixed(1)}/5`;
  
  const pages = 180 + (hash % 25) * 12;
  const shelf = `F${hash % 9 + 1}-${book.category.toUpperCase().slice(0, 4)}-SH${hash % 5 + 1}-R${hash % 3 + 1}-P${hash % 15 + 1}`;
  const borrowedCount = 45 + (hash % 70) + (book.maxStock - book.stock) * 12;
  const resourceLink = `https://libra.io/books/${book.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  
  const categoryGradients: { [key: string]: string } = {
    'Design': 'from-rose-400 to-red-500',
    'Technology': 'from-blue-400 to-indigo-500',
    'History': 'from-amber-400 to-amber-600',
    'Business': 'from-emerald-400 to-teal-500',
    'Self-Improvement': 'from-violet-400 to-purple-500',
    'Fiction': 'from-fuchsia-400 to-pink-500',
    'Children': 'from-sky-400 to-cyan-500',
    'Teen': 'from-yellow-400 to-orange-500'
  };
  const gradient = categoryGradients[book.category] || 'from-slate-400 to-slate-600';
  
  const illustrations: { [key: string]: string } = {
    'Design': '🎨',
    'Technology': '💻',
    'History': '🏛️',
    'Business': '📈',
    'Self-Improvement': '🧠',
    'Fiction': '🦄',
    'Children': '🧸',
    'Teen': '⚡'
  };
  const illustration = illustrations[book.category] || '📖';

  const tagsList: { [key: string]: string[] } = {
    'Design': ['#uxui-design', '#psychology', '#cognition', '#usability', '#principles'],
    'Technology': ['#coding', '#software', '#refactoring', '#patterns', '#engineering'],
    'History': ['#anthropology', '#evolution', '#society', '#history', '#civilization'],
    'Business': ['#startups', '#venture', '#growth', '#strategy', '#innovation'],
    'Self-Improvement': ['#habits', '#routines', '#mindset', '#growth', '#productivity']
  };
  const tags = tagsList[book.category] || ['#literature', '#books', '#reading', '#library', '#education'];

  return {
    language,
    rating,
    pages,
    shelf,
    borrowedCount,
    resourceLink,
    gradient,
    illustration,
    tags
  };
};

export const AdminBooks: React.FC<AdminBooksProps> = ({
  books,
  allTransactions,
  members,
  handleBookSubmit,
  handleBookDelete
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // activeDetailBook determines if we show the full-page detailed Book Detail view!
  const [activeDetailBook, setActiveDetailBook] = useState<Book | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeTab, setActiveTab] = useState<'popular' | 'featured' | 'latest'>('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Add/Edit Book modal state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [newBookData, setNewBookData] = useState({
    title: '',
    author: '',
    publisher: '',
    category: 'Design',
    year: new Date().getFullYear(),
    stock: 1,
    maxStock: 1,
    description: ''
  });

  // Filter book list based on tabs, search, and category
  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'All' || b.category === categoryFilter;
    
    if (!matchesSearch || !matchesCategory) return false;
    
    if (activeTab === 'featured') {
      return b.stock > 0;
    }
    return true;
  });

  // Sort book list
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (activeTab === 'latest') {
      return b.year - a.year; // newer books first
    }
    if (activeTab === 'popular') {
      const extraA = getExtraBookDetails(a);
      const extraB = getExtraBookDetails(b);
      return extraB.borrowedCount - extraA.borrowedCount; // popular books first
    }
    return 0;
  });

  // Pagination calculation
  const totalResults = sortedBooks.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const paginatedBooks = sortedBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const onSubmit = (e: React.FormEvent) => {
    handleBookSubmit(e, newBookData, editingBook);
    setIsBookModalOpen(false);
    // Refresh active detail book reference if it was modified
    if (editingBook) {
      setActiveDetailBook(prev => {
        if (prev?.id === editingBook.id) {
          return { ...prev, ...newBookData } as Book;
        }
        return prev;
      });
    }
  };

  const onDelete = (bookId: string) => {
    handleBookDelete(bookId);
    if (activeDetailBook?.id === bookId) {
      setActiveDetailBook(null);
    }
  };

  const openAddModal = () => {
    setEditingBook(null);
    setNewBookData({
      title: '',
      author: '',
      publisher: '',
      category: 'Design',
      year: new Date().getFullYear(),
      stock: 1,
      maxStock: 1,
      description: ''
    });
    setIsBookModalOpen(true);
  };

  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setNewBookData({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      category: book.category,
      year: book.year,
      stock: book.stock,
      maxStock: book.maxStock,
      description: book.description
    });
    setIsBookModalOpen(true);
  };

  // Helper: Format Date for Borrowing History
  const formatDateStr = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
      return d.toLocaleDateString('en-US', options);
    } catch {
      return dateStr;
    }
  };

  // Dynamic values for Book Detail
  const selectedDetails = activeDetailBook ? getExtraBookDetails(activeDetailBook) : null;

  // Filter actual borrowing history of active book
  const activeBookHistory: ActivityHistoryItem[] = activeDetailBook 
    ? allTransactions
        .filter(t => t.bookId === activeDetailBook.id)
        .map(t => {
          const member = members.find(m => m.id === t.userId);
          const isOverdue = t.status === 'borrowed' && new Date(t.dueDate) < new Date();
          let overdueDays = 0;
          let calculatedFine = t.fine || 0;
          if (isOverdue) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const due = new Date(t.dueDate);
            due.setHours(0, 0, 0, 0);
            overdueDays = Math.ceil(Math.abs(today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
            calculatedFine = overdueDays * 5000;
          }
          return {
            id: t.id,
            memberName: member?.name || "Member",
            memberId: t.userId,
            borrowDate: formatDateStr(t.borrowDate),
            dueDate: formatDateStr(t.dueDate),
            returnDate: t.returnDate ? formatDateStr(t.returnDate) : "—",
            overdue: isOverdue ? `${overdueDays} Days` : (t.fine ? 'Late Return' : '—'),
            fine: calculatedFine
          };
        })
    : [];

  // Default Mock Borrowing History to show if database is empty
  const defaultHistoryList: ActivityHistoryItem[] = [
    { id: "h-1", memberName: "Milo Sharp", memberId: "MBR-4112", borrowDate: "Aug 24, 2025", dueDate: "Sept 07, 2025", returnDate: "Aug 10, 2025", overdue: "—", fine: 0 },
    { id: "h-2", memberName: "Celine Moore", memberId: "MBR-3095", borrowDate: "Jul 26, 2025", dueDate: "Aug 09, 2025", returnDate: "Aug 13, 2025", overdue: "4 Days", fine: 30000 }, // Rp 30.000 ($2.00)
    { id: "h-3", memberName: "Ava Lin", memberId: "MBR-3021", borrowDate: "Jun 15, 2025", dueDate: "Jun 29, 2025", returnDate: "Jun 01, 2025", overdue: "—", fine: 0 },
    { id: "h-4", memberName: "Leo Finch", memberId: "MBR-2210", borrowDate: "May 17, 2025", dueDate: "May 31, 2025", returnDate: "May 03, 2025", overdue: "—", fine: 0 }
  ];

  const displayHistory = activeBookHistory.length > 0 ? activeBookHistory : defaultHistoryList;

  // Mock waitlisted reservations for the active book
  const defaultDetailReservations = [
    { name: "Isla Ray", id: "MBR-2389", initials: "IR", color: "bg-teal-50 text-teal-600 border-teal-100" },
    { name: "Noah Trent", id: "MBR-1643", initials: "NT", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { name: "Ezra Nolan", id: "MBR-1170", initials: "EN", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { name: "Nova Wells", id: "MBR-3678", initials: "NW", color: "bg-rose-50 text-rose-600 border-rose-100" }
  ];

  // Dynamic reservations calculation
  const getDetailReservations = () => {
    if (!activeDetailBook) return defaultDetailReservations;
    try {
      const stored = localStorage.getItem('lib_reservations');
      if (stored) {
        const parsed = JSON.parse(stored);
        const filtered = parsed.filter((r: any) => r.bookId === activeDetailBook.id);
        if (filtered.length > 0) {
          const colors = [
            "bg-teal-50 text-teal-600 border-teal-100",
            "bg-blue-50 text-blue-600 border-blue-100",
            "bg-indigo-50 text-indigo-600 border-indigo-100",
            "bg-rose-50 text-rose-600 border-rose-100"
          ];
          const dynamic = filtered.map((r: any, idx: number) => {
            const member = members.find(m => m.id === r.userId);
            const initials = member?.name ? member.name.split(' ').map(n=>n[0]).join('') : r.userId.slice(0, 2);
            return {
              name: member?.name || "Member",
              id: r.userId,
              initials,
              color: colors[idx % colors.length]
            };
          });
          // Merge to have 4 slots populated
          const merged = [...dynamic];
          defaultDetailReservations.forEach(d => {
            if (!merged.some(m => m.id === d.id) && merged.length < 4) {
              merged.push(d);
            }
          });
          return merged;
        }
      }
    } catch {}
    return defaultDetailReservations;
  };

  const detailReservationsList = getDetailReservations();

  // Find related books from same category
  const relatedBooksList = activeDetailBook 
    ? books
        .filter(b => b.category === activeDetailBook.category && b.id !== activeDetailBook.id)
        .slice(0, 3)
    : [];

  return (
    <div className="w-full text-left font-sans">
      
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: FULL BOOK DETAIL VIEW */}
        {activeDetailBook && selectedDetails ? (
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6 lg:gap-8"
          >
            {/* Breadcrumb section */}
            <div className="flex items-center justify-between gap-4 -mt-2">
              <div className="flex items-center gap-2 text-[10px] lg:text-xs font-bold text-[#808080]">
                <span onClick={() => setActiveDetailBook(null)} className="cursor-pointer hover:text-[#FA5A3C] transition-colors">Dashboard</span>
                <span>/</span>
                <span onClick={() => setActiveDetailBook(null)} className="cursor-pointer hover:text-[#FA5A3C] transition-colors">Book</span>
                <span>/</span>
                <span className="text-[#1B1B1B] font-extrabold max-w-[200px] truncate">{activeDetailBook.title}</span>
              </div>
              
              {/* Back button */}
              <button 
                onClick={() => setActiveDetailBook(null)}
                className="flex items-center gap-2 text-xs font-bold text-[#6E6E6E] hover:text-[#1B1B1B] transition-colors cursor-pointer bg-white border border-[#EAEAEA] rounded-xl px-4 py-2 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Catalog</span>
              </button>
            </div>

            {/* Split layout: Left detail core (7 cols) and Right side widgets (3 cols) */}
            <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 lg:gap-8">
              
              {/* Left Column (Core Detail & Borrowing History) */}
              <div className="xl:col-span-7 flex flex-col gap-6 lg:gap-8">
                
                {/* Book Summary Card */}
                <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-6 relative">
                  
                  {/* Left Cover block */}
                  <div className={`w-full md:w-56 shrink-0 aspect-[3/4] rounded-2xl bg-gradient-to-br ${selectedDetails.gradient} border border-[#EAEAEA] flex flex-col justify-between p-6 shadow-md relative overflow-hidden text-white`}>
                    <div className="absolute inset-0 bg-black/[0.04] pointer-events-none" />
                    <div className="absolute left-0 top-0 bottom-0 w-3.5 bg-gradient-to-r from-black/[0.12] to-transparent pointer-events-none" />
                    <span className="text-3xl leading-none">{selectedDetails.illustration}</span>
                    <div className="flex flex-col gap-1 text-left mt-auto">
                      <h4 className="font-display font-extrabold text-base leading-snug drop-shadow-sm">{activeDetailBook.title}</h4>
                      <span className="text-[10px] font-bold opacity-85 uppercase font-mono tracking-wider">by {activeDetailBook.author}</span>
                    </div>
                  </div>

                  {/* Right Summary metadata */}
                  <div className="flex-1 flex flex-col gap-5 text-left">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex flex-col gap-2">
                        <span className="inline-block w-fit rounded-lg bg-[#FA5A3C]/10 text-[#FA5A3C] text-[10px] font-extrabold tracking-wide px-2.5 py-1 uppercase">
                          {activeDetailBook.category}
                        </span>
                        <h2 className="text-xl lg:text-2xl font-extrabold text-[#1B1B1B] leading-tight tracking-tight mt-1">
                          {activeDetailBook.title}
                        </h2>
                        <span className="text-xs text-[#808080] font-semibold leading-none">by {activeDetailBook.author}</span>
                      </div>
                      
                      {/* Availability status badge */}
                      <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${
                        activeDetailBook.stock > 0 
                          ? 'bg-green-50 border border-green-100 text-green-600' 
                          : 'bg-red-50 border border-red-100 text-red-600'
                      }`}>
                        {activeDetailBook.stock > 0 ? 'Available' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Blue box Metrics block */}
                    <div className="bg-blue-50/50 border border-blue-100/50 rounded-xl p-3 grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="flex flex-col items-center gap-1 border-r border-blue-100/60 pr-1">
                        <span className="text-[8px] text-blue-700/60 font-bold uppercase tracking-wider">Rating</span>
                        <span className="font-extrabold text-[#1B1B1B] flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" weight="fill" />
                          {selectedDetails.rating.split('/')[0]}
                        </span>
                      </div>
                      <div className="flex flex-col items-center gap-1 border-r border-blue-100/60 px-1">
                        <span className="text-[8px] text-blue-700/60 font-bold uppercase tracking-wider">Language</span>
                        <span className="font-extrabold text-slate-800 truncate max-w-full">{selectedDetails.language}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 border-r border-blue-100/60 px-1">
                        <span className="text-[8px] text-blue-700/60 font-bold uppercase tracking-wider">Total Pages</span>
                        <span className="font-extrabold text-slate-800 font-mono">{selectedDetails.pages} pages</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 pl-1">
                        <span className="text-[8px] text-blue-700/60 font-bold uppercase tracking-wider">Copies</span>
                        <span className="font-extrabold text-slate-800 font-mono">{activeDetailBook.stock} of {activeDetailBook.maxStock}</span>
                      </div>
                    </div>

                    {/* Detailed field specs */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs text-[#1B1B1B] font-semibold border-t border-[#F1F3F5] pt-4">
                      <div className="flex justify-between items-center border-b border-[#F8F9FA] pb-1.5">
                        <span className="text-[#808080]">Book ID</span>
                        <span className="font-mono font-bold">BK-20{100 + parseInt(activeDetailBook.id)}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#F8F9FA] pb-1.5">
                        <span className="text-[#808080]">Publisher (Year)</span>
                        <span>{activeDetailBook.publisher} ({activeDetailBook.year})</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#F8F9FA] pb-1.5">
                        <span className="text-[#808080]">Shelf Location</span>
                        <span className="font-mono font-bold text-right truncate max-w-[50%]">{selectedDetails.shelf}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-[#F8F9FA] pb-1.5">
                        <span className="text-[#808080]">Resource Link</span>
                        <a 
                          href={selectedDetails.resourceLink} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="font-bold text-[#FA5A3C] hover:text-[#E24A2D] hover:underline flex items-center gap-1 shrink-0"
                        >
                          <Globe className="w-3.5 h-3.5 shrink-0" />
                          <span>View Link</span>
                        </a>
                      </div>
                    </div>

                    {/* Synopsis synopsis */}
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-[#808080]">Synopsis</span>
                      <p className="text-[11px] text-[#6E6E6E] font-medium leading-relaxed">
                        {activeDetailBook.description || 'No description available for this book.'}
                      </p>
                    </div>

                    {/* Tag pills */}
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedDetails.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-bold text-[#6E6E6E] bg-[#F8F9FA] border border-[#EAEAEA] rounded-full px-2.5 py-0.5">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Panel */}
                    <div className="flex gap-3 mt-3 border-t border-[#F1F3F5] pt-4">
                      <button
                        onClick={() => openEditModal(activeDetailBook)}
                        className="bg-[#FA5A3C] hover:bg-[#E24A2D] text-white font-bold py-2.5 px-6 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors btn-pressable shadow-sm"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit Details</span>
                      </button>
                      <button
                        onClick={() => onDelete(activeDetailBook.id)}
                        className="bg-red-50 hover:bg-red-100 text-[#FA0F00] font-bold py-2.5 px-6 border border-red-100 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors btn-pressable"
                      >
                        <Trash className="w-3.5 h-3.5" />
                        <span>Delete Book</span>
                      </button>
                    </div>

                  </div>

                </div>

                {/* Borrowing History */}
                <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-extrabold text-[#1B1B1B]">Borrowing History</h3>
                    <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2.5 py-1 text-[10px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
                      <span>This Week</span>
                      <CaretDown className="w-3 h-3 text-[#808080]" />
                    </div>
                  </div>

                  <div className="overflow-x-auto -mx-6 px-6">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="border-b border-[#F1F3F5] pb-3 text-[10px] font-bold uppercase tracking-wider text-[#808080]">
                          <th className="pb-3 pr-4">Member Info</th>
                          <th className="pb-3 px-4">Borrow & Due Date</th>
                          <th className="pb-3 px-4">Return Date</th>
                          <th className="pb-3 px-4">Overdue</th>
                          <th className="pb-3 pl-4 text-right">Fine</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F1F3F5] text-xs font-sans">
                        {displayHistory.map(h => (
                          <tr key={h.id} className="hover:bg-[#FAF9F6]/20 transition-colors">
                            <td className="py-3 px-4 pl-0">
                              <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                  <span className="text-[8px] font-bold text-slate-500 font-mono">
                                    {h.memberName.split(' ').map(n=>n[0]).join('')}
                                  </span>
                                </div>
                                <div className="flex flex-col text-left">
                                  <span className="font-extrabold text-[#1B1B1B]">{h.memberName}</span>
                                  <span className="text-[9px] text-[#808080] font-semibold font-mono mt-0.5">{h.memberId}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-[10px] text-[#1B1B1B]">
                              {h.borrowDate} <span className="text-[#A0A0A0] font-normal mx-1">—</span> {h.dueDate}
                            </td>
                            <td className="py-3 px-4 font-mono text-[10px] text-[#6E6E6E]">
                              {h.returnDate}
                            </td>
                            <td className="py-3 px-4 font-semibold text-[#6E6E6E]">
                              {h.overdue !== '—' ? (
                                <span className="text-red-500 font-bold">{h.overdue}</span>
                              ) : '—'}
                            </td>
                            <td className="py-3 pl-4 text-right font-mono font-bold text-[#1B1B1B]">
                              {h.fine === 0 ? '$0.00' : `$${(h.fine / 15000).toFixed(2)}`}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              {/* Right Column (Widgets: Reservations, Borrowing Trend, Related Books) */}
              <div className="xl:col-span-3 flex flex-col gap-6 lg:gap-8">
                
                {/* Reservations List */}
                <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-extrabold text-[#1B1B1B]">Reservations</h3>
                    <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
                      <span>This Week</span>
                      <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
                    </div>
                  </div>

                  {/* Avatars Grid */}
                  <div className="grid grid-cols-4 gap-2.5">
                    {detailReservationsList.map((res, resIdx) => (
                      <div key={res.id || resIdx} className="flex flex-col items-center gap-1.5 group cursor-pointer">
                        <div className="w-10 h-10 rounded-full border-2 border-white ring-2 ring-slate-100 shadow-sm flex items-center justify-center font-bold font-mono text-[11px] bg-slate-50 text-slate-700 shrink-0 relative group-hover:ring-[#FA5A3C] transition-all">
                          {res.initials}
                          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-slate-800 text-white font-mono font-bold text-[8px] flex items-center justify-center border border-white">
                            #{resIdx + 1}
                          </span>
                        </div>
                        <span className="text-[9px] font-extrabold text-[#1B1B1B] truncate max-w-full leading-none mt-1">{res.name.split(' ')[0]}</span>
                        <span className="text-[8px] text-[#808080] font-bold font-mono leading-none">{res.id.split('-')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Borrowing Trend line chart */}
                <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-extrabold text-[#1B1B1B]">Borrowing Trend</h3>
                    <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
                      <span>Last 8 Months</span>
                      <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 text-left">
                    <span className="text-[10px] text-[#808080] font-bold uppercase tracking-wider leading-none">Total Borrowed</span>
                    <span className="text-2xl font-extrabold text-[#1B1B1B] tracking-tight leading-none mt-1.5">78</span>
                  </div>

                  {/* SVG line chart */}
                  <div className="h-28 w-full pt-4 relative border-b border-[#F1F3F5]">
                    <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                      <line x1="0" y1="15" x2="200" y2="15" stroke="#F8F9FA" strokeWidth="1" />
                      <line x1="0" y1="30" x2="200" y2="30" stroke="#F8F9FA" strokeWidth="1" />
                      <line x1="0" y1="45" x2="200" y2="45" stroke="#F8F9FA" strokeWidth="1" />
                      
                      {/* Trend line */}
                      <path 
                        d="M 10 40 C 30 42, 45 28, 65 31 C 85 24, 105 45, 125 15 C 145 27, 175 22, 190 28" 
                        fill="none" 
                        stroke="#FA5A3C" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                      />
                      
                      {/* Glowing dot on peak April (105, 24) */}
                      <circle cx="105" cy="24" r="3.5" fill="#FA5A3C" stroke="white" strokeWidth="1" />
                    </svg>

                    {/* Tooltip on peak April */}
                    <div className="absolute top-1 left-[45%] bg-white border border-[#EAEAEA] rounded shadow-md px-1.5 py-0.5 text-[8px] font-bold text-left flex flex-col font-sans">
                      <span className="text-[#808080] font-medium leading-none">April 2035</span>
                      <span className="text-[#1B1B1B] mt-0.5 leading-none">9 loans</span>
                    </div>

                    {/* X-axis months */}
                    <div className="absolute inset-x-0 -bottom-5 flex justify-between px-1 text-[8px] font-bold text-[#808080] font-mono">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                    </div>
                  </div>

                  {/* 4 Mini metric specs */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] text-left">
                    <div className="bg-[#FAF9F6] border border-[#EAE9E4] rounded-xl p-2.5 flex flex-col gap-1">
                      <span className="text-[#808080] font-bold leading-none">Total Reserved</span>
                      <span className="font-extrabold text-[#1B1B1B] mt-0.5">10 <span className="text-[8px] text-[#808080] font-medium">this month</span></span>
                    </div>
                    <div className="bg-[#FAF9F6] border border-[#EAE9E4] rounded-xl p-2.5 flex flex-col gap-1">
                      <span className="text-[#808080] font-bold leading-none">Average Wait Time</span>
                      <span className="font-extrabold text-[#1B1B1B] mt-0.5">5 <span className="text-[8px] text-[#808080] font-medium">days</span></span>
                    </div>
                    <div className="bg-[#FAF9F6] border border-[#EAE9E4] rounded-xl p-2.5 flex flex-col gap-1">
                      <span className="text-[#808080] font-bold leading-none">Top Segment</span>
                      <span className="font-extrabold text-slate-800 mt-0.5 truncate">Students <span className="text-[8px] text-[#808080] font-medium">(65%)</span></span>
                    </div>
                    <div className="bg-[#FAF9F6] border border-[#EAE9E4] rounded-xl p-2.5 flex flex-col gap-1">
                      <span className="text-[#808080] font-bold leading-none">Next Copy Available</span>
                      <span className="font-extrabold text-[#FA5A3C] mt-0.5">Sept 25 <span className="text-[8px] text-[#808080] font-medium">est.</span></span>
                    </div>
                  </div>
                </div>

                {/* Related Books */}
                {relatedBooksList.length > 0 && (
                  <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-extrabold text-[#1B1B1B]">Related Books</h3>
                      <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
                        <span>This Week</span>
                        <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
                      </div>
                    </div>

                    {/* Book Cards Grid */}
                    <div className="grid grid-cols-3 gap-3">
                      {relatedBooksList.map(rBook => {
                        const rExt = getExtraBookDetails(rBook);
                        return (
                          <div 
                            key={rBook.id} 
                            onClick={() => {
                              setActiveDetailBook(rBook);
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="flex flex-col gap-1.5 cursor-pointer group text-center"
                          >
                            <div className={`aspect-[3/4] w-full rounded-xl bg-gradient-to-br ${rExt.gradient} border border-slate-200/50 flex flex-col justify-between p-2 shadow-sm relative overflow-hidden group-hover:scale-[1.03] transition-all`}>
                              <div className="absolute inset-0 bg-black/[0.03] pointer-events-none" />
                              <span className="text-sm leading-none">{rExt.illustration}</span>
                              <span className="text-[6px] font-display font-extrabold text-white text-left leading-tight truncate">
                                {rBook.title}
                              </span>
                            </div>
                            <span className="text-[9px] font-bold text-[#1B1B1B] truncate group-hover:text-[#FA5A3C] transition-colors leading-tight px-0.5">
                              {rBook.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </motion.div>
        ) : (
          
          /* VIEW 2: STANDARD LIST/GRID COLLECTION CATALOG */
          <motion.div
            key="catalog-view"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="flex flex-col gap-6 lg:gap-8"
          >
            {/* Split layout: Main List/Grid (7 cols) and Right side small details panel (3 cols) */}
            <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 lg:gap-8">
              
              {/* Left Column - Main Book List (takes 7 columns) */}
              <div className="xl:col-span-7 flex flex-col gap-6 lg:gap-8 min-w-0">
                
                {/* Outer White Card Container */}
                <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 lg:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-6">
                  
                  {/* Header Row: Title, Toggles, Add Button */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <h3 className="text-sm lg:text-base font-extrabold text-[#1B1B1B]">Books Collection</h3>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                      {/* List / Grid Toggles */}
                      <div className="flex items-center bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl p-[3px]">
                        <button
                          onClick={() => setViewMode('list')}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            viewMode === 'list' 
                              ? 'bg-white shadow-sm text-[#FA5A3C]' 
                              : 'text-[#808080] hover:text-[#1B1B1B]'
                          }`}
                          title="List View"
                        >
                          <ListIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode('grid')}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            viewMode === 'grid' 
                              ? 'bg-[#FA5A3C] text-white shadow-sm' 
                              : 'text-[#808080] hover:text-[#1B1B1B]'
                          }`}
                          title="Grid View"
                        >
                          <SquaresFour className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Add Book Button */}
                      <button
                        onClick={openAddModal}
                        className="bg-[#FA5A3C] hover:bg-[#E24A2D] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors btn-pressable shadow-sm"
                      >
                        <Plus className="w-4 h-4" weight="bold" />
                        <span>Add Book</span>
                      </button>
                    </div>
                  </div>

                  {/* Filters Row: Popular/Featured/Latest, Search, Categories Dropdown */}
                  <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
                    {/* Filter Tabs */}
                    <div className="flex items-center bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl p-[3px] w-fit">
                      {[
                        { id: 'popular' as const, label: 'Popular' },
                        { id: 'featured' as const, label: 'Featured' },
                        { id: 'latest' as const, label: 'Latest' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setCurrentPage(1);
                          }}
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-4 py-2 rounded-lg transition-all cursor-pointer ${
                            activeTab === tab.id
                              ? 'bg-white shadow-sm text-[#1B1B1B]'
                              : 'text-[#808080] hover:text-[#1B1B1B]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Search + Category Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full md:w-auto">
                      
                      {/* Search input */}
                      <div className="relative flex-1 sm:w-48 lg:w-56">
                        <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                          }}
                          placeholder="Search a book"
                          className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold"
                        />
                      </div>

                      {/* Category selector */}
                      <div className="relative">
                        <select
                          value={categoryFilter}
                          onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setCurrentPage(1);
                          }}
                          className="bg-white border border-[#EAEAEA] rounded-xl pl-8 pr-8 py-2 text-xs text-[#6E6E6E] font-bold focus:outline-none focus:border-[#FA5A3C] transition-colors cursor-pointer appearance-none w-full"
                        >
                          <option value="All">All Categories</option>
                          {['Design', 'Technology', 'History', 'Business', 'Self-Improvement', 'Fiction', 'Children', 'Teen'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E6E6E] pointer-events-none" />
                        <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6E6E6E] pointer-events-none" />
                      </div>

                    </div>
                  </div>

                  {/* Grid View Mode */}
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-6 min-h-[300px]">
                      {paginatedBooks.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center text-center py-16 text-[#808080]">
                          <BookOpen className="w-12 h-12 text-[#EAEAEA] mb-3" />
                          <span className="font-semibold text-xs">No books match your filters.</span>
                        </div>
                      ) : (
                        paginatedBooks.map(book => {
                          const ext = getExtraBookDetails(book);
                          return (
                            <div 
                              key={book.id}
                              onClick={() => {
                                setActiveDetailBook(book);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="flex flex-col gap-2.5 cursor-pointer group"
                            >
                              {/* Premium Cover Mockup */}
                              <div className="aspect-[3/4] w-full rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 bg-gradient-to-br from-indigo-400 to-indigo-500 border border-[#EAEAEA] flex flex-col justify-between p-3.5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] relative overflow-hidden transition-all duration-300 group-hover:border-[#FA5A3C] group-hover:scale-[1.02]">
                                {/* Cover art styles */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${ext.gradient} pointer-events-none`} />
                                <div className="absolute inset-0 bg-black/[0.04] pointer-events-none" />
                                <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/[0.12] to-transparent pointer-events-none" />
                                
                                <span className="text-xl leading-none z-10">{ext.illustration}</span>
                                
                                <div className="flex flex-col gap-1 text-left text-white mt-auto z-10">
                                  <h5 className="font-display font-extrabold text-[10px] sm:text-[11px] leading-tight drop-shadow-sm tracking-wide line-clamp-2">
                                    {book.title}
                                  </h5>
                                  <span className="text-[7px] sm:text-[8px] font-bold opacity-80 uppercase font-mono tracking-wider truncate">
                                    {book.author}
                                  </span>
                                </div>
                              </div>

                              {/* Title block beneath cover */}
                              <span className="text-xs font-extrabold text-[#1B1B1B] text-center line-clamp-1 group-hover:text-[#FA5A3C] transition-colors leading-snug px-1">
                                {book.title}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  ) : (
                    /* List View Mode */
                    <div className="overflow-x-auto -mx-5 px-5">
                      <table className="w-full text-left border-collapse min-w-[650px]">
                        <thead>
                          <tr className="border-b border-[#F1F3F5] pb-3 text-[10px] font-bold uppercase tracking-wider text-[#808080]">
                            <th className="pb-3 pr-4 w-12">ID</th>
                            <th className="pb-3 px-4">Book Cover</th>
                            <th className="pb-3 px-4">Book Title</th>
                            <th className="pb-3 px-4">Category</th>
                            <th className="pb-3 px-4 w-28">Stock (Available)</th>
                            <th className="pb-3 pl-4 text-right w-20">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F3F5] text-xs">
                          {paginatedBooks.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-[#808080] font-semibold">
                                No books match your filters.
                              </td>
                            </tr>
                          ) : (
                            paginatedBooks.map(book => {
                              const ext = getExtraBookDetails(book);
                              return (
                                <tr 
                                  key={book.id} 
                                  onClick={() => {
                                    setActiveDetailBook(book);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="hover:bg-[#FAF9F6]/30 cursor-pointer transition-colors"
                                >
                                  <td className="py-3.5 pr-4 font-mono font-bold text-[#808080]">{book.id}</td>
                                  <td className="py-3.5 px-4">
                                    <div className={`w-8 h-11 rounded bg-gradient-to-br ${ext.gradient} border border-slate-200/50 flex items-center justify-center p-0.5 shadow-sm shrink-0 overflow-hidden text-[6px] font-display font-extrabold text-slate-800 text-center leading-tight relative`}>
                                      <div className="absolute inset-0 bg-[#3D1E1E]/5" />
                                      {book.title.slice(0, 10)}
                                    </div>
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <p className="font-extrabold text-[#1B1B1B] text-sm leading-snug">{book.title}</p>
                                    <p className="text-[#808080] text-[10px] font-semibold mt-0.5">By {book.author} ({book.year})</p>
                                  </td>
                                  <td className="py-3.5 px-4">
                                    <span className="inline-block rounded-lg bg-[#F8F9FA] border border-[#EAEAEA] text-[#6E6E6E] text-[10px] font-bold tracking-wide px-2 py-0.5">
                                      {book.category}
                                    </span>
                                  </td>
                                  <td className="py-3.5 px-4 font-mono">
                                    <span className={`font-bold ${book.stock === 0 ? 'text-red-500' : 'text-[#1B1B1B]'}`}>
                                      {book.stock}
                                    </span>
                                    <span className="text-[#808080] font-semibold"> / {book.maxStock}</span>
                                  </td>
                                  <td className="py-3.5 pl-4 text-right">
                                    <span className="text-xs font-bold text-[#FA5A3C] hover:underline cursor-pointer">
                                      View Detail
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Table Footer with Pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F1F3F5] pt-4 text-xs font-semibold text-[#808080]">
                    
                    <div className="flex items-center gap-1.5">
                      <span>Show</span>
                      <div className="relative">
                        <select 
                          className="bg-white border border-[#EAEAEA] rounded-lg px-2.5 py-1 text-[10px] font-bold text-[#6E6E6E] appearance-none pr-6 cursor-pointer"
                          disabled
                        >
                          <option>{paginatedBooks.length}</option>
                        </select>
                        <CaretDown className="absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-[#6E6E6E] pointer-events-none" />
                      </div>
                      <span>of {totalResults} results</span>
                    </div>

                    {/* Pagination buttons */}
                    {totalPages > 1 && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="w-8 h-8 rounded-lg bg-white border border-[#EAEAEA] flex items-center justify-center text-[#6E6E6E] hover:bg-[#F8F9FA] disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          <CaretLeft className="w-3.5 h-3.5" />
                        </button>

                        {Array.from({ length: totalPages }).map((_, idx) => {
                          const pageNum = idx + 1;
                          const isSelected = currentPage === pageNum;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                isSelected 
                                  ? 'bg-[#FA5A3C] text-white shadow-sm' 
                                  : 'bg-white border border-[#EAEAEA] text-[#6E6E6E] hover:bg-[#F8F9FA]'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="w-8 h-8 rounded-lg bg-white border border-[#EAEAEA] flex items-center justify-center text-[#6E6E6E] hover:bg-[#F8F9FA] disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          <CaretRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* Right Column - Side statistics (shows borrowing trends across inventory) */}
              <div className="xl:col-span-3 flex flex-col gap-6 lg:gap-8 sticky xl:top-[88px] h-fit">
                
                {/* Catalog Borrowing Trend */}
                <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-5 text-left">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-extrabold text-[#1B1B1B]">Borrowing Trend</h3>
                    <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
                      <span>Last 8 Months</span>
                      <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-[#808080] font-bold uppercase tracking-wider">Total Loans</span>
                    <span className="text-2xl font-extrabold text-[#1B1B1B] tracking-tight leading-none mt-1.5">384</span>
                  </div>

                  {/* SVG line chart */}
                  <div className="h-28 w-full pt-4 relative border-b border-[#F1F3F5]">
                    <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                      <line x1="0" y1="15" x2="200" y2="15" stroke="#F8F9FA" strokeWidth="1" />
                      <line x1="0" y1="30" x2="200" y2="30" stroke="#F8F9FA" strokeWidth="1" />
                      <line x1="0" y1="45" x2="200" y2="45" stroke="#F8F9FA" strokeWidth="1" />
                      <path 
                        d="M 10 38 C 30 30, 45 42, 65 31 C 85 24, 105 18, 125 35 C 145 27, 175 14, 190 20" 
                        fill="none" 
                        stroke="#FA5A3C" 
                        strokeWidth="2" 
                        strokeLinecap="round"
                      />
                      <circle cx="175" cy="14" r="3.5" fill="#FA5A3C" stroke="white" strokeWidth="1" />
                    </svg>

                    <div className="absolute top-1 left-[65%] bg-white border border-[#EAEAEA] rounded shadow-md px-1.5 py-0.5 text-[8px] font-bold text-left flex flex-col font-sans">
                      <span className="text-[#808080] font-medium leading-none">July 2035</span>
                      <span className="text-[#1B1B1B] mt-0.5 leading-none">62 loans</span>
                    </div>

                    <div className="absolute inset-x-0 -bottom-5 flex justify-between px-1 text-[8px] font-bold text-[#808080] font-mono">
                      <span>Jan</span>
                      <span>Feb</span>
                      <span>Mar</span>
                      <span>Apr</span>
                      <span>May</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Aug</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 text-[10px]">
                    <div className="bg-[#FAF9F6] border border-[#EAE9E4] rounded-xl p-2.5 flex flex-col gap-1">
                      <span className="text-[#808080] font-bold leading-none">Total Reserved</span>
                      <span className="font-extrabold text-[#1B1B1B] mt-0.5">38 <span className="text-[8px] text-[#808080] font-medium">waitlists</span></span>
                    </div>
                    <div className="bg-[#FAF9F6] border border-[#EAE9E4] rounded-xl p-2.5 flex flex-col gap-1">
                      <span className="text-[#808080] font-bold leading-none">Average Wait Time</span>
                      <span className="font-extrabold text-[#1B1B1B] mt-0.5">6.2 <span className="text-[8px] text-[#808080] font-medium">days</span></span>
                    </div>
                  </div>
                </div>

                {/* Popular Books sidebar widget */}
                <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-4 text-left">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-extrabold text-[#1B1B1B]">Popular Books</h3>
                    <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
                      <span>This Week</span>
                      <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {books.slice(0, 3).map(book => {
                      const ext = getExtraBookDetails(book);
                      return (
                        <div 
                          key={book.id} 
                          onClick={() => {
                            setActiveDetailBook(book);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex gap-3 items-center cursor-pointer group"
                        >
                          <div className={`w-8 h-11 rounded bg-gradient-to-br ${ext.gradient} border border-slate-200/50 flex items-center justify-center p-0.5 shadow-sm shrink-0 overflow-hidden text-[6px] font-display font-extrabold text-slate-800 text-center leading-tight relative`}>
                            <div className="absolute inset-0 bg-[#3D1E1E]/5" />
                            {book.title.slice(0, 10)}
                          </div>
                          <div className="flex flex-col text-left flex-1 min-w-0">
                            <h4 className="font-extrabold text-xs text-[#1B1B1B] truncate leading-tight group-hover:text-[#FA5A3C] transition-colors">{book.title}</h4>
                            <span className="text-[10px] text-[#808080] font-semibold mt-0.5">{book.author}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Admin Add/Edit Book Modal Overlay */}
      <AnimatePresence>
        {isBookModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookModalOpen(false)}
              className="absolute inset-0 bg-[#1B1B1B]/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-lg z-10 bg-white border border-[#D3D3D3] rounded-2xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto font-sans"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsBookModalOpen(false)}
                className="absolute top-5 right-5 w-7 h-7 rounded-lg bg-[#F5F5F5] hover:bg-[#E8E8E8] border border-[#D3D3D3] flex items-center justify-center text-[#6E6E6E] hover:text-[#1B1B1B] transition-all cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <h3 className="font-display font-extrabold text-2xl text-[#1B1B1B] tracking-tight">
                  {editingBook ? 'Edit Data Buku' : 'Tambah Buku Baru'}
                </h3>
                <p className="text-xs text-[#808080] mt-1 font-mono font-semibold">
                  {editingBook ? `ID Buku: BK-20${100 + parseInt(editingBook.id)}` : 'Tambahkan buku baru ke sirkulasi perpustakaan'}
                </p>
              </div>

              <form onSubmit={onSubmit} className="space-y-4 text-xs text-left font-sans">
                <div className="space-y-1.5">
                  <label className="font-extrabold text-[#1B1B1B] tracking-wider uppercase block">Judul Buku *</label>
                  <input
                    type="text"
                    required
                    value={newBookData.title}
                    onChange={(e) => setNewBookData({ ...newBookData, title: e.target.value })}
                    placeholder="Contoh: The Design of Everyday Things"
                    className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-[#1B1B1B] tracking-wider uppercase block">Pengarang *</label>
                    <input
                      type="text"
                      required
                      value={newBookData.author}
                      onChange={(e) => setNewBookData({ ...newBookData, author: e.target.value })}
                      placeholder="Don Norman"
                      className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-[#1B1B1B] tracking-wider uppercase block">Penerbit *</label>
                    <input
                      type="text"
                      required
                      value={newBookData.publisher}
                      onChange={(e) => setNewBookData({ ...newBookData, publisher: e.target.value })}
                      placeholder="Basic Books"
                      className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-[#1B1B1B] tracking-wider uppercase block">Kategori *</label>
                    <select
                      value={newBookData.category}
                      onChange={(e) => setNewBookData({ ...newBookData, category: e.target.value })}
                      className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#6E6E6E] font-bold focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all cursor-pointer"
                    >
                      {['Design', 'Technology', 'History', 'Business', 'Self-Improvement', 'Fiction', 'Children', 'Teen'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-[#1B1B1B] tracking-wider uppercase block">Tahun Terbit *</label>
                    <input
                      type="number"
                      required
                      value={newBookData.year}
                      onChange={(e) => setNewBookData({ ...newBookData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                      placeholder="2013"
                      className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-[#1B1B1B] tracking-wider uppercase block">Stok Tersedia *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={newBookData.maxStock}
                      value={newBookData.stock}
                      onChange={(e) => setNewBookData({ ...newBookData, stock: Math.max(0, parseInt(e.target.value) || 0) })}
                      placeholder="3"
                      className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-extrabold text-[#1B1B1B] tracking-wider uppercase block">Stok Maksimal *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newBookData.maxStock}
                      onChange={(e) => {
                        const mStock = Math.max(1, parseInt(e.target.value) || 1);
                        setNewBookData({
                          ...newBookData,
                          maxStock: mStock,
                          stock: Math.min(newBookData.stock, mStock)
                        });
                      }}
                      placeholder="5"
                      className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-[#1B1B1B] tracking-wider uppercase block">Deskripsi</label>
                  <textarea
                    rows={3}
                    value={newBookData.description}
                    onChange={(e) => setNewBookData({ ...newBookData, description: e.target.value })}
                    placeholder="Tulis deskripsi sinopsis buku di sini..."
                    className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all resize-none font-semibold"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsBookModalOpen(false)}
                    className="flex-1 bg-[#FAF6F0] hover:bg-[#EAE3D2] border border-[#3D1E1E]/15 text-[#3D1E1E] font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors btn-pressable"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#FA5A3C] hover:bg-[#E24A2D] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors btn-pressable shadow-sm"
                  >
                    {editingBook ? 'Simpan' : 'Tambah Buku'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
