import React, { useState, useEffect } from 'react';
import { X, QrCode, CheckCircle } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'motion/react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (data: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const [scanState, setScanState] = useState<'scanning' | 'success'>('scanning');

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setScanState('scanning');
    }
  }, [isOpen]);

  // Mock scan after 2.5 seconds
  useEffect(() => {
    let timer: number;
    if (isOpen && scanState === 'scanning') {
      timer = setTimeout(() => {
        setScanState('success');
        setTimeout(() => {
          onScanSuccess('MOCK_BOOK_QR_DATA');
          onClose();
        }, 1500);
      }, 2500) as unknown as number;
    }
    return () => clearTimeout(timer);
  }, [isOpen, scanState, onClose, onScanSuccess]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#1B1B1B]/80 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#D3D3D3]">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#1B1B1B]" />
                <h3 className="font-display font-bold text-[#1B1B1B] text-base">Self-Checkout Scanner</h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[#F5F5F5] rounded-full transition-colors text-[#6E6E6E] hover:text-[#1B1B1B]"
                aria-label="Tutup scanner"
              >
                <X className="w-4 h-4" weight="bold" />
              </button>
            </div>

            {/* Scanner Area */}
            <div className="relative aspect-square w-full bg-[#1B1B1B] flex flex-col items-center justify-center overflow-hidden">
              {scanState === 'scanning' ? (
                <>
                  <div className="absolute inset-0 opacity-20 pointer-events-none" 
                       style={{ backgroundImage: 'radial-gradient(circle, #FA0F00 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                  </div>
                  {/* Scanning Grid Frame */}
                  <div className="relative w-48 h-48 border-2 border-white/20 rounded-xl overflow-hidden flex items-center justify-center">
                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FA0F00] rounded-tl-xl"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FA0F00] rounded-tr-xl"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#FA0F00] rounded-bl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#FA0F00] rounded-br-xl"></div>

                    {/* Laser line */}
                    <motion.div 
                      animate={{ y: [-90, 90, -90] }}
                      transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                      className="absolute w-full h-0.5 bg-[#FA0F00] shadow-[0_0_8px_2px_rgba(250,15,0,0.5)] z-10"
                    />
                  </div>
                  <p className="absolute bottom-6 text-white/70 text-xs font-mono tracking-widest uppercase">
                    Arahkan kamera ke QR Code Buku
                  </p>
                </>
              ) : (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4 text-white"
                >
                  <div className="w-20 h-20 rounded-full bg-[#008000]/20 flex items-center justify-center">
                    <CheckCircle className="w-12 h-12 text-[#008000]" weight="fill" />
                  </div>
                  <p className="font-display font-bold text-lg">Buku Terdeteksi!</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
