import React, { useState, useEffect } from 'react';
import { 
  MagnifyingGlass, 
  Funnel, 
  CaretDown, 
  CaretLeft, 
  CaretRight, 
  FilePdf, 
  DownloadSimple
} from '@phosphor-icons/react';
import type { Book, BorrowRequest, UserAccount } from '../../data/mockDb';

interface AdminSupplyProps {
  books: Book[];
  allTransactions: BorrowRequest[];
  members: UserAccount[];
}

interface AcquisitionLog {
  invoiceNumber: string;
  vendorName: string;
  totalBooks: number;
  fileName: string;
  acquisitionDate: string;
  purchasePrice: number; // in USD
  fundingSource: string;
}

const initialAcquisitions: AcquisitionLog[] = [
  { invoiceNumber: "INV-AUR-1357", vendorName: "Aurora Books Co.", totalBooks: 320, fileName: "aurora_books_q1.pdf", acquisitionDate: "Jan 15, 2035", purchasePrice: 4800.00, fundingSource: "City Library Budget" },
  { invoiceNumber: "INV-NEB-9884", vendorName: "Nebula Press Distribution", totalBooks: 275, fileName: "nebula_batch_3.pdf", acquisitionDate: "Feb 10, 2035", purchasePrice: 4125.00, fundingSource: "Local Education Grant" },
  { invoiceNumber: "INV-GRV-2235", vendorName: "GroveLine Publishing", totalBooks: 200, fileName: "groveline_list.pdf", acquisitionDate: "Mar 05, 2035", purchasePrice: 3100.00, fundingSource: "City Library Budget" },
  { invoiceNumber: "INV-SKY-7642", vendorName: "Skybound Learning Partners", totalBooks: 150, fileName: "skybound_batch2.pdf", acquisitionDate: "Apr 18, 2035", purchasePrice: 2250.00, fundingSource: "State Education Fund" },
  { invoiceNumber: "INV-HOL-4519", vendorName: "Hollow House Publishing", totalBooks: 180, fileName: "hollow_house_q2.pdf", acquisitionDate: "May 02, 2035", purchasePrice: 2700.00, fundingSource: "Library Reserve" },
  { invoiceNumber: "INV-FNF-6678", vendorName: "Forge & Feather Supplies", totalBooks: 210, fileName: "forge_list.pdf", acquisitionDate: "Jun 09, 2035", purchasePrice: 3350.00, fundingSource: "City Library Budget" },
  { invoiceNumber: "INV-GRN-1229", vendorName: "Greenline Books", totalBooks: 135, fileName: "greenline_books.pdf", acquisitionDate: "Jul 01, 2035", purchasePrice: 2025.00, fundingSource: "Cultural Literacy Grant" },
  { invoiceNumber: "INV-OBS-2093", vendorName: "Obsidian Edge Distributors", totalBooks: 190, fileName: "obsidian_batch.pdf", acquisitionDate: "Jul 27, 2035", purchasePrice: 2900.00, fundingSource: "Library Reserve" }
];

