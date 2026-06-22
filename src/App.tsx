import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence, useReducedMotion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { QRScannerModal } from './components/QRScannerModal';
import { BookCatalog } from './components/BookCatalog';
import { MemberDashboard } from './components/MemberDashboard';
import { LandingPage } from './components/LandingPage';
import { AboutPage } from './components/AboutPage';
import { EventsPage } from './components/EventsPage';
import { ProfileSettings } from './components/ProfileSettings';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminBooks } from './components/admin/AdminBooks';
import { AdminMembers } from './components/admin/AdminMembers';
import { AdminTransactions } from './components/admin/AdminTransactions';
import { AdminReports } from './components/admin/AdminReports';
import { AdminStock } from './components/admin/AdminStock';
import { AdminSupply } from './components/admin/AdminSupply';
import { mockDb } from './data/mockDb';
import type { Book, BorrowRequest, LibraryEvent, UserAccount } from './data/mockDb';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'dashboard' | 'about' | 'events' | 'settings' | 'admin_dashboard' | 'admin_books' | 'admin_members' | 'admin_transactions' | 'admin_reports' | 'admin_stock' | 'admin_supply'>('home');
  const shouldReduceMotion = useReducedMotion();

  const pageVariants = {
    initial: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 12, filter: "blur(4px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    exit: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: -8, filter: "blur(4px)" }
  };

  const pageTransition = shouldReduceMotion
    ? { duration: 0.2 }
    : { type: "spring" as const, duration: 0.45, bounce: 0 };

  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [user, setUser] = useState<{ name: string; id: string; role?: 'member' | 'admin' } | null>(null);

  const [profileData, setProfileData] = useState({
    name: '',
    email: 'adrian@atmalibrary.org',
    phone: '+62 812-3456-7890',
    memberTier: 'Premium Reader',
    joinDate: '12 Maret 2025',
    whatsappNotif: true,
    emailNotif: false
  });
  
  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<BorrowRequest[]>([]);
  const [events, setEvents] = useState<LibraryEvent[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const [members, setMembers] = useState<UserAccount[]>([]);
  const [allTransactions, setAllTransactions] = useState<BorrowRequest[]>([]);

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
    fetchData();
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name
      }));
      if (user.role === 'admin' && !currentView.startsWith('admin_')) {
        setCurrentView('admin_dashboard');
      } else if (user.role === 'member' && currentView.startsWith('admin_')) {
        setCurrentView('dashboard');
      }
    } else {
      setBorrows([]);
      if (
        currentView === 'dashboard' || 
        currentView === 'settings' || 
        currentView.startsWith('admin_')
      ) {
        setCurrentView('home');
      }
    }
  }, [user, currentView]);

  const fetchData = () => {
    setBooks(mockDb.getBooks());
    setEvents(mockDb.getEvents());
    setMembers(mockDb.getMembers());
    setAllTransactions(mockDb.getAllTransactions());
    if (user) {
      setBorrows(mockDb.getBorrowRequests(user.id));
    }
  };

  const handleLoginSuccess = (loggedInUser: { name: string; id: string; role?: 'member' | 'admin' }) => {
    setUser(loggedInUser);
    localStorage.setItem('lib_session_user', JSON.stringify(loggedInUser));
    if (loggedInUser.role === 'admin') {
      setCurrentView('admin_dashboard');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lib_session_user');
    setCurrentView('home');
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

  const handleSaveProfile = (updatedName: string, updatedEmail: string, updatedPhone: string, whatsappNotif: boolean, emailNotif: boolean) => {
    if (user) {
      const updatedUser = { ...user, name: updatedName };
      setUser(updatedUser);
      localStorage.setItem('lib_session_user', JSON.stringify(updatedUser));
      setProfileData(prev => ({
        ...prev,
        name: updatedName,
        email: updatedEmail,
        phone: updatedPhone,
        whatsappNotif,
        emailNotif
      }));
      alert('Perubahan profil berhasil disimpan!');
    }
  };

  const handlePasswordReset = (currentPass: string, newPass: string, confirmPass: string) => {
    if (!currentPass || !newPass || !confirmPass) {
      alert('Semua kolom kata sandi wajib diisi!');
      return false;
    }
    if (newPass !== confirmPass) {
      alert('Konfirmasi kata sandi baru tidak cocok!');
      return false;
    }
    alert('Kata sandi Anda telah berhasil diubah!');
    return true;
  };

  // --- Admin Handler Functions ---
  const handleRegisterMember = (e: React.FormEvent, memberData: any) => {
    e.preventDefault();
    if (!memberData.id || !memberData.name || !memberData.email) {
      alert('Mohon isi semua field wajib!');
      return false;
    }
    const res = mockDb.addMember(memberData);
    alert(res.message);
    if (res.success) {
      fetchData();
      return true;
    }
    return false;
  };

  const handleToggleMemberStatus = (member: UserAccount) => {
    const updated = {
      ...member,
      status: member.status === 'active' ? ('inactive' as const) : ('active' as const)
    };
    const res = mockDb.updateMember(updated);
    if (res.success) {
      fetchData();
    } else {
      alert(res.message);
    }
  };

  const handleBookSubmit = (e: React.FormEvent, bookData: any, editingBook: Book | null) => {
    e.preventDefault();
    if (editingBook) {
      const res = mockDb.updateBook({
        ...editingBook,
        ...bookData
      });
      alert(res.message);
      if (res.success) {
        fetchData();
      }
    } else {
      const coverSeed = bookData.title.toLowerCase().replace(/[^a-z0-9]/g, '') || 'booksstack';
      const res = mockDb.addBook({
        ...bookData,
        coverSeed
      });
      alert(res.message);
      if (res.success) {
        fetchData();
      }
    }
  };

  const handleBookDelete = (bookId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus buku ini dari katalog?')) {
      const res = mockDb.deleteBook(bookId);
      alert(res.message);
      if (res.success) {
        fetchData();
      }
    }
  };

  const handleVerifyReturn = (borrowId: string) => {
    const res = mockDb.adminVerifyReturn(borrowId);
    alert(res.message);
    fetchData();
  };

  const isAdminView = currentView.startsWith('admin_');

  if (isAdminView && user?.role === 'admin') {
    return (
      <AdminLayout
        currentView={currentView as any}
        setCurrentView={setCurrentView as any}
        user={user}
        onLogout={handleLogout}
      >
        <AnimatePresence mode="wait">
          {currentView === 'admin_dashboard' && (
            <motion.div
              key="admin_dashboard"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <AdminDashboard
                books={books}
                members={members}
                allTransactions={allTransactions}
              />
            </motion.div>
          )}

          {currentView === 'admin_books' && (
            <motion.div
              key="admin_books"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <AdminBooks
                books={books}
                allTransactions={allTransactions}
                members={members}
                handleBookSubmit={handleBookSubmit}
                handleBookDelete={handleBookDelete}
              />
            </motion.div>
          )}

          {currentView === 'admin_members' && (
            <motion.div
              key="admin_members"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <AdminMembers
                members={members}
                handleRegisterMember={handleRegisterMember}
                handleToggleMemberStatus={handleToggleMemberStatus}
              />
            </motion.div>
          )}

          {currentView === 'admin_transactions' && (
            <motion.div
              key="admin_transactions"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <AdminTransactions
                allTransactions={allTransactions}
                members={members}
                handleVerifyReturn={handleVerifyReturn}
              />
            </motion.div>
          )}

          {currentView === 'admin_reports' && (
            <motion.div
              key="admin_reports"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <AdminReports
                books={books}
                members={members}
                allTransactions={allTransactions}
              />
            </motion.div>
          )}

          {currentView === 'admin_stock' && (
            <motion.div
              key="admin_stock"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <AdminStock
                books={books}
                allTransactions={allTransactions}
                members={members}
              />
            </motion.div>
          )}

          {currentView === 'admin_supply' && (
            <motion.div
              key="admin_supply"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <AdminSupply
                books={books}
                allTransactions={allTransactions}
                members={members}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </AdminLayout>
    );
  }

  return (
    <main 
      onPointerMove={handlePointerMove}
      className="overflow-x-hidden w-full max-w-full min-h-dvh bg-white relative flex flex-col justify-between selection:bg-[#FA0F00] selection:text-white font-sans text-left"
    >
      {/* Parallax Ambient spotlight */}
      <motion.div 
        style={{ x: springX, y: springY }}
        className="mouse-parallax-blob absolute top-[10%] left-[25%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      {/* Navigation bar */}
      <Navbar
        isScrolled={isScrolled}
        currentView={currentView as any}
        setCurrentView={setCurrentView as any}
        user={user}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onQRScannerClick={() => setIsQROpen(true)}
      />

      {/* Main Content Layout */}
      <div className="relative z-10 pt-14 flex-1 flex flex-col justify-start">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <LandingPage
                books={books}
                events={events}
                user={user}
                setCurrentView={setCurrentView as any}
                onLoginClick={() => setIsLoginOpen(true)}
                onRSVP={handleRSVP}
              />
            </motion.div>
          )}

          {currentView === 'about' && (
            <motion.div
              key="about"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <AboutPage />
            </motion.div>
          )}

          {currentView === 'events' && (
            <motion.div
              key="events"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <EventsPage events={events} onRSVP={handleRSVP} />
            </motion.div>
          )}

          {currentView === 'catalog' && (
            <motion.div
              key="catalog"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="relative z-10 bg-[#F5F5F5] min-h-screen"
            >
              <BookCatalog
                books={books}
                user={user}
                onBorrow={handleBorrow}
                onLoginRequest={() => setIsLoginOpen(true)}
                refreshBooks={fetchData}
                globalSearchQuery={globalSearchQuery}
                setGlobalSearchQuery={setGlobalSearchQuery}
              />
            </motion.div>
          )}

          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
              className="relative z-10 bg-[#F5F5F5] min-h-screen"
            >
              <MemberDashboard
                user={user}
                borrows={borrows}
                onReturnRequest={handleReturnRequest}
                onBrowseBooks={() => setCurrentView('catalog')}
                refreshBorrows={fetchData}
              />
            </motion.div>
          )}

          {currentView === 'settings' && (
            <motion.div
              key="settings"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <ProfileSettings
                user={user}
                profileData={profileData}
                handleSaveProfile={handleSaveProfile}
                handlePasswordReset={handlePasswordReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Footer */}
      <footer className="w-full bg-[#1B1B1B] text-white py-12 border-t border-[#333333] relative z-20 text-center font-mono">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center justify-center gap-4 text-xs tracking-wider text-[#9E9E9E]">
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
