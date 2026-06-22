import React, { useState } from 'react';
import { BookOpen, TrendUp, Users, Coin, Funnel } from '@phosphor-icons/react';
import type { Book, UserAccount, BorrowRequest } from '../../data/mockDb';

interface AdminReportsProps {
  books: Book[];
  members: UserAccount[];
  allTransactions: BorrowRequest[];
}

export const AdminReports: React.FC<AdminReportsProps> = ({
  books,
  members,
  allTransactions
}) => {
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');

  const filtered = allTransactions.filter(tx => {
    if (!reportStartDate && !reportEndDate) return true;
    const tDate = new Date(tx.borrowDate);
    const start = reportStartDate ? new Date(reportStartDate) : new Date('1970-01-01');
    const end = reportEndDate ? new Date(reportEndDate) : new Date('2099-12-31');
    return tDate >= start && tDate <= end;
  });

  const totalFineInPeriod = filtered.reduce((acc, f) => acc + (f.fine || 0), 0);

  return (
    <div className="relative z-10 bg-[#F5F5F5] min-h-screen pb-20 font-sans text-left">
      <section className="w-full bg-[#FAF6F0] py-16 text-center border-b border-[#D3D3D3]">
        <div className="max-w-4xl mx-auto px-6">
          <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-[#FA0F00]/10 text-[#FA0F00] mb-3 inline-block">
            Panel Administrator
          </span>
          <h1 className="font-display font-medium text-4xl md:text-5xl text-[#3D1E1E] mb-4">
            Laporan & Analisis Statistik
          </h1>
          <div className="w-12 h-[2px] bg-[#3D1E1E] mx-auto mb-4" />
          <p className="text-xs md:text-sm text-[#6E6E6E] max-w-xl mx-auto font-medium leading-relaxed font-sans">
            Analisis sirkulasi perpustakaan, denda terkumpul, dan filter transaksi peminjaman berdasarkan periode tanggal.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 mt-10">
        {/* Stats Summary Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Judul Buku */}
          <div className="border border-[#3D1E1E]/10 bg-[#3D1E1E]/5 p-1.5 rounded-2xl">
            <div className="bg-white border border-[#3D1E1E]/15 p-6 rounded-[calc(1rem-2px)] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E6E6E] mb-1">Judul Buku</p>
                <h3 className="font-display font-bold text-3xl text-[#1B1B1B]">{books.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#3D1E1E]/10 flex items-center justify-center text-[#FA0F00]">
                <BookOpen className="w-5 h-5" weight="bold" />
              </div>
            </div>
          </div>

          {/* Card 2: Salinan Buku */}
          <div className="border border-[#3D1E1E]/10 bg-[#3D1E1E]/5 p-1.5 rounded-2xl">
            <div className="bg-white border border-[#3D1E1E]/15 p-6 rounded-[calc(1rem-2px)] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E6E6E] mb-1">Total Salinan</p>
                <h3 className="font-display font-bold text-3xl text-[#1B1B1B]">
                  {books.reduce((acc, b) => acc + b.stock, 0)}
                  <span className="text-sm text-[#9E9E9E] font-sans font-medium"> / {books.reduce((acc, b) => acc + b.maxStock, 0)}</span>
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#3D1E1E]/10 flex items-center justify-center text-[#FA0F00]">
                <TrendUp className="w-5 h-5" weight="bold" />
              </div>
            </div>
          </div>

          {/* Card 3: Anggota */}
          <div className="border border-[#3D1E1E]/10 bg-[#3D1E1E]/5 p-1.5 rounded-2xl">
            <div className="bg-white border border-[#3D1E1E]/15 p-6 rounded-[calc(1rem-2px)] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E6E6E] mb-1">Anggota Aktif</p>
                <h3 className="font-display font-bold text-3xl text-[#1B1B1B]">{members.filter(m => m.status === 'active').length}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#3D1E1E]/10 flex items-center justify-center text-[#FA0F00]">
                <Users className="w-5 h-5" weight="bold" />
              </div>
            </div>
          </div>

          {/* Card 4: Total Denda */}
          <div className="border border-[#3D1E1E]/10 bg-[#3D1E1E]/5 p-1.5 rounded-2xl">
            <div className="bg-white border border-[#3D1E1E]/15 p-6 rounded-[calc(1rem-2px)] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E6E6E] mb-1">Total Denda</p>
                <h3 className="font-display font-bold text-2xl text-green-600">
                  Rp {allTransactions.reduce((acc, tx) => acc + (tx.fine || 0), 0).toLocaleString('id-ID')}
                </h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#FAF6F0] border border-[#3D1E1E]/10 flex items-center justify-center text-green-600">
                <Coin className="w-5 h-5" weight="bold" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Date Range Form */}
        <div className="bg-white border border-[#D3D3D3] rounded-lg p-6 mb-8 text-left text-xs">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#F0F0F0]">
            <Funnel className="w-4 h-4 text-[#FA0F00]" />
            <h4 className="font-bold text-sm text-[#1B1B1B] uppercase tracking-wider">Filter Periode Laporan</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-1">
              <label className="font-bold text-[#6E6E6E] tracking-wider uppercase block">Tanggal Mulai</label>
              <input
                type="date"
                value={reportStartDate}
                onChange={(e) => setReportStartDate(e.target.value)}
                className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md px-3 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA0F00] focus:bg-white transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-[#6E6E6E] tracking-wider uppercase block">Tanggal Akhir</label>
              <input
                type="date"
                value={reportEndDate}
                onChange={(e) => setReportEndDate(e.target.value)}
                className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md px-3 py-2 text-xs text-[#1B1B1B] focus:outline-none focus:border-[#FA0F00] focus:bg-white transition-all"
              />
            </div>
            <div>
              <button
                onClick={() => {
                  setReportStartDate('');
                  setReportEndDate('');
                }}
                className="w-full bg-[#FAF6F0] hover:bg-[#EAE3D2] border border-[#3D1E1E]/15 text-[#3D1E1E] font-semibold py-2 rounded-md shadow-sm transition-all text-xs font-mono uppercase tracking-wider"
              >
                Reset Filter
              </button>
            </div>
          </div>
        </div>

        {/* Filtered List Double-Bezel Card Container */}
        <div className="border border-[#3D1E1E]/10 bg-[#3D1E1E]/5 p-2 rounded-2xl">
          <div className="bg-white border border-[#3D1E1E]/15 rounded-[calc(1rem-2px)] overflow-hidden">
            <div className="px-6 py-4 bg-[#FAF6F0] border-b border-[#D3D3D3] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="font-display font-bold text-base text-[#3D1E1E]">Log Sirkulasi Terfilter</h3>
              
              {/* Filter stats summary */}
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#6E6E6E] bg-[#3D1E1E]/5 px-2.5 py-1 rounded">
                Peminjaman: {filtered.length} | Denda: Rp {totalFineInPeriod.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAF6F0]/50 border-b border-[#D3D3D3] text-[9px] font-mono font-bold uppercase tracking-wider text-[#6E6E6E]">
                    <th className="py-3.5 px-6">ID Transaksi</th>
                    <th className="py-3.5 px-6">Anggota</th>
                    <th className="py-3.5 px-6">Buku</th>
                    <th className="py-3.5 px-6">Tanggal Pinjam</th>
                    <th className="py-3.5 px-6">Tanggal Kembali</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Denda Terbayar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0] text-xs">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#9E9E9E] font-medium font-sans">
                        Tidak ada sirkulasi peminjaman di rentang tanggal ini.
                      </td>
                    </tr>
                  ) : (
                    filtered.map(tx => (
                      <tr key={tx.id} className="hover:bg-[#FAF9F9]/50 transition-colors">
                        <td className="py-3.5 px-6 font-mono font-bold text-[#1B1B1B]">{tx.id}</td>
                        <td className="py-3.5 px-6">
                          <p className="font-bold text-[#1B1B1B]">{members.find(m => m.id === tx.userId)?.name || tx.userId}</p>
                          <p className="text-[9px] font-mono text-[#6E6E6E]">{tx.userId}</p>
                        </td>
                        <td className="py-3.5 px-6 font-bold text-[#1B1B1B]">{tx.bookTitle}</td>
                        <td className="py-3.5 px-6 font-mono text-[10px] text-[#6E6E6E]">{tx.borrowDate}</td>
                        <td className="py-3.5 px-6 font-mono text-[10px] text-[#6E6E6E]">{tx.returnDate || '-'}</td>
                        <td className="py-3.5 px-6">
                          <span className={`inline-block rounded-full text-[9px] font-bold tracking-wider px-2 py-0.5 uppercase ${
                            tx.status === 'returned'
                              ? 'bg-green-50 border border-green-200 text-green-600'
                              : 'bg-blue-50 border border-blue-200 text-blue-600'
                          }`}>
                            {tx.status === 'returned' ? 'Kembali' : 'Dipinjam'}
                          </span>
                        </td>
                        <td className="py-3.5 px-6 text-right font-mono font-bold">
                          {tx.fine && tx.fine > 0 ? (
                            <span className="text-[#FA0F00]">Rp {tx.fine.toLocaleString('id-ID')}</span>
                          ) : (
                            <span className="text-[#9E9E9E]">Rp 0</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
