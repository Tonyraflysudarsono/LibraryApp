import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  MagnifyingGlass, 
  Funnel,
  CaretDown,
  CaretLeft,
  CaretRight
} from '@phosphor-icons/react';
import type { BorrowRequest, UserAccount } from '../../data/mockDb';

interface AdminTransactionsProps {
  allTransactions: BorrowRequest[];
  members: UserAccount[];
  handleVerifyReturn: (borrowId: string) => void;
}

interface ActivityLog {
  id: string;
  activity: string;
  dateTime: string;
  memberName: string;
  memberId: string;
  memberTier: string;
  bookTitle: string;
  bookId: string;
  dueDate: string;
  returnDate: string;
  status: 'borrowed' | 'returned' | 'overdue' | 'reserved' | '—';
  fine: number;
  coverGradient: string;
  realTxId?: string;
}

interface ReservationItem {
  id: string;
  title: string;
  memberName: string;
  memberId: string;
  time: string;
  coverGradient: string;
}

interface ActiveBorrowerItem {
  name: string;
  id: string;
  count: number;
  initials: string;
  color: string;
}

export const AdminTransactions: React.FC<AdminTransactionsProps> = ({
  allTransactions,
  members,
  handleVerifyReturn
}) => {
  // State for search, filter, sorting, and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'borrowed' | 'returned' | 'overdue'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredCheckinIdx, setHoveredCheckinIdx] = useState<number | null>(null);
  
  const itemsPerPage = 11;

  // Calculate dynamic metrics on top of Figma baselines
  const activeBorrows = allTransactions.filter(t => t.status === 'borrowed');
  const returnedBorrows = allTransactions.filter(t => t.status === 'returned');

  const stats = {
    totalBorrowed: {
      value: (1250 + activeBorrows.length).toLocaleString('id-ID'),
      change: "+8.2%",
      isPositive: true,
    },
    totalReturned: {
      value: (1110 + returnedBorrows.length).toLocaleString('id-ID'),
      change: "+4.5%",
      isPositive: true,
    },
    totalReserved: {
      value: "320",
      change: "-1.5%",
      isPositive: false,
    }
  };

  // Mock data for check-ins chart (Figma: Jan to Aug)
  const checkinsData = [
    { month: 'Jan', visitors: 600 },
    { month: 'Feb', visitors: 800 },
    { month: 'Mar', visitors: 1316 }, // Hovered by default in Figma design
    { month: 'Apr', visitors: 1000 },
    { month: 'May', visitors: 1200 },
    { month: 'Jun', visitors: 1100 },
    { month: 'Jul', visitors: 980 },
    { month: 'Aug', visitors: 1400 },
  ];

  // Mock reservations list matching Figma design
  const defaultReservations: ReservationItem[] = [
    {
      id: "res-1",
      title: "Floral Dreams",
      memberName: "Livia Hart",
      memberId: "MBR-2081",
      time: "Sept 27, 2035 – 10:45 AM",
      coverGradient: "from-pink-200 to-pink-400"
    },
    {
      id: "res-2",
      title: "The Book of Prayer",
      memberName: "Isla Ray",
      memberId: "MBR-2389",
      time: "Sept 27, 2035 – 09:30 AM",
      coverGradient: "from-emerald-200 to-emerald-400"
    },
    {
      id: "res-3",
      title: "Claudia Life Story",
      memberName: "Ezra Nolan",
      memberId: "MBR-1170",
      time: "Sept 26, 2035 – 04:15 PM",
      coverGradient: "from-amber-200 to-amber-400"
    }
  ];

  // Fetch reservations from localStorage if any exist
  const getReservations = (): ReservationItem[] => {
    try {
      const stored = localStorage.getItem('lib_reservations');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          const gradients = [
            "from-pink-200 to-pink-400",
            "from-emerald-200 to-emerald-400",
            "from-amber-200 to-amber-400"
          ];
          return parsed.slice(0, 3).map((r: any, idx: number) => {
            const member = members.find(m => m.id === r.userId);
            return {
              id: r.id,
              title: r.bookTitle,
              memberName: member?.name || "Unknown Member",
              memberId: r.userId,
              time: "Today – 10:00 AM",
              coverGradient: gradients[idx % gradients.length]
            };
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
    return defaultReservations;
  };

  const reservationsList = getReservations();

  // Mock Active Borrowers matching Figma design
  const defaultActiveBorrowers: ActiveBorrowerItem[] = [
    { name: "Livia Hart", id: "MBR-2081", count: 4, initials: "LH", color: "bg-orange-50 text-orange-600 border-orange-100" },
    { name: "Ezra Nolan", id: "MBR-1170", count: 3, initials: "EN", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { name: "Isla Ray", id: "MBR-2389", count: 3, initials: "IR", color: "bg-teal-50 text-teal-600 border-teal-100" }
  ];

  // Dynamic active borrowers calculation
  const getActiveBorrowers = (): ActiveBorrowerItem[] => {
    const borrowCounts: { [key: string]: number } = {};
    activeBorrows.forEach(t => {
      borrowCounts[t.userId] = (borrowCounts[t.userId] || 0) + 1;
    });

    const activeUsers = Object.keys(borrowCounts)
      .map(uid => {
        const m = members.find(u => u.id === uid);
        const initials = m?.name ? m.name.split(' ').map(n=>n[0]).join('') : uid.slice(0, 2);
        const colors = [
          "bg-orange-50 text-orange-600 border-orange-100",
          "bg-blue-50 text-blue-600 border-blue-100",
          "bg-teal-50 text-teal-600 border-teal-100"
        ];
        return {
          name: m?.name || "Member",
          id: uid,
          count: borrowCounts[uid],
          initials,
          color: colors[Math.floor(Math.random() * colors.length)]
        };
      })
      .sort((a, b) => b.count - a.count);

    if (activeUsers.length === 0) return defaultActiveBorrowers;
    if (activeUsers.length < 3) {
      const merged = [...activeUsers];
      defaultActiveBorrowers.forEach(d => {
        if (!merged.some(m => m.id === d.id) && merged.length < 3) {
          merged.push(d);
        }
      });
      return merged;
    }
    return activeUsers.slice(0, 3);
  };

  const activeBorrowersList = getActiveBorrowers();

  // Helper: Format Dates to Match Figma screenshot
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

  // Figma activities list
  const defaultActivities: ActivityLog[] = [
    {
      id: "tx-1",
      activity: "Borrow",
      dateTime: "Sept 27, 2035 09:20 AM",
      memberName: "Livia Hart",
      memberId: "MBR-2081",
      memberTier: "Premium",
      bookTitle: "Where The Flowers Bloom",
      bookId: "BK-10234",
      dueDate: "Oct 11, 2035",
      returnDate: "—",
      status: "borrowed" as const,
      fine: 0,
      coverGradient: "from-amber-200 to-amber-400"
    },
    {
      id: "tx-2",
      activity: "Return",
      dateTime: "Sept 26, 2035 05:15 PM",
      memberName: "Ezra Nolan",
      memberId: "MBR-1170",
      memberTier: "Premium",
      bookTitle: "Floral Dreams",
      bookId: "BK-09876",
      dueDate: "Sept 25, 2035",
      returnDate: "Sept 26, 2035",
      status: "returned" as const,
      fine: 15000, // Rp 15.000 ($1.00)
      coverGradient: "from-pink-200 to-pink-400"
    },
    {
      id: "tx-3",
      activity: "Reservation",
      dateTime: "Sept 26, 2035 04:05 PM",
      memberName: "Isla Ray",
      memberId: "MBR-2389",
      memberTier: "Standard",
      bookTitle: "My Story",
      bookId: "BK-11001",
      dueDate: "—",
      returnDate: "—",
      status: "reserved" as const,
      fine: 0,
      coverGradient: "from-teal-200 to-teal-400"
    },
    {
      id: "tx-4",
      activity: "Return",
      dateTime: "Sept 25, 2035 03:40 PM",
      memberName: "Milo Sharp",
      memberId: "MBR-4112",
      memberTier: "Basic",
      bookTitle: "My Recipe Book",
      bookId: "BK-10567",
      dueDate: "Sept 20, 2035",
      returnDate: "Sept 25, 2035",
      status: "returned" as const,
      fine: 37500, // Rp 37.500 ($2.50)
      coverGradient: "from-orange-200 to-orange-400"
    },
    {
      id: "tx-5",
      activity: "Reservation",
      dateTime: "Sept 25, 2035 02:20 PM",
      memberName: "Ava Lin",
      memberId: "MBR-3021",
      memberTier: "Premium",
      bookTitle: "Threads of Fate",
      bookId: "BK-11122",
      dueDate: "—",
      returnDate: "—",
      status: "reserved" as const,
      fine: 0,
      coverGradient: "from-purple-200 to-purple-400"
    },
    {
      id: "tx-6",
      activity: "Borrow",
      dateTime: "Sept 25, 2035 01:30 PM",
      memberName: "Julian Cross",
      memberId: "MBR-2759",
      memberTier: "Basic",
      bookTitle: "Drew Feig",
      bookId: "BK-10345",
      dueDate: "Oct 08, 2035",
      returnDate: "—",
      status: "overdue" as const,
      fine: 15000, // Rp 15.000 ($1.00)
      coverGradient: "from-rose-200 to-rose-400"
    },
    {
      id: "tx-7",
      activity: "Return",
      dateTime: "Sept 24, 2035 05:45 PM",
      memberName: "Elara Moon",
      memberId: "MBR-1945",
      memberTier: "Standard",
      bookTitle: "The Book of Prayer",
      bookId: "BK-10098",
      dueDate: "Sept 23, 2035",
      returnDate: "Sept 24, 2035",
      status: "returned" as const,
      fine: 15000,
      coverGradient: "from-emerald-200 to-emerald-400"
    },
    {
      id: "tx-8",
      activity: "Reservation",
      dateTime: "Sept 24, 2035 11:10 AM",
      memberName: "Celine Moore",
      memberId: "MBR-3095",
      memberTier: "Basic",
      bookTitle: "The Coffee Shop Next Door",
      bookId: "BK-08745",
      dueDate: "—",
      returnDate: "—",
      status: "reserved" as const,
      fine: 0,
      coverGradient: "from-blue-200 to-blue-400"
    },
    {
      id: "tx-9",
      activity: "Borrow",
      dateTime: "Sept 22, 2035 10:15 AM",
      memberName: "Noah Trent",
      memberId: "MBR-1643",
      memberTier: "Standard",
      bookTitle: "Claudia's Life Story",
      bookId: "BK-10777",
      dueDate: "Oct 06, 2035",
      returnDate: "—",
      status: "overdue" as const,
      fine: 22500, // Rp 22.500 ($1.50)
      coverGradient: "from-amber-200 to-amber-300"
    },
    {
      id: "tx-10",
      activity: "Reservation",
      dateTime: "Sept 21, 2035 04:50 PM",
      memberName: "Leo Finch",
      memberId: "MBR-2210",
      memberTier: "Standard",
      bookTitle: "Everything Kimchi",
      bookId: "BK-10991",
      dueDate: "—",
      returnDate: "—",
      status: "reserved" as const,
      fine: 0,
      coverGradient: "from-orange-200 to-amber-400"
    },
    {
      id: "tx-11",
      activity: "Borrow",
      dateTime: "Sept 21, 2035 09:30 AM",
      memberName: "Nova Wells",
      memberId: "MBR-3678",
      memberTier: "Basic",
      bookTitle: "Dune Whisper",
      bookId: "BK-10888",
      dueDate: "Oct 05, 2035",
      returnDate: "—",
      status: "borrowed" as const,
      fine: 0,
      coverGradient: "from-indigo-200 to-indigo-400"
    }
  ];

  // Convert real db transaction logs
  const getMergedActivities = (): ActivityLog[] => {
    if (allTransactions.length === 0) return defaultActivities;
    
    const dbActivities: ActivityLog[] = allTransactions.map(tx => {
      const member = members.find(m => m.id === tx.userId);
      const isOverdue = tx.status === 'borrowed' && new Date(tx.dueDate) < new Date();
      
      let activity = "Borrow";
      if (tx.status === 'returned') activity = "Return";
      else if (tx.status === 'pending_return') activity = "Return Request";
      
      let fineAmt = tx.fine || 0;
      if (isOverdue) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(tx.dueDate);
        due.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil(Math.abs(today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
        fineAmt = diffDays * 5000;
      }

      const gradients = [
        "from-amber-200 to-amber-400",
        "from-blue-200 to-blue-400",
        "from-emerald-200 to-emerald-400",
        "from-pink-200 to-pink-400",
        "from-purple-200 to-purple-400"
      ];
      const stringHash = tx.bookTitle.length + tx.id.length;

      return {
        id: tx.id,
        activity,
        dateTime: formatDateStr(tx.borrowDate) + " 10:00 AM",
        memberName: member?.name || "Member",
        memberId: tx.userId,
        memberTier: member?.id === 'MEM001' ? 'Premium' : member?.id === 'MEM002' ? 'Standard' : 'Basic',
        bookTitle: tx.bookTitle,
        bookId: `BK-${10000 + parseInt(tx.bookId || '0')}`,
        dueDate: formatDateStr(tx.dueDate),
        returnDate: tx.returnDate ? formatDateStr(tx.returnDate) : "—",
        status: isOverdue ? ('overdue' as const) : (tx.status === 'pending_return' ? ('borrowed' as const) : tx.status),
        fine: fineAmt,
        coverGradient: gradients[stringHash % gradients.length],
        realTxId: tx.id // keep link to trigger verification
      };
    });

    // Merge with defaults to populate table fully
    const merged = [...dbActivities];
    defaultActivities.forEach(d => {
      if (!merged.some(m => m.bookTitle === d.bookTitle && m.memberName === d.memberName)) {
        merged.push(d);
      }
    });

    return merged;
  };

  const rawActivities = getMergedActivities();

  // Apply search query, status filter
  const filteredActivities = rawActivities.filter(act => {
    const matchesSearch = act.bookTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          act.memberName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          act.memberId.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    if (statusFilter === 'borrowed') return matchesSearch && act.status === 'borrowed';
    if (statusFilter === 'returned') return matchesSearch && act.status === 'returned';
    if (statusFilter === 'overdue') return matchesSearch && act.status === 'overdue';
    return matchesSearch;
  });

  // Pagination calculation
  const totalResults = filteredActivities.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format fine amount to USD
  const formatFineUsd = (fineIdr: number) => {
    if (fineIdr === 0) return "$0.00";
    const usd = fineIdr / 15000;
    return `$${usd.toFixed(2)}`;
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 font-sans text-left">
      
      {/* Breadcrumb section */}
      <div className="flex flex-col text-left -mt-2">
        <div className="flex items-center gap-2 text-[10px] lg:text-xs font-bold text-[#808080]">
          <span className="cursor-pointer hover:text-[#FA5A3C] transition-colors">Dashboard</span>
          <span>/</span>
          <span className="text-[#1B1B1B]">Library Activity</span>
        </div>
      </div>

      {/* Top 3 Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Borrowed Card */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[#1B1B1B]">
            <BookOpen className="w-5 h-5 text-slate-800" />
          </div>
          <div className="flex flex-col gap-0.5 flex-1 text-left">
            <span className="text-[10px] font-bold text-[#808080] uppercase tracking-wider">Total Borrowed</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-[#1B1B1B] leading-none tracking-tight">{stats.totalBorrowed.value}</span>
              <span className="text-[9px] text-[#808080] font-semibold">books</span>
            </div>
          </div>
          <span className="text-[9px] bg-green-50 border border-green-100 text-green-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shrink-0 self-start">
            <ArrowUpRight className="w-2.5 h-2.5" />
            {stats.totalBorrowed.change}
          </span>
        </div>

        {/* Total Returned Card */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-[#FA5A3C]">
            <CheckCircle className="w-5 h-5 text-[#FA5A3C]" />
          </div>
          <div className="flex flex-col gap-0.5 flex-1 text-left">
            <span className="text-[10px] font-bold text-[#808080] uppercase tracking-wider">Total Returned</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-[#1B1B1B] leading-none tracking-tight">{stats.totalReturned.value}</span>
              <span className="text-[9px] text-[#808080] font-semibold">books</span>
            </div>
          </div>
          <span className="text-[9px] bg-green-50 border border-green-100 text-green-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shrink-0 self-start">
            <ArrowUpRight className="w-2.5 h-2.5" />
            {stats.totalReturned.change}
          </span>
        </div>

        {/* Total Reserved Card */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
          <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <Calendar className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex flex-col gap-0.5 flex-1 text-left">
            <span className="text-[10px] font-bold text-[#808080] uppercase tracking-wider">Total Reserved</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-[#1B1B1B] leading-none tracking-tight">{stats.totalReserved.value}</span>
              <span className="text-[9px] text-[#808080] font-semibold">books</span>
            </div>
          </div>
          <span className="text-[9px] bg-red-50 border border-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shrink-0 self-start">
            <ArrowDownRight className="w-2.5 h-2.5" />
            {stats.totalReserved.change}
          </span>
        </div>

      </div>

      {/* Middle Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        {/* Library Check-ins Line Chart (Spans 4 columns) */}
        <div className="lg:col-span-4 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-4 relative">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-[#1B1B1B]">Library Check-ins</h3>
            <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2.5 py-1 text-[10px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
              <span>Last 8 Months</span>
              <CaretDown className="w-3 h-3 text-[#808080]" />
            </div>
          </div>

          {/* Line Chart Grid */}
          <div className="h-44 w-full flex items-end justify-between px-2 pt-6 relative border-b border-[#F1F3F5]">
            {/* Grid background columns */}
            <div className="absolute inset-0 flex justify-between pointer-events-none px-2">
              {checkinsData.map(d => (
                <div key={d.month} className="w-[1.5px] h-full bg-[#FAF9F6] border-dashed border-[#F1F3F5] border-r" />
              ))}
            </div>

            {/* SVG line and area */}
            <svg className="absolute inset-x-0 bottom-6 w-full h-24 overflow-visible pointer-events-none" viewBox="0 0 340 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="checkinGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FA5A3C" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#FA5A3C" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M 10 75 C 50 65, 80 15, 100 45 C 130 50, 160 30, 200 35 C 245 45, 270 20, 330 15 L 330 100 L 10 100 Z" fill="url(#checkinGrad)" />
              <path d="M 10 75 C 50 65, 80 15, 100 45 C 130 50, 160 30, 200 35 C 245 45, 270 20, 330 15" fill="none" stroke="#FA5A3C" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Highlight point on March (node 3: 100, 45) */}
              <circle cx="100" cy="45" r="5" fill="#FA5A3C" stroke="white" strokeWidth="1.5" />
            </svg>

            {/* Interactive Hover Nodes */}
            {checkinsData.map((d, idx) => {
              const isHovered = hoveredCheckinIdx === idx || (hoveredCheckinIdx === null && idx === 2); // Default March hovered
              return (
                <div 
                  key={d.month} 
                  className="flex flex-col items-center gap-1.5 w-[10%] relative z-10 cursor-pointer"
                  onMouseEnter={() => setHoveredCheckinIdx(idx)}
                  onMouseLeave={() => setHoveredCheckinIdx(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-white border border-[#EAEAEA] rounded-lg shadow-xl p-2 z-20 flex flex-col gap-0.5 w-24 text-left animate-in fade-in zoom-in-95 duration-100">
                      <span className="text-[8px] font-bold text-[#808080] font-mono leading-none">March 2035</span>
                      <span className="text-[10px] font-extrabold text-[#1B1B1B] mt-0.5">{d.visitors.toLocaleString('id-ID')} visitors</span>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-r border-b border-[#EAEAEA] rotate-45" />
                    </div>
                  )}

                  <span className="text-[9px] font-bold text-[#808080] font-mono">{d.month}</span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Active Borrowers (Spans 3 columns) */}
        <div className="lg:col-span-3 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-[#1B1B1B]">Active Borrowers</h3>
            <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
              <span>This Month</span>
              <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 h-full">
            {activeBorrowersList.map(b => (
              <div key={b.id} className="bg-[#FAF9F6] border border-[#EAE9E4] rounded-2xl p-3 flex flex-col items-center text-center justify-center gap-3 relative overflow-hidden group hover:border-[#FA5A3C] transition-colors">
                {/* Visual Accent ring */}
                <div className="w-12 h-12 rounded-full border-2 border-white ring-2 ring-slate-100 shadow-sm flex items-center justify-center font-bold font-mono text-xs bg-slate-50 text-slate-700 shrink-0">
                  {b.initials}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-extrabold text-[#1B1B1B] truncate max-w-full leading-tight">{b.name}</span>
                  <span className="text-[9px] text-[#808080] font-bold font-mono tracking-wider mt-0.5">{b.id}</span>
                </div>
                <span className="text-[9px] bg-white border border-[#EAEAEA] text-[#6E6E6E] font-bold px-2 py-0.5 rounded-lg whitespace-nowrap shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                  {b.count} books
                </span>
              </div>
            ))}
          </div>

        </div>

        {/* Reservations widget (Spans 3 columns) */}
        <div className="lg:col-span-3 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-[#1B1B1B]">Reservations</h3>
            <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
              <span>This Week</span>
              <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
            </div>
          </div>

          <div className="flex flex-col gap-3.5 justify-between flex-1">
            {reservationsList.map(res => (
              <div key={res.id} className="flex gap-3 items-center">
                {/* Cover graphic */}
                <div className={`w-8 h-11 rounded bg-gradient-to-br ${res.coverGradient} border border-slate-200/50 flex items-center justify-center p-0.5 shadow-sm shrink-0 overflow-hidden text-[6px] font-display font-extrabold text-slate-800 text-center leading-tight relative`}>
                  <div className="absolute inset-0 bg-[#3D1E1E]/5" />
                  {res.title.slice(0, 10)}
                </div>
                <div className="flex flex-col text-left flex-1 min-w-0">
                  <h4 className="font-extrabold text-xs text-[#1B1B1B] truncate leading-tight">{res.title}</h4>
                  <span className="text-[10px] text-[#808080] font-semibold mt-0.5">
                    By {res.memberName} <span className="font-mono text-[9px] text-[#A0A0A0]">({res.memberId})</span>
                  </span>
                  <span className="text-[8px] text-[#A0A0A0] font-bold font-mono tracking-wide mt-1">
                    {res.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Bottom Layout - Large Activity Table */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-6">
        
        {/* Table header with Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h3 className="text-sm font-extrabold text-[#1B1B1B]">Library Activity</h3>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search for activity, member, etc"
                className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl pl-9 pr-4 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="bg-white border border-[#EAEAEA] rounded-xl pl-8 pr-8 py-2 text-xs text-[#6E6E6E] font-bold focus:outline-none focus:border-[#FA5A3C] transition-colors cursor-pointer appearance-none w-full"
              >
                <option value="All">All Status</option>
                <option value="borrowed">Borrowed</option>
                <option value="returned">Returned</option>
                <option value="overdue">Overdue</option>
              </select>
              <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E6E6E] pointer-events-none" />
              <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6E6E6E] pointer-events-none" />
            </div>

          </div>
        </div>

        {/* Scrollable Table Viewport */}
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-[#F1F3F5] pb-3 text-[10px] font-bold uppercase tracking-wider text-[#808080]">
                <th className="pb-3 pr-4">Activity</th>
                <th className="pb-3 px-4">Date & Time</th>
                <th className="pb-3 px-4">Member Info</th>
                <th className="pb-3 px-4">Book Title</th>
                <th className="pb-3 px-4">Due Date</th>
                <th className="pb-3 px-4">Return Date</th>
                <th className="pb-3 px-4">Status</th>
                <th className="pb-3 px-4">Fine</th>
                <th className="pb-3 pl-4 text-right w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5] text-xs font-sans">
              {paginatedActivities.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#808080] font-semibold">
                    No activity logs match your filters.
                  </td>
                </tr>
              ) : (
                paginatedActivities.map(act => (
                  <tr key={act.id} className="hover:bg-[#FAF9F6]/30 transition-colors">
                    
                    {/* Activity Type */}
                    <td className="py-3.5 pr-4 font-bold text-[#1B1B1B]">
                      {act.activity}
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4 text-[#808080] font-semibold">
                      {act.dateTime}
                    </td>

                    {/* Member Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          <span className="text-[8px] font-bold text-slate-500 font-mono">
                            {act.memberName.split(' ').map(n=>n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex flex-col text-left">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-[#1B1B1B]">{act.memberName}</span>
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                              act.memberTier === 'Premium' ? 'bg-[#FA5A3C]/10 text-[#FA5A3C]' :
                              act.memberTier === 'Standard' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-600'
                            }`}>{act.memberTier}</span>
                          </div>
                          <span className="text-[9px] text-[#808080] font-semibold font-mono mt-0.5">{act.memberId}</span>
                        </div>
                      </div>
                    </td>

                    {/* Book Title */}
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className={`w-8 h-11 rounded bg-gradient-to-br ${act.coverGradient} border border-slate-200/50 flex items-center justify-center p-0.5 shadow-sm shrink-0 overflow-hidden text-[6px] font-display font-extrabold text-slate-800 text-center leading-tight relative`}>
                        <div className="absolute inset-0 bg-[#3D1E1E]/5" />
                        {act.bookTitle.slice(0, 10)}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-extrabold text-[#1B1B1B]">{act.bookTitle}</span>
                        <span className="text-[10px] text-[#808080] font-mono mt-0.5">{act.bookId}</span>
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[10px] text-[#1B1B1B]">
                      {act.dueDate}
                    </td>

                    {/* Return Date */}
                    <td className="py-3.5 px-4 font-mono text-[10px] text-[#6E6E6E]">
                      {act.returnDate}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {act.status === '—' ? (
                        <span className="text-[#808080]">——</span>
                      ) : (
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          act.status === 'returned' ? 'bg-green-50 border border-green-100 text-green-600' :
                          act.status === 'overdue' ? 'bg-red-50 border border-red-100 text-red-600' :
                          'bg-amber-50 border border-amber-100 text-amber-600'
                        }`}>
                          {act.status}
                        </span>
                      )}
                    </td>

                    {/* Fine */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1B1B1B]">
                      {formatFineUsd(act.fine)}
                    </td>

                    {/* Actions Verification Trigger */}
                    <td className="py-3.5 pl-4 text-right">
                      {act.realTxId && act.status !== 'returned' ? (
                        <button
                          onClick={() => handleVerifyReturn(act.realTxId!)}
                          className="bg-[#FA5A3C] hover:bg-[#E24A2D] text-white px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider shadow-sm transition-colors btn-pressable whitespace-nowrap"
                        >
                          Verify Return
                        </button>
                      ) : (
                        <span className="text-[10px] text-[#808080] font-semibold italic">Verified</span>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F1F3F5] pt-4 text-xs font-semibold text-[#808080] font-sans">
          
          <div className="flex items-center gap-1.5">
            <span>Show</span>
            <div className="relative">
              <select 
                className="bg-white border border-[#EAEAEA] rounded-lg px-2.5 py-1 text-[10px] font-bold text-[#6E6E6E] appearance-none pr-6 cursor-pointer"
                disabled
              >
                <option>{paginatedActivities.length}</option>
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
  );
};
