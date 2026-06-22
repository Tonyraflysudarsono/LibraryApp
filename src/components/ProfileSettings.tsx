import React from 'react';
import { ContactSection } from './ContactSection';
import { LocationMap } from './LocationMap';

interface ProfileSettingsProps {
  user: { name: string; id: string; role?: 'member' | 'admin' } | null;
  profileData: {
    name: string;
    email: string;
    phone: string;
    memberTier: string;
    joinDate: string;
    whatsappNotif: boolean;
    emailNotif: boolean;
  };
  handleSaveProfile: (
    name: string,
    email: string,
    phone: string,
    whatsappNotif: boolean,
    emailNotif: boolean
  ) => void;
  handlePasswordReset: (
    currentPass: string,
    newPass: string,
    confirmPass: string
  ) => boolean;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  user,
  profileData,
  handleSaveProfile,
  handlePasswordReset
}) => {
  return (
    <>
      {/* Header Section */}
      <section className="w-full bg-[#FAF6F0] py-20 text-center relative z-10 font-sans">
        <div className="max-w-4xl mx-auto px-6">
          <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-[#3D1E1E]/10 text-[#3D1E1E] mb-3 inline-block">
            Pengaturan Akun
          </span>
          <h1 className="font-display font-medium text-5xl md:text-6xl text-[#3D1E1E] mb-6">
            Profile Settings
          </h1>
          <div className="w-12 h-[2px] bg-[#3D1E1E] mx-auto mb-6" />
          <p className="text-sm md:text-base text-[#6E6E6E] max-w-xl mx-auto font-medium leading-relaxed">
            Perbarui informasi profil Anda, ubah kata sandi, dan kelola preferensi notifikasi peminjaman buku.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto border-t border-[#D3D3D3]" />

      {/* Content Section */}
      <section className="w-full bg-white py-16 relative z-20 font-sans text-left">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column - User Summary Bezel Card */}
            <div className="lg:col-span-4 space-y-6">
              <div className="border border-[#3D1E1E]/15 bg-[#3D1E1E]/5 p-2 rounded-2xl">
                <div className="bg-[#FAF6F0] border border-[#3D1E1E] p-8 rounded-[calc(1rem-2px)] text-center">
                  {/* Avatar editing circle */}
                  <div className="relative w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[#3D1E1E] bg-white group">
                    <img
                      src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${profileData.name || 'Adrian'}`}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer">
                      Ubah
                    </div>
                  </div>
                  
                  {/* Username & Tier */}
                  <h3 className="font-display font-medium text-2xl text-[#3D1E1E] mb-1">
                    {profileData.name}
                  </h3>
                  <span className="inline-block rounded-full bg-[#FA0F00]/10 border border-[#FA0F00]/30 text-[#FA0F00] text-[10px] font-bold tracking-wider px-3 py-0.5 uppercase mb-6">
                    {profileData.memberTier}
                  </span>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 border-t border-[#3D1E1E]/20 pt-6 text-left">
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-wider text-[#6E6E6E] mb-0.5">ID Anggota</p>
                      <p className="text-xs font-bold text-[#1B1B1B] font-mono">{user?.id || 'M-001'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-wider text-[#6E6E6E] mb-0.5">Terdaftar Sejak</p>
                      <p className="text-xs font-bold text-[#1B1B1B]">{profileData.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Member Limit Alert */}
              <div className="border border-[#3D1E1E]/15 bg-[#3D1E1E]/5 p-2 rounded-2xl">
                <div className="bg-white border border-[#3D1E1E] p-6 rounded-[calc(1rem-2px)] text-left space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B1B1B]">Limit Sirkulasi</h4>
                  <div className="w-full bg-[#E8E8E8] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#FA0F00] h-full rounded-full" style={{ width: '33%' }}></div>
                  </div>
                  <p className="text-[11px] text-[#6E6E6E] leading-relaxed">
                    Anda sedang meminjam **1 dari 3** batas maksimal buku yang diperbolehkan.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Forms Bento */}
            <div className="lg:col-span-8 space-y-8">
              {/* Bezel 1: Personal Details */}
              <div className="border border-[#3D1E1E]/15 bg-[#3D1E1E]/5 p-2 rounded-2xl">
                <div className="bg-white border border-[#3D1E1E] p-8 rounded-[calc(1rem-2px)] text-left">
                  <h3 className="font-display font-medium text-2xl text-[#3D1E1E] mb-6 pb-2 border-b border-[#F0F0F0]">
                    Detail Pribadi
                  </h3>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const name = formData.get('name') as string;
                    const email = formData.get('email') as string;
                    const phone = formData.get('phone') as string;
                    const whatsappNotif = formData.get('whatsappNotif') === 'on';
                    const emailNotif = formData.get('emailNotif') === 'on';
                    handleSaveProfile(name, email, phone, whatsappNotif, emailNotif);
                  }} className="space-y-6">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-2">Nama Lengkap *</label>
                        <input
                          required
                          name="name"
                          type="text"
                          defaultValue={profileData.name}
                          className="w-full bg-[#FAF9F9] border border-[#D3D3D3] rounded-sm py-2.5 px-4 text-sm text-[#1B1B1B] focus:border-[#FA0F00] focus:bg-white outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-2">Alamat Email *</label>
                        <input
                          required
                          name="email"
                          type="email"
                          defaultValue={profileData.email}
                          className="w-full bg-[#FAF9F9] border border-[#D3D3D3] rounded-sm py-2.5 px-4 text-sm text-[#1B1B1B] focus:border-[#FA0F00] focus:bg-white outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-2">Nomor Telepon</label>
                        <input
                          name="phone"
                          type="text"
                          defaultValue={profileData.phone}
                          className="w-full bg-[#FAF9F9] border border-[#D3D3D3] rounded-sm py-2.5 px-4 text-sm text-[#1B1B1B] focus:border-[#FA0F00] focus:bg-white outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-2">Tingkat Keanggotaan</label>
                        <input
                          disabled
                          type="text"
                          value={profileData.memberTier}
                          className="w-full bg-[#F5F5F5] border border-[#E8E8E8] rounded-sm py-2.5 px-4 text-sm text-[#6E6E6E] outline-none cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Preferences Checkbox switches */}
                    <div className="pt-4 border-t border-[#F0F0F0] space-y-4">
                      <h4 className="text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-2">Preferensi Notifikasi</h4>
                      
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-xs font-bold text-[#1B1B1B]">WhatsApp Alerts</p>
                          <p className="text-[10px] text-[#6E6E6E]">Terima pengingat jatuh tempo sirkulasi via WhatsApp.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input name="whatsappNotif" type="checkbox" defaultChecked={profileData.whatsappNotif} className="sr-only peer" />
                          <div className="w-9 h-5 bg-[#E8E8E8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#D3D3D3] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FA0F00]"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-xs font-bold text-[#1B1B1B]">Email Newsletter</p>
                          <p className="text-[10px] text-[#6E6E6E]">Dapatkan rekomendasi buku mingguan dan rilis event baru.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input name="emailNotif" type="checkbox" defaultChecked={profileData.emailNotif} className="sr-only peer" />
                          <div className="w-9 h-5 bg-[#E8E8E8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#D3D3D3] after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FA0F00]"></div>
                        </label>
                      </div>
                    </div>

                    {/* Save Button-in-Button */}
                    <div className="pt-6 border-t border-[#F0F0F0] flex justify-end">
                      <button
                        type="submit"
                        className="group bg-[#FA0F00] hover:bg-[#E00D00] text-white pl-6 pr-2 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-300 btn-pressable flex items-center gap-3 cursor-pointer"
                      >
                        <span>Simpan Profil</span>
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-105">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 256 256">
                            <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/>
                          </svg>
                        </div>
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Bezel 2: Password Update */}
              <div className="border border-[#3D1E1E]/15 bg-[#3D1E1E]/5 p-2 rounded-2xl">
                <div className="bg-white border border-[#3D1E1E] p-8 rounded-[calc(1rem-2px)] text-left">
                  <h3 className="font-display font-medium text-2xl text-[#3D1E1E] mb-6 pb-2 border-b border-[#F0F0F0]">
                    Ubah Kata Sandi
                  </h3>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const currentPass = formData.get('currentPass') as string;
                    const newPass = formData.get('newPass') as string;
                    const confirmPass = formData.get('confirmPass') as string;
                    const success = handlePasswordReset(currentPass, newPass, confirmPass);
                    if (success) {
                      e.currentTarget.reset();
                    }
                  }} className="space-y-6">
                    <div>
                      <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-2">Kata Sandi Sekarang *</label>
                      <input
                        required
                        name="currentPass"
                        type="password"
                        className="w-full bg-[#FAF9F9] border border-[#D3D3D3] rounded-sm py-2.5 px-4 text-sm text-[#1B1B1B] focus:border-[#FA0F00] focus:bg-white outline-none transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-2">Kata Sandi Baru *</label>
                        <input
                          required
                          name="newPass"
                          type="password"
                          className="w-full bg-[#FAF9F9] border border-[#D3D3D3] rounded-sm py-2.5 px-4 text-sm text-[#1B1B1B] focus:border-[#FA0F00] focus:bg-white outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-mono text-[#6E6E6E] uppercase tracking-wider mb-2">Konfirmasi Kata Sandi Baru *</label>
                        <input
                          required
                          name="confirmPass"
                          type="password"
                          className="w-full bg-[#FAF9F9] border border-[#D3D3D3] rounded-sm py-2.5 px-4 text-sm text-[#1B1B1B] focus:border-[#FA0F00] focus:bg-white outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Save Button-in-Button */}
                    <div className="pt-6 border-t border-[#F0F0F0] flex justify-end">
                      <button
                        type="submit"
                        className="group bg-[#3D1E1E] hover:bg-[#2A1515] text-white pl-6 pr-2 py-2 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-300 btn-pressable flex items-center gap-3 cursor-pointer"
                      >
                        <span>Perbarui Kata Sandi</span>
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white transition-all duration-300 group-hover:scale-105">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 256 256">
                            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192A88,88,0,1,1,216,128,88.1,88.1,0,0,1,128,216Zm12-88a12,12,0,1,1-12-12A12,12,0,0,1,140,128Z"/>
                          </svg>
                        </div>
                      </button>
                    </div>
                  </form>
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
