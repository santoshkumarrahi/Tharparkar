import React, { useState } from 'react';
import {
  HeartPulse,
  PhoneCall,
  Activity,
  MapPin,
  Clock,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Baby,
  Ambulance,
  Search
} from 'lucide-react';
import { DirectoryItem } from '../types.ts';
import { TOWNS } from '../data/seedData.ts';

interface HealthcareSectionProps {
  items: DirectoryItem[];
  onSelectItem: (item: DirectoryItem) => void;
}

export const HealthcareSection: React.FC<HealthcareSectionProps> = ({
  items,
  onSelectItem
}) => {
  const [selectedTown, setSelectedTown] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const healthItems = items.filter((item) => item.category === 'healthcare');

  const filtered = healthItems.filter((item) => {
    const matchesTown =
      selectedTown === 'all' ||
      item.town.toLowerCase() === selectedTown.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.programsOrServices &&
        item.programsOrServices.some((p) =>
          p.toLowerCase().includes(searchQuery.toLowerCase())
        ));

    return matchesTown && matchesSearch;
  });

  return (
    <section id="healthcare" className="py-20 lg:py-28 bg-[#F4EFE6] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-widest mb-3">
            <HeartPulse className="w-3.5 h-3.5 text-red-600" />
            <span>Essential Medical Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#25251F] tracking-tight">
            Hospitals & Healthcare Directory
          </h2>
          <div className="w-20 h-1 bg-[#9A542E] my-4 rounded-full" />
          <p className="text-base text-[#25251F]/80 leading-relaxed">
            Verified district hospital network, 24/7 trauma emergency centers, anti-snake venom units, and maternal-child health facilities across District Tharparkar.
          </p>
        </div>

        {/* Emergency Callout Card */}
        <div className="bg-gradient-to-r from-red-700 to-[#9A542E] text-white rounded-2xl p-6 sm:p-8 shadow-xl mb-12 border border-red-400/30">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="flex items-center gap-2 text-red-200 text-xs font-bold uppercase tracking-widest">
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>24/7 District Medical Emergency Hotlines</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif">
                Immediate Trauma & Emergency Hospital Access
              </h3>
              <p className="text-sm text-red-100">
                Civil Hospital Mithi DHQ operates a dedicated round-the-clock emergency casualty, pediatric ICU, and anti-snake venom center.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-center">
              <a
                href="tel:0232920031"
                className="px-4 py-3 rounded-xl bg-white text-red-700 hover:bg-red-50 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <PhoneCall className="w-4 h-4 text-red-600" />
                <span>DHQ Hospital Mithi: 0232-920031</span>
              </a>

              <a
                href="tel:1122"
                className="px-4 py-3 rounded-xl bg-red-900/60 hover:bg-red-900/80 text-white font-bold text-sm border border-white/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
              >
                <Ambulance className="w-4 h-4 text-red-300" />
                <span>Emergency Ambulance: 1122 / 115</span>
              </a>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#D8B786]/30 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
            <div className="md:col-span-7 relative">
              <Search className="w-4 h-4 text-[#9A542E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hospital name, ICU, pediatric care, snake venom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#9A542E]"
              />
            </div>

            <div className="md:col-span-5 flex items-center gap-3">
              <select
                value={selectedTown}
                onChange={(e) => setSelectedTown(e.target.value)}
                aria-label="Filter healthcare facilities by town or settlement"
                className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#9A542E]"
              >
                <option value="all">All Healthcare Centers in Tharparkar</option>
                {TOWNS.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Facility Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-[#D8B786]/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-red-100 text-red-700">
                    {item.subCategory.replace(/_/g, ' ')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified
                  </span>
                </div>

                <h3 className="font-bold text-lg text-[#25251F] group-hover:text-[#9A542E] transition-colors leading-snug">
                  {item.name}
                </h3>

                <div className="flex items-center gap-1.5 text-xs text-[#25251F]/70 mt-2 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-[#9A542E] shrink-0" />
                  <span>{item.address}</span>
                </div>

                {item.hours && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium mb-3 bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/50">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{item.hours}</span>
                  </div>
                )}

                <p className="text-xs text-[#25251F]/75 line-clamp-3 mb-4 leading-relaxed">
                  {item.description}
                </p>

                {item.programsOrServices && item.programsOrServices.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-[#25251F]/60 uppercase tracking-wider block mb-1.5">
                      Available Medical Services:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {item.programsOrServices.slice(0, 3).map((service, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-[#F8F4EC] border border-[#D8B786]/30 px-2 py-0.5 rounded text-[#25251F]/80 font-medium"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-100 mt-2 flex items-center justify-between text-xs">
                {item.phone ? (
                  <a
                    href={`tel:${item.phone}`}
                    className="text-[#9A542E] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{item.phone}</span>
                  </a>
                ) : (
                  <span className="text-[#25251F]/50">Hours verified</span>
                )}

                <button
                  onClick={() => onSelectItem(item)}
                  className="px-3 py-1.5 rounded-lg bg-[#D8B786]/20 hover:bg-[#9A542E] text-[#9A542E] hover:text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>View Details</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
