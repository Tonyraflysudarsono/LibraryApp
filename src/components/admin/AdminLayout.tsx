import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  House, 
  Envelope, 
  Receipt, 
  Books, 
  Users, 
  Gear, 
  SignOut, 
  Bell, 
  MagnifyingGlass, 
  SlidersHorizontal,
  CaretDown,
  CaretRight,
  List,
  X,
  Package,
  Buildings,
  UsersThree
} from '@phosphor-icons/react';

interface AdminLayoutProps {
  currentView: 'admin_dashboard' | 'admin_books' | 'admin_members' | 'admin_transactions' | 'admin_reports' | 'admin_stock' | 'admin_supply' | 'admin_hr';
  setCurrentView: (view: 'admin_dashboard' | 'admin_books' | 'admin_members' | 'admin_transactions' | 'admin_reports' | 'admin_stock' | 'admin_supply' | 'admin_hr') => void;
  user: { name: string; id: string; role?: 'member' | 'admin' } | null;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentView,
  setCurrentView,
  user,
  onLogout,
  children
}) => {
  const [isManagementOpen, setIsManagementOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const notifications = [
    { id: 1, text: "Return verification request for 'The Coffee Shop Next Door'", time: "5 mins ago", unread: true },
    { id: 2, text: "New member registration: Olive James (MBR-4521)", time: "1 hr ago", unread: true },
    { id: 3, text: "Book 'Atomic Habits' is overdue by member Citra Lestari", time: "2 hrs ago", unread: false }
  ];

  const getPageTitle = () => {
    switch (currentView) {
      case 'admin_dashboard': return 'Dashboard';
      case 'admin_books': return 'Books Management';
      case 'admin_members': return 'Members Directory';
      case 'admin_transactions': return 'Library Activity';
      case 'admin_reports': return 'Settings & Reports';
      case 'admin_stock': return 'Stock Management';
      case 'admin_supply': return 'Supply & Acquisition';
      case 'admin_hr': return 'HR Dashboard';
      default: return 'Admin Panel';
    }
  };

  const getPageSubtitle = () => {
    const firstName = user?.name ? user.name.split(' ')[0] : 'Admin';
    return `Good Morning, ${firstName}!`;
  };

  const navItems = [
    { 
      id: 'admin_dashboard' as const, 
      label: 'Dashboard', 
      icon: House 
    },
    { 
      id: 'inbox' as const, 
      label: 'Inbox', 
      icon: Envelope,
      placeholder: true
    },
    { 
      id: 'admin_transactions' as const, 
      label: 'Library Activity', 
      icon: Receipt 
    },
    { 
      id: 'admin_books' as const, 
      label: 'Books', 
      icon: Books 
    }
  ];

  const managementSubItems = [
    { 
      id: 'admin_stock' as const, 
      label: 'Stock Management', 
      icon: Package 
    },
    { 
      id: 'admin_supply' as const, 
      label: 'Supply & Acquisition', 
      icon: Buildings 
    }
  ];

  const handleNavClick = (viewId: any, placeholder?: boolean) => {
    if (placeholder) {
      alert("Inbox feature is coming soon!");
      return;
    }
    setCurrentView(viewId);
    setIsMobileSidebarOpen(false);
  };

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-[#EAEAEA] py-6 px-5 font-sans justify-between">
      <div className="flex flex-col gap-8">
        {/* Brand Logo - Figma Style */}
        <div className="flex items-center gap-2.5 px-2">
          {/* Custom Geometric Leaf Logo */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B4A] to-[#FA5A3C] flex items-center justify-center shadow-md relative shrink-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.2),transparent_60%)]" />
            <Books className="w-4.5 h-4.5 text-white" weight="bold" />
          </div>
          <span className="font-sans font-extrabold text-lg tracking-[0.12em] text-[#1B1B1B]">
            LIBRA
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.id, item.placeholder)}
                className={`flex items-center justify-between w-full rounded-xl py-3 px-4 text-xs font-semibold tracking-wide transition-all duration-150 group ${
                  isActive 
                    ? 'bg-[#FA5A3C] text-white shadow-sm' 
                    : 'text-[#6E6E6E] hover:bg-[#F8F9FA] hover:text-[#1B1B1B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-white' : 'text-[#6E6E6E] group-hover:text-[#1B1B1B]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.placeholder && (
                  <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded uppercase">Soon</span>
                )}
              </button>
            );
          })}

          {/* Management Collapsible Head */}
          <div className="mt-2">
            <button
              onClick={() => setIsManagementOpen(!isManagementOpen)}
              className="flex items-center justify-between w-full rounded-xl py-3 px-4 text-xs font-semibold tracking-wide text-[#6E6E6E] hover:bg-[#F8F9FA] hover:text-[#1B1B1B] transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-4.5 h-4.5 text-[#6E6E6E]" />
                <span>Management</span>
              </div>
              {isManagementOpen ? (
                <CaretDown className="w-3.5 h-3.5 text-[#6E6E6E]" />
              ) : (
                <CaretRight className="w-3.5 h-3.5 text-[#6E6E6E]" />
              )}
            </button>

            {/* Sub-items */}
            <AnimatePresence initial={false}>
              {isManagementOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden pl-4 flex flex-col gap-0.5 mt-0.5"
                >
                  {managementSubItems.map((sub) => {
                    const isActive = currentView === sub.id;
                    const Icon = sub.icon;
                    return (
                      <button
                        key={sub.label}
                        onClick={() => handleNavClick(sub.id)}
                        className={`flex items-center gap-3 w-full rounded-xl py-2.5 px-4 text-xs font-semibold tracking-wide transition-all duration-150 group ${
                          isActive 
                            ? 'bg-[#FA5A3C] text-white shadow-sm' 
                            : 'text-[#6E6E6E] hover:bg-[#F8F9FA] hover:text-[#1B1B1B]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#6E6E6E] group-hover:text-[#1B1B1B]'}`} />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Members Button (Top-Level) */}
          <button
            onClick={() => handleNavClick('admin_members')}
            className={`flex items-center justify-between w-full rounded-xl py-3 px-4 text-xs font-semibold tracking-wide transition-all duration-150 group mt-1 ${
              currentView === 'admin_members' 
                ? 'bg-[#FA5A3C] text-white shadow-sm' 
                : 'text-[#6E6E6E] hover:bg-[#F8F9FA] hover:text-[#1B1B1B]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className={`w-4.5 h-4.5 ${currentView === 'admin_members' ? 'text-white' : 'text-[#6E6E6E] group-hover:text-[#1B1B1B]'}`} />
              <span>Members</span>
            </div>
          </button>

          {/* HR Dashboard Button (Top-Level) */}
          <button
            onClick={() => handleNavClick('admin_hr')}
            className={`flex items-center justify-between w-full rounded-xl py-3 px-4 text-xs font-semibold tracking-wide transition-all duration-150 group mt-0.5 ${
              currentView === 'admin_hr' 
                ? 'bg-[#FA5A3C] text-white shadow-sm' 
                : 'text-[#6E6E6E] hover:bg-[#F8F9FA] hover:text-[#1B1B1B]'
            }`}
          >
            <div className="flex items-center gap-3">
              <UsersThree className={`w-4.5 h-4.5 ${currentView === 'admin_hr' ? 'text-white' : 'text-[#6E6E6E] group-hover:text-[#1B1B1B]'}`} />
              <span>HR Dashboard</span>
            </div>
          </button>

          {/* Settings Button (Top-Level) */}
          <button
            onClick={() => handleNavClick('admin_reports')}
            className={`flex items-center justify-between w-full rounded-xl py-3 px-4 text-xs font-semibold tracking-wide transition-all duration-150 group mt-0.5 ${
              currentView === 'admin_reports' 
                ? 'bg-[#FA5A3C] text-white shadow-sm' 
                : 'text-[#6E6E6E] hover:bg-[#F8F9FA] hover:text-[#1B1B1B]'
            }`}
          >
            <div className="flex items-center gap-3">
              <Gear className={`w-4.5 h-4.5 ${currentView === 'admin_reports' ? 'text-white' : 'text-[#6E6E6E] group-hover:text-[#1B1B1B]'}`} />
              <span>Settings</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Footer / Promo Card & Logout */}
      <div className="flex flex-col gap-6">
        {/* On-the-Go Management Promo Card */}
        <div className="bg-[#FAF9F6] border border-[#EAE9E4] rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-[#FA5A3C]/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex flex-col gap-1.5 text-left">
            <h4 className="text-xs font-bold text-[#1B1B1B] leading-snug">On-the-Go Management</h4>
            <p className="text-[10px] text-[#808080] leading-relaxed font-medium">
              Libra Mobile lets you access books, members, and stats anytime, anywhere.
            </p>
          </div>
          <button className="w-full bg-[#FA5A3C] hover:bg-[#E24A2D] text-white text-[10px] font-bold py-2 rounded-lg transition-colors btn-pressable shadow-sm">
            Try for Free
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full rounded-xl py-3 px-4 text-xs font-semibold tracking-wide text-[#6E6E6E] hover:bg-red-50 hover:text-red-600 transition-all duration-150 btn-pressable border border-transparent hover:border-red-100"
        >
          <SignOut className="w-4.5 h-4.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-[#1B1B1B]">
      
      {/* Desktop Sidebar (Fixed Left) */}
      <div className="hidden lg:block w-[260px] h-screen sticky top-0 shrink-0 z-20">
        {renderSidebarContent()}
      </div>

      {/* Mobile Sidebar Slide-out Drawer */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute inset-0 bg-[#1B1B1B]/40 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 w-[260px] bg-white h-full shadow-2xl relative"
            >
              {/* Close button inside mobile sidebar */}
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="absolute top-5 right-5 p-1.5 bg-[#F5F5F5] rounded-lg border border-[#E0E0E0] text-[#6E6E6E]"
              >
                <X className="w-4 h-4" />
              </button>
              {renderSidebarContent()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Header Panel */}
        <header className="bg-white border-b border-[#EAEAEA] sticky top-0 z-10 px-6 lg:px-8 py-4 flex items-center justify-between gap-4 font-sans">
          
          {/* Hamburger + Page Info */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-[#F8F9FA] border border-[#EAEAEA] text-[#1B1B1B] transition-colors hover:bg-[#EAEAEA]"
            >
              <List className="w-5 h-5" />
            </button>
            <div className="text-left flex flex-col">
              <h1 className="text-lg lg:text-xl font-extrabold tracking-tight text-[#1B1B1B] leading-none">
                {getPageTitle()}
              </h1>
              <p className="text-[10px] lg:text-xs text-[#808080] font-medium mt-1">
                {getPageSubtitle()}
              </p>
            </div>
          </div>

          {/* Search + Action panel */}
          <div className="flex items-center gap-4 lg:gap-6">
            
            {/* Search Input Bar - Figma style */}
            <div className="relative hidden md:block w-64 lg:w-72">
              <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-[#F8F9FA] border border-[#EAEAEA] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA5A3C] focus:bg-white transition-all font-medium"
              />
              <button className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#808080] hover:text-[#1B1B1B] transition-colors">
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="w-9 h-9 rounded-xl bg-[#F8F9FA] hover:bg-[#F1F3F5] border border-[#EAEAEA] flex items-center justify-center text-[#1B1B1B] transition-colors relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-[#FA5A3C] rounded-full border border-white"></span>
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    {/* Invisible click backdrop */}
                    <div className="fixed inset-0 z-30" onClick={() => setIsNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-72 bg-white border border-[#EAEAEA] rounded-xl shadow-xl overflow-hidden z-40 origin-top-right text-left"
                    >
                      <div className="px-4 py-3 border-b border-[#EAEAEA] bg-[#FAF9F6] flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1B1B1B] font-mono">Notifications</span>
                        <span className="text-[10px] text-[#FA5A3C] font-bold cursor-pointer hover:underline">Mark all read</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto divide-y divide-[#F1F3F5]">
                        {notifications.map(n => (
                          <div key={n.id} className={`px-4 py-3.5 hover:bg-[#F8F9FA] cursor-pointer transition-colors ${n.unread ? 'bg-[#FA5A3C]/5' : ''}`}>
                            <p className="text-[11px] text-[#1B1B1B] leading-normal font-semibold">{n.text}</p>
                            <span className="text-[9px] text-[#808080] font-mono block mt-1">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Block */}
            <div className="flex items-center gap-3 border-l border-[#EAEAEA] pl-4 lg:pl-6">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E2E8F0] to-[#CBD5E1] border border-[#EAEAEA] flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative">
                <span className="text-xs font-bold text-slate-600 font-mono">NT</span>
                {/* Visual indicator of online status */}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-[#1B1B1B] leading-none">
                  {user?.name || 'Noah Tanaka'}
                </span>
                <span className="text-[10px] text-[#808080] font-semibold mt-1">
                  Admin
                </span>
              </div>
            </div>

          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-6 lg:p-8 flex flex-col justify-start">
          {children}
        </main>

        {/* Internal Admin Footer */}
        <footer className="w-full py-6 border-t border-[#EAEAEA] bg-white text-center font-sans">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-medium text-[#808080]">
            <p>Copyright © 2026 Peterdraw</p>
            <div className="flex gap-4">
              <span className="cursor-pointer hover:text-[#FA5A3C] transition-colors">Privacy Policy</span>
              <span>•</span>
              <span className="cursor-pointer hover:text-[#FA5A3C] transition-colors">Terms and conditions</span>
              <span>•</span>
              <span className="cursor-pointer hover:text-[#FA5A3C] transition-colors">Contact</span>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};
