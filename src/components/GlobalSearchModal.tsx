import React, { useState } from 'react';
import { Search, X, MapPin, CheckCircle2, Compass, ExternalLink } from 'lucide-react';
import { DirectoryItem } from '../types.ts';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: DirectoryItem[];
  onSelectItem: (item: DirectoryItem) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = query.trim()
    ? items.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.town.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.address.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.programsOrServices &&
            item.programsOrServices.some((p) => p.toLowerCase().includes(q)))
        );
      })
    : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 overflow-y-auto animate-fade-in">
      <div className="bg-[#1C1C17] text-[#F8F4EC] rounded-3xl max-w-2xl w-full border border-[#D8B786]/30 shadow-2xl overflow-hidden relative">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#D8B786] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search Tharparkar schools, hospitals, hotels, landmarks, offices..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white placeholder-white/40 text-sm sm:text-base focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-white/50 text-xs">
              Type to search across schools, universities, hospitals, tourist sites, and administrative offices.
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-white/50 text-xs">
              No matching verified directory records found for "{query}".
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectItem(item);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-[#25251F] hover:bg-[#2e2e26] border border-white/5 hover:border-[#D8B786]/40 cursor-pointer transition-all flex items-center justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold text-[#D8B786] bg-white/5 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-xs text-white/60">• {item.town}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-[#D8B786] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-white/60 line-clamp-1 mt-0.5">
                    {item.address}
                  </p>
                </div>
                <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-[#D8B786] shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
