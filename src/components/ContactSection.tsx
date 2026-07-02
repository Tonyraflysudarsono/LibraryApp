import React from 'react';

export const ContactSection: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Pesan Anda telah terkirim. Terima kasih!');
  };

  return (
    <section className="w-full bg-[#FAF9F9] py-24 relative z-20 font-sans">
      <div className="max-w-6xl mx-auto px-6 relative">


        <div className="text-center md:text-left mb-16 max-w-2xl">
          <h2 className="font-display font-bold text-4xl text-[#1B1B1B] tracking-tight mb-4">
            Contact
          </h2>
          <p className="text-sm text-[#6E6E6E] font-medium leading-relaxed">
            Hubungi kami untuk mempelajari lebih lanjut tentang rilis koleksi buku terbaru, event virtual, serta layanan peminjaman sirkulasi mandiri digital.
          </p>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Col 1: Address */}
          <div className="md:col-span-3 text-left">
            <h3 className="font-display font-bold text-lg text-[#1B1B1B] mb-6 tracking-wide">
              Address
            </h3>
            <p className="text-sm text-[#6E6E6E] leading-relaxed font-medium mb-6">
              Jl. Babarsari No.44, <br />
              Janti, Caturtunggal, Depok, <br />
              Sleman, Yogyakarta 55281
            </p>
            <p className="text-sm text-[#6E6E6E] leading-relaxed font-medium">
              Telp: 123-456-7890 <br />
              Email: info@atmalibrary.org
            </p>
          </div>

          {/* Col 2: Opening Hours & Socials */}
          <div className="md:col-span-3 text-left">
            <h3 className="font-display font-bold text-lg text-[#1B1B1B] mb-6 tracking-wide">
              Opening Hours
            </h3>
            <p className="text-sm text-[#6E6E6E] leading-relaxed font-medium mb-8">
              Mon - Fri: 8am - 8pm <br />
              Saturday: 9am - 7pm <br />
              Sunday: 9am - 8pm
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-4 items-center">
              <a href="#" className="w-8 h-8 rounded-full border border-[#D3D3D3] hover:border-[#FA0F00] hover:text-[#FA0F00] flex items-center justify-center text-[#6E6E6E] transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-[#D3D3D3] hover:border-[#FA0F00] hover:text-[#FA0F00] flex items-center justify-center text-[#6E6E6E] transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014 3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full border border-[#D3D3D3] hover:border-[#FA0F00] hover:text-[#FA0F00] flex items-center justify-center text-[#6E6E6E] transition-all">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 3: Ask Us Anything Form */}
          <div className="md:col-span-6 text-left">
            <h3 className="font-display font-bold text-lg text-[#1B1B1B] mb-6 tracking-wide">
              Ask Us Anything
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">First Name *</label>
                  <input required type="text" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Last Name *</label>
                  <input required type="text" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Email *</label>
                  <input required type="email" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Subject</label>
                  <input type="text" className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-1">Leave us a message...</label>
                <textarea rows={3} className="w-full bg-transparent border-b border-[#D3D3D3] focus:border-[#FA0F00] transition-colors py-2 text-sm text-[#1B1B1B] outline-none resize-none" />
              </div>

              <button type="submit" className="bg-[#FA0F00] hover:bg-[#E00D00] text-white px-8 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-130 btn-pressable">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
