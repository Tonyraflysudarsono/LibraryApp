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
import { AdminHR } from './components/admin/AdminHR';
import { mockDb } from './data/mockDb';
import type { LibraryEvent, UserAccount } from './data/mockDb';

import { bukuService } from './services/bukuService';
import type { Book } from './services/bukuService';
import { anggotaService } from './services/anggotaService';
import { peminjamanService } from './services/peminjamanService';
import type { BorrowRequest } from './services/peminjamanService';
import { authService } from './services/authService';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'dashboard' | 'about' | 'events' | 'settings' | 'admin_dashboard' | 'admin_books' | 'admin_members' | 'admin_transactions' | 'admin_reports' | 'admin_stock' | 'admin_supply' | 'admin_hr'>('home');
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
    const savedUser = localStorage.getItem('lib_user');
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

  const fetchData = async () => {
    try {
      const fetchedBooks = await bukuService.getAllBooks();
      setBooks(fetchedBooks as any);
      
      // Events remain mock data as there is no events table in PDM
      setEvents(mockDb.getEvents());

      if (user) {
        if (user.role === 'admin') {
          const [fetchedMembers, fetchedTransactions] = await Promise.all([
            anggotaService.getAllMembers(),
            peminjamanService.getAllTransactions(),
          ]);
          setMembers(fetchedMembers as any);
          setAllTransactions(fetchedTransactions as any);
        } else {
          const fetchedBorrows = await peminjamanService.getAllTransactions(user.id);
          setBorrows(fetchedBorrows as any);
        }
      }
    } catch (error) {
      console.error('Error fetching library data:', error);
    }
  };

  const handleLoginSuccess = (loggedInUser: { name: string; id: string; role?: 'member' | 'admin' }) => {
    setUser(loggedInUser);
    localStorage.setItem('lib_user', JSON.stringify({
      id: loggedInUser.id,
      name: loggedInUser.name,
      role: loggedInUser.role,
      status: 'active'
    }));
    if (loggedInUser.role === 'admin') {
      setCurrentView('admin_dashboard');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    authService.logout();
    setCurrentView('home');
  };

  const handleBorrow = async (bookId: string) => {
    if (!user) return { success: false, message: 'Please log in first.' };
    try {
      await peminjamanService.createTransaction(user.id, bookId);
      await fetchData();
      return { success: true, message: 'Buku berhasil dipinjam!' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Gagal meminjam buku.' };
    }
  };

  const handleReturnRequest = async (borrowId: string) => {
    try {
      await peminjamanService.requestReturn(borrowId);
      await fetchData();
      return { success: true, message: 'Permintaan pengembalian berhasil diajukan.' };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Gagal mengajukan pengembalian.' };
    }
  };

  const handleRSVP = (evtTitle: string) => {
    alert(`Terima kasih! Pendaftaran RSVP Anda untuk "${evtTitle}" telah berhasil.`);
  };

  const handleSaveProfile = async (updatedName: string, updatedEmail: string, updatedPhone: string, whatsappNotif: boolean, emailNotif: boolean) => {
    if (user) {
      try {
        // Find DB member ID
        const loggedInUserStr = localStorage.getItem('lib_user');
        if (!loggedInUserStr) return;
        const loggedInUser = JSON.parse(loggedInUserStr);

        await anggotaService.updateMember(loggedInUser.dbId || loggedInUser.id, {
          name: updatedName,
          email: updatedEmail,
          phone: updatedPhone,
        });

        const updatedUser = { ...user, name: updatedName };
        setUser(updatedUser);
        localStorage.setItem('lib_user', JSON.stringify({
          ...loggedInUser,
          name: updatedName,
          email: updatedEmail,
          phone: updatedPhone
        }));

        setProfileData(prev => ({
          ...prev,
          name: updatedName,
          email: updatedEmail,
          phone: updatedPhone,
          whatsappNotif,
          emailNotif
        }));
        alert('Perubahan profil berhasil disimpan!');
      } catch (err: any) {
        alert(err.response?.data?.message || 'Gagal menyimpan perubahan profil.');
      }
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
  const handleRegisterMember = async (e: React.FormEvent, memberData: any) => {
    e.preventDefault();
    try {
      await anggotaService.createMember({
        name: memberData.name,
        email: memberData.email,
        phone: memberData.phone,
        password: memberData.password || 'password',
      });
      alert('Anggota baru berhasil didaftarkan!');
      await fetchData();
      return true;
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mendaftarkan anggota baru.');
      return false;
    }
  };

  const handleToggleMemberStatus = async (member: any) => {
    try {
      await anggotaService.toggleMemberStatus(member.dbId || member.id);
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengubah status anggota.');
    }
  };

  const handleBookSubmit = async (e: React.FormEvent, bookData: any, editingBook: any | null) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await bukuService.updateBook(editingBook.dbId, bookData);
        alert('Buku berhasil diperbarui!');
      } else {
        await bukuService.createBook(bookData);
        alert('Buku berhasil ditambahkan!');
      }
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal menyimpan buku.');
    }
  };

  const handleBookDelete = async (bookId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus buku ini dari katalog?')) {
      try {
        const match = books.find(b => b.id === bookId);
        if (!match) return;
        await bukuService.deleteBook(match.dbId);
        alert('Buku berhasil dihapus!');
        await fetchData();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Gagal menghapus buku.');
      }
    }
  };

  const handleVerifyReturn = async (borrowId: string) => {
    try {
      await peminjamanService.verifyReturn(borrowId);
      alert('Pengembalian berhasil diverifikasi.');
      await fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal memverifikasi pengembalian.');
    }
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

          {currentView === 'admin_hr' && (
            <motion.div
              key="admin_hr"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={pageTransition}
            >
              <AdminHR />
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
