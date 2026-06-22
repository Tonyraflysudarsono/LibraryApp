import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight,
  BookOpen,
  Users,
  Clock,
  Star,
  CaretDown
} from '@phosphor-icons/react';
import type { Book, BorrowRequest, UserAccount } from '../../data/mockDb';

interface AdminDashboardProps {
  books: Book[];
  members: UserAccount[];
  allTransactions: BorrowRequest[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  books,
  members,
  allTransactions
}) => {
  // Tooltip state for usage trends chart
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState<number | null>(null);
  
  // Calculate dynamic metrics on top of Figma baselines
  const activeBorrows = allTransactions.filter(t => t.status === 'borrowed');
  const overdueBorrows = allTransactions.filter(t => {
    return t.status === 'borrowed' && new Date(t.dueDate) < new Date();
  });

  const stats = {
    borrowedBooks: {
      value: (1250 + activeBorrows.length).toLocaleString('id-ID'),
      change: "+8.2%",
      isPositive: true,
      time: "from last week",
    },
    overdueReturns: {
      value: (132 + overdueBorrows.length).toLocaleString('id-ID'),
      change: "-5.6%",
      isPositive: true, // Decreasing overdue items is good/positive
      time: "improvement",
    },
    totalVisitors: {
      value: "3.420",
      change: "-2.4%",
      isPositive: false,
      time: "from previous month",
    },
    totalBooks: {
      value: (18750 + books.length).toLocaleString('id-ID'),
      change: `+${books.length > 14 ? books.length - 14 : 150}`,
      isPositive: true,
      time: "new books this month",
    }
  };

  // Mock data for trends bar chart (Figma: sun, mon, tue, wed, thu, fri, sat)
  const trendsData = [
    { day: 'Sun', visitors: 65, borrowers: 25 },
    { day: 'Mon', visitors: 55, borrowers: 45 },
    { day: 'Tue', visitors: 85, borrowers: 55 },
    { day: 'Wed', visitors: 90, borrowers: 40 },
    { day: 'Thu', visitors: 81, borrowers: 32 }, // Hovered by default in Figma design
    { day: 'Fri', visitors: 70, borrowers: 52 },
    { day: 'Sat', visitors: 60, borrowers: 38 },
  ];

  // Mock data for revenue area chart (Feb to Sep)
  const revenueData = [
    { month: 'Feb', value: 4800 },
    { month: 'Mar', value: 5200 },
    { month: 'Apr', value: 5000 },
    { month: 'May', value: 6800 },
    { month: 'Jun', value: 7598 }, // Peak label in Figma
    { month: 'Jul', value: 7000 },
    { month: 'Aug', value: 7200 },
    { month: 'Sep', value: 7400 },
  ];

  // Helper to format date
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

  // Fallback / mock data for Activity Table matching Figma design exactly if DB is empty
  const defaultActivity = [
    {
      id: "act-1",
      bookTitle: "Claudia's Life Story",
      bookAuthor: "Mira Ellison",
      memberName: "Livia Hart",
      memberId: "MBR-2081",
      memberTier: "Premium",
      borrowDate: "Sept 01, 2025",
      dueDate: "Sept 15, 2025",
      returnDate: "Sept 14, 2025",
      status: "returned" as const,
      coverGradient: "from-amber-200 to-amber-400"
    },
    {
      id: "act-2",
      bookTitle: "The Coffee Shop Next Door",
      bookAuthor: "Avery Davis",
      memberName: "Noah Trent",
      memberId: "MBR-1643",
      memberTier: "Standard",
      borrowDate: "Aug 28, 2025",
      dueDate: "Sept 11, 2025",
      returnDate: "-",
      status: "borrowed" as const,
      coverGradient: "from-blue-200 to-blue-400"
    },
    {
      id: "act-3",
      bookTitle: "The Book of Prayer",
      bookAuthor: "Elara Quinn",
      memberName: "Celine Moore",
      memberId: "MBR-3095",
      memberTier: "Basic",
      borrowDate: "Aug 20, 2025",
      dueDate: "Sept 03, 2025",
      returnDate: "Sept 02, 2025",
      status: "returned" as const,
      coverGradient: "from-emerald-200 to-emerald-400"
    },
    {
      id: "act-4",
      bookTitle: "Floral Dreams",
      bookAuthor: "Claudia Alexa",
      memberName: "Isla Ray",
      memberId: "MBR-2389",
      memberTier: "Standard",
      borrowDate: "Aug 25, 2025",
      dueDate: "Sept 08, 2025",
      returnDate: "-",
      status: "overdue" as const,
      coverGradient: "from-pink-200 to-pink-400"
    }
  ];

  // Merge actual transactions into UI activities
  const displayActivities = allTransactions.length > 0 
    ? allTransactions.slice(0, 5).map((t, idx) => {
        const member = members.find(m => m.id === t.userId);
        const overdue = t.status === 'borrowed' && new Date(t.dueDate) < new Date();
        const gradients = [
          "from-amber-200 to-amber-400",
          "from-blue-200 to-blue-400",
          "from-emerald-200 to-emerald-400",
          "from-pink-200 to-pink-400",
          "from-purple-200 to-purple-400"
        ];
        return {
          id: t.id,
          bookTitle: t.bookTitle,
          bookAuthor: t.bookAuthor,
          memberName: member?.name || "Unknown Member",
          memberId: t.userId,
          memberTier: member?.id === 'MEM001' ? 'Premium' : member?.id === 'MEM002' ? 'Standard' : 'Basic',
          borrowDate: formatDateStr(t.borrowDate),
          dueDate: formatDateStr(t.dueDate),
          returnDate: t.returnDate ? formatDateStr(t.returnDate) : "-",
          status: overdue ? ('overdue' as const) : (t.status === 'pending_return' ? ('borrowed' as const) : t.status),
          coverGradient: gradients[idx % gradients.length]
        };
      })
    : defaultActivity;

  // Book categories breakdown calculations (total books = 18750 + books.length)
  const categoryPercentages = [
    { label: "Fiction", value: 35, books: "6.563 books", color: "bg-[#FA5A3C]" },
    { label: "Non-Fiction", value: 22, books: "4.126 books", color: "bg-[#4B5EAA]" },
    { label: "Science & Technology", value: 15, books: "2.812 books", color: "bg-[#2ECC71]" },
    { label: "History", value: 12, books: "2.250 books", color: "bg-[#F1C40F]" },
    { label: "Children & Young Adult", value: 10, books: "1.875 books", color: "bg-[#9B59B6]" },
    { label: "Others", value: 6, books: "1.124 books", color: "bg-[#BDC3C7]" },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8 font-sans text-left">
      
      {/* Left Column (Dashboard main content - spans 3 columns) */}
      <div className="xl:col-span-3 flex flex-col gap-6 lg:gap-8 min-w-0">
        
        {/* Top 4 Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Borrowed Books Card */}
          <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 flex flex-col gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-[#808080] uppercase tracking-wider">Borrowed Books</span>
              <div className="w-8 h-8 bg-[#F8F9FA] rounded-xl flex items-center justify-center text-[#1B1B1B] border border-[#EAEAEA]">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xl font-extrabold text-[#1B1B1B] leading-none tracking-tight">{stats.borrowedBooks.value}</span>
              <span className="text-[10px] text-[#808080] font-medium leading-none">books borrowed</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 border-t border-[#F1F3F5] pt-3">
              <span className="text-[9px] bg-green-50 border border-green-100 text-green-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" weight="bold" />
                {stats.borrowedBooks.change}
              </span>
              <span className="text-[9px] text-[#808080] font-semibold">{stats.borrowedBooks.time}</span>
            </div>
          </div>

          {/* Overdue Returns Card */}
          <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 flex flex-col gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-[#808080] uppercase tracking-wider">Overdue Returns</span>
              <div className="w-8 h-8 bg-[#F8F9FA] rounded-xl flex items-center justify-center text-[#1B1B1B] border border-[#EAEAEA]">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xl font-extrabold text-[#1B1B1B] leading-none tracking-tight">{stats.overdueReturns.value}</span>
              <span className="text-[10px] text-[#808080] font-medium leading-none">overdue items</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 border-t border-[#F1F3F5] pt-3">
              <span className="text-[9px] bg-green-50 border border-green-100 text-green-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowDownRight className="w-2.5 h-2.5" weight="bold" />
                {stats.overdueReturns.change}
              </span>
              <span className="text-[9px] text-[#808080] font-semibold">{stats.overdueReturns.time}</span>
            </div>
          </div>

          {/* Total Visitors Card */}
          <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 flex flex-col gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-[#808080] uppercase tracking-wider">Total Visitors</span>
              <div className="w-8 h-8 bg-[#F8F9FA] rounded-xl flex items-center justify-center text-[#1B1B1B] border border-[#EAEAEA]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xl font-extrabold text-[#1B1B1B] leading-none tracking-tight">{stats.totalVisitors.value}</span>
              <span className="text-[10px] text-[#808080] font-medium leading-none">this month</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 border-t border-[#F1F3F5] pt-3">
              <span className="text-[9px] bg-red-50 border border-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowDownRight className="w-2.5 h-2.5" weight="bold" />
                {stats.totalVisitors.change}
              </span>
              <span className="text-[9px] text-[#808080] font-semibold">{stats.totalVisitors.time}</span>
            </div>
          </div>

          {/* Total Books Card */}
          <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 flex flex-col gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-start">
              <span className="text-[11px] font-bold text-[#808080] uppercase tracking-wider">Total Books</span>
              <div className="w-8 h-8 bg-[#F8F9FA] rounded-xl flex items-center justify-center text-[#1B1B1B] border border-[#EAEAEA]">
                <BookOpen className="w-4 h-4" weight="fill" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-2xl font-extrabold text-[#1B1B1B] leading-none tracking-tight">{stats.totalBooks.value}</span>
              <span className="text-[10px] text-[#808080] font-medium leading-none">in collection</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 border-t border-[#F1F3F5] pt-3">
              <span className="text-[9px] bg-green-50 border border-green-100 text-green-600 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight className="w-2.5 h-2.5" weight="bold" />
                {stats.totalBooks.change}
              </span>
              <span className="text-[9px] text-[#808080] font-semibold">{stats.totalBooks.time}</span>
            </div>
          </div>

        </div>

        {/* Row 2: Usage Trends & Revenue Area Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Library Usage Trends Chart Card */}
          <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-6 relative">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-[#1B1B1B]">Library Usage Trends</h3>
              <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2.5 py-1 text-[10px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
                <span>Last Week</span>
                <CaretDown className="w-3 h-3 text-[#808080]" />
              </div>
            </div>
            
            {/* Chart Legend */}
            <div className="flex gap-4 text-[10px] font-bold text-[#6E6E6E]">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded bg-[#E5E7EB]" />
                <span>Visitors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded bg-[#FA5A3C]" />
                <span>Borrowers</span>
              </div>
            </div>

            {/* Custom SVG/CSS Bar Chart Grid */}
            <div className="h-44 w-full flex items-end justify-between px-2 pt-6 relative border-b border-[#EAEAEA]">
              
              {/* Y-axis Guides */}
              <div className="absolute inset-x-0 top-0 flex flex-col justify-between h-full pointer-events-none text-[8px] font-mono font-bold text-[#A0A0A0] text-left">
                <div className="border-b border-[#F1F3F5] w-full pb-0.5">100</div>
                <div className="border-b border-[#F1F3F5] w-full pb-0.5">75</div>
                <div className="border-b border-[#F1F3F5] w-full pb-0.5">50</div>
                <div className="border-b border-[#F1F3F5] w-full pb-0.5">25</div>
                <div className="w-full pb-0.5">0</div>
              </div>

              {trendsData.map((data, idx) => {
                const isHovered = hoveredTrendIdx === idx || (hoveredTrendIdx === null && idx === 4); // Default Thu hovered in Figma
                return (
                  <div
                    key={data.day}
                    className="flex flex-col items-center gap-2 z-10 w-[12%] relative"
                    onMouseEnter={() => setHoveredTrendIdx(idx)}
                    onMouseLeave={() => setHoveredTrendIdx(null)}
                  >
                    
                    {/* Double Bars */}
                    <div className="h-32 w-full flex items-end justify-center gap-1">
                      
                      {/* Visitors bar (gray) */}
                      <div 
                        style={{ height: `${data.visitors}%` }} 
                        className={`w-2.5 rounded-t-full transition-all duration-300 ${
                          isHovered ? 'bg-[#CBD5E1]' : 'bg-[#E2E8F0]'
                        }`}
                      />

                      {/* Borrowers bar (orange) */}
                      <div 
                        style={{ height: `${data.borrowers}%` }} 
                        className={`w-2.5 rounded-t-full transition-all duration-300 ${
                          isHovered ? 'bg-[#FF6B4A]' : 'bg-[#FA5A3C]'
                        }`}
                      />

                    </div>

                    {/* Tooltip Overlay (matching Figma Thursday) */}
                    {isHovered && (
                      <div className="absolute bottom-36 left-1/2 -translate-x-1/2 bg-white border border-[#EAEAEA] rounded-lg shadow-xl p-2.5 z-20 flex flex-col gap-1 w-32 text-left animate-in fade-in zoom-in-95 duration-100">
                        <span className="text-[9px] font-bold text-[#808080] font-mono leading-none">Thu, 27 Sept 2025</span>
                        <div className="flex flex-col gap-0.5 mt-1 text-[10px]">
                          <div className="flex justify-between font-bold text-[#1B1B1B]">
                            <span className="text-[#808080] font-medium">Visitors</span>
                            <span>{data.visitors}</span>
                          </div>
                          <div className="flex justify-between font-bold text-[#FA5A3C]">
                            <span className="text-[#808080] font-medium">Borrowers</span>
                            <span>{data.borrowers}</span>
                          </div>
                        </div>
                        {/* Tooltip caret */}
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r border-b border-[#EAEAEA] rotate-45" />
                      </div>
                    )}

                    {/* Label */}
                    <span className="text-[9px] font-bold text-[#808080] font-mono">{data.day}</span>
                  </div>
                );
              })}

            </div>

          </div>

          {/* Revenue Area Chart Card */}
          <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-[#1B1B1B]">Revenue</h3>
              <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2.5 py-1 text-[10px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
                <span>Last 8 Months</span>
                <CaretDown className="w-3 h-3 text-[#808080]" />
              </div>
            </div>

            {/* Glowing Peak Value */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[#1B1B1B] tracking-tight">$7,598</span>
              <span className="text-[9px] text-[#FA5A3C] font-bold uppercase tracking-wider">Peak in Jun</span>
            </div>

            {/* Custom SVG Line Area Chart */}
            <div className="h-32 w-full pt-4 relative border-b border-[#EAEAEA]">
              <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                <defs>
                  {/* Revenue area fill gradient */}
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FA5A3C" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#FA5A3C" stopOpacity="0" />
                  </linearGradient>
                </defs>
                
                {/* Horizontal Guides */}
                <line x1="0" y1="30" x2="500" y2="30" stroke="#F1F3F5" strokeWidth="1" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#F1F3F5" strokeWidth="1" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#F1F3F5" strokeWidth="1" />

                {/* Area path */}
                <path 
                  d="M 10 110 C 70 80, 100 95, 140 70 C 180 80, 220 40, 260 25 C 300 45, 340 50, 380 40 C 420 55, 460 30, 490 35 L 490 120 L 10 120 Z" 
                  fill="url(#revGrad)" 
                />

                {/* Line path */}
                <path 
                  d="M 10 110 C 70 80, 100 95, 140 70 C 180 80, 220 40, 260 25 C 300 45, 340 50, 380 40 C 420 55, 460 30, 490 35" 
                  fill="none" 
                  stroke="#FA5A3C" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />

                {/* Jun peak glowing marker (260, 25) */}
                <circle cx="260" cy="25" r="7" fill="#FA5A3C" stroke="white" strokeWidth="2" className="shadow-lg" />
                <circle cx="260" cy="25" r="14" fill="#FA5A3C" opacity="0.15" />
              </svg>

              {/* X-axis Labels */}
              <div className="absolute inset-x-0 -bottom-6 flex justify-between px-2 text-[9px] font-bold text-[#808080] font-mono">
                {revenueData.map(d => (
                  <span key={d.month}>{d.month}</span>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Row 3: Book Categories & Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-2">
          
          {/* Book Categories (Spans 3 columns) */}
          <div className="lg:col-span-3 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-[#1B1B1B]">Book Categories</h3>
              <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2.5 py-1 text-[10px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
                <span>Last Week</span>
                <CaretDown className="w-3 h-3 text-[#808080]" />
              </div>
            </div>

            {/* Figma-style Dashed Indicator Bar */}
            <div className="w-full flex gap-[2px] h-9 rounded-md overflow-hidden bg-slate-50 border border-slate-100 p-[3px]">
              {categoryPercentages.map((cat, catIdx) => {
                // Determine width segment
                return (
                  <div 
                    key={cat.label} 
                    style={{ width: `${cat.value}%` }} 
                    className={`h-full flex gap-[2px]`}
                  >
                    {/* Render mini dashed subdivisions */}
                    {Array.from({ length: Math.ceil(cat.value * 0.7) }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`flex-1 h-full rounded-sm opacity-90 hover:opacity-100 transition-opacity ${
                          catIdx === 0 ? 'bg-[#FA5A3C]' :
                          catIdx === 1 ? 'bg-[#3A6073]' :
                          catIdx === 2 ? 'bg-[#3CA55C]' :
                          catIdx === 3 ? 'bg-[#E5A93B]' :
                          catIdx === 4 ? 'bg-[#8E44AD]' :
                          'bg-[#A0A0A0]'
                        }`}
                      />
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Category Legend list (2 columns layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {categoryPercentages.map((cat, catIdx) => {
                const bulletColors = [
                  'bg-[#FA5A3C]',
                  'bg-[#3A6073]',
                  'bg-[#3CA55C]',
                  'bg-[#E5A93B]',
                  'bg-[#8E44AD]',
                  'bg-[#A0A0A0]'
                ];
                return (
                  <div key={cat.label} className="flex items-start gap-3">
                    <div className={`w-3.5 h-3.5 rounded-md ${bulletColors[catIdx]} shrink-0 mt-0.5`} />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1B1B1B]">{cat.label}</span>
                      <span className="text-[10px] text-[#808080] font-semibold mt-0.5">
                        {cat.value}% — <span className="font-mono">{cat.books}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Revenue Breakdown Donut (Spans 2 columns) */}
          <div className="lg:col-span-2 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-extrabold text-[#1B1B1B]">Revenue Breakdown</h3>
              <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2.5 py-1 text-[10px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
                <span>This Month</span>
                <CaretDown className="w-3 h-3 text-[#808080]" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              {/* Donut Chart (SVG Circle) */}
              <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#F1F3F5" strokeWidth="4.2" />
                  
                  {/* Membership segment (60%): color #FA5A3C */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#FA5A3C" strokeWidth="4.2" 
                    strokeDasharray="60 40" strokeDashoffset="0" 
                  />
                  {/* Fines segment (20%): color #3A6073 */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3A6073" strokeWidth="4.2" 
                    strokeDasharray="20 80" strokeDashoffset="-60" 
                  />
                  {/* Events segment (12%): color #E5A93B */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#E5A93B" strokeWidth="4.2" 
                    strokeDasharray="12 88" strokeDashoffset="-80" 
                  />
                  {/* Others segment (8%): color #BDC3C7 */}
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#BDC3C7" strokeWidth="4.2" 
                    strokeDasharray="8 92" strokeDashoffset="-92" 
                  />
                </svg>
                
                {/* Center text inside donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-extrabold text-[#1B1B1B]">$12,450</span>
                  <span className="text-[7px] font-bold text-[#808080] uppercase tracking-wide">Total Revenue</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="flex flex-col gap-2 flex-1">
                {[
                  { label: "Membership", pct: 60, val: "$7.470", dot: "bg-[#FA5A3C]" },
                  { label: "Fines", pct: 20, val: "$2.490", dot: "bg-[#3A6073]" },
                  { label: "Events", pct: 12, val: "$1.494", dot: "bg-[#E5A93B]" },
                  { label: "Others", pct: 8, val: "$996", dot: "bg-[#BDC3C7]" },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between gap-1 text-[10px]">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className={`w-2 h-2 rounded-full ${item.dot}`} />
                      <span className="font-bold text-[#6E6E6E]">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono font-bold text-[#1B1B1B]">
                      <span>{item.val}</span>
                      <span className="text-[8px] text-[#A0A0A0] font-normal">({item.pct}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Row 4: Library Activity Table */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-6 mt-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-[#1B1B1B]">Library Activity</h3>
            <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2.5 py-1 text-[10px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
              <span>Last Week</span>
              <CaretDown className="w-3 h-3 text-[#808080]" />
            </div>
          </div>

          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#F1F3F5] pb-3 text-[10px] font-bold uppercase tracking-wider text-[#808080]">
                  <th className="pb-3 pr-4">Book</th>
                  <th className="pb-3 px-4">Member Info</th>
                  <th className="pb-3 px-4">Borrow & Due Date</th>
                  <th className="pb-3 px-4">Return Date</th>
                  <th className="pb-3 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5] text-xs font-sans">
                {displayActivities.map(act => (
                  <tr key={act.id} className="hover:bg-[#FAF9F6]/30 transition-colors">
                    
                    {/* Book */}
                    <td className="py-3.5 pr-4 flex items-center gap-3">
                      {/* Mini Book Cover mockup */}
                      <div className={`w-8 h-11 rounded bg-gradient-to-br ${act.coverGradient} border border-slate-200/50 flex items-center justify-center p-0.5 shadow-sm shrink-0 overflow-hidden text-[6px] font-display font-extrabold text-slate-800 text-center leading-tight relative`}>
                        <div className="absolute inset-0 bg-[#3D1E1E]/5" />
                        {act.bookTitle.slice(0, 10)}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-extrabold text-[#1B1B1B]">{act.bookTitle}</span>
                        <span className="text-[10px] text-[#808080] font-medium mt-0.5">{act.bookAuthor}</span>
                      </div>
                    </td>

                    {/* Member Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        {/* Mini Avatar */}
                        <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          <span className="text-[8px] font-bold text-slate-500 font-mono">{act.memberName.split(' ').map(n=>n[0]).join('')}</span>
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

                    {/* Borrow & Due Date */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1B1B1B] text-[10px]">
                      {act.borrowDate} <span className="text-[#A0A0A0] font-normal mx-1">—</span> {act.dueDate}
                    </td>

                    {/* Return Date */}
                    <td className="py-3.5 px-4 font-mono text-[10px] text-[#6E6E6E]">
                      {act.returnDate}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 pl-4 text-right">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        act.status === 'returned' ? 'bg-green-50 border border-green-100 text-green-600' :
                        act.status === 'overdue' ? 'bg-red-50 border border-red-100 text-red-600' :
                        'bg-amber-50 border border-amber-100 text-amber-600'
                      }`}>
                        {act.status}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

      {/* Right Column (Sidebar widgets - spans 1 column) */}
      <div className="flex flex-col gap-6 lg:gap-8 xl:sticky xl:top-[88px] h-fit">
        
        {/* Top Borrowed Books widget */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-[#1B1B1B]">Top Borrowed Books</h3>
            <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
              <span>This Month</span>
              <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
            </div>
          </div>

          {/* Book Items List */}
          <div className="flex flex-col gap-4">
            {[
              {
                id: "BK-10234",
                title: "Everything Kimchi",
                author: "Olivia Wilson",
                rating: 4.9,
                borrowers: 128,
                gradient: "from-orange-400 to-amber-500",
                illustration: "🥬"
              },
              {
                id: "BK-09876",
                title: "My Story",
                author: "Olivia Wilson",
                rating: 4.8,
                borrowers: 113,
                gradient: "from-teal-400 to-emerald-500",
                illustration: "📖"
              }
            ].map(book => (
              <div key={book.id} className="flex gap-3.5 items-center">
                {/* Book cover graphic */}
                <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${book.gradient} border border-slate-200/50 flex flex-col justify-between p-2 shadow-md shrink-0 relative overflow-hidden text-white`}>
                  <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                  <span className="text-[12px] leading-none block">{book.illustration}</span>
                  <span className="text-[6px] font-extrabold tracking-wide uppercase leading-none opacity-85 mt-auto">
                    {book.title.slice(0, 10)}
                  </span>
                </div>
                
                {/* Book Details */}
                <div className="flex flex-col text-left flex-1 min-w-0">
                  <h4 className="font-extrabold text-xs text-[#1B1B1B] truncate leading-tight">{book.title}</h4>
                  <span className="text-[10px] text-[#808080] font-semibold mt-0.5">{book.author}</span>
                  
                  {/* Rating + Borrowers row */}
                  <div className="flex items-center gap-3 mt-1.5 text-[9px] font-bold text-[#808080]">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star className="w-3.5 h-3.5" weight="fill" />
                      <span>{book.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{book.borrowers} Borrowers</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Top Authors widget */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-[#1B1B1B]">Top Authors</h3>
            <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
              <span>This Week</span>
              <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
            </div>
          </div>

          {/* Authors List */}
          <div className="flex flex-col gap-4">
            {[
              { name: "Ava Thornton", books: 6, borrowers: 365, initials: "AT", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
              { name: "Leo Vance", books: 5, borrowers: 342, initials: "LV", color: "bg-rose-50 text-rose-600 border-rose-100" },
              { name: "Mira Ellison", books: 4, borrowers: 326, initials: "ME", color: "bg-amber-50 text-amber-600 border-amber-100" }
            ].map(auth => (
              <div key={auth.name} className="flex justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  {/* Initials Avatar */}
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono font-bold text-[10px] ${auth.color} shrink-0`}>
                    {auth.initials}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-extrabold text-xs text-[#1B1B1B]">{auth.name}</span>
                    <span className="text-[10px] text-[#808080] font-semibold mt-0.5">{auth.books} Books</span>
                  </div>
                </div>
                
                {/* Borrower count metric badge */}
                <div className="text-right">
                  <span className="font-mono font-bold text-xs text-[#1B1B1B] block">{auth.borrowers}</span>
                  <span className="text-[8px] text-[#808080] font-bold uppercase tracking-wider mt-0.5 block">Borrowers</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Recent Activities widget */}
        <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-extrabold text-[#1B1B1B]">Recent Activities</h3>
            <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
              <span>This Week</span>
              <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="flex flex-col gap-5 relative pl-4 text-left font-sans">
            {/* Timeline Vertical bar line */}
            <div className="absolute left-1.5 top-2.5 bottom-2.5 w-[1.5px] bg-[#EAEAEA]" />

            {[
              {
                id: "log-1",
                title: "Inventory Updated",
                desc: "Admin added 15 new books to the \"Science & Tech\" category",
                time: "Sept 27, 2025 – 09:15 AM",
                iconColor: "bg-[#FA5A3C]"
              },
              {
                id: "log-2",
                title: "New Member Registered",
                desc: "Olive James (MBR-4521) signed up for a Standard membership",
                time: "Sept 27, 2025 – 08:50 AM",
                iconColor: "bg-blue-500"
              },
              {
                id: "log-3",
                title: "Book Returned",
                desc: "\"Echoes of Astra\" returned by Livia Hart (MBR-2081)",
                time: "Sept 26, 2025 – 05:20 PM",
                iconColor: "bg-emerald-500"
              }
            ].map(log => (
              <div key={log.id} className="relative flex flex-col gap-1">
                {/* Glowing Dot on timeline */}
                <div className={`absolute -left-[18px] top-1.5 w-2 h-2 rounded-full ${log.iconColor} border border-white ring-4 ring-slate-50`} />
                
                <h4 className="font-extrabold text-xs text-[#1B1B1B] leading-none">{log.title}</h4>
                <p className="text-[10px] text-[#6E6E6E] leading-relaxed font-semibold mt-1">
                  {log.desc}
                </p>
                <span className="text-[8px] text-[#A0A0A0] font-bold font-mono tracking-wide mt-1 block">
                  {log.time}
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
