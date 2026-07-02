import React from 'react';
import aboutLibraryTeamImg from '../assets/about-library-team.png';
import { ContactSection } from './ContactSection';
import { LocationMap } from './LocationMap';

export const AboutPage: React.FC = () => {
  return (
    <>
      {/* About Us Split Header Section */}
      <section className="w-full bg-[#FAF6F0] py-16 relative z-10 font-sans text-left">
        <div className="max-w-7xl mx-auto px-6 relative">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-8">
            {/* Left Side: Collaboration Image */}
            <div className="lg:col-span-6 relative min-h-[350px] lg:min-h-[480px] rounded-sm overflow-hidden border border-[#D3D3D3] shadow-lg">
              <img
                src={aboutLibraryTeamImg}
                alt="AtmaLibrary Team & Visitors"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Subtle vignette gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
            </div>

            {/* Right Side: Content Panel (Overlap Box) */}
            <div className="lg:col-span-6 bg-[#E5D7D7]/90 text-[#1B1B1B] border border-[#CBB8B8] rounded-sm p-8 lg:p-14 flex flex-col justify-center text-left shadow-2xl lg:-ml-16 z-10 my-6 relative">
              <h2 className="font-display font-bold text-4xl text-[#1B1B1B] tracking-tight leading-[1.1] mb-6">
                Our Library
              </h2>
              <p className="text-sm text-[#4A4A4A] leading-relaxed font-medium mb-6">
                AtmaLibrary adalah pusat pembelajaran kolaboratif yang didirikan dengan visi untuk memberdayakan komunitas Surabaya melalui penyediaan akses literasi tanpa batas. Kami mengintegrasikan teknologi sirkulasi digital mandiri dengan kenyamanan ruang baca fisik yang inklusif.
              </p>
              <p className="text-sm text-[#4A4A4A] leading-relaxed font-medium">
                Setiap sudut perpustakaan dirancang untuk memfasilitasi diskusi, penelitian mendalam, dan kreasi bersama. Kami menyelenggarakan berbagai program virtual dan fisik mingguan untuk menghubungkan pembaca, penulis, serta profesional lintas bidang.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />

      {/* Staff & Board Members Section */}
      <section className="w-full bg-[#FAF9F9] py-24 relative z-20 font-sans text-left">
        <div className="max-w-4xl mx-auto px-6 relative">

          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[#1B1B1B] tracking-tight mb-4">
              Staff & Board Members
            </h2>
            <p className="text-sm text-[#6E6E6E] max-w-lg mx-auto font-medium leading-relaxed">
              Kenali tim profesional dan dewan pengarah yang berdedikasi tinggi dalam mengelola layanan, program sirkulasi, dan pengembangan berkelanjutan AtmaLibrary.
            </p>
          </div>

          {/* Staff & Board List Card Box */}
          <div className="bg-white border border-[#D3D3D3] rounded-sm p-12 shadow-sm relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-center">
              {/* Column 1: Staff */}
              <div>
                <h3 className="font-display font-bold text-xl text-[#1B1B1B] border-b border-[#D3D3D3] pb-4 mb-8 uppercase tracking-wider">
                  Staff
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-display font-bold text-base text-[#1B1B1B]">Tony Rafly Sudarsono</h4>
                    <p className="text-xs text-[#6E6E6E] font-mono mt-0.5">Library Director</p>
                  </div>
                </div>
              </div>

              {/* Column 2: Board */}
              <div>
                <h3 className="font-display font-bold text-xl text-[#1B1B1B] border-b border-[#D3D3D3] pb-4 mb-8 uppercase tracking-wider">
                  Board
                </h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-display font-bold text-base text-[#1B1B1B]">Adrian Faishal Hilmy</h4>
                    <p className="text-xs text-[#6E6E6E] font-mono mt-0.5">Chair</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />
      <ContactSection />
      <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />
      <LocationMap />
    </>
  );
};
