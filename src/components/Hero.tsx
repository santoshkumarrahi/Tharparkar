import React from 'react';
import { Compass, Map, GraduationCap, ChevronDown, Sparkles, Shield, Heart } from 'lucide-react';
import { SiteSettings } from '../types.ts';

interface HeroProps {
  settings: SiteSettings;
  onExploreClick: () => void;
  onMapClick: () => void;
  onEducationClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onExploreClick,
  onMapClick,
  onEducationClick
}) => {
  return (
    <section className="relative w-full min-h-[92vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#25251F]">
      {/* Cinematic Hero Background Image with Subtle Parallax/Zoom Effect */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroImage || '/hero-tharparkar.jpg'}
          alt="Tharparkar desert sunset with decorated camel, Mithi monument tower, and I Love Mithi landmark"
          className="w-full h-full object-cover object-[center_60%] sm:object-[center_50%] scale-105 animate-subtle-zoom transition-transform duration-1000"
          loading="eager"
          decoding="async"
        />
        {/* Multi-layered cinematic gradient overlays for pristine text readability without obscuring sunset warmth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#25251F] via-[#25251F]/40 to-[#25251F]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#25251F]/80 via-[#25251F]/30 to-transparent" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36 flex flex-col items-center text-center max-w-5xl">
        {/* Subtle Cultural Tag / Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#25251F]/70 border border-[#D8B786]/50 backdrop-blur-md text-[#D8B786] text-xs font-semibold uppercase tracking-widest mb-6 animate-fade-in shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-[#D8B786]" />
          <span>Sindh, Pakistan — The Golden Oasis of Harmony</span>
        </div>

        {/* Master Heading */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F8F4EC] tracking-tight leading-[1.15] mb-6 drop-shadow-md">
          {settings.heroHeading || 'Discover Tharparkar — The Land of Beauty, Culture & Heritage'}
        </h1>

        {/* Master Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-[#F8F4EC]/90 max-w-3xl leading-relaxed mb-10 drop-shadow">
          {settings.heroSubtitle ||
            'Explore destinations, discover educational institutions, find essential services, and experience the authentic spirit of Tharparkar.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-14">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#9A542E] hover:bg-[#b06135] text-white font-semibold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Compass className="w-5 h-5 text-[#D8B786] group-hover:rotate-45 transition-transform" />
            <span>{settings.heroButtonPrimary || 'Explore Tharparkar'}</span>
          </button>

          <button
            onClick={onMapClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#25251F]/80 hover:bg-[#25251F] text-[#F8F4EC] border border-[#D8B786]/60 backdrop-blur-md font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Map className="w-5 h-5 text-[#D8B786] group-hover:scale-110 transition-transform" />
            <span>{settings.heroButtonSecondary || 'Explore the District Map'}</span>
          </button>

          <button
            onClick={onEducationClick}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F8F4EC] border border-white/25 backdrop-blur-md font-semibold text-sm sm:text-base shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <GraduationCap className="w-5 h-5 text-[#D8B786]" />
            <span>{settings.heroButtonTertiary || 'Discover Educational Institutions'}</span>
          </button>
        </div>

        {/* Key Feature Highlights Pill Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl pt-4 border-t border-white/15">
          <div className="bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-white/10 flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-lg bg-[#D8B786]/20 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-[#D8B786]" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">7 Talukas</div>
              <div className="text-white/70 text-xs">Full District Coverage</div>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-white/10 flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-lg bg-[#9A542E]/30 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-[#D8B786]" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">Peacock Sanctuary</div>
              <div className="text-white/70 text-xs">Exemplary Harmony</div>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-white/10 flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-lg bg-[#D8B786]/20 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-[#D8B786]" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">TIEST & Colleges</div>
              <div className="text-white/70 text-xs">Verified Institutions</div>
            </div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm p-3 rounded-xl border border-white/10 flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-lg bg-[#9A542E]/30 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#D8B786]" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">100% Verified</div>
              <div className="text-white/70 text-xs">Public Data Portal</div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Scroll Down Indicator */}
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white/75 hover:text-white transition-colors cursor-pointer group"
        aria-label="Scroll to content"
      >
        <span className="text-[11px] font-semibold uppercase tracking-widest text-[#D8B786] mb-1">
          Scroll Down
        </span>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1 group-hover:border-[#D8B786]">
          <div className="w-1.5 h-2.5 rounded-full bg-[#D8B786] animate-bounce" />
        </div>
      </a>
    </section>
  );
};
