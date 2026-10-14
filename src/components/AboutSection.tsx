import React from 'react';
import {
  Compass,
  MapPin,
  Heart,
  Sparkles,
  Users,
  Feather,
  Sun,
  ShieldCheck,
  Building
} from 'lucide-react';
import { TOWNS } from '../data/seedData.ts';

interface AboutSectionProps {
  onTownSelect: (townName: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onTownSelect }) => {
  return (
    <section id="about" className="py-20 lg:py-28 bg-[#F8F4EC] relative overflow-hidden">
      {/* Subtle Sand Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#9A542E_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B786]/30 text-[#9A542E] text-xs font-bold uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>District Profile & Heritage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#25251F] tracking-tight leading-tight">
            About Tharparkar, Sindh
          </h2>
          <div className="w-20 h-1 bg-[#9A542E] mx-auto my-4 rounded-full" />
          <p className="text-base sm:text-lg text-[#25251F]/80 leading-relaxed">
            Spanning over 19,638 square kilometers of golden dunes, pink granite mountains, and resilient communities, Tharparkar is one of Pakistan’s most culturally rich and ecologically distinctive districts.
          </p>
        </div>

        {/* Narrative & Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7 space-y-6 text-[#25251F]/85 leading-relaxed text-base sm:text-lg">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#25251F] font-serif leading-snug">
              A Living Testament to Tolerance, Tradition & Natural Splendor
            </h3>
            <p>
              District Tharparkar, situated in the southeastern corner of Sindh bordering the Great Rann of Kutch and Rajasthan, is renowned across South Asia for its extraordinary tradition of interfaith coexistence. In towns like Mithi, Islamkot, and Nagarparkar, Hindu and Muslim communities live in profound mutual affection, sharing sweetmeats during Eid, illuminating homes together during Diwali, and maintaining an unbroken record of communal harmony.
            </p>
            <p>
              The desert transforms with dramatic grace. During the monsoon rains, known locally as the <em>Sawan</em> season, the arid sand hills burst into a carpet of emerald greenery, seasonal streams cascade down the ancient granite peaks of the Karoonjhar Mountains, and thousands of wild peacocks dance freely among village courtyards.
            </p>
            <p>
              Today, Tharparkar is rapidly advancing as an educational and economic corridor with constituent campuses like the NED University Thar Institute of Engineering (TIEST), modern highways connecting every taluka, expanding healthcare facilities, and cultural initiatives protecting ancestral handicrafts like Ralli quilts and mirror embroidery.
            </p>

            {/* Cultural Highlights Pill Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#D8B786]/30 shadow-sm">
                <div className="p-2 rounded-lg bg-[#D8B786]/20 text-[#9A542E] shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#25251F]">Peace & Zero Communal Conflict</h4>
                  <p className="text-xs text-[#25251F]/70 mt-0.5">
                    Universal respect across faiths with centuries of peaceful shared living.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#D8B786]/30 shadow-sm">
                <div className="p-2 rounded-lg bg-[#9A542E]/15 text-[#9A542E] shrink-0">
                  <Feather className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#25251F]">The Peacock Sanctuary</h4>
                  <p className="text-xs text-[#25251F]/70 mt-0.5">
                    Protected by ancient local traditions; wild peacocks roam freely in residential lanes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#D8B786]/30 shadow-sm">
                <div className="p-2 rounded-lg bg-[#D8B786]/20 text-[#9A542E] shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#25251F]">Legend of Umar Marvi</h4>
                  <p className="text-xs text-[#25251F]/70 mt-0.5">
                    Symbol of loyalty to the homeland celebrated by Sufi saint Shah Abdul Latif Bhittai.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-[#D8B786]/30 shadow-sm">
                <div className="p-2 rounded-lg bg-[#9A542E]/15 text-[#9A542E] shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#25251F]">Karoonjhar Granite Mountain</h4>
                  <p className="text-xs text-[#25251F]/70 mt-0.5">
                    Geologically unique pre-Cambrian pink granite range housing historic Jain shrines.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="/karoonjhar.jpg"
                alt="Karoonjhar mountains in Nagarparkar Tharparkar"
                className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D8B786]">
                  Nagarparkar Valley
                </span>
                <h4 className="text-xl font-bold font-serif">
                  Karoonjhar Mountains & Ancient Shrines
                </h4>
                <p className="text-xs text-white/80 mt-1">
                  16-mile mountain range rising from desert sands, home to Sardharo springs and the 14th-century Gori Jain Temple.
                </p>
              </div>
            </div>

            {/* Overlapping Badge */}
            <div className="absolute -bottom-6 -left-6 bg-[#25251F] text-white p-4 rounded-xl shadow-xl border border-[#D8B786]/40 hidden sm:flex items-center gap-3 max-w-xs">
              <div className="w-10 h-10 rounded-lg bg-[#9A542E] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#F8F4EC]" />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#D8B786]">Official Digital Directory</div>
                <div className="text-sm font-bold">100% Verified Information</div>
              </div>
            </div>
          </div>
        </div>

        {/* District Talukas & Administrative Divisions */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-md border border-[#D8B786]/30">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold text-[#9A542E] uppercase tracking-wider">
                Geographic & Administrative Setup
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#25251F] mt-1">
                The 7 Talukas & Key Settlements
              </h3>
            </div>
            <p className="text-sm text-[#25251F]/70 max-w-md mt-2 md:mt-0">
              Click any town to inspect on the interactive map or filter directory records across institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {TOWNS.map((town) => (
              <button
                key={town.id}
                onClick={() => {
                  onTownSelect(town.name);
                  const mapElement = document.getElementById('map');
                  if (mapElement) {
                    mapElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="p-4 rounded-xl bg-[#F8F4EC]/60 hover:bg-[#D8B786]/20 border border-[#D8B786]/30 hover:border-[#9A542E] transition-all text-left group hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base text-[#25251F] group-hover:text-[#9A542E] transition-colors">
                    {town.name}
                  </span>
                  <MapPin className="w-4 h-4 text-[#9A542E] opacity-70 group-hover:opacity-100" />
                </div>
                <p className="text-xs text-[#25251F]/70 line-clamp-2 mb-3">
                  {town.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {town.highlights.slice(0, 2).map((h, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-[#D8B786]/40 text-[#25251F]/80 font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
