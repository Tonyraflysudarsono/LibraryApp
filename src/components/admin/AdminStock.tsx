import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlass, 
  Funnel, 
  CaretDown, 
  CaretLeft, 
  CaretRight, 
  Drop, 
  Flame, 
  Warning, 
  FileText, 
  MapPin, 
  Bug, 
  Wrench
} from '@phosphor-icons/react';
import type { Book, BorrowRequest, UserAccount } from '../../data/mockDb';

interface AdminStockProps {
  books: Book[];
  allTransactions: BorrowRequest[];
  members: UserAccount[];
}

interface DamagedBook {
  id: string; // Report ID
  bookId: string;
  title: string;
  coverSeed: string;
  copies: string;
  condition: 'Damaged' | 'Lost';
  notes: string;
  dateReported: string;
  reportedBy: string;
  replacementStatus: 'Written Off' | 'Replaced' | 'Pending' | 'Repaired';
  fine: number; // in USD
}

const initialDamagedBooks: DamagedBook[] = [
  { id: "REP-01", bookId: "BK-10567", title: "Where The Flowers Bloom", coverSeed: "flowers", copies: "0/1", condition: "Damaged", notes: "Water Damage", dateReported: "Sept 25, 2035", reportedBy: "Milo Sharp", replacementStatus: "Written Off", fine: 2.50 },
  { id: "REP-02", bookId: "BK-11234", title: "Floral Dreams", coverSeed: "dreams", copies: "2/3", condition: "Damaged", notes: "Fire Damage", dateReported: "Sept 22, 2035", reportedBy: "Staff - Ken R.", replacementStatus: "Replaced", fine: 3.50 },
  { id: "REP-03", bookId: "BK-10345", title: "My Story", coverSeed: "mystory", copies: "0/2", condition: "Lost", notes: "Not Returned", dateReported: "Sept 28, 2035", reportedBy: "Julian Cross", replacementStatus: "Pending", fine: 4.00 },
  { id: "REP-04", bookId: "BK-10991", title: "Threads of Fate", coverSeed: "threads", copies: "1/2", condition: "Damaged", notes: "Torn Pages", dateReported: "Sept 20, 2035", reportedBy: "Staff - Alice H.", replacementStatus: "Repaired", fine: 1.00 },
  { id: "REP-05", bookId: "BK-09999", title: "My Recipe Book", coverSeed: "recipe", copies: "1/2", condition: "Damaged", notes: "Mold Growth", dateReported: "Sept 26, 2035", reportedBy: "Leo Finch", replacementStatus: "Written Off", fine: 2.00 },
  { id: "REP-06", bookId: "BK-10101", title: "The Book of Prayer", coverSeed: "prayer", copies: "2/2", condition: "Lost", notes: "Member Relocated", dateReported: "Sept 23, 2035", reportedBy: "Isla Ray", replacementStatus: "Pending", fine: 4.50 },
  { id: "REP-07", bookId: "BK-11122", title: "The Coffee Shop Next Door", coverSeed: "coffeeshop", copies: "1/3", condition: "Damaged", notes: "Binding Broken", dateReported: "Sept 24, 2035", reportedBy: "Staff - Admin", replacementStatus: "Repaired", fine: 1.00 },
  { id: "REP-08", bookId: "BK-08745", title: "Dune Whisper", coverSeed: "dune", copies: "2/2", condition: "Damaged", notes: "Water Damage", dateReported: "Sept 19, 2035", reportedBy: "Celine Moore", replacementStatus: "Replaced", fine: 2.50 },
  { id: "REP-09", bookId: "BK-08746", title: "Claudia's Life Story", coverSeed: "claudia", copies: "2/2", condition: "Damaged", notes: "Water Damage", dateReported: "Sept 19, 2035", reportedBy: "Celine Moore", replacementStatus: "Replaced", fine: 2.50 }
];

