import React from 'react';
import {
  Compass,
  MapPin,
  PhoneCall,
  Mail,
  ShieldCheck,
  Heart,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { SiteSettings } from '../types.ts';

interface FooterProps {
  settings: SiteSettings;
  onOpenAdmin: () => void;
  onOpenSubmit: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenAdmin,
  onOpenSubmit
}) => {
  return (
    <footer className="bg-[#1C1C17] text-[#F8F4EC] border-t border-[#D8B786]/20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Column 1: Identity & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D8B786] to-[#9A542E] p-0.5 shadow-md">
                <div className="w-full h-full bg-[#25251F] rounded-[10px] flex items-center justify-center">
                  <Compass className="w-5 h-5 text-[#D8B786]" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg font-serif tracking-tight text-[#F8F4EC]">
                  THARPARKAR
                </span>
                <span className="text-[10px] text-[#D8B786] uppercase tracking-widest font-semibold">
                  Digital District Portal
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-sm">
              The official centralized digital repository for District Tharparkar, Sindh, Pakistan. Connecting citizens and visitors to verified schools, colleges, DHQ and THQ hospitals, historic landmarks, STDC resorts, and public services.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#D8B786]">
              <MapPin className="w-4 h-4 text-[#9A542E]" />
              <span>Headquarters: Mithi | Sindh, Pakistan</span>
            </div>
          </div>

          {/* Column 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#D8B786]">
              Explore Portal
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <a href="#about" className="hover:text-[#D8B786] transition-colors">
                  About Tharparkar
                </a>
              </li>
              <li>
                <a href="#map" className="hover:text-[#D8B786] transition-colors">
                  Interactive GIS Map
                </a>
              </li>
              <li>
                <a href="#destinations" className="hover:text-[#D8B786] transition-colors">
                  Famous Destinations
                </a>
              </li>
              <li>
                <a href="#education" className="hover:text-[#D8B786] transition-colors">
                  Education Directory
                </a>
              </li>
              <li>
                <a href="#healthcare" className="hover:text-[#D8B786] transition-colors">
                  Hospitals & Clinics
                </a>
              </li>
              <li>
                <a href="#accommodation" className="hover:text-[#D8B786] transition-colors">
                  Hotels & Lodges
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Public Services & Culture (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#D8B786]">
              Public Services
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <a href="#services" className="hover:text-[#D8B786] transition-colors">
                  Government Offices
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#D8B786] transition-colors">
                  Banks & Businesses
                </a>
              </li>
              <li>
                <a href="#culture" className="hover:text-[#D8B786] transition-colors">
                  Ralli & Handicrafts
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-[#D8B786] transition-colors">
                  Photo Gallery
                </a>
              </li>
              <li>
                <a href="#guide" className="hover:text-[#D8B786] transition-colors">
                  Travel Guide & FAQs
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenSubmit}
                  className="text-[#D8B786] hover:underline cursor-pointer"
                >
                  + Submit a Place
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Emergency Contacts (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#D8B786]">
              District Emergency Helplines
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#25251F] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Deputy Commissioner Office</div>
                  <div className="text-white/60 text-[11px]">District Complex Mithi</div>
                </div>
                <a
                  href="tel:0232920060"
                  className="text-[#D8B786] font-mono font-bold hover:underline"
                >
                  0232-920060
                </a>
              </div>

              <div className="p-3 rounded-xl bg-[#25251F] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Civil Hospital Mithi (DHQ)</div>
                  <div className="text-white/60 text-[11px]">24/7 Casualty & PICU</div>
                </div>
                <a
                  href="tel:0232920031"
                  className="text-red-400 font-mono font-bold hover:underline"
                >
                  0232-920031
                </a>
              </div>

              <div className="p-3 rounded-xl bg-[#25251F] border border-white/10 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Police Helpline & SSP Mithi</div>
                  <div className="text-white/60 text-[11px]">Emergency Response</div>
                </div>
                <span className="text-[#D8B786] font-mono font-bold">
                  15 / 0232-920050
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <span>© {new Date().getFullYear()} Tharparkar Digital District Portal.</span>
            <span>All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenSubmit}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Submit Listing
            </button>
            <span>•</span>
            <a href="#guide" className="hover:text-white transition-colors">
              Travel FAQs
            </a>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#D8B786] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Access</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
