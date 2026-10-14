import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, AlertCircle, Building, MapPin } from 'lucide-react';
import { CategoryType } from '../types.ts';
import { TOWNS } from '../data/seedData.ts';

interface CitizenSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CitizenSubmitModal: React.FC<CitizenSubmitModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'education' as CategoryType,
    town: 'Mithi',
    address: '',
    description: '',
    contactPhone: '',
    submitterName: '',
    submitterEmail: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      setErrorMessage('Please provide an institution name and address.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit place');
      }

      setSuccessMessage(data.message || 'Place submitted successfully for verification!');
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccessMessage(null);
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#D8B786]/30 relative text-[#25251F]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-[#D8B786]/20 text-[#9A542E]">
            <PlusCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#25251F]">
            Submit Place or Institution
          </h2>
        </div>

        <p className="text-xs text-gray-600 mb-6">
          Help enrich the Tharparkar Digital Directory. All citizen submissions are verified by the district desk before being published to the public map and directory.
        </p>

        {successMessage && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
              Place / Institution Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Government Primary School Chelhar"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] px-3.5 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#9A542E]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as CategoryType })
                }
                className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] px-3 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#9A542E]"
              >
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="accommodation">Accommodation</option>
                <option value="destination">Tourist Destination</option>
                <option value="government">Government Office</option>
                <option value="business">Private Business / Artisan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                Taluka / Town *
              </label>
              <select
                value={formData.town}
                onChange={(e) => setFormData({ ...formData, town: e.target.value })}
                className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] px-3 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#9A542E]"
              >
                {TOWNS.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
              Address / Landmark *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Near Shahi Bazaar, Main Bypass Road"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] px-3.5 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#9A542E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
              Official Contact Phone / Mobile (Optional)
            </label>
            <input
              type="tel"
              placeholder="+92 232 920000 / +92 300 0000000"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] px-3.5 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#9A542E]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
              Brief Description & Offered Services
            </label>
            <textarea
              rows={3}
              placeholder="Explain programs, grades, bed capacity, or cultural significance..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] px-3.5 py-2 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#9A542E]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#9A542E] hover:bg-[#b06135] text-white text-xs font-bold shadow transition-all cursor-pointer"
            >
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
