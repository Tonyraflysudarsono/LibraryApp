import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MagnifyingGlass, 
  Plus, 
  CaretDown, 
  CaretLeft, 
  CaretRight, 
  Funnel,
  ArrowLeft,
  Envelope,
  Phone,
  Calendar,
  User,
  UploadSimple,
  Clock,
  Warning,
  Eye
} from '@phosphor-icons/react';
import type { UserAccount } from '../../data/mockDb';

interface AdminMembersProps {
  members: UserAccount[];
  handleRegisterMember: (e: React.FormEvent, memberData: any) => Promise<boolean> | boolean;
  handleToggleMemberStatus: (member: UserAccount) => void;
}

interface MemberStats {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'expired' | 'suspended';
  joinDate: string;
  expiryDate: string;
  membershipType: 'Premium' | 'Standard' | 'Basic';
  borrowed: number;
  overdue: number;
  fines: number; // in IDR
}

const defaultMockMembers: MemberStats[] = [
  { id: 'MBR-2081', name: 'Livia Hart', email: 'livia.hart@email.com', phone: '+62 812 0001 2345', status: 'active', joinDate: '2034-01-10', expiryDate: '2036-01-10', membershipType: 'Premium', borrowed: 42, overdue: 0, fines: 0 },
  { id: 'MBR-1170', name: 'Ezra Nolan', email: 'ezra.nolan@email.com', phone: '+62 812 0002 5678', status: 'active', joinDate: '2034-02-12', expiryDate: '2036-02-12', membershipType: 'Premium', borrowed: 39, overdue: 1, fines: 15000 },
  { id: 'MBR-2389', name: 'Isla Ray', email: 'isla.ray@email.com', phone: '+62 812 0003 8910', status: 'expired', joinDate: '2033-03-05', expiryDate: '2035-03-05', membershipType: 'Standard', borrowed: 37, overdue: 0, fines: 0 },
  { id: 'MBR-4112', name: 'Milo Sharp', email: 'milo.sharp@email.com', phone: '+62 812 0004 1122', status: 'suspended', joinDate: '2034-07-01', expiryDate: '2035-07-01', membershipType: 'Basic', borrowed: 31, overdue: 4, fines: 60000 },
  { id: 'MBR-3021', name: 'Ava Lin', email: 'ava.lin@email.com', phone: '+62 812 0005 3344', status: 'suspended', joinDate: '2034-04-09', expiryDate: '2036-04-09', membershipType: 'Premium', borrowed: 35, overdue: 3, fines: 45000 },
  { id: 'MBR-2759', name: 'Julian Cross', email: 'julian.cross@email.com', phone: '+62 812 0006 5566', status: 'active', joinDate: '2034-05-14', expiryDate: '2035-05-14', membershipType: 'Basic', borrowed: 29, overdue: 0, fines: 0 },
  { id: 'MBR-1945', name: 'Elara Moon', email: 'elara.moon@email.com', phone: '+62 812 0007 7788', status: 'active', joinDate: '2034-06-03', expiryDate: '2035-06-03', membershipType: 'Standard', borrowed: 27, overdue: 0, fines: 15000 },
  { id: 'MBR-3095', name: 'Celine Moore', email: 'celine.moore@email.com', phone: '+62 812 0008 9900', status: 'expired', joinDate: '2032-07-20', expiryDate: '2034-07-20', membershipType: 'Basic', borrowed: 30, overdue: 1, fines: 15000 },
  { id: 'MBR-1643', name: 'Noah Trent', email: 'noah.trent@email.com', phone: '+62 812 0009 1234', status: 'active', joinDate: '2035-03-01', expiryDate: '2036-03-01', membershipType: 'Standard', borrowed: 34, overdue: 2, fines: 30000 },
  { id: 'MBR-2210', name: 'Leo Finch', email: 'leo.finch@email.com', phone: '+62 812 0010 5678', status: 'suspended', joinDate: '2033-08-11', expiryDate: '2035-08-11', membershipType: 'Standard', borrowed: 26, overdue: 4, fines: 60000 },
  { id: 'MBR-3678', name: 'Nova Wells', email: 'nova.wells@email.com', phone: '+62 812 0011 8910', status: 'active', joinDate: '2034-09-17', expiryDate: '2035-09-17', membershipType: 'Basic', borrowed: 22, overdue: 0, fines: 0 }
];

