import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  School,
  Building,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Phone,
  Search,
  Filter,
  Award,
  Users
} from 'lucide-react';
import { DirectoryItem, SubCategoryType } from '../types.ts';
import { TOWNS } from '../data/seedData.ts';

interface EducationDirectoryProps {
  items: DirectoryItem[];
  onSelectItem: (item: DirectoryItem) => void;
  onTownFilterChange: (town: string) => void;
}

export const EducationDirectory: React.FC<EducationDirectoryProps> = ({
  items,
  onSelectItem,
  onTownFilterChange
}) => {
  const [subCategoryFilter, setSubCategoryFilter] = useState<string>('all');
  const [selectedTown, setSelectedTown] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const educationItems = items.filter((item) => item.category === 'education');

  const filteredEducation = educationItems.filter((item) => {
    const matchesSub =
      subCategoryFilter === 'all' || item.subCategory === subCategoryFilter;
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

    return matchesSub && matchesTown && matchesSearch;
  });

  const subCategories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Educational Institutions' },
    { id: 'engineering_tech', label: 'Universities & Engineering' },
    { id: 'medical_nursing', label: 'Medical & Nursing' },
    { id: 'boys_college', label: 'Boys Colleges' },
    { id: 'girls_college', label: 'Girls Colleges' },
    { id: 'govt_college', label: 'Government Colleges' },
    { id: 'private_school', label: 'Private & Model Schools' },
    { id: 'govt_boys_school', label: 'Govt Boys Schools' },
    { id: 'govt_girls_school', label: 'Govt Girls Schools' },
    { id: 'vocational_training', label: 'STEVTA Vocational Centers' }
  ];

  return (
    <section id="education" className="py-20 lg:py-28 bg-[#F8F4EC] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B786]/30 text-[#9A542E] text-xs font-bold uppercase tracking-widest mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>District Education Repository</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#25251F] tracking-tight">
            Education Directory — Tharparkar
          </h2>
          <div className="w-20 h-1 bg-[#9A542E] my-4 rounded-full" />
          <p className="text-base text-[#25251F]/80 leading-relaxed">
            Verified information for public and private schools, colleges, technical institutions, and higher education facilities across District Tharparkar, including the prestigious NED University TIEST campus.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#D8B786]/30 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center mb-4">
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-[#9A542E] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by school or college name, diploma, program..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#9A542E]"
              />
            </div>

            <div className="md:col-span-6 flex items-center gap-3">
              <select
                value={selectedTown}
                onChange={(e) => {
                  setSelectedTown(e.target.value);
                  onTownFilterChange(e.target.value);
                }}
                aria-label="Filter education listings by town or settlement"
                className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#9A542E]"
              >
                <option value="all">All Towns in Tharparkar</option>
                {TOWNS.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>

              {(searchQuery || subCategoryFilter !== 'all' || selectedTown !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSubCategoryFilter('all');
                    setSelectedTown('all');
                  }}
                  className="px-3.5 py-2.5 text-xs text-[#9A542E] hover:underline font-semibold shrink-0 cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Subcategory Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {subCategories.map((sub) => {
              const isActive = subCategoryFilter === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSubCategoryFilter(sub.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#9A542E] text-white shadow-sm'
                      : 'bg-[#F8F4EC] text-[#25251F]/70 hover:bg-[#D8B786]/30 border border-[#D8B786]/30'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Directory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEducation.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-dashed border-[#D8B786]">
              <School className="w-12 h-12 text-[#9A542E]/50 mx-auto mb-3" />
              <h3 className="font-bold text-lg text-[#25251F]">
                No educational institutions match this criteria
              </h3>
              <p className="text-sm text-[#25251F]/60 max-w-md mx-auto mt-1">
                Try selecting another subcategory or town, or submit an institution for verification.
              </p>
            </div>
          ) : (
            filteredEducation.map((inst) => (
              <div
                key={inst.id}
                className="bg-white rounded-2xl p-5 border border-[#D8B786]/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-[#2563EB]/10 text-[#2563EB]">
                      {inst.subCategory.replace(/_/g, ' ')}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-[#25251F] group-hover:text-[#9A542E] transition-colors leading-snug">
                    {inst.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[#25251F]/70 mt-2 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-[#9A542E] shrink-0" />
                    <span>{inst.address}</span>
                  </div>

                  <p className="text-xs text-[#25251F]/75 line-clamp-3 mb-4 leading-relaxed">
                    {inst.description}
                  </p>

                  {/* Programs / Grades */}
                  {inst.programsOrServices && inst.programsOrServices.length > 0 && (
                    <div className="mb-4">
                      <span className="text-[11px] font-bold text-[#25251F]/60 uppercase tracking-wider block mb-1.5">
                        Key Programs & Courses:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {inst.programsOrServices.slice(0, 3).map((prog, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-[#F8F4EC] border border-[#D8B786]/30 px-2 py-0.5 rounded text-[#25251F]/80 font-medium"
                          >
                            {prog}
                          </span>
                        ))}
                        {inst.programsOrServices.length > 3 && (
                          <span className="text-[10px] text-[#9A542E] font-bold self-center">
                            +{inst.programsOrServices.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer metadata & Action Button */}
                <div className="pt-3 border-t border-gray-100 mt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[#25251F]/60">
                    <Users className="w-3.5 h-3.5 text-[#9A542E]" />
                    <span>{inst.genderType || 'Co-education'}</span>
                  </div>

                  <button
                    onClick={() => onSelectItem(inst)}
                    className="px-3 py-1.5 rounded-lg bg-[#D8B786]/20 hover:bg-[#9A542E] text-[#9A542E] hover:text-white font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
