import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, IdentificationCard, WarningCircle } from '@phosphor-icons/react';

import { mockDb } from '../data/mockDb';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { name: string; id: string; role: 'member' | 'admin' }) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const users = mockDb.getUsers();
      const match = users.find(
        u => u.id.toLowerCase() === memberId.trim().toLowerCase() && u.pass === password
      );

      setIsLoading(false);
      if (match) {
        if (match.status === 'inactive') {
          setError('Akun Anda dinonaktifkan oleh administrator.');
          return;
        }
        onLoginSuccess({ name: match.name, id: match.id, role: match.role });
        setMemberId('');
        setPassword('');
        onClose();
      } else {
        setError('ID atau password salah. Coba MEM001 / password atau ADM001 / password.');
      }
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1B1B1B]/40 backdrop-blur-sm"
          />

          {/* Modal Container - Adobe Spectrum style (8px border-radius, clean border) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.45, 0, 0.40, 1] }}
            className="relative w-full max-w-md z-10 bg-white border border-[#D3D3D3] rounded-lg shadow-xl p-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-7 h-7 rounded-md bg-[#F5F5F5] hover:bg-[#E8E8E8] border border-[#D3D3D3] flex items-center justify-center text-[#6E6E6E] hover:text-[#1B1B1B] transition-all duration-130"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-8">
              <h3 className="font-display font-bold text-2xl text-[#1B1B1B] tracking-tight">
                Autentikasi Anggota
              </h3>
              <p className="text-xs text-[#6E6E6E] mt-2 font-mono">
                Masuk untuk mengakses sirkulasi peminjaman digital.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Member ID Field */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-[#1B1B1B] tracking-wider uppercase block">
                  ID Anggota
                </label>
                <div className="relative">
                  <IdentificationCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E6E6E]" />
                  <input
                    type="text"
                    value={memberId}
                    onChange={e => setMemberId(e.target.value)}
                    placeholder="Contoh: MEM001"
                    required
                    className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md pl-12 pr-4 py-3 text-sm text-[#1B1B1B] placeholder-[#6E6E6E]/60 focus:outline-none focus:border-[#0265DC] focus:bg-white transition-all duration-130"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-[#1B1B1B] tracking-wider uppercase block">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E6E6E]" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Masukan sandi..."
                    required
                    className="w-full bg-[#F5F5F5] border border-[#D3D3D3] rounded-md pl-12 pr-4 py-3 text-sm text-[#1B1B1B] placeholder-[#6E6E6E]/60 focus:outline-none focus:border-[#0265DC] focus:bg-white transition-all duration-130"
                  />
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-2.5 bg-red-50 border border-red-200 p-3 rounded-md text-left"
                  >
                    <WarningCircle className="w-5 h-5 text-[#FA0F00] shrink-0 mt-0.5" />
                    <span className="text-xs text-[#FA0F00] font-semibold leading-relaxed">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FA0F00] hover:bg-[#E00D00] text-white font-semibold py-3 rounded-md shadow-sm transition-all duration-130 btn-pressable flex items-center justify-center text-sm gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Masuk Ke Dashboard'
                )}
              </button>
            </form>

            {/* Demo credentials helper */}
            <div className="mt-8 pt-6 border-t border-[#D3D3D3] text-left bg-[#F5F5F5] p-4 rounded-md border border-[#D3D3D3]">
              <h4 className="text-[10px] font-bold text-[#6E6E6E] tracking-wider uppercase mb-2 font-mono">
                Uji Coba:
              </h4>
              <div className="space-y-1 font-mono text-[10px] text-[#6E6E6E]">
                <p>
                  Anggota: <span className="text-[#0265DC] font-bold">MEM001</span> (Adrian Wijaya) - Sandi: password
                </p>
                <p>
                  Admin: <span className="text-[#FA0F00] font-bold">ADM001</span> (Admin Perpustakaan) - Sandi: password
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
