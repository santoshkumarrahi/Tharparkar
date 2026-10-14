import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Camera,
  ExternalLink,
  CheckCircle2,
  Mountain,
  Castle,
  Landmark,
  Sun
} from 'lucide-react';
import { DirectoryItem } from '../types.ts';

interface DestinationsSectionProps {
  items: DirectoryItem[];
  onSelectItem: (item: DirectoryItem) => void;
  onExploreMap: () => void;
}

export const DestinationsSection: React.FC<DestinationsSectionProps> = ({
  items,
  onSelectItem,
  onExploreMap
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const destinations = items.filter((item) => item.category === 'destination');

  const filtered = destinations.filter((dest) => {
    if (filterType === 'all') return true;
    return dest.subCategory === filterType;
  });

  return (
    <section id="destinations" className="py-20 lg:py-28 bg-[#25251F] text-[#F8F4EC] relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#9A542E]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D8B786]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B786]/20 text-[#D8B786] text-xs font-bold uppercase tracking-widest mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Cultural Wonders & Scenic Landscapes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8F4EC] tracking-tight">
              Famous Tourist Destinations
            </h2>
            <div className="w-20 h-1 bg-[#9A542E] my-4 rounded-full" />
            <p className="text-base text-white/70 leading-relaxed">
              From the highest sunset dune of Gadhi Bhit in Mithi to the ancient pink granite peaks of Karoonjhar in Nagarparkar and the Talpur fortress at Naukot.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Destinations' },
              { id: 'viewpoint', label: 'Viewpoints & Dunes' },
              { id: 'natural_landscape', label: 'Karoonjhar Mountains' },
              { id: 'heritage_site', label: 'Historic Forts & Mosques' },
              { id: 'religious_site', label: 'Temples & Ashrams' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterType === tab.id
                    ? 'bg-[#9A542E] text-white shadow-md'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectItem(dest)}
              className="group bg-[#1C1C17] border border-[#D8B786]/20 rounded-2xl overflow-hidden hover:border-[#D8B786]/60 transition-all duration-300 hover:-translate-y-1.5 shadow-xl cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Photo container */}
                <div className="relative h-56 sm:h-64 overflow-hidden bg-black">
                  <img
                    src={dest.photos[0] || '/hero-tharparkar.jpg'}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C17] via-transparent to-black/40" />

                  <div className="absolute top-3 left-3 bg-[#25251F]/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-[#D8B786] border border-[#D8B786]/30 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-[#9A542E]" />
                    <span>{dest.town}</span>
                  </div>

                  <div className="absolute top-3 right-3 bg-emerald-600/90 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    Verified Heritage
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D8B786] block mb-1">
                    {dest.subCategory.replace(/_/g, ' ')}
                  </span>
                  <h3 className="text-xl font-bold font-serif text-[#F8F4EC] group-hover:text-[#D8B786] transition-colors leading-snug">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-white/70 line-clamp-3 mt-2.5 leading-relaxed">
                    {dest.description}
                  </p>

                  {/* Highlights pills */}
                  {dest.programsOrServices && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {dest.programsOrServices.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/80 font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action footer */}
              <div className="px-6 pb-6 pt-0">
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[#D8B786] group-hover:text-white transition-colors">
                  <span>Explore Destination History &rarr;</span>
                  <span className="text-white/40 group-hover:text-[#D8B786]">
                    Details
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#9A542E]/30 via-[#25251F] to-[#D8B786]/20 border border-[#D8B786]/30 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-[#F8F4EC]">
              View All Heritage Sites on the Geographic District Map
            </h4>
            <p className="text-xs sm:text-sm text-white/70 mt-1 max-w-xl">
              Pinpoint ancient temples, mountain springs, fortresses, and sunset dunes with live route directions and distances.
            </p>
          </div>
          <button
            onClick={onExploreMap}
            className="px-6 py-3 rounded-xl bg-[#9A542E] hover:bg-[#b06135] text-white text-xs sm:text-sm font-semibold transition-all shrink-0 shadow-lg flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#D8B786]" />
            <span>Open District Map</span>
          </button>
        </div>
      </div>
    </section>
  );
};
