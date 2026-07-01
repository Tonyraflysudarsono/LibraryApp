import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, CheckCircle, ArrowUUpLeft, BookOpen, Info, ShieldWarning, Users, Chair, BookmarkSimple, Sparkle } from '@phosphor-icons/react';
import { mockDb } from '../data/mockDb';
import type { BorrowRequest, Bookmark, Reservation, SpaceBooking, Book } from '../data/mockDb';

interface MemberDashboardProps {
  user: { name: string; id: string } | null;
  borrows: BorrowRequest[];
  onReturnRequest: (borrowId: string) => Promise<{ success: boolean; message: string }> | any;
  onBrowseBooks: () => void;
  refreshBorrows: () => void;
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  user,
  borrows,
  onReturnRequest,
  onBrowseBooks,
  refreshBorrows
}) => {
  const [actionFeedback, setActionFeedback] = useState<{ success?: boolean; message: string } | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'aktivitas' | 'koleksi' | 'antrean' | 'ruang' | 'rekomendasi'>('aktivitas');

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [spaceBookings, setSpaceBookings] = useState<SpaceBooking[]>([]);
  const [recommendations, setRecommendations] = useState<Book[]>([]);

  // We need to fetch books to join with bookmarks
  const allBooks = mockDb.getBooks();

  React.useEffect(() => {
    if (user) {
      setBookmarks(mockDb.getBookmarks(user.id));
      setReservations(mockDb.getReservations(user.id));
      setSpaceBookings(mockDb.getSpaceBookings(user.id));
      setRecommendations(mockDb.getRecommendations());
    }
  }, [user, borrows]);

  const activeLoans = borrows.filter(b => b.status === 'borrowed' || b.status === 'pending_return');
  const historyLoans = borrows.filter(b => b.status === 'returned');
  
  const bookmarkedBooks = bookmarks.map(b => allBooks.find(bk => bk.id === b.bookId)).filter(Boolean) as Book[];

  const handleReturnSubmit = async (borrowId: string) => {
    setProcessingId(borrowId);
    setActionFeedback(null);

    try {
      const res = await onReturnRequest(borrowId);
      setActionFeedback(res);
      setProcessingId(null);
      if (res.success) {
        refreshBorrows();
      }
    } catch {
      setProcessingId(null);
    }
  };

  const calculateDaysRemaining = (dueDateStr: string): { days: number; isOverdue: boolean } => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      days: diffDays,
      isOverdue: diffDays < 0
    };
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 md:py-16">
      
      {/* Digital Library Card */}
      {user && (
        <div className="w-full bg-[#1B1B1B] text-white rounded-xl p-6 md:p-8 mb-12 relative overflow-hidden shadow-2xl shadow-slate-900/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FA0F00] rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="text-left">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-[#FA0F00]" weight="bold" />
                <span className="font-display font-bold text-sm tracking-widest text-[#D3D3D3] uppercase">AtmaLibrary Digital ID</span>
              </div>
              <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-1">{user.name}</h2>
              <p className="font-mono text-sm text-[#A0A0A0]">ID Anggota: {user.id}</p>
            </div>
            
            {/* Mock Barcode */}
            <div className="bg-white p-3 rounded-md flex flex-col items-center gap-2 shrink-0">
              <div className="flex gap-0.5 h-10 w-full sm:w-48 opacity-80 justify-center">
                {[...Array(40)].map((_, i) => (
                  <div key={i} className="bg-black h-full" style={{ width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 1 : 2)}px`, marginRight: `${(i % 4 === 0 ? 2 : 1)}px` }}></div>
                ))}
              </div>
              <span className="font-mono text-[10px] font-bold text-[#1B1B1B] tracking-[0.3em]">{user.id}</span>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#D3D3D3] mb-8 scrollbar-none pb-px">
        {['aktivitas', 'koleksi', 'antrean', 'ruang', 'rekomendasi'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as any);
              setActionFeedback(null);
            }}
            className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === tab
                ? 'border-[#FA0F00] text-[#1B1B1B]'
                : 'border-transparent text-[#6E6E6E] hover:text-[#1B1B1B] hover:border-[#D3D3D3]'
            }`}
          >
            {tab === 'aktivitas' && <><Clock className="w-4 h-4" /> Sirkulasi</>}
            {tab === 'koleksi' && <><BookmarkSimple className="w-4 h-4" /> Koleksi Saya</>}
            {tab === 'antrean' && <><Users className="w-4 h-4" /> Waitlist</>}
            {tab === 'ruang' && <><Chair className="w-4 h-4" /> Pesan Ruang</>}
            {tab === 'rekomendasi' && <><Sparkle className="w-4 h-4" /> Rekomendasi</>}
          </button>
        ))}
      </div>

      {/* Action result alerts */}
      <AnimatePresence>
        {actionFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-2 px-5 py-4 rounded-md mb-8 border max-w-2xl text-xs ${
              actionFeedback.success
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                : 'bg-red-50 border-red-200 text-[#FA0F00]'
            }`}
          >
            <span>{actionFeedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tab Content: Aktivitas */}
      {activeTab === 'aktivitas' && (
        <div className="flex flex-col lg:flex-row gap-8 items-start animate-in fade-in slide-in-from-bottom-2">
        
        {/* Main Column: Active Loans */}
        <div className="w-full lg:w-2/3 space-y-6">
          <h3 className="font-display font-bold text-lg text-[#1B1B1B] text-left flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#0265DC]" />
            Pinjaman Aktif ({activeLoans.length})
          </h3>

          {activeLoans.length > 0 ? (
            <div className="space-y-4">
              {activeLoans.map((loan, idx) => {
                const { days, isOverdue } = calculateDaysRemaining(loan.dueDate);
                
                return (
                  <motion.div
                    key={loan.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: [0.45, 0, 0.40, 1], delay: idx * 0.03 }}
                    className="adobe-card"
                  >
                    <div className="p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between text-left">
                      <div>
                        {/* Book Metadata details */}
                        <span className="text-[10px] font-mono tracking-wider text-[#0265DC] uppercase block mb-1 font-bold">
                          {loan.bookAuthor}
                        </span>
                        <h4 className="font-display font-bold text-base md:text-lg text-[#1B1B1B] line-clamp-1">
                          {loan.bookTitle}
                        </h4>
                        
                        {/* Borrow dates */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 font-mono text-[10px] text-[#6E6E6E]">
                          <p>Dipinjam: <span className="text-[#1B1B1B]">{loan.borrowDate}</span></p>
                          <p>Jatuh Tempo: <span className="text-[#1B1B1B]">{loan.dueDate}</span></p>
                        </div>
                      </div>

                      {/* Status and Action Buttons */}
                      <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-center w-full sm:w-auto border-t sm:border-t-0 border-[#D3D3D3] pt-4 sm:pt-0 mt-4 sm:mt-0 shrink-0 gap-3">
                        
                        {/* Remaining days display or overdue */}
                        {loan.status === 'borrowed' ? (
                          <div className="flex items-center gap-1.5">
                            {isOverdue ? (
                              <div className="flex items-center gap-1 text-[#FA0F00] text-[10px] font-bold bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-sm uppercase tracking-wide">
                                <ShieldWarning className="w-3.5 h-3.5" />
                                Terlambat {Math.abs(days)} Hari
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-[#1B1B1B] text-[10px] font-bold bg-[#F5F5F5] border border-[#D3D3D3] px-2.5 py-0.5 rounded-sm uppercase tracking-wide">
                                <Clock className="w-3.5 h-3.5 text-[#0265DC]" />
                                {days} Hari Tersisa
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-accent-primary text-[10px] font-bold bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-sm uppercase tracking-wide">
                            <Info className="w-3.5 h-3.5" />
                            Menunggu Persetujuan
                          </div>
                        )}

                        {/* Return submission button */}
                        {loan.status === 'borrowed' && (
                          <button
                            disabled={processingId === loan.id}
                            onClick={() => handleReturnSubmit(loan.id)}
                            className="bg-[#F5F5F5] border border-[#D3D3D3] hover:bg-[#E8E8E8] text-[#1B1B1B] text-[10px] font-bold tracking-wider uppercase px-4 py-2 rounded-md transition-all duration-130 btn-pressable flex items-center gap-1.5 ml-auto sm:ml-0"
                          >
                            {processingId === loan.id ? (
                              <div className="w-3 h-3 border-2 border-[#1B1B1B] border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <ArrowUUpLeft className="w-3.5 h-3.5" />
                                Ajukan Pengembalian
                              </>
                            )}
                          </button>
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-[#D3D3D3] rounded-lg p-8 max-w-md mx-auto shadow-sm">
              <BookOpen className="w-10 h-10 text-[#D3D3D3] mx-auto mb-4" />
              <h4 className="text-[#1B1B1B] font-display font-semibold text-base">Tidak ada pinjaman aktif</h4>
              <p className="text-xs text-[#6E6E6E] mt-2 mb-6">
                Silakan cari buku menarik di katalog dan mulai lakukan peminjaman.
              </p>
              <button
                onClick={onBrowseBooks}
                className="bg-[#FA0F00] hover:bg-[#E00D00] text-white font-semibold px-5 py-2.5 rounded-md shadow-sm transition-all duration-130 text-xs uppercase tracking-wider btn-pressable"
              >
                Cari Buku Katalog
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Return History Logs */}
        <div className="w-full lg:w-1/3 space-y-6">
          <h3 className="font-display font-bold text-lg text-[#1B1B1B] text-left flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#6E6E6E]" />
            Riwayat Pengembalian ({historyLoans.length})
          </h3>

          {historyLoans.length > 0 ? (
            <div className="space-y-4">
              {historyLoans.map((loan) => (
                <div key={loan.id} className="bg-white border border-[#D3D3D3] rounded-lg p-4 text-left text-xs text-[#6E6E6E] shadow-sm">
                  <span className="text-[9px] font-mono text-[#6E6E6E] block mb-1">
                    Dikembalikan pada {loan.returnDate}
                  </span>
                  <h4 className="font-display font-semibold text-[#1B1B1B] line-clamp-1 mb-1.5">
                    {loan.bookTitle}
                  </h4>
                  <div className="flex justify-between items-center text-[10px] text-[#6E6E6E] font-mono">
                    <p>ID: {loan.id}</p>
                    <span className="text-[#0265DC] flex items-center gap-1 font-bold text-[9px] uppercase">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Selesai
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-left py-8 px-5 border border-dashed border-[#D3D3D3] rounded-lg text-xs text-[#6E6E6E] leading-relaxed bg-[#F5F5F5]/30">
              Belum ada riwayat transaksi pengembalian buku sebelumnya.
            </div>
          )}
        </div>

        </div>
      )}

      {/* Tab Content: Koleksi Saya (Bookmarks) */}
      {activeTab === 'koleksi' && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <h3 className="font-display font-bold text-lg text-[#1B1B1B] text-left mb-6 flex items-center gap-2">
            <BookmarkSimple className="w-5 h-5 text-[#FA0F00]" />
            Buku yang Disimpan ({bookmarkedBooks.length})
          </h3>
          {bookmarkedBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedBooks.map(book => (
                <div key={book.id} className="adobe-card p-4 flex gap-4">
                  <img src={`https://picsum.photos/seed/${book.coverSeed}/100/150`} alt={book.title} className="w-16 h-24 object-cover rounded" />
                  <div className="text-left flex flex-col justify-center">
                    <span className="text-[9px] uppercase font-bold text-[#0265DC]">{book.author}</span>
                    <h4 className="font-display font-bold text-sm text-[#1B1B1B] line-clamp-2 mt-1">{book.title}</h4>
                    <button onClick={onBrowseBooks} className="text-[10px] uppercase font-bold text-[#FA0F00] hover:text-[#E00D00] mt-2 underline text-left">
                      Lihat di Katalog
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-[#D3D3D3] rounded-lg">
              <p className="text-xs text-[#6E6E6E]">Belum ada buku yang disimpan.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Antrean Waitlist */}
      {activeTab === 'antrean' && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <h3 className="font-display font-bold text-lg text-[#1B1B1B] text-left mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#0265DC]" />
            Status Antrean Buku ({reservations.length})
          </h3>
          {reservations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reservations.map(res => (
                <div key={res.id} className="bg-white border border-[#D3D3D3] rounded-lg p-5 flex items-center justify-between shadow-sm">
                  <div className="text-left">
                    <h4 className="font-display font-bold text-[#1B1B1B]">{res.bookTitle}</h4>
                    <p className="text-[10px] uppercase tracking-wide text-[#6E6E6E] mt-1">{res.bookAuthor}</p>
                  </div>
                  <div className="bg-[#F5F5F5] px-4 py-2 rounded-md text-center border border-[#D3D3D3]">
                    <span className="block text-[10px] text-[#6E6E6E] uppercase font-bold">Posisi</span>
                    <span className="font-display font-bold text-[#FA0F00] text-xl">#{res.queuePosition}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-[#D3D3D3] rounded-lg">
              <p className="text-xs text-[#6E6E6E]">Anda tidak berada dalam antrean buku manapun.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Pesan Ruang (Space Booking) */}
      {activeTab === 'ruang' && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <h3 className="font-display font-bold text-lg text-[#1B1B1B] text-left mb-6 flex items-center gap-2">
            <Chair className="w-5 h-5 text-[#0265DC]" />
            Ruang Belajar & Diskusi
          </h3>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/2 space-y-4">
              <h4 className="font-bold text-sm text-[#1B1B1B] text-left border-b border-[#D3D3D3] pb-2">Pesan Ruangan Baru</h4>
              <div className="bg-white border border-[#D3D3D3] rounded-lg p-5 text-left shadow-sm">
                <p className="text-xs text-[#6E6E6E] mb-4">Pilih jadwal untuk reservasi Ruang Diskusi Kolaboratif. Kapasitas maksimal 6 orang.</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {['10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00'].map(slot => (
                    <button
                      key={slot}
                      onClick={() => {
                        if (user) {
                          const result = mockDb.bookSpace('R1', 'Ruang Diskusi Alpha', user.id, new Date().toISOString().split('T')[0], slot);
                          setActionFeedback(result);
                          if (result.success) {
                            setSpaceBookings(mockDb.getSpaceBookings(user.id));
                          }
                        }
                      }}
                      className="px-4 py-2 text-xs font-bold text-[#1B1B1B] bg-[#F5F5F5] hover:bg-[#E8E8E8] hover:border-[#1B1B1B] border border-[#D3D3D3] rounded-md transition-all"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 space-y-4">
              <h4 className="font-bold text-sm text-[#1B1B1B] text-left border-b border-[#D3D3D3] pb-2">Reservasi Aktif</h4>
              {spaceBookings.length > 0 ? (
                spaceBookings.map(sb => (
                  <div key={sb.id} className="bg-white border-l-4 border-[#008000] border-y border-r border-[#D3D3D3] rounded-r-lg p-4 text-left shadow-sm">
                    <h5 className="font-display font-bold text-sm text-[#1B1B1B]">{sb.roomName}</h5>
                    <p className="text-xs text-[#6E6E6E] mt-1 font-mono">Tanggal: {sb.date}</p>
                    <p className="text-xs text-[#6E6E6E] font-mono">Waktu: {sb.timeSlot}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#6E6E6E] text-left">Belum ada reservasi aktif.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Rekomendasi (Recommendations) */}
      {activeTab === 'rekomendasi' && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <h3 className="font-display font-bold text-lg text-[#1B1B1B] text-left mb-6 flex items-center gap-2">
            <Sparkle className="w-5 h-5 text-[#FA0F00]" />
            Dipilih Khusus Untuk Anda
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((book) => (
              <div key={book.id} className="adobe-card p-5 text-left flex flex-col items-center">
                <img src={`https://picsum.photos/seed/${book.coverSeed}/200/300`} alt={book.title} className="w-32 h-48 object-cover rounded shadow-md mb-4" />
                <span className="text-[10px] font-mono tracking-widest text-[#6E6E6E] uppercase block mb-1">
                  {book.author}
                </span>
                <h4 className="font-display font-bold text-base text-[#1B1B1B] line-clamp-2 text-center mb-4">
                  {book.title}
                </h4>
                <button
                  onClick={onBrowseBooks}
                  className="w-full bg-[#1B1B1B] hover:bg-[#333333] text-white py-2.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  Lihat di Katalog
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
