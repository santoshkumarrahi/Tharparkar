import React from 'react';
import {
  Sparkles,
  Compass,
  Music,
  Utensils,
  Sun,
  Moon,
  Mountain,
  Feather,
  Layers
} from 'lucide-react';

interface CultureAndAdventuresProps {
  onPlanTripClick: () => void;
}

export const CultureAndAdventures: React.FC<CultureAndAdventuresProps> = ({
  onPlanTripClick
}) => {
  return (
    <section id="culture" className="py-20 lg:py-28 bg-[#F8F4EC] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B786]/30 text-[#9A542E] text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Timeless Heritage & Thrilling Expeditions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#25251F] tracking-tight">
            Local Culture, Handicrafts & Desert Adventures
          </h2>
          <div className="w-20 h-1 bg-[#9A542E] mx-auto my-4 rounded-full" />
          <p className="text-base text-[#25251F]/80 leading-relaxed">
            Immerse yourself in authentic Thari traditions: intricate mirror-work embroidery, centuries-old folk melodies, organic desert cuisine, and unforgettable dune safaris under star-filled skies.
          </p>
        </div>

        {/* Culture & Handicrafts Spotlight */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-20">
          <div className="lg:col-span-6 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <img
              src="/thar-crafts.jpg"
              alt="Authentic Tharparkar handicrafts, Ralli patchwork quilts and mirror work embroidery"
              className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#9A542E]">
              <Layers className="w-4 h-4" />
              <span>Ancestral Craftsmanship</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#25251F] font-serif">
              The Intricate Art of Thari Ralli & Mirror Embroidery
            </h3>
            <p className="text-sm sm:text-base text-[#25251F]/80 leading-relaxed">
              Every village across Tharparkar echoes with the patient rhythm of needlecraft. The world-renowned <strong>Ralli quilt</strong> is handcrafted by women using vibrant patches of cotton and silk arranged in kaleidoscopic geometric motifs passed down through mother-daughter lineages.
            </p>
            <p className="text-sm sm:text-base text-[#25251F]/80 leading-relaxed">
              Complementing the quilts is glittering mirror-work (<em>Aabla Kaari</em>), where small hand-cut mirrors are secured into fabric with tight chain-stitching. Tharparkar is also celebrated for hand-spun camel-wool blankets (<em>Khaadi Shawls</em>), clay terracotta pots, and colorful glass bangles.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 bg-white rounded-xl border border-[#D8B786]/30">
                <div className="font-bold text-sm text-[#25251F]">Geometric Ralli Quilts</div>
                <div className="text-xs text-[#25251F]/70 mt-1">
                  100% hand-stitched traditional patchwork from Diplo & Mithi.
                </div>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-[#D8B786]/30">
                <div className="font-bold text-sm text-[#25251F]">Thari Peda & Cuisine</div>
                <div className="text-xs text-[#25251F]/70 mt-1">
                  Pure mawa sweet peda, Bajra bread & wild desert melon delicacies.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desert Adventures Grid */}
        <div className="bg-[#25251F] text-[#F8F4EC] rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold text-[#D8B786] uppercase tracking-wider">
              Desert Tourism Experiences
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold font-serif mt-1">
              Top Desert Adventures in Tharparkar
            </h3>
            <p className="text-xs sm:text-sm text-white/70 mt-2">
              Experience authentic desert life safely with certified local operators and heritage guides.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Adventure 1 */}
            <div className="bg-[#1C1C17] p-5 rounded-2xl border border-white/10 hover:border-[#D8B786]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#9A542E]/30 text-[#D8B786] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sun className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-white mb-2">
                Sunset Camel Treks
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Traverse golden sand dunes on decorated desert camels at Gadhi Bhit and Chachro as the sun melts into purple hues.
              </p>
            </div>

            {/* Adventure 2 */}
            <div className="bg-[#1C1C17] p-5 rounded-2xl border border-white/10 hover:border-[#D8B786]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#9A542E]/30 text-[#D8B786] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mountain className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-white mb-2">
                Karoonjhar Granite Treks
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Bouldering and guided scenic hiking through ancient pink granite gorges, freshwater Sardharo springs, and Jain caves.
              </p>
            </div>

            {/* Adventure 3 */}
            <div className="bg-[#1C1C17] p-5 rounded-2xl border border-white/10 hover:border-[#D8B786]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#9A542E]/30 text-[#D8B786] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Moon className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-white mb-2">
                Stargazing & Chaunra Camps
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Sleep in traditional thatched Chaunra huts with zero light pollution, witnessing the pristine celestial Milky Way.
              </p>
            </div>

            {/* Adventure 4 */}
            <div className="bg-[#1C1C17] p-5 rounded-2xl border border-white/10 hover:border-[#D8B786]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#9A542E]/30 text-[#D8B786] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Music className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-white mb-2">
                Sufi Folk Music Nights
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Evening bonfire gatherings listening to master Thari musicians playing the Alghoza flute, Dholak, and singing Mai Bhagi songs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
