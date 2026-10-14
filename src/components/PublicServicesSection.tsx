import React, { useState } from 'react';
import {
  Building2,
  Briefcase,
  Shield,
  MapPin,
  Phone,
  Globe,
  CheckCircle2,
  ExternalLink,
  Clock,
  Search
} from 'lucide-react';
import { DirectoryItem } from '../types.ts';
import { TOWNS } from '../data/seedData.ts';

interface PublicServicesSectionProps {
  items: DirectoryItem[];
  onSelectItem: (item: DirectoryItem) => void;
}

export const PublicServicesSection: React.FC<PublicServicesSectionProps> = ({
  items,
  onSelectItem
}) => {
  const [activeTab, setActiveTab] = useState<'government' | 'business'>('government');
  const [selectedTown, setSelectedTown] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const publicItems = items.filter((item) => item.category === activeTab);

  const filtered = publicItems.filter((item) => {
    const matchesTown =
      selectedTown === 'all' || item.town.toLowerCase() === selectedTown.toLowerCase();
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
    <section id="services" className="py-20 lg:py-28 bg-[#F4EFE6] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B786]/30 text-[#9A542E] text-xs font-bold uppercase tracking-widest mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Public Administration & Local Commerce</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#25251F] tracking-tight">
            Government Offices & Business Directory
          </h2>
          <div className="w-20 h-1 bg-[#9A542E] my-4 rounded-full" />
          <p className="text-base text-[#25251F]/80 leading-relaxed">
            Essential citizen public departments, municipal services, revenue and police authorities, alongside commercial banks, local artisans cooperatives, and safari tour operators.
          </p>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#D8B786]/30 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100">
            {/* Primary Toggle */}
            <div className="flex bg-[#F8F4EC] p-1 rounded-xl border border-[#D8B786]/30 w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('government')}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'government'
                    ? 'bg-[#9A542E] text-white shadow-sm'
                    : 'text-[#25251F]/70 hover:text-[#25251F]'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Government Offices & Departments</span>
              </button>

              <button
                onClick={() => setActiveTab('business')}
                className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'business'
                    ? 'bg-[#9A542E] text-white shadow-sm'
                    : 'text-[#25251F]/70 hover:text-[#25251F]'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Private Offices & Businesses</span>
              </button>
            </div>

            {/* Town Selector */}
            <div className="w-full sm:w-64">
              <select
                value={selectedTown}
                onChange={(e) => setSelectedTown(e.target.value)}
                aria-label="Filter directory listings by town"
                className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#9A542E]"
              >
                <option value="all">All Towns in Tharparkar</option>
                {TOWNS.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="mt-4 relative">
            <Search className="w-4 h-4 text-[#9A542E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'government' ? 'government departments, DC, police, NADRA...' : 'banks, ATMs, tour operators, cooperatives...'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#9A542E]"
            />
          </div>
        </div>

        {/* Directory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-[#D8B786]/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#D8B786]/20 text-[#9A542E]">
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
                  <div className="flex items-center gap-1.5 text-xs text-[#25251F]/70 mb-3 bg-[#F8F4EC] p-2 rounded-lg border border-[#D8B786]/20">
                    <Clock className="w-3.5 h-3.5 text-[#9A542E] shrink-0" />
                    <span>{item.hours}</span>
                  </div>
                )}

                <p className="text-xs text-[#25251F]/75 line-clamp-3 mb-4 leading-relaxed">
                  {item.description}
                </p>

                {item.programsOrServices && item.programsOrServices.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-[#25251F]/60 uppercase tracking-wider block mb-1.5">
                      Public Services & Offerings:
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

              {/* Action buttons */}
              <div className="pt-3 border-t border-gray-100 mt-2 flex items-center justify-between text-xs">
                {item.phone ? (
                  <a
                    href={`tel:${item.phone}`}
                    className="text-[#9A542E] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{item.phone}</span>
                  </a>
                ) : (
                  <span className="text-[#25251F]/50">District Registry</span>
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
