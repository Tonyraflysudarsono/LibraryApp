import React, { useState, useRef, useEffect } from 'react';
import { Books, User, SignOut, Bell, QrCode } from '@phosphor-icons/react';

interface NavbarProps {
  isScrolled: boolean;
  currentView: 'home' | 'catalog' | 'dashboard' | 'about' | 'events' | 'settings';
  setCurrentView: (view: 'home' | 'catalog' | 'dashboard' | 'about' | 'events' | 'settings') => void;
  user: { name: string; id: string } | null;
  onLoginClick: () => void;
  onLogout: () => void;
  onQRScannerClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isScrolled,
  currentView,
  setCurrentView,
  user,
  onLoginClick,
  onLogout,
  onQRScannerClick
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Mock Notifications
  const mockNotifications = [
    { id: 1, text: "Jatuh tempo 'Atomic Habits' besok.", unread: true },
    { id: 2, text: "Buku dari Waitlist Anda kini tersedia!", unread: true },
    { id: 3, text: "Ruang Diskusi C dikonfirmasi untuk besok 10:00 AM.", unread: false }
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`fixed z-40 left-0 right-0 flex justify-center pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
      isScrolled ? 'top-4 px-4' : 'top-0 px-0'
    }`}>
      <div className={`pointer-events-auto flex items-center justify-between w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isScrolled
          ? 'max-w-4xl backdrop-blur-xl bg-white/75 border border-white/50 rounded-full px-6 h-14 shadow-[0_16px_32px_-8px_rgba(0,0,0,0.1)]'
          : 'max-w-full backdrop-blur-none bg-white border border-transparent border-b-[#D3D3D3] rounded-none px-8 h-16 shadow-none'
      }`}>
        
        {/* Brand Logo - Adobe Style (2px rounded corner) */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('home')}>
          <div className="w-7 h-7 rounded-sm bg-[#FA0F00] flex items-center justify-center shadow-sm shrink-0">
            <Books className="w-4.5 h-4.5 text-white" weight="bold" />
          </div>
          <span className="font-display font-bold text-base tracking-tight text-[#1B1B1B]">
            Atma<span className="text-[#FA0F00]">Library</span>
          </span>
        </div>

        {/* Navigation Tabs - Flat Spectrum Style */}
        <div className="flex h-full items-center gap-6">
          <button
            onClick={() => setCurrentView('home')}
            className={`h-full px-1 border-b-2 flex items-center gap-2 text-xs font-bold transition-all duration-130 ${
              currentView === 'home'
                ? 'border-[#FA0F00] text-[#1B1B1B]'
                : 'border-transparent text-[#6E6E6E] hover:text-[#1B1B1B]'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => setCurrentView('about')}
            className={`h-full px-1 border-b-2 flex items-center gap-2 text-xs font-bold transition-all duration-130 ${
              currentView === 'about'
                ? 'border-[#FA0F00] text-[#1B1B1B]'
                : 'border-transparent text-[#6E6E6E] hover:text-[#1B1B1B]'
            }`}
          >
            Tentang Kami
          </button>
          <button
            onClick={() => setCurrentView('events')}
            className={`h-full px-1 border-b-2 flex items-center gap-2 text-xs font-bold transition-all duration-130 ${
              currentView === 'events'
                ? 'border-[#FA0F00] text-[#1B1B1B]'
                : 'border-transparent text-[#6E6E6E] hover:text-[#1B1B1B]'
            }`}
          >
            Acara
          </button>
          <button
            onClick={() => setCurrentView('catalog')}
            className={`h-full px-1 border-b-2 flex items-center gap-2 text-xs font-bold transition-all duration-130 ${
              currentView === 'catalog'
                ? 'border-[#FA0F00] text-[#1B1B1B]'
                : 'border-transparent text-[#6E6E6E] hover:text-[#1B1B1B]'
            }`}
          >
            Katalog
          </button>
          {user && (
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`h-full px-1 border-b-2 flex items-center gap-2 text-xs font-bold transition-all duration-130 ${
                currentView === 'dashboard'
                  ? 'border-[#FA0F00] text-[#1B1B1B]'
                  : 'border-transparent text-[#6E6E6E] hover:text-[#1B1B1B]'
              }`}
            >
              Pinjaman Saya
            </button>
          )}
        </div>

        {/* User Session Action (4px rounded button) */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end text-right">
                <span className="text-[11px] font-bold text-[#1B1B1B] leading-tight">{user.name}</span>
                <span className="text-[9px] text-[#6E6E6E] font-mono leading-none">{user.id}</span>
              </div>

              {/* QR Scanner Trigger */}
              <button
                onClick={onQRScannerClick}
                className="w-8 h-8 rounded-md bg-[#FA0F00]/10 border border-[#FA0F00]/20 flex items-center justify-center text-[#FA0F00] hover:bg-[#FA0F00] hover:text-white transition-all duration-130 btn-pressable shrink-0 relative group"
                title="Self-Checkout QR Scanner"
              >
                <QrCode className="w-4 h-4" weight="bold" />
                <span className="absolute -bottom-8 bg-[#1B1B1B] text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Scan Buku</span>
              </button>

              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="w-8 h-8 rounded-md bg-[#F5F5F5] border border-[#D3D3D3] flex items-center justify-center text-[#1B1B1B] hover:bg-[#E8E8E8] transition-colors relative"
                  aria-label="Notifikasi"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-[#FA0F00] rounded-full border border-white"></span>
                </button>
                
                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-[#D3D3D3] rounded-lg shadow-xl overflow-hidden pointer-events-auto transform origin-top-right transition-all animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-[#D3D3D3] bg-[#F5F5F5]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B1B1B] font-mono">Notifikasi</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {mockNotifications.map(n => (
                        <div key={n.id} className={`px-4 py-3 border-b border-[#F0F0F0] last:border-0 hover:bg-[#F9F9F9] cursor-pointer transition-colors ${n.unread ? 'bg-red-50/30' : ''}`}>
                          <div className="flex gap-2">
                            {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#FA0F00] shrink-0 mt-1.5"></span>}
                            <p className="text-xs text-[#1B1B1B] leading-relaxed">{n.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Icon button */}
              <button
                onClick={() => setCurrentView('settings')}
                className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-all duration-130 btn-pressable cursor-pointer ${
                  currentView === 'settings'
                    ? 'bg-[#FA0F00]/10 border border-[#FA0F00] text-[#FA0F00]'
                    : 'bg-[#F5F5F5] border border-[#D3D3D3] text-[#1B1B1B] hover:bg-[#E8E8E8]'
                }`}
                title="Pengaturan Profil"
              >
                <User className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onLogout}
                className="w-8 h-8 rounded-md bg-[#F5F5F5] border border-[#D3D3D3] flex items-center justify-center text-[#6E6E6E] hover:text-[#1B1B1B] hover:bg-[#E8E8E8] transition-all duration-130 btn-pressable shrink-0"
                title="Log Out"
              >
                <SignOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="adobe-btn px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-[#FA0F00] hover:bg-[#E00D00] shadow-sm transition-all duration-130"
            >
              Log In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
