import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  GraduationCap,
  HeartPulse,
  Building2,
  Hotel,
  ShieldCheck,
  Search,
  PlusCircle,
  Menu,
  X,
  PhoneCall
} from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenSubmit: () => void;
  onSearchClick: () => void;
  emergencyNotice?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onOpenSubmit,
  onSearchClick,
  emergencyNotice
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'District Map', href: '#map' },
    { name: 'Destinations', href: '#destinations' },
    { name: 'Education', href: '#education' },
    { name: 'Healthcare', href: '#healthcare' },
    { name: 'Hotels', href: '#accommodation' },
    { name: 'Services', href: '#services' },
    { name: 'Culture', href: '#culture' },
    { name: 'FAQs', href: '#guide' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <>
      {/* Top Emergency & Helpline Bar */}
      {emergencyNotice && (
        <div className="bg-[#9A542E] text-white text-xs py-1.5 px-4 font-medium tracking-wide flex items-center justify-between z-50 relative border-b border-[#D8B786]/30">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-[#F8F4EC] animate-pulse" />
              <span>{emergencyNotice}</span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs text-[#F8F4EC]/90">
              <span>District Headquarters: Mithi</span>
              <span>•</span>
              <span>Province: Sindh, Pakistan</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          emergencyNotice ? (isScrolled ? 'top-0' : 'top-[29px]') : 'top-0'
        } ${
          isScrolled
            ? 'bg-[#25251F]/95 backdrop-blur-md shadow-lg border-b border-[#D8B786]/20 py-3 text-white'
            : 'bg-gradient-to-b from-[#25251F]/90 via-[#25251F]/50 to-transparent py-5 text-white'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo & Portal Identity */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D8B786] to-[#9A542E] p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#25251F] rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-[#D8B786]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight font-serif text-[#F8F4EC] leading-tight">
                THARPARKAR
              </span>
              <span className="text-[10px] text-[#D8B786] uppercase tracking-widest font-semibold">
                Digital District Portal
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-2.5 py-1.5 rounded-lg text-white/90 hover:text-[#D8B786] hover:bg-white/10 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onSearchClick}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-[#F8F4EC] transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Global Search"
            >
              <Search className="w-4 h-4 text-[#D8B786]" />
              <span className="hidden sm:inline">Search</span>
            </button>

            <button
              onClick={onOpenSubmit}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D8B786]/20 hover:bg-[#D8B786]/30 text-[#D8B786] border border-[#D8B786]/40 text-xs font-semibold transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Submit Place</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-lg bg-[#9A542E] hover:bg-[#b06135] text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 hover:scale-[1.02]"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 lg:hidden text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#25251F] border-b border-[#D8B786]/20 px-4 pt-3 pb-5 mt-2 space-y-1 shadow-2xl">
            <div className="grid grid-cols-2 gap-1 mb-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-white/90 hover:text-[#D8B786] hover:bg-white/10 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSubmit();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-[#D8B786]/20 text-[#D8B786] border border-[#D8B786]/40 text-xs font-semibold flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Submit Institution / Business
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-[#9A542E] text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Administrative Portal Login
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