export const AdminSupply: React.FC<AdminSupplyProps> = () => {
  const [acquisitionsList, setAcquisitionsList] = useState<AcquisitionLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [fundingFilter, setFundingFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Initialize acquisitions list from localstorage if present
  useEffect(() => {
    const stored = localStorage.getItem('lib_acquisitions');
    if (stored) {
      try {
        setAcquisitionsList(JSON.parse(stored));
      } catch {
        setAcquisitionsList(initialAcquisitions);
        localStorage.setItem('lib_acquisitions', JSON.stringify(initialAcquisitions));
      }
    } else {
      setAcquisitionsList(initialAcquisitions);
      localStorage.setItem('lib_acquisitions', JSON.stringify(initialAcquisitions));
    }
  }, []);

  // Filter logs
  const filteredList = acquisitionsList.filter(item => {
    const matchesSearch = item.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFunding = fundingFilter === 'All' || item.fundingSource === fundingFilter;
    
    return matchesSearch && matchesFunding;
  });

  // Pagination calculation
  const totalResults = filteredList.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const paginatedLogs = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDownloadFile = (fileName: string) => {
    alert(`Downloading acquisition document "${fileName}"...`);
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 font-sans text-left">
      
      {/* Header Breadcrumbs */}
      <div className="flex items-center justify-between -mt-2">
        <div className="flex items-center gap-2 text-[10px] lg:text-xs font-bold text-[#808080]">
          <span className="cursor-pointer hover:text-[#FA5A3C] transition-colors">Dashboard</span>
          <span>/</span>
          <span className="text-[#1B1B1B] font-extrabold">Supply & Acquisition</span>
        </div>
      </div>

      {/* Top section widgets: Suppliers, Line Charts, Donut charts */}
      <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 lg:gap-8">
        
        {/* Widget 1: Top Suppliers (4 cols) */}
        <div className="xl:col-span-4 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold text-[#1B1B1B] uppercase tracking-wider">Top Suppliers</h3>
            <span className="text-[14px] font-extrabold text-[#1B1B1B] flex items-center gap-1">•••</span>
          </div>

          <div className="flex flex-col gap-1 text-left">
            <span className="text-[9px] text-[#808080] font-bold uppercase tracking-wider leading-none">Total Supplied Books</span>
            <span className="text-xl font-extrabold text-[#1B1B1B] mt-1.5 leading-none">18,750 <span className="text-[9px] text-[#808080] font-semibold">Books</span></span>
          </div>

          {/* Horizontal proportion bars */}
          <div className="w-full flex rounded-lg overflow-hidden h-6 bg-slate-100 mt-1">
            <div className="bg-[#223354]" style={{ width: '31%' }} title="Aurora Books Co. (31%)" />
            <div className="bg-[#FF6B4A]" style={{ width: '25%' }} title="Nebula Press (25%)" />
            <div className="bg-[#F8A899]" style={{ width: '20%' }} title="GroveLine Publishing (20%)" />
            <div className="bg-[#A0AEC0]" style={{ width: '9%' }} title="Skyhigh Learning Partners (9%)" />
            <div className="bg-[#E2E8F0]" style={{ width: '15%' }} title="Others (15%)" />
          </div>

          {/* Supplier details list */}
          <div className="flex flex-col gap-2.5 mt-2.5 text-[10px] font-semibold text-slate-800">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-[#223354] shrink-0" />
                <span className="text-slate-800 font-bold">Aurora Books Co.</span>
              </div>
              <span className="font-mono text-[#808080]">5,875 <span className="text-[#1B1B1B] font-extrabold ml-1.5">31%</span></span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-[#FF6B4A] shrink-0" />
                <span className="text-slate-800 font-bold">Nebula Press Distribution</span>
              </div>
              <span className="font-mono text-[#808080]">4,650 <span className="text-[#1B1B1B] font-extrabold ml-1.5">25%</span></span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-[#F8A899] shrink-0" />
                <span className="text-slate-800 font-bold">GroveLine Publishing</span>
              </div>
              <span className="font-mono text-[#808080]">3,825 <span className="text-[#1B1B1B] font-extrabold ml-1.5">20%</span></span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-[#A0AEC0] shrink-0" />
                <span className="text-slate-800 font-bold">Skyhigh Learning Partners</span>
              </div>
              <span className="font-mono text-[#808080]">1,750 <span className="text-[#1B1B1B] font-extrabold ml-1.5">9%</span></span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-[#E2E8F0] shrink-0" />
                <span className="text-slate-800 font-bold">Others</span>
              </div>
              <span className="font-mono text-[#808080]">2,650 <span className="text-[#1B1B1B] font-extrabold ml-1.5">15%</span></span>
            </div>
          </div>

        </div>

        {/* Widget 2: Acquisitions Overview Double Line Chart (3 cols) */}
        <div className="xl:col-span-3 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold text-[#1B1B1B] uppercase tracking-wider">Acquisitions Overview</h3>
            <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
              <span>Last 8 Months</span>
              <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
            </div>
          </div>

          {/* Legends */}
          <div className="flex gap-4 text-[9px] font-bold uppercase tracking-wider text-[#808080] leading-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-[#223354]" />
              <span>Print</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-[#FF6B4A]" />
              <span>Digital</span>
            </div>
          </div>

          {/* SVG line chart */}
          <div className="h-28 w-full pt-4 relative border-b border-[#F1F3F5]">
            <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
              <line x1="0" y1="15" x2="200" y2="15" stroke="#F8F9FA" strokeWidth="1" />
              <line x1="0" y1="30" x2="200" y2="30" stroke="#F8F9FA" strokeWidth="1" />
              <line x1="0" y1="45" x2="200" y2="45" stroke="#F8F9FA" strokeWidth="1" />
              
              {/* Series 1: Print (Blue line) */}
              <path 
                d="M 10 32 C 30 20, 45 28, 65 31 C 85 24, 105 38, 125 45 C 145 42, 175 22, 190 28" 
                fill="none" 
                stroke="#223354" 
                strokeWidth="1.8" 
                strokeLinecap="round"
              />
              
              {/* Series 2: Digital (Orange line) */}
              <path 
                d="M 10 40 C 30 38, 45 22, 65 31 C 85 35, 105 12, 125 15 C 145 32, 175 22, 190 22" 
                fill="none" 
                stroke="#FF6B4A" 
                strokeWidth="1.8" 
                strokeLinecap="round"
              />
              
              {/* Tooltip marker lines at April (105) */}
              <line x1="105" y1="0" x2="105" y2="60" stroke="#EAEAEA" strokeWidth="0.8" strokeDasharray="2,2" />
              <circle cx="105" cy="38" r="2.5" fill="#223354" stroke="white" strokeWidth="0.8" />
              <circle cx="105" cy="12" r="2.5" fill="#FF6B4A" stroke="white" strokeWidth="0.8" />
            </svg>

            {/* Peak Tooltip April */}
            <div className="absolute top-0 left-[45%] bg-white border border-[#EAEAEA] rounded shadow-md px-1.5 py-0.5 text-[8px] font-bold text-left flex flex-col font-sans z-10 w-16">
              <span className="text-[#808080] font-medium leading-none">April 2035</span>
              <span className="text-[#FF6B4A] mt-0.5 leading-none">Digital: 342</span>
              <span className="text-[#223354] mt-0.5 leading-none">Print: 163</span>
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

        {/* Widget 3: Funding Source Breakdown Donut Chart (3 cols) */}
        <div className="xl:col-span-3 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4 text-center">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-extrabold text-[#1B1B1B] uppercase tracking-wider">Funding Source Breakdown</h3>
            <span className="text-[14px] font-extrabold text-[#1B1B1B] flex items-center gap-1">•••</span>
          </div>

          <div className="relative w-28 h-28 mx-auto mt-1 flex items-center justify-center">
            {/* SVG circular donut chart */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              {/* Purchase (35%) */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#223354" strokeWidth="4" strokeDasharray="35 65" strokeDashoffset="0" />
              {/* Donation (30%) */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#FF6B4A" strokeWidth="4" strokeDasharray="30 70" strokeDashoffset="-35" />
              {/* Grant (20%) */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#A0AEC0" strokeWidth="4" strokeDasharray="20 80" strokeDashoffset="-65" />
              {/* Exchange (15%) */}
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="4" strokeDasharray="15 85" strokeDashoffset="-85" />
            </svg>
          </div>

          {/* Legend indicators */}
          <div className="grid grid-cols-2 gap-2 text-[9px] font-bold text-left text-slate-800 uppercase mt-1">
            <div className="bg-slate-50 border border-slate-200/50 rounded-lg p-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-[#223354] shrink-0" />
              <span className="truncate">35% Purchase</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/50 rounded-lg p-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-[#FF6B4A] shrink-0" />
              <span className="truncate">30% Donation</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/50 rounded-lg p-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-[#A0AEC0] shrink-0" />
              <span className="truncate">20% Grant</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/50 rounded-lg p-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-[#E2E8F0] shrink-0" />
              <span className="truncate">15% Exchange</span>
            </div>
          </div>

        </div>

      </div>

      {/* Main Table: Supply & Acquisition Logs */}
      <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 lg:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-6">
        
        {/* Toolbar row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="text-sm font-extrabold text-[#1B1B1B]">Supply & Acquisition</h3>
          
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
                placeholder="Search a vendor"
                className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl pl-9.5 pr-4 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold"
              />
            </div>

            {/* Funding Filter */}
            <div className="relative">
              <select
                value={fundingFilter}
                onChange={(e) => {
                  setFundingFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-[#EAEAEA] rounded-xl pl-8 pr-8 py-2 text-xs text-[#6E6E6E] font-bold focus:outline-none focus:border-[#FA5A3C] transition-colors cursor-pointer appearance-none"
              >
                <option value="All">All Fundings</option>
                <option value="City Library Budget">City Library Budget</option>
                <option value="Local Education Grant">Local Education Grant</option>
                <option value="State Education Fund">State Education Fund</option>
                <option value="Library Reserve">Library Reserve</option>
                <option value="Cultural Literacy Grant">Cultural Literacy Grant</option>
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
                <th className="pb-3 pr-4">Vendor</th>
                <th className="pb-3 px-4">Total Books</th>
                <th className="pb-3 px-4">Book List File</th>
                <th className="pb-3 px-4">Acquisition Date</th>
                <th className="pb-3 px-4">Purchase Price</th>
                <th className="pb-3 px-4">Invoice Number</th>
                <th className="pb-3 pl-4 text-right">Funding Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5] text-xs font-sans">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#808080] font-semibold">
                    No acquisition logs match your filters.
                  </td>
                </tr>
              ) : (
                paginatedLogs.map(item => {
                  return (
                    <tr key={item.invoiceNumber} className="hover:bg-[#FAF9F6]/30 transition-colors">
                      <td className="py-3.5 px-4 pl-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/50 flex items-center justify-center overflow-hidden shrink-0 text-slate-500 font-extrabold text-[10px]">
                            {item.vendorName.split(' ').map(n=>n[0]).join('')}
                          </div>
                          <span className="font-extrabold text-[#1B1B1B] text-sm">{item.vendorName}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{item.totalBooks}</td>
                      <td className="py-3.5 px-4">
                        <div 
                          onClick={() => handleDownloadFile(item.fileName)}
                          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg px-2.5 py-1 w-fit font-bold text-[#FA0F00] text-[10px] cursor-pointer transition-all btn-pressable shrink-0"
                        >
                          <FilePdf className="w-3.5 h-3.5" />
                          <span className="font-mono">{item.fileName}</span>
                          <DownloadSimple className="w-3 h-3 text-[#FA0F00]" />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[10px] text-[#6E6E6E]">{item.acquisitionDate}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">${item.purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{item.invoiceNumber}</td>
                      <td className="py-3.5 pl-4 text-right font-semibold text-slate-700">{item.fundingSource}</td>
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
