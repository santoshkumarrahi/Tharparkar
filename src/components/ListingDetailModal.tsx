import React from 'react';
import {
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Layers,
  Users,
  Compass
} from 'lucide-react';
import { DirectoryItem } from '../types.ts';

interface ListingDetailModalProps {
  item: DirectoryItem | null;
  onClose: () => void;
  onDirections: (lat: number, lng: number) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  item,
  onClose,
  onDirections
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#D8B786]/30 text-[#25251F] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image */}
        <div className="relative h-60 sm:h-72 bg-[#25251F] overflow-hidden">
          <img
            src={item.photos[0] || '/hero-tharparkar.jpg'}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#9A542E] text-white text-[11px] font-bold uppercase tracking-wider">
                {item.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white text-[11px] font-semibold">
                {item.subCategory.replace(/_/g, ' ')}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {item.verificationStatus.toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-serif leading-tight">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Location & Quick Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#F8F4EC] border border-[#D8B786]/30 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#9A542E]" />
              <span className="font-semibold text-[#25251F]">
                {item.address} ({item.town}, Tharparkar)
              </span>
            </div>

            <div className="flex items-center gap-2 text-[#25251F]/70">
              <Compass className="w-4 h-4 text-[#9A542E]" />
              <span className="font-mono">
                {item.latitude.toFixed(4)}° N, {item.longitude.toFixed(4)}° E
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#25251F]/60 mb-2">
              Overview & Institutional Description
            </h3>
            <p className="text-sm sm:text-base text-[#25251F]/85 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Programs / Services / Offerings */}
          {item.programsOrServices && item.programsOrServices.length > 0 && (
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#25251F]/60 mb-2">
                Offered Programs, Departments & Services
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.programsOrServices.map((prog, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-[#D8B786]/20 border border-[#D8B786]/40 text-[#25251F] text-xs font-semibold"
                  >
                    {prog}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Facilities if available */}
          {item.facilities && item.facilities.length > 0 && (
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider text-[#25251F]/60 mb-2">
                Available Facilities & Infrastructure
              </h3>
              <div className="flex flex-wrap gap-2">
                {item.facilities.map((fac, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-white border border-gray-200 text-[#25251F]/80 text-xs"
                  >
                    ✓ {fac}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-xs">
            {item.phone && (
              <div className="flex items-center gap-2 text-[#25251F]">
                <Phone className="w-4 h-4 text-[#9A542E]" />
                <span>
                  <strong>Phone:</strong> {item.phone}
                </span>
              </div>
            )}

            {item.email && (
              <div className="flex items-center gap-2 text-[#25251F]">
                <Mail className="w-4 h-4 text-[#9A542E]" />
                <span>
                  <strong>Email:</strong> {item.email}
                </span>
              </div>
            )}

            {item.website && (
              <div className="flex items-center gap-2 text-[#25251F] sm:col-span-2">
                <Globe className="w-4 h-4 text-[#9A542E]" />
                <a
                  href={item.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9A542E] hover:underline font-semibold flex items-center gap-1"
                >
                  <span>{item.website}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {item.hours && (
              <div className="flex items-center gap-2 text-[#25251F] sm:col-span-2">
                <Clock className="w-4 h-4 text-[#9A542E]" />
                <span>
                  <strong>Operating Hours:</strong> {item.hours}
                </span>
              </div>
            )}
          </div>

          {/* Source Reference & Last Updated verification footer */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-gray-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                <strong>Verification Source:</strong> {item.sourceReference}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Updated: {item.lastUpdated}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#25251F] font-semibold text-xs cursor-pointer"
            >
              Close
            </button>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${item.latitude},${item.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#9A542E] hover:bg-[#b06135] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow cursor-pointer"
            >
              <span>Get Directions on Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