export const AdminMembers: React.FC<AdminMembersProps> = ({
  members,
  handleRegisterMember,
  handleToggleMemberStatus
}) => {
  // Local views: 'list' | 'detail' | 'add'
  const [viewState, setViewState] = useState<'list' | 'detail' | 'add'>('list');
  const [selectedMember, setSelectedMember] = useState<MemberStats | null>(null);

  // Filters & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [membershipFilter, setMembershipFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'borrowed'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;

  // Add Member form state
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '1998-06-21',
    gender: 'Female',
    membershipType: 'Premium' as 'Premium' | 'Standard' | 'Basic',
    amountPaid: '$59',
    paymentMethod: 'Online'
  });

  // Helper to format Date string
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

  // Status Toggler
  const onToggleStatus = () => {
    if (!selectedMember) return;
    const dbMember = members.find(m => m.id === selectedMember.id);
    if (dbMember) {
      handleToggleMemberStatus(dbMember);
      setSelectedMember(prev => {
        if (!prev) return null;
        return {
          ...prev,
          status: prev.status === 'active' ? 'suspended' : 'active'
        };
      });
    } else {
      alert("Status toggle is only supported for registered members.");
    }
  };

  // Compile active members from mockDb and merge with Figma mocks
  const getExtendedMembers = (): MemberStats[] => {
    const dbMembers = members.map(m => {
      // Find matches in figma mock list to inherit membershipType and pre-calc stats
      const mockMatch = defaultMockMembers.find(f => f.id === m.id || f.name.toLowerCase() === m.name.toLowerCase());
      
      const membershipType = (m as any).membershipType || mockMatch?.membershipType || (m.id === 'MEM001' ? 'Premium' : m.id === 'MEM002' ? 'Standard' : 'Basic');
      const status = m.status === 'active' ? 'active' : 'suspended';
      
      const joinDate = m.joinDate || '2035-03-12';
      const jD = new Date(joinDate);
      const eD = new Date(jD);
      eD.setFullYear(jD.getFullYear() + 2);
      const expiryDate = eD.toISOString().split('T')[0];

      return {
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        status: status as any,
        joinDate,
        expiryDate,
        membershipType: membershipType as any,
        borrowed: mockMatch?.borrowed || 4,
        overdue: mockMatch?.overdue || 0,
        fines: mockMatch?.fines || 0
      };
    });

    // Merge databases: prioritize dbMembers, append mock members not in database
    const merged = [...dbMembers];
    defaultMockMembers.forEach(mock => {
      if (!merged.some(m => m.id === mock.id || m.name.toLowerCase() === mock.name.toLowerCase())) {
        merged.push(mock);
      }
    });

    return merged;
  };

  const allCompiledMembers = getExtendedMembers();

  // Filters & Sort logic
  const filteredMembers = allCompiledMembers.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = membershipFilter === 'All' || m.membershipType === membershipFilter;
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
    }
    if (sortBy === 'borrowed') {
      return b.borrowed - a.borrowed;
    }
    return 0;
  });

  // Pagination calculations
  const totalResults = sortedMembers.length;
  const totalPages = Math.ceil(totalResults / itemsPerPage);
  const paginatedMembers = sortedMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate a new sequential Member ID
    const userCount = members.length;
    const generatedId = `MBR-${2000 + userCount * 12 + Math.floor(Math.random() * 9)}`;

    const memberPayload = {
      id: generatedId,
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone,
      pass: 'password',
      role: 'member' as const,
      status: 'active' as const,
      membershipType: newMember.membershipType
    };

    const success = await handleRegisterMember(e, memberPayload);
    if (success) {
      // Clear form
      setNewMember({
        name: '',
        email: '',
        phone: '',
        dob: '1998-06-21',
        gender: 'Female',
        membershipType: 'Premium',
        amountPaid: '$59',
        paymentMethod: 'Online'
      });
      // Switch back to list view
      setViewState('list');
    }
  };

  return (
    <div className="w-full text-left font-sans">
      <AnimatePresence mode="wait">
        
        {/* VIEW 1: MEMBERS DIRECTORY LIST */}
        {viewState === 'list' && (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6"
          >
            {/* Header Breadcrumbs */}
            <div className="flex items-center justify-between -mt-2">
              <div className="flex items-center gap-2 text-[10px] lg:text-xs font-bold text-[#808080]">
                <span className="cursor-pointer hover:text-[#FA5A3C] transition-colors">Dashboard</span>
                <span>/</span>
                <span className="text-[#1B1B1B] font-extrabold">Members</span>
              </div>
            </div>

            {/* Filter Toolbar */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col md:flex-row justify-between items-center gap-4">
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="relative w-full sm:w-56 lg:w-64">
                  <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search a member"
                    className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl pl-9.5 pr-4 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold"
                  />
                </div>

                {/* Membership Type Filter */}
                <div className="relative">
                  <select
                    value={membershipFilter}
                    onChange={(e) => {
                      setMembershipFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-white border border-[#EAEAEA] rounded-xl pl-8 pr-8 py-2 text-xs text-[#6E6E6E] font-bold focus:outline-none focus:border-[#FA5A3C] transition-colors cursor-pointer appearance-none"
                  >
                    <option value="All">All Tiers</option>
                    <option value="Premium">Premium</option>
                    <option value="Standard">Standard</option>
                    <option value="Basic">Basic</option>
                  </select>
                  <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E6E6E] pointer-events-none" />
                  <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6E6E6E] pointer-events-none" />
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
                    <option value="All">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <Funnel className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E6E6E] pointer-events-none" />
                  <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#6E6E6E] pointer-events-none" />
                </div>
              </div>

              {/* Sort & Add Member */}
              <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 text-xs font-bold text-[#808080]">
                  <span>Sort by:</span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e: any) => setSortBy(e.target.value)}
                      className="bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl pl-3 pr-8 py-2 text-xs text-[#1B1B1B] font-extrabold focus:outline-none focus:border-[#FA5A3C] cursor-pointer appearance-none"
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="borrowed">Borrowed</option>
                    </select>
                    <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-[#1B1B1B] pointer-events-none" />
                  </div>
                </div>

                <button
                  onClick={() => setViewState('add')}
                  className="bg-[#FA5A3C] hover:bg-[#E24A2D] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors btn-pressable shadow-sm"
                >
                  <Plus className="w-4 h-4" weight="bold" />
                  <span>Add Member</span>
                </button>
              </div>

            </div>

            {/* Members Directory Table */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="border-b border-[#F1F3F5] text-[10px] font-bold uppercase tracking-wider text-[#808080] bg-[#FAF9F6]/20">
                      <th className="py-4 px-6">Member Info</th>
                      <th className="py-4 px-6">Email / Phone</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6">Join – Expiry Date</th>
                      <th className="py-4 px-6">Borrowed</th>
                      <th className="py-4 px-6">Overdue</th>
                      <th className="py-4 px-6">Fines</th>
                      <th className="py-4 px-6 text-right w-16">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F3F5] text-xs font-sans">
                    {paginatedMembers.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center text-[#808080] font-semibold">
                          No members match your filter choices.
                        </td>
                      </tr>
                    ) : (
                      paginatedMembers.map(m => {
                        const tierColor = m.membershipType === 'Premium' 
                          ? 'bg-[#223354] text-white border-transparent' 
                          : m.membershipType === 'Standard'
                          ? 'bg-[#FA5A3C]/10 text-[#FA5A3C] border-[#FA5A3C]/20'
                          : 'bg-slate-100 text-slate-600 border-slate-200';
                        
                        const statusColor = m.status === 'active' 
                          ? 'text-green-600 font-extrabold' 
                          : m.status === 'expired'
                          ? 'text-red-500 font-extrabold'
                          : 'text-[#E27A1D] font-extrabold';

                        return (
                          <tr key={m.id} className="hover:bg-[#FAF9F6]/30 transition-colors">
                            <td className="py-3 px-6">
                              <div className="flex items-center gap-3">
                                <img
                                  src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${m.name}`}
                                  alt={m.name}
                                  className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 shrink-0"
                                />
                                <div className="flex flex-col text-left">
                                  <span className="font-extrabold text-[#1B1B1B] text-sm leading-tight">{m.name}</span>
                                  <div className="flex items-center gap-1.5 mt-1">
                                    <span className="text-[9px] font-mono font-bold text-[#808080]">{m.id}</span>
                                    <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border leading-none font-mono ${tierColor}`}>
                                      {m.membershipType}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-6 text-[#1B1B1B] font-semibold">
                              <p>{m.email}</p>
                              <p className="text-[10px] text-[#808080] font-mono font-normal mt-0.5">{m.phone}</p>
                            </td>
                            <td className="py-3 px-6">
                              <span className={`text-xs uppercase tracking-wider ${statusColor}`}>
                                {m.status}
                              </span>
                            </td>
                            <td className="py-3 px-6 font-mono font-bold text-[10px] text-[#6E6E6E]">
                              {formatDateStr(m.joinDate)} <span className="text-[#A0A0A0] font-normal mx-1">—</span> {formatDateStr(m.expiryDate)}
                            </td>
                            <td className="py-3 px-6 font-mono font-extrabold text-[#1B1B1B]">{m.borrowed}</td>
                            <td className="py-3 px-6 font-mono font-extrabold">
                              {m.overdue > 0 ? (
                                <span className="text-red-500 font-extrabold">{m.overdue}</span>
                              ) : '0'}
                            </td>
                            <td className="py-3 px-6 font-mono font-extrabold text-[#1B1B1B]">
                              {m.fines === 0 ? '$0.00' : `$${(m.fines / 15000).toFixed(2)}`}
                            </td>
                            <td className="py-3 px-6 text-right">
                              <button
                                onClick={() => {
                                  setSelectedMember(m);
                                  setViewState('detail');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="p-1.5 rounded-lg bg-[#FAF9F6] border border-[#EAEAEA] text-[#FA5A3C] hover:bg-[#FA5A3C] hover:text-white transition-all cursor-pointer flex items-center justify-center btn-pressable"
                                title="View Detail"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F1F3F5] px-6 py-4 text-xs font-semibold text-[#808080]">
                
                <div className="flex items-center gap-1.5">
                  <span>Show</span>
                  <div className="relative">
                    <select 
                      className="bg-white border border-[#EAEAEA] rounded-lg px-2.5 py-1 text-[10px] font-bold text-[#6E6E6E] appearance-none pr-6 cursor-pointer"
                      disabled
                    >
                      <option>{paginatedMembers.length}</option>
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

          </motion.div>
        )}

        {/* VIEW 2: MEMBER DETAILS VIEW */}
        {viewState === 'detail' && selectedMember && (
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
                <span onClick={() => setViewState('list')} className="cursor-pointer hover:text-[#FA5A3C] transition-colors">Dashboard</span>
                <span>/</span>
                <span onClick={() => setViewState('list')} className="cursor-pointer hover:text-[#FA5A3C] transition-colors">Members</span>
                <span>/</span>
                <span className="text-[#1B1B1B] font-extrabold max-w-[200px] truncate">{selectedMember.name} Details</span>
              </div>
              
              <button 
                onClick={() => setViewState('list')}
                className="flex items-center gap-2 text-xs font-bold text-[#6E6E6E] hover:text-[#1B1B1B] transition-colors cursor-pointer bg-white border border-[#EAEAEA] rounded-xl px-4 py-2 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Directory</span>
              </button>
            </div>

            {/* Split layout: Profile block (3 cols) and Main details contents (7 cols) */}
            <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 lg:gap-8">
              
              {/* Left Column - Profile Details card (3 cols) */}
              <div className="xl:col-span-3 flex flex-col gap-6">
                
                <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col items-center text-center">
                  
                  <img
                    src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${selectedMember.name}`}
                    alt={selectedMember.name}
                    className="w-24 h-24 rounded-2xl border border-slate-200 bg-slate-50 shadow-md p-1 shrink-0"
                  />
                  
                  <h3 className="font-extrabold text-lg text-[#1B1B1B] mt-4 leading-tight">{selectedMember.name}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold font-mono text-[#808080]">{selectedMember.id}</span>
                    <span className={`text-[9px] font-mono font-bold uppercase border px-2 py-0.5 rounded ${
                      selectedMember.membershipType === 'Premium' 
                        ? 'bg-[#223354] text-white border-transparent' 
                        : selectedMember.membershipType === 'Standard'
                        ? 'bg-[#FA5A3C]/10 text-[#FA5A3C] border-[#FA5A3C]/20'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {selectedMember.membershipType}
                    </span>
                  </div>

                  {/* General Specs */}
                  <div className="w-full grid grid-cols-1 gap-2 text-xs text-[#1B1B1B] font-semibold border-t border-[#F1F3F5] pt-5 mt-5 text-left">
                    <div className="flex justify-between items-center border-b border-[#F8F9FA] pb-2">
                      <span className="text-[#808080]">Gender</span>
                      <span>Female</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#F8F9FA] pb-2">
                      <span className="text-[#808080]">Date of Birth</span>
                      <span className="font-mono">March 14, 2010</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#F8F9FA] pb-2">
                      <span className="text-[#808080]">Status</span>
                      <span className={`font-bold capitalize ${
                        selectedMember.status === 'active' ? 'text-green-600' : selectedMember.status === 'expired' ? 'text-red-500' : 'text-[#E27A1D]'
                      }`}>{selectedMember.status}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-[#F8F9FA] pb-2">
                      <span className="text-[#808080]">Join Date</span>
                      <span className="font-mono">{formatDateStr(selectedMember.joinDate)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-1">
                      <span className="text-[#808080]">Expiry Date</span>
                      <span className="font-mono">{formatDateStr(selectedMember.expiryDate)}</span>
                    </div>
                  </div>

                  {/* Action Button to toggle status */}
                  <button
                    type="button"
                    onClick={onToggleStatus}
                    className="w-full mt-4 bg-slate-50 hover:bg-slate-100 border border-[#EAEAEA] text-[#1B1B1B] text-[10px] font-bold py-2 rounded-xl transition-colors btn-pressable text-center"
                  >
                    Toggle Active Status
                  </button>

                  {/* Contact Info */}
                  <div className="w-full flex flex-col gap-3.5 border-t border-[#F1F3F5] pt-5 mt-5 text-left">
                    <h4 className="text-[10px] uppercase font-bold text-[#808080] tracking-wider leading-none">Contact Info</h4>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-center shrink-0">
                        <Envelope className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] text-[#808080] font-semibold leading-none">Email Address</span>
                        <span className="text-[11px] font-bold text-slate-800 truncate mt-1">{selectedMember.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-[#FA5A3C]" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] text-[#808080] font-semibold leading-none">Phone Number</span>
                        <span className="text-[11px] font-bold text-slate-800 font-mono mt-1">{selectedMember.phone}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] text-[#808080] font-semibold leading-none">Emergency Contact</span>
                        <span className="text-[11px] font-bold text-slate-800 mt-1">+62 812 3456 7890</span>
                        <span className="text-[8px] text-[#808080] font-medium leading-none mt-0.5">(Amelia Trent - Mother)</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

              {/* Right Column - Detailed contents & metrics (7 cols) */}
              <div className="xl:col-span-7 flex flex-col gap-6 lg:gap-8">
                
                {/* 3 Metrics Cards row */}
                <div className="grid grid-cols-3 gap-4">
                  
                  <div className="bg-white border border-[#EAEAEA] rounded-2xl p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex gap-3.5 items-center">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <Clock className="w-5.5 h-5.5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-[#808080] font-bold uppercase tracking-wide leading-none">Currently Borrowed</span>
                      <span className="text-xl font-extrabold text-[#1B1B1B] mt-1.5">2 books</span>
                    </div>
                  </div>

                  <div className="bg-white border border-[#EAEAEA] rounded-2xl p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex gap-3.5 items-center">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FA5A3C] shrink-0">
                      <Calendar className="w-5.5 h-5.5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-[#808080] font-bold uppercase tracking-wide leading-none">Books Reserved</span>
                      <span className="text-xl font-extrabold text-[#1B1B1B] mt-1.5">3 books</span>
                    </div>
                  </div>

                  <div className="bg-white border border-[#EAEAEA] rounded-2xl p-4.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex gap-3.5 items-center">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                      <Warning className="w-5.5 h-5.5" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-[#808080] font-bold uppercase tracking-wide leading-none">Overdue Books</span>
                      <span className="text-xl font-extrabold text-red-500 mt-1.5">{selectedMember.overdue} books</span>
                    </div>
                  </div>

                </div>

                {/* Split layout: Borrowing trend chart + Insights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Borrowing Trend Column Chart */}
                  <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4 text-left">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-extrabold text-[#1B1B1B] uppercase tracking-wider">Borrowing Trend</h3>
                      <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
                        <span>Last 8 Months</span>
                        <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
                      </div>
                    </div>

                    <div className="h-28 w-full pt-4 relative border-b border-[#F1F3F5] flex items-end justify-between px-1">
                      {/* Grid background lines */}
                      <div className="absolute inset-x-0 top-3 h-[1px] bg-slate-50" />
                      <div className="absolute inset-x-0 top-11 h-[1px] bg-slate-50" />
                      <div className="absolute inset-x-0 top-20 h-[1px] bg-slate-50" />

                      {/* Chart bars */}
                      {[
                        { val: 3, label: 'Jan' },
                        { val: 5, label: 'Feb' },
                        { val: 4, label: 'Mar' },
                        { val: 6, label: 'Apr', active: true },
                        { val: 5, label: 'May' },
                        { val: 4, label: 'Jun' },
                        { val: 7, label: 'Jul' },
                        { val: 6, label: 'Aug' }
                      ].map((item, idx) => {
                        const pct = (item.val / 8) * 100;
                        return (
                          <div key={idx} className="flex flex-col items-center gap-1.5 w-[9%] z-10 relative group">
                            <div 
                              className={`w-full rounded-t-sm transition-all duration-300 ${
                                item.active ? 'bg-[#FA5A3C]' : 'bg-slate-100 hover:bg-slate-200'
                              }`} 
                              style={{ height: `${pct}px` }} 
                            />
                            
                            {/* Hover tooltip for active/april */}
                            {item.active && (
                              <div className="absolute bottom-[105%] bg-white border border-[#EAEAEA] rounded shadow-md px-1.5 py-0.5 text-[8px] font-bold text-left flex flex-col font-sans w-16">
                                <span className="text-[#808080] font-medium leading-none">April 2035</span>
                                <span className="text-[#1B1B1B] mt-0.5 leading-none">{item.val} Books</span>
                              </div>
                            )}

                            <span className="text-[8px] text-[#808080] font-mono font-bold">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Insights card */}
                  <div className="bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4 text-left">
                    <h3 className="text-xs font-extrabold text-[#1B1B1B] uppercase tracking-wider">Insights</h3>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FA5A3C] shrink-0">
                          <Calendar className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[9px] text-[#808080] font-bold uppercase tracking-wide leading-none">Last Visit Date</span>
                          <span className="text-xs font-extrabold text-[#1B1B1B] mt-1">Oct 08, 2035</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5 border-t border-[#F8F9FA] pt-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                          <User className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[9px] text-[#808080] font-bold uppercase tracking-wide leading-none">Most Borrowed Genre</span>
                          <span className="text-xs font-extrabold text-[#1B1B1B] mt-1">Science Fiction</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5 border-t border-[#F8F9FA] pt-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FA5A3C] shrink-0">
                          <UploadSimple className="w-4.5 h-4.5" />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[9px] text-[#808080] font-bold uppercase tracking-wide leading-none">Most Borrowed Author</span>
                          <span className="text-xs font-extrabold text-[#1B1B1B] mt-1">Mira Ellison</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Borrowed Books History and Fines */}
                <div className="grid grid-cols-1 xl:grid-cols-10 gap-6 lg:gap-8">
                  
                  {/* Left Table: Borrowed Books (6 cols) */}
                  <div className="xl:col-span-6 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-[#F1F3F5] pb-3">
                      <h3 className="text-xs font-extrabold text-[#1B1B1B] uppercase tracking-wider">Borrowed Books</h3>
                      <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
                        <span>This Week</span>
                        <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-[#F1F3F5] pb-2 text-[9px] font-bold uppercase tracking-wider text-[#808080]">
                            <th className="pb-2">Book</th>
                            <th className="pb-2">Borrow – Due Date</th>
                            <th className="pb-2">Return Date</th>
                            <th className="pb-2">Status</th>
                            <th className="pb-2 text-right">Fine</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F3F5] font-sans">
                          {[
                            { title: 'My Story', author: 'Leo Vance', bDate: 'Sept 22', dDate: 'Oct 06, 2035', rDate: '—', status: 'Borrowed', fine: 0 },
                            { title: 'Everything Kimchi', author: 'Callen Dray', bDate: 'Sept 10', dDate: 'Sept 24, 2035', rDate: '—', status: 'Overdue', fine: 22500 }, // $1.50 = 22500
                            { title: 'Where The Flowers Bloom', author: 'Elara Quinn', bDate: 'Aug 15', dDate: 'Aug 29, 2035', rDate: 'Aug 30, 2035', status: 'Returned', fine: 15000 }
                          ].map((bRow, bIdx) => (
                            <tr key={bIdx} className="hover:bg-[#FAF9F6]/25 transition-colors">
                              <td className="py-2.5 font-bold text-[#1B1B1B] text-left">
                                <p className="truncate max-w-[120px]">{bRow.title}</p>
                                <span className="text-[9px] text-[#808080] font-normal leading-none">by {bRow.author}</span>
                              </td>
                              <td className="py-2.5 font-mono font-bold text-[10px] text-[#6E6E6E]">
                                {bRow.bDate} <span className="text-[#A0A0A0] font-normal mx-0.5">—</span> {bRow.dDate}
                              </td>
                              <td className="py-2.5 font-mono text-[#808080]">{bRow.rDate}</td>
                              <td className="py-2.5">
                                <span className={`text-[9px] font-bold uppercase ${
                                  bRow.status === 'Returned' ? 'text-green-600' : bRow.status === 'Overdue' ? 'text-red-500' : 'text-[#E27A1D]'
                                }`}>
                                  {bRow.status}
                                </span>
                              </td>
                              <td className="py-2.5 text-right font-mono font-bold text-[#1B1B1B]">
                                {bRow.fine === 0 ? '0' : `$${(bRow.fine / 15000).toFixed(2)}`}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Table: Fines Info (4 cols) */}
                  <div className="xl:col-span-4 bg-white border border-[#EAEAEA] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-[#F1F3F5] pb-3">
                      <h3 className="text-xs font-extrabold text-[#1B1B1B] uppercase tracking-wider">Fines Info</h3>
                      <div className="flex items-center gap-2 border border-[#EAEAEA] rounded-lg px-2 py-0.5 text-[9px] font-bold text-[#6E6E6E] cursor-pointer hover:bg-[#F8F9FA]">
                        <span>This Week</span>
                        <CaretDown className="w-2.5 h-2.5 text-[#808080]" />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="border-b border-[#F1F3F5] pb-2 text-[9px] font-bold uppercase tracking-wider text-[#808080]">
                            <th className="pb-2">Book</th>
                            <th className="pb-2">Amount</th>
                            <th className="pb-2 text-right">Reason</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1F3F5] font-sans">
                          {[
                            { title: 'The Book of Prayer', id: 'BK-08745', fine: 15000, reason: 'Late', badge: 'bg-[#FA5A3C]/10 text-[#FA5A3C]' },
                            { title: 'Drew Feig', id: 'BK-08745', fine: 75000, reason: 'Damage', badge: 'bg-red-50 text-red-500' },
                            { title: 'The Lost Kingdom', id: 'BK-08745', fine: 150000, reason: 'Lost', badge: 'bg-slate-100 text-slate-600' }
                          ].map((fRow, fIdx) => (
                            <tr key={fIdx} className="hover:bg-[#FAF9F6]/25 transition-colors">
                              <td className="py-3 font-bold text-[#1B1B1B] text-left">
                                <p className="truncate max-w-[100px] leading-tight">{fRow.title}</p>
                                <span className="text-[8px] font-mono text-[#808080] font-normal mt-0.5 block">{fRow.id}</span>
                              </td>
                              <td className="py-3 font-mono font-bold text-[#1B1B1B]">
                                {fRow.fine === 0 ? '0' : `$${(fRow.fine / 15000).toFixed(2)}`}
                              </td>
                              <td className="py-3 text-right">
                                <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded font-mono ${fRow.badge}`}>
                                  {fRow.reason}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </motion.div>
        )}

        {/* VIEW 3: ADD NEW MEMBER FORM */}
        {viewState === 'add' && (
          <motion.div
            key="add-view"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6 lg:gap-8"
          >
            {/* Header Row */}
            <div className="flex items-center justify-between gap-4 -mt-2">
              <div className="flex items-center gap-2 text-[10px] lg:text-xs font-bold text-[#808080]">
                <span onClick={() => setViewState('list')} className="cursor-pointer hover:text-[#FA5A3C] transition-colors">Dashboard</span>
                <span>/</span>
                <span onClick={() => setViewState('list')} className="cursor-pointer hover:text-[#FA5A3C] transition-colors">Members</span>
                <span>/</span>
                <span className="text-[#1B1B1B] font-extrabold">Add New Member</span>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  onClick={() => setViewState('list')}
                  className="px-4 py-2 text-xs font-bold text-[#6E6E6E] hover:text-[#1B1B1B] transition-colors cursor-pointer bg-white border border-[#EAEAEA] rounded-xl shadow-sm btn-pressable"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddMemberSubmit}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#FA5A3C] hover:bg-[#E24A2D] transition-colors cursor-pointer rounded-xl shadow-md btn-pressable"
                >
                  Submit
                </button>
              </div>
            </div>

            {/* Main Form Block */}
            <div className="bg-white border border-[#EAEAEA] rounded-2xl p-6 lg:p-8 shadow-[0_4px_16px_rgba(0,0,0,0.02)] max-w-4xl mx-auto w-full text-xs">
              <div className="flex items-center gap-3 border-b border-[#F1F3F5] pb-4 mb-6 text-left">
                <ArrowLeft onClick={() => setViewState('list')} className="w-5 h-5 cursor-pointer text-[#6E6E6E] hover:text-[#1B1B1B] shrink-0" />
                <h3 className="font-display font-extrabold text-lg text-[#1B1B1B] tracking-tight">Create Member Account</h3>
              </div>

              <form onSubmit={handleAddMemberSubmit} className="space-y-8 text-left">
                
                {/* Section 1: Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-start">
                  <div className="md:col-span-3">
                    <h4 className="font-extrabold text-slate-800 text-sm">Basic Info</h4>
                    <p className="text-[10px] text-[#808080] mt-1 font-medium leading-relaxed">
                      Provide the member's personal details for identification and profile setup.
                    </p>
                  </div>
                  <div className="md:col-span-7 space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Profile Picture</label>
                      <div className="flex items-center bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl p-1 w-full max-w-md">
                        <button type="button" className="bg-white border border-[#EAEAEA] px-3.5 py-1.5 rounded-lg font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer hover:bg-slate-50 shadow-sm shrink-0">
                          <UploadSimple className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                        </button>
                        <span className="text-[10px] text-[#808080] font-mono px-3 truncate">No file chosen</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={newMember.name}
                          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                          placeholder="e.g. Morgan Taylor"
                          className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Date of Birth</label>
                        <input
                          type="date"
                          value={newMember.dob}
                          onChange={(e) => setNewMember({ ...newMember, dob: e.target.value })}
                          className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#6E6E6E] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Gender</label>
                      <div className="flex gap-4">
                        {['Male', 'Female'].map(g => (
                          <label key={g} className="flex items-center gap-2 cursor-pointer font-semibold text-[#1B1B1B]">
                            <input
                              type="radio"
                              name="gender"
                              value={g}
                              checked={newMember.gender === g}
                              onChange={(e) => setNewMember({ ...newMember, gender: e.target.value })}
                              className="w-4 h-4 accent-[#FA5A3C] cursor-pointer"
                            />
                            <span>{g}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-[#F1F3F5]" />

                {/* Section 2: Membership Info */}
                <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-start">
                  <div className="md:col-span-3">
                    <h4 className="font-extrabold text-slate-800 text-sm">Membership Info</h4>
                    <p className="text-[10px] text-[#808080] mt-1 font-medium leading-relaxed">
                      Library membership details including type, join date, and validity period.
                    </p>
                  </div>
                  <div className="md:col-span-7 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Member ID</label>
                        <input
                          type="text"
                          disabled
                          placeholder="Auto-Generated on save"
                          className="w-full bg-[#FAF9F6] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#808080] focus:outline-none font-mono font-bold"
                        />
                        <span className="text-[8px] text-[#808080] block font-mono font-medium">Auto-Generated</span>
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Membership Type *</label>
                        <div className="relative">
                          <select
                            value={newMember.membershipType}
                            onChange={(e: any) => setNewMember({ ...newMember, membershipType: e.target.value })}
                            className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl pl-4 pr-8 py-2.5 text-xs text-[#6E6E6E] font-bold focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all cursor-pointer appearance-none"
                          >
                            <option value="Premium">Premium</option>
                            <option value="Standard">Standard</option>
                            <option value="Basic">Basic</option>
                          </select>
                          <CaretDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E6E6E] pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Join Date</label>
                        <input
                          type="text"
                          disabled
                          value="2035-10-10"
                          className="w-full bg-[#FAF9F6] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#808080] focus:outline-none font-mono font-bold"
                        />
                        <span className="text-[8px] text-[#808080] block font-mono font-medium">Auto-set</span>
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Expiry Date</label>
                        <input
                          type="text"
                          disabled
                          value="2036-10-10"
                          className="w-full bg-[#FAF9F6] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#808080] focus:outline-none font-mono font-bold"
                        />
                        <span className="text-[8px] text-[#808080] block font-mono font-medium">Auto-calculated</span>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-[#F1F3F5]" />

                {/* Section 3: Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-start">
                  <div className="md:col-span-3">
                    <h4 className="font-extrabold text-slate-800 text-sm">Contact Info</h4>
                    <p className="text-[10px] text-[#808080] mt-1 font-medium leading-relaxed">
                      Primary contact details and emergency contact information for quick communication.
                    </p>
                  </div>
                  <div className="md:col-span-7 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={newMember.email}
                          onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                          placeholder="morgan.taylor@email.com"
                          className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Phone Number *</label>
                        <div className="flex bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl px-3 w-full focus-within:bg-white focus-within:border-[#FA5A3C] transition-all">
                          <select className="bg-transparent pr-2 focus:outline-none text-[#6E6E6E] font-bold border-r border-[#EAEAEA] mr-2 cursor-pointer">
                            <option>+62</option>
                            <option>+1</option>
                            <option>+61</option>
                          </select>
                          <input
                            type="text"
                            required
                            value={newMember.phone}
                            onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                            placeholder="812-0011-8910"
                            className="w-full bg-transparent border-none py-2.5 text-xs text-[#1B1B1B] focus:outline-none font-semibold font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-[#FAF9F6]/40 border border-[#EAEAEA] rounded-xl p-4 space-y-4 mt-2">
                      <h5 className="font-extrabold text-[#1B1B1B] text-[10px] uppercase tracking-wider">Emergency Contact</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block text-[9px]">Contact Name</label>
                          <input
                            type="text"
                            placeholder="Enter contact name"
                            className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl px-4 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block text-[9px]">Phone Number</label>
                          <div className="flex bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl px-3 w-full focus-within:bg-white focus-within:border-[#FA5A3C] transition-all">
                            <select className="bg-transparent pr-2 focus:outline-none text-[#6E6E6E] font-bold border-r border-[#EAEAEA] mr-2 cursor-pointer">
                              <option>+62</option>
                              <option>+1</option>
                            </select>
                            <input
                              type="text"
                              placeholder="Phone number"
                              className="w-full bg-transparent border-none py-2 text-xs text-[#1B1B1B] focus:outline-none font-semibold font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-[#F1F3F5]" />

                {/* Section 4: Borrowing Privileges */}
                <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-start">
                  <div className="md:col-span-3">
                    <h4 className="font-extrabold text-slate-800 text-sm">Borrowing Privileges</h4>
                    <p className="text-[10px] text-[#808080] mt-1 font-medium leading-relaxed">
                      Default borrowing rules and access rights assigned to this membership.
                    </p>
                  </div>
                  <div className="md:col-span-7 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Borrow Limit</label>
                        <input
                          type="text"
                          disabled
                          value={newMember.membershipType === 'Premium' ? '10 Books' : newMember.membershipType === 'Standard' ? '5 Books' : '3 Books'}
                          className="w-full bg-[#FAF9F6] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#808080] focus:outline-none font-semibold"
                        />
                        <span className="text-[8px] text-[#808080] block font-medium">Auto-Filled</span>
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Loan Duration</label>
                        <input
                          type="text"
                          disabled
                          value={newMember.membershipType === 'Premium' ? '21 Days' : '14 Days'}
                          className="w-full bg-[#FAF9F6] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#808080] focus:outline-none font-semibold"
                        />
                        <span className="text-[8px] text-[#808080] block font-medium">Auto-Filled</span>
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Reservation Limit</label>
                        <input
                          type="text"
                          disabled
                          value="5"
                          className="w-full bg-[#FAF9F6] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#808080] focus:outline-none font-semibold"
                        />
                        <span className="text-[8px] text-[#808080] block font-medium">Auto-Filled</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Access Rights</label>
                      <div className="flex gap-4">
                        {['Physical Books', 'Digital Access', 'Both'].map(right => (
                          <label key={right} className="flex items-center gap-2 cursor-pointer font-semibold text-[#1B1B1B]">
                            <input
                              type="radio"
                              name="rights"
                              value={right}
                              defaultChecked={right === 'Both'}
                              className="w-4 h-4 accent-[#FA5A3C] cursor-pointer"
                            />
                            <span>{right}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-[#F1F3F5]" />

                {/* Section 5: Payment */}
                <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-start">
                  <div className="md:col-span-3">
                    <h4 className="font-extrabold text-slate-800 text-sm">Payment Details</h4>
                    <p className="text-[10px] text-[#808080] mt-1 font-medium leading-relaxed">
                      Record the membership fee payment and transaction details.
                    </p>
                  </div>
                  <div className="md:col-span-7 space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Membership Fee Paid</label>
                      <div className="flex gap-4">
                        {['Yes', 'No'].map(paid => (
                          <label key={paid} className="flex items-center gap-2 cursor-pointer font-semibold text-[#1B1B1B]">
                            <input
                              type="radio"
                              name="paid"
                              value={paid}
                              defaultChecked={paid === 'Yes'}
                              className="w-4 h-4 accent-[#FA5A3C] cursor-pointer"
                            />
                            <span>{paid}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Amount Paid</label>
                        <input
                          type="text"
                          value={newMember.membershipType === 'Premium' ? '$59' : newMember.membershipType === 'Standard' ? '$29' : '$0'}
                          onChange={(e) => setNewMember({ ...newMember, amountPaid: e.target.value })}
                          className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-semibold font-mono"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Payment Method</label>
                        <div className="relative">
                          <select
                            value={newMember.paymentMethod}
                            onChange={(e) => setNewMember({ ...newMember, paymentMethod: e.target.value })}
                            className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl pl-4 pr-8 py-2.5 text-xs text-[#6E6E6E] font-bold focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all cursor-pointer appearance-none"
                          >
                            <option value="Online">Online Payment</option>
                            <option value="Cash">Cash at Counter</option>
                            <option value="Bank">Bank Transfer</option>
                          </select>
                          <CaretDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E6E6E] pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-[#1B1B1B] tracking-wider uppercase block">Receipt / Transaction ID</label>
                        <input
                          type="text"
                          disabled
                          value="TXN-PREM-89345"
                          className="w-full bg-[#FAF9F6] border border-[#EAEAEA] rounded-xl px-4 py-2.5 text-xs text-[#808080] focus:outline-none font-mono font-bold"
                        />
                        <span className="text-[8px] text-[#808080] block font-mono font-medium">Auto-Generated</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Row */}
                <div className="pt-4 flex gap-3.5 border-t border-[#F1F3F5]">
                  <button
                    type="button"
                    onClick={() => setViewState('list')}
                    className="flex-1 bg-[#FAF6F0] hover:bg-[#EAE3D2] border border-[#3D1E1E]/15 text-[#3D1E1E] font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors btn-pressable"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-[#FA5A3C] hover:bg-[#E24A2D] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors btn-pressable shadow-sm"
                  >
                    Create Account
                  </button>
                </div>

              </form>

            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};
