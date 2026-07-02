import React from 'react';

export const LocationMap: React.FC = () => {
  return (
    <section className="w-full relative z-20 h-[450px] overflow-hidden font-sans">
      {/* OpenStreetMap iframe */}
      <iframe 
        src="https://www.openstreetmap.org/export/embed.html?bbox=112.7555%2C-7.2750%2C112.7615%2C-7.2700&amp;layer=mapnik"
        title="AtmaLibrary Location Map"
        className="w-full h-full border-none grayscale contrast-115 hover:grayscale-0 transition-all duration-700 ease-in-out"
      />

      {/* Location Pin Overlay Popup */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[120px] bg-white border border-[#D3D3D3] p-4 pr-10 shadow-xl rounded-sm z-30 min-w-[200px] text-left">
        <button 
          onClick={(e) => { e.currentTarget.parentElement?.remove(); }}
          className="absolute top-2 right-2 text-[#9E9E9E] hover:text-[#1B1B1B] text-xs font-bold font-mono transition-colors"
          title="Close"
        >
          ✕
        </button>
        <h4 className="font-display font-bold text-xs uppercase tracking-widest text-[#FA0F00] mb-1">
          ATMA LIBRARY
        </h4>
        <p className="text-[10px] font-mono font-bold text-[#6E6E6E]">
          Surabaya, Indonesia
        </p>
        {/* Marker indicator triangle pointing down */}
        <div className="absolute bottom-[-6px] left-[20px] w-3 h-3 bg-white border-r border-b border-[#D3D3D3] rotate-45" />
      </div>
    </section>
  );
};