export const AdminStock: React.FC<AdminStockProps> = ({ books, allTransactions }) => {
  const [damagedList, setDamagedList] = useState<DamagedBook[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const lowStockFavorites = React.useMemo(() => {
    // 1. Filter books where stock <= 1
    let filtered = books.filter(b => b.stock <= 1);
    
    // 2. If we don't have at least 3, sort all books by stock ascending
    if (filtered.length < 3) {
      const sorted = [...books].sort((a, b) => a.stock - b.stock);
      for (const b of sorted) {
        if (!filtered.some(x => x.id === b.id)) {
          filtered.push(b);
        }
        if (filtered.length >= 3) break;
      }
    }
    
    // 3. Fallback to mock books if database has no books at all (safety)
    if (filtered.length === 0) {
      return [
        { title: "The Lost Kingdom", borrowed: 128, copies: "1/3", status: "Available" as const, statusColor: "text-green-600 bg-green-50/50" },
        { title: "Threads of Fate", borrowed: 95, copies: "0/1", status: "Damaged" as const, statusColor: "text-red-500 bg-red-50/50" },
        { title: "Where The Flowers Bloom", borrowed: 109, copies: "0/2", status: "On Loan" as const, statusColor: "text-blue-600 bg-blue-50/50" }
      ];
    }

    return filtered.slice(0, 3).map(b => {
      // Calculate borrow count
      const borrows = allTransactions.filter(t => t.bookId === b.id).length;
      
      // Determine status: if stock === 0, check if active loans exist
      const activeLoans = allTransactions.filter(t => t.bookId === b.id && t.status === 'borrowed');
      let status: 'Available' | 'Damaged' | 'On Loan' = 'Available';
      let statusColor = 'text-green-600 bg-green-50/50';
      
      if (b.stock === 0) {
        if (activeLoans.length > 0) {
          status = 'On Loan';
          statusColor = 'text-blue-600 bg-blue-50/50';
        } else {
          status = 'Damaged';
          statusColor = 'text-red-500 bg-red-50/50';
        }
      } else {
        status = 'Available';
        statusColor = 'text-green-600 bg-green-50/50';
      }

      // Add a mock borrows offset based on book ID so it's realistic (sparse mock DB transactions)
      const mockOffset = (parseInt(b.id) * 17) % 80 + 15;
      const totalBorrows = borrows + mockOffset;

      return {
        title: b.title,
        borrowed: totalBorrows,
        copies: `${b.stock}/${b.maxStock}`,
        status,
        statusColor
      };
    });
  }, [books, allTransactions]);

  // Initialize damaged list from localstorage if present
  useEffect(() => {
    const stored = localStorage.getItem('lib_damaged_books');
    if (stored) {
      try {
        setDamagedList(JSON.parse(stored));
      } catch {
        setDamagedList(initialDamagedBooks);
        localStorage.setItem('lib_damaged_books', JSON.stringify(initialDamagedBooks));
      }
    } else {
      setDamagedList(initialDamagedBooks);
      localStorage.setItem('lib_damaged_books', JSON.stringify(initialDamagedBooks));
    }
  }, []);

  const saveList = (updated: DamagedBook[]) => {
    setDamagedList(updated);
    localStorage.setItem('lib_damaged_books', JSON.stringify(updated));
  };

  // Helper to render Note Icon
  const getNoteIcon = (note: string) => {
    const n = note.toLowerCase();
    if (n.includes('water')) return <Drop className="w-3.5 h-3.5 text-blue-500" />;
    if (n.includes('fire')) return <Flame className="w-3.5 h-3.5 text-red-500" />;
    if (n.includes('torn')) return <FileText className="w-3.5 h-3.5 text-orange-500" />;
    if (n.includes('mold')) return <Bug className="w-3.5 h-3.5 text-green-600" />;
    if (n.includes('relocated')) return <MapPin className="w-3.5 h-3.5 text-indigo-500" />;
    if (n.includes('binding')) return <Wrench className="w-3.5 h-3.5 text-slate-500" />;
    return <Warning className="w-3.5 h-3.5 text-amber-500" />;
  };

  // Cycle replacement status on click
  const cycleStatus = (id: string) => {
    const statuses: Array<DamagedBook['replacementStatus']> = ["Pending", "Replaced", "Repaired", "Written Off"];
    const updated = damagedList.map(item => {
      if (item.id === id) {
        const nextIdx = (statuses.indexOf(item.replacementStatus) + 1) % statuses.length;
        return {
          ...item,
          replacementStatus: statuses[nextIdx]
        };
      }
      return item;
    });
    saveList(updated);
  };

  // Filter logs
  const filteredList = damagedList.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.bookId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCondition = conditionFilter === 'All' || item.condition === conditionFilter;
    const matchesStatus = statusFilter === 'All' || item.replacementStatus === statusFilter;
    
    return matchesSearch && matchesCondition && matchesStatus;
  });

  // Pagination calculation
  const totalResults = filteredList.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const paginatedLogs = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleReorder = (bookTitle: string) => {
    alert(`Reorder request successfully sent to procurement for "${bookTitle}"!`);
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 font-sans text-left">
      
      {/* Header Breadcrumbs */}
      <div className="flex items-center justify-between -mt-2">
        <div className="flex items-center gap-2 text-[10px] lg:text-xs font-bold text-[#808080]">
          <span className="cursor-pointer hover:text-[#FA5A3C] transition-colors">Dashboard</span>
          <span>/</span>
          <span className="text-[#1B1B1B] font-extrabold">Stock Management</span>
        </div>
      </div>

      {/* Top section widgets: Trend, circular gauge, and low stock items */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 lg:gap-8">
        
        {/* Widget 1: Damaged/Lost Trend (4 cols) */}
        <div className="xl:col-span-4 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold text-[#1B1B1B] uppercase tracking-wider">Damaged/Lost Books Trend</h3>
            <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
              <span>Last 8 Months</span>
              <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
            </div>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <span className="text-[10px] text-[#808080] font-bold uppercase tracking-wider leading-none">Total Incidents</span>
            <span className="text-2xl font-extrabold text-[#1B1B1B] tracking-tight leading-none mt-1.5">264 <span className="text-[9px] text-[#808080] font-medium font-sans">reports</span></span>
          </div>

          {/* SVG line chart */}
          <div className="h-28 w-full pt-4 relative border-b border-[#F1F3F5]">
            <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
              <line x1="0" y1="15" x2="200" y2="15" stroke="#F8F9FA" strokeWidth="1" />
              <line x1="0" y1="30" x2="200" y2="30" stroke="#F8F9FA" strokeWidth="1" />
              <line x1="0" y1="45" x2="200" y2="45" stroke="#F8F9FA" strokeWidth="1" />
              
              {/* Trend line */}
              <path 
                d="M 10 42 C 30 45, 45 35, 65 37 C 85 24, 105 15, 125 31 C 145 27, 175 35, 190 32" 
                fill="none" 
                stroke="#FA5A3C" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              
              {/* Peak indicator dot */}
              <circle cx="105" cy="15" r="3.5" fill="#FA5A3C" stroke="white" strokeWidth="1" />
            </svg>

            {/* Peak Tooltip April */}
            <div className="absolute top-0 left-[45%] bg-white border border-[#EAEAEA] rounded shadow-md px-1.5 py-0.5 text-[8px] font-bold text-left flex flex-col font-sans">
              <span className="text-[#808080] font-medium leading-none">April 2035</span>
              <span className="text-[#1B1B1B] mt-0.5 leading-none">39 Books</span>
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
        </div>

        {/* Widget 2: Stock Overview Circular Gauge (3 cols) */}
        <div className="xl:col-span-3 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4 text-center">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold text-[#1B1B1B] uppercase tracking-wider">Stock Overview</h3>
            <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
              <span>This Month</span>
              <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
            </div>
          </div>

          <div className="relative w-40 h-24 mx-auto flex items-end justify-center pt-2">
            {/* SVG semi-circular gauge ring */}
            <svg className="w-full h-full" viewBox="0 0 100 50">
              {/* Backing arc */}
              <path 
                d="M 10 50 A 40 40 0 0 1 90 50" 
                fill="none" 
                stroke="#F1F3F5" 
                strokeWidth="12" 
                strokeLinecap="round" 
              />
              {/* Available arc (67% - Dark Blue) */}
              <path 
                d="M 10 50 A 40 40 0 0 1 72.8 22" 
                fill="none" 
                stroke="#223354" 
                strokeWidth="12" 
                strokeLinecap="round" 
              />
              {/* On Loan arc (21% - Orange) */}
              <path 
                d="M 72.8 22 A 40 40 0 0 1 87.2 40" 
                fill="none" 
                stroke="#FF6B4A" 
                strokeWidth="12" 
                strokeLinecap="round" 
              />
              {/* Reserved arc (7% - Muted Grey) */}
              <path 
                d="M 87.2 40 A 40 40 0 0 1 90 50" 
                fill="none" 
                stroke="#A0AEC0" 
                strokeWidth="12" 
                strokeLinecap="round" 
              />
            </svg>

            {/* Inner statistics text */}
            <div className="absolute bottom-0 flex flex-col items-center">
              <span className="text-[8px] text-[#808080] font-bold uppercase tracking-wider">Total Copies</span>
              <span className="text-base font-extrabold text-[#1B1B1B] mt-0.5 leading-none">18,750 <span className="text-[9px] text-[#808080] font-semibold">Books</span></span>
            </div>
          </div>

          {/* Legends Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[10px] text-left mt-1.5 font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-[#223354] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[#808080] text-[8px] uppercase">Available</span>
                <span className="text-slate-800 leading-none mt-0.5">12,600 copies</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-[#FF6B4A] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[#808080] text-[8px] uppercase">On Loan</span>
                <span className="text-slate-800 leading-none mt-0.5">3,900 copies</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-[#A0AEC0] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[#808080] text-[8px] uppercase">Reserved</span>
                <span className="text-slate-800 leading-none mt-0.5">1,400 copies</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded bg-[#E2E8F0] shrink-0" />
              <div className="flex flex-col">
                <span className="text-[#808080] text-[8px] uppercase">Damaged/Lost</span>
                <span className="text-slate-800 leading-none mt-0.5">850 copies</span>
              </div>
            </div>
          </div>

        </div>

        {/* Widget 3: Low Stock Favorites (3 cols) */}
        <div className="xl:col-span-3 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4 text-left">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold text-[#1B1B1B] uppercase tracking-wider">Low Stock Favorites</h3>
            <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
              <span>This Month</span>
              <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {lowStockFavorites.map((fItem, fIdx) => (
              <div key={fIdx} className="flex justify-between items-center gap-3 border-b border-[#F8F9FA] pb-3 last:border-b-0 last:pb-0">
                <div className="flex flex-col min-w-0">
                  <h4 className="font-extrabold text-xs text-[#1B1B1B] truncate leading-tight">{fItem.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-[#808080] font-semibold">Borrowed {fItem.borrowed} times</span>
                    <span className="text-[#A0A0A0] text-[8px] font-mono">•</span>
                    <span className="text-[9px] text-slate-800 font-bold font-mono">Copies {fItem.copies}</span>
                  </div>
                  <span className={`w-fit mt-1 px-1.5 py-0.2 rounded text-[8px] font-bold uppercase tracking-wider ${fItem.statusColor}`}>
                    {fItem.status}
                  </span>
                </div>
                
                <button
                  onClick={() => handleReorder(fItem.title)}
                  className="bg-[#FA5A3C] hover:bg-[#E24A2D] text-white text-[9px] font-bold py-1.5 px-3 rounded-lg shadow-sm shrink-0 transition-colors btn-pressable"
                >
                  Reorder
                </button>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Main Damaged/Lost Books Log Table Container */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 lg:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-6">
        
        {/* Toolbar row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-sm font-extrabold text-[#1B1B1B]">Damaged/Lost Books Log</h3>
          
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            {/* Search */}
            <div className="relative w-full sm:w-48 lg:w-56">
              <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search a book"
                className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl pl-9.5 pr-4 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold"
              />
            </div>

            {/* Condition Filter */}
            <div className="relative">
              <select
                value={conditionFilter}
                onChange={(e) => {
                  setConditionFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-[#EAEAEA] rounded-xl pl-8 pr-8 py-2 text-xs text-[#6E6E6E] font-bold focus:outline-none focus:border-[#FA5A3C] transition-colors cursor-pointer appearance-none"
              >
                <option value="All">All Conditions</option>
                <option value="Damaged">Damaged</option>
                <option value="Lost">Lost</option>
              </select>
              <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E6E6E] pointer-events-none" />
              <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E6E6E] pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-[#EAEAEA] rounded-xl pl-8 pr-8 py-2 text-xs text-[#6E6E6E] font-bold focus:outline-none focus:border-[#FA5A3C] transition-colors cursor-pointer appearance-none"
              >
                <option value="All">All Replacements</option>
                <option value="Pending">Pending</option>
                <option value="Replaced">Replaced</option>
                <option value="Repaired">Repaired</option>
                <option value="Written Off">Written Off</option>
              </select>
              <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E6E6E] pointer-events-none" />
              <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E6E6E] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table representation */}
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-[#F1F3F5] pb-3 text-[10px] font-bold uppercase tracking-wider text-[#808080]">
                <th className="pb-3 pr-4">Book</th>
                <th className="pb-3 px-4">Copies</th>
                <th className="pb-3 px-4">Condition</th>
                <th className="pb-3 px-4">Notes</th>
                <th className="pb-3 px-4">Date Reported</th>
                <th className="pb-3 px-4">Reported By</th>
                <th className="pb-3 px-4">Replacement Status</th>
                <th className="pb-3 pl-4 text-right">Fine</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5] text-xs font-sans">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-[#808080] font-semibold">
                    No incident reports match your filters.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map(item => {
                  const conditionColor = item.condition === 'Damaged' ? 'bg-[#FA5A3C]' : 'bg-slate-400';
                  
                  const statusColors = item.replacementStatus === 'Written Off'
                    ? 'bg-slate-100 text-slate-600 border-slate-200/50'
                    : item.replacementStatus === 'Replaced'
                    ? 'bg-blue-50 text-blue-600 border-blue-100'
                    : item.replacementStatus === 'Pending'
                    ? 'bg-orange-50 text-orange-600 border-orange-100'
                    : 'bg-green-50 text-green-600 border-green-100';

                  // Assign category cover background dynamically based on ID hashing
                  const h = item.title.charCodeAt(0) + item.title.length + parseInt(item.bookId.split('-')[1] || '0') * 7;
                  const colors = [
                    'from-rose-400 to-red-500',
                    'from-blue-400 to-indigo-500',
                    'from-amber-400 to-amber-600',
                    'from-emerald-400 to-teal-500',
                    'from-violet-400 to-purple-500'
                  ];
                  const coverGrad = colors[h % colors.length];

                  return (
                    <tr key={item.id} className="hover:bg-[#FAF9F6]/30 transition-colors">
                      <td className="py-3 px-4 pl-0">
                        <div className="flex items-center gap-3">
                          {/* Mini book cover mockup */}
                          <div className={`w-8 h-11 rounded bg-gradient-to-br ${coverGrad} border border-slate-200/50 flex items-center justify-center p-0.5 shadow-sm shrink-0 overflow-hidden text-[6px] font-display font-extrabold text-white text-center leading-tight relative`}>
                            <div className="absolute inset-0 bg-[#3D1E1E]/5" />
                            {item.title.slice(0, 10)}
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="font-extrabold text-[#1B1B1B] text-sm leading-tight">{item.title}</span>
                            <span className="text-[10px] text-[#808080] font-mono mt-0.5">{item.bookId}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{item.copies}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${conditionColor}`} />
                          <span className="font-semibold text-slate-700">{item.condition}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 bg-slate-50 border border-[#EAEAEA] rounded-lg px-2 py-1 w-fit font-semibold text-slate-600 text-[10px]">
                          {getNoteIcon(item.notes)}
                          <span>{item.notes}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[10px] text-[#6E6E6E]">{item.dateReported}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{item.reportedBy}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => cycleStatus(item.id)}
                          className={`px-2.5 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider cursor-pointer hover:shadow-sm transition-all text-center leading-none ${statusColors}`}
                          title="Click to change status"
                        >
                          {item.replacementStatus}
                        </button>
                      </td>
                      <td className="py-3 pl-4 text-right font-mono font-bold text-[#1B1B1B]">${item.fine.toFixed(2)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F1F3F5] pt-4 text-xs font-semibold text-[#808080]">
          
          <div className="flex items-center gap-1.5">
            <span>Show</span>
            <div className="relative">
              <select 
                className="bg-white border border-[#EAEAEA] rounded-lg px-2.5 py-1 text-[10px] font-bold text-[#6E6E6E] appearance-none pr-6 cursor-pointer"
                disabled
              >
                <option>{paginatedLogs.length}</option>
              </select>
              <CaretDown className="absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-[#6E6E6E] pointer-events-none" />
            </div>
            <span>of {totalResults} results</span>
          </div>

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
  );
};
