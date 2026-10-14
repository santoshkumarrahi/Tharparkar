import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight, Maximize2, Sparkles } from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'Landscapes' | 'Heritage' | 'Culture';
  location: string;
  src: string;
  description: string;
}

export const GallerySection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'gal-1',
      title: 'Mithi Sunset, Decorated Camel & Monument Tower',
      category: 'Landscapes',
      location: 'Gadhi Bhit, Mithi',
      src: '/hero-tharparkar.jpg',
      description: 'The golden desert sunset over Gadhi Bhit sand dune, with the iconic brick tower monument, decorated camel, and the famous I Love Mithi landmark.'
    },
    {
      id: 'gal-2',
      title: 'Karoonjhar Mountains Pink Granite Range',
      category: 'Landscapes',
      location: 'Nagarparkar Valley',
      src: '/karoonjhar.jpg',
      description: 'The pre-Cambrian pink granite mountains of Karoonjhar rising dramatically above green monsoon pastures and tranquil Thari settlements.'
    },
    {
      id: 'gal-3',
      title: 'Historic 1814 Naukot Fort — Gateway to Thar Desert',
      category: 'Heritage',
      location: 'Naukot, Tharparkar',
      src: '/naukot-fort.jpg',
      description: 'The imposing mud-brick and fired-brick ramparts, grand arched gateway, and bastion towers built in 1814 by Mir Karam Ali Khan Talpur.'
    },
    {
      id: 'gal-4',
      title: 'Authentic Hand-Stitched Ralli Quilts & Mirror Embroidery',
      category: 'Culture',
      location: 'Shahi Bazaar, Mithi & Diplo',
      src: '/thar-crafts.jpg',
      description: 'Vibrant geometric patchwork Ralli quilts and traditional mirror-work textiles handcrafted by skilled village women artisans of Tharparkar.'
    }
  ];

  const filtered = galleryItems.filter(
    (item) => activeFilter === 'All' || item.category === activeFilter
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filtered.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length);
    }
  };

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#25251F] text-[#F8F4EC] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B786]/20 text-[#D8B786] text-xs font-bold uppercase tracking-widest mb-3">
              <Camera className="w-3.5 h-3.5" />
              <span>Visual Documentary</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8F4EC] tracking-tight">
              Image Gallery — Spirit of Tharparkar
            </h2>
            <div className="w-20 h-1 bg-[#9A542E] my-4 rounded-full" />
            <p className="text-base text-white/70 leading-relaxed">
              Experience the visual grandeur of the Thar desert, its architectural wonders, and deep-rooted cultural heritage.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-2">
            {['All', 'Landscapes', 'Heritage', 'Culture'].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeFilter === f
                    ? 'bg-[#9A542E] text-white shadow-md'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden cursor-pointer shadow-xl border border-white/10 hover:border-[#D8B786]/50 transition-all duration-300"
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-[11px] font-bold text-[#D8B786] uppercase tracking-wider mb-1">
                  {item.category} • {item.location}
                </span>
                <h3 className="text-xl font-bold font-serif leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-white/80 line-clamp-2 mt-1">
                  {item.description}
                </p>
              </div>

              <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-[#D8B786]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in">
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={filtered[lightboxIndex].src}
              alt={filtered[lightboxIndex].title}
              className="max-h-[70vh] w-auto object-contain rounded-xl shadow-2xl mb-4"
            />
            <div className="text-center text-white max-w-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D8B786]">
                {filtered[lightboxIndex].location}
              </span>
              <h4 className="text-xl font-bold font-serif mt-1">
                {filtered[lightboxIndex].title}
              </h4>
              <p className="text-xs text-white/80 mt-1">
                {filtered[lightboxIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
