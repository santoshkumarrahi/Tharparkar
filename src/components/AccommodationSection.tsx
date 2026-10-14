import React, { useState } from 'react';
import {
  Hotel,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Phone,
  Bed,
  Wifi,
  Sparkles,
  Search,
  Calendar
} from 'lucide-react';
import { DirectoryItem } from '../types.ts';

interface AccommodationSectionProps {
  items: DirectoryItem[];
  onSelectItem: (item: DirectoryItem) => void;
  onInquiryClick: (hotelName: string) => void;
}

export const AccommodationSection: React.FC<AccommodationSectionProps> = ({
  items,
  onSelectItem,
  onInquiryClick
}) => {
  const [selectedTown, setSelectedTown] = useState<string>('all');

  const accommodationItems = items.filter(
    (item) => item.category === 'accommodation'
  );

  const filtered = accommodationItems.filter((item) => {
    return selectedTown === 'all' || item.town.toLowerCase() === selectedTown.toLowerCase();
  });

  return (
    <section id="accommodation" className="py-20 lg:py-28 bg-[#F8F4EC] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B786]/30 text-[#9A542E] text-xs font-bold uppercase tracking-widest mb-3">
              <Hotel className="w-3.5 h-3.5" />
              <span>Visitor Hospitality & Lodging</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#25251F] tracking-tight">
              Hotels, Resorts & Guest Houses
            </h2>
            <div className="w-20 h-1 bg-[#9A542E] my-4 rounded-full" />
            <p className="text-base text-[#25251F]/80 leading-relaxed">
              Verified accommodation options across Mithi, Nagarparkar, Islamkot, and Bhalwa, including Sindh Tourism Development Corporation (STDC) resorts and traditional desert huts.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-2">
            {['all', 'Mithi', 'Nagarparkar', 'Islamkot', 'Bhalwa'].map((town) => (
              <button
                key={town}
                onClick={() => setSelectedTown(town)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedTown === town
                    ? 'bg-[#9A542E] text-white shadow-sm'
                    : 'bg-white text-[#25251F]/70 hover:bg-[#D8B786]/30 border border-[#D8B786]/30'
                }`}
              >
                {town === 'all' ? 'All Locations' : town}
              </button>
            ))}
          </div>
        </div>

        {/* Accommodation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#D8B786]/30 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Photo Header */}
                <div className="relative h-48 overflow-hidden bg-[#25251F]">
                  <img
                    src={item.photos[0] || '/hero-tharparkar.jpg'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#25251F]/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-semibold">
                    {item.town}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-[#9A542E] font-bold uppercase tracking-wider mb-1.5">
                    <span>{item.subCategory.replace(/_/g, ' ')}</span>
                    <span>•</span>
                    <span>{item.ownership}</span>
                  </div>

                  <h3 className="font-bold text-lg text-[#25251F] group-hover:text-[#9A542E] transition-colors leading-snug">
                    {item.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[#25251F]/70 mt-2 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#9A542E] shrink-0" />
                    <span>{item.address}</span>
                  </div>

                  <p className="text-xs text-[#25251F]/75 line-clamp-3 mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Facilities list */}
                  {item.facilities && item.facilities.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[11px] font-bold text-[#25251F]/60 uppercase tracking-wider block mb-1.5">
                        Amenities & Services:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.facilities.map((fac, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#F8F4EC] border border-[#D8B786]/30 px-2 py-0.5 rounded text-[#25251F]/80 font-medium"
                          >
                            {fac}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  {item.phone ? (
                    <a
                      href={`tel:${item.phone}`}
                      className="text-xs text-[#9A542E] font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{item.phone}</span>
                    </a>
                  ) : (
                    <span className="text-xs text-[#25251F]/50">Official Desk</span>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onInquiryClick(item.name)}
                      className="px-3 py-1.5 rounded-lg bg-[#9A542E] hover:bg-[#b06135] text-white text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Calendar className="w-3 h-3" />
                      <span>Inquire</span>
                    </button>
                    <button
                      onClick={() => onSelectItem(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#25251F] text-xs font-semibold transition-colors"
                      title="View Details"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
