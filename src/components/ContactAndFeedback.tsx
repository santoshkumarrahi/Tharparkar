import React, { useState } from 'react';
import {
  Send,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  MessageSquare
} from 'lucide-react';
import { SiteSettings } from '../types.ts';

interface ContactAndFeedbackProps {
  settings: SiteSettings;
  onOpenSubmitModal: () => void;
  prefilledSubject?: string;
}

export const ContactAndFeedback: React.FC<ContactAndFeedbackProps> = ({
  settings,
  onOpenSubmitModal,
  prefilledSubject
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: prefilledSubject || '',
    category: 'Tourism & Travel',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in your name, email, and message.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setSuccessMessage('Thank you! Your inquiry has been logged with the District Portal Desk.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: 'Tourism & Travel',
        message: ''
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while sending your message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#F4EFE6] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Citizen Suggestion Column */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B786]/30 text-[#9A542E] text-xs font-bold uppercase tracking-widest mb-3">
                <Mail className="w-3.5 h-3.5" />
                <span>Citizen Engagement & Support</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#25251F] tracking-tight">
                Contact & Portal Feedback
              </h2>
              <div className="w-20 h-1 bg-[#9A542E] my-4 rounded-full" />
              <p className="text-sm sm:text-base text-[#25251F]/80 leading-relaxed">
                Connect with the District Tharparkar Information and Verification Cell for travel guidance, official institutional queries, or corrections.
              </p>
            </div>

            {/* Verified Address & Contacts */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#D8B786]/30 shadow-sm">
                <div className="p-3 rounded-xl bg-[#D8B786]/20 text-[#9A542E] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#25251F]">District Headquarters</h4>
                  <p className="text-xs text-[#25251F]/70 mt-1 leading-relaxed">
                    {settings.contactAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#D8B786]/30 shadow-sm">
                <div className="p-3 rounded-xl bg-[#9A542E]/15 text-[#9A542E] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#25251F]">Official Helpline</h4>
                  <p className="text-xs text-[#25251F]/70 mt-1">
                    {settings.contactPhone} (Mon–Fri, 9am–5pm)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-[#D8B786]/30 shadow-sm">
                <div className="p-3 rounded-xl bg-[#D8B786]/20 text-[#9A542E] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#25251F]">Electronic Mail</h4>
                  <p className="text-xs text-[#25251F]/70 mt-1">
                    {settings.contactEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Citizen Place Submission Promotion */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#9A542E] to-[#783f1f] text-white shadow-xl">
              <h4 className="font-bold text-lg font-serif">
                Know an unlisted school, hospital, or local business?
              </h4>
              <p className="text-xs text-white/85 mt-2 leading-relaxed">
                Citizens and institution heads can submit records for formal verification. Our administrative desk reviews each entry before publishing.
              </p>
              <button
                onClick={onOpenSubmitModal}
                className="mt-4 px-4 py-2.5 rounded-xl bg-[#F8F4EC] text-[#9A542E] hover:bg-white text-xs font-bold transition-all flex items-center gap-2 shadow cursor-pointer hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Institution / Place for Verification</span>
              </button>
            </div>
          </div>

          {/* Interactive Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-[#D8B786]/30">
            <h3 className="text-2xl font-bold font-serif text-[#25251F] mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-[#9A542E]" />
              <span>Send an Official Inquiry</span>
            </h3>

            {successMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#25251F]/70 mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar / Aisha Khan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#9A542E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#25251F]/70 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#9A542E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#25251F]/70 mb-1.5">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#9A542E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#25251F]/70 mb-1.5">
                    Topic Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#9A542E]"
                  >
                    <option value="Tourism & Travel">Tourism & Travel</option>
                    <option value="Education Directory">Education & Admissions</option>
                    <option value="Healthcare & Hospitals">Healthcare & Emergency</option>
                    <option value="Hotels & Lodging">Hotels & Lodging</option>
                    <option value="Government & Public Office">Government Services</option>
                    <option value="General Feedback">General Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#25251F]/70 mb-1.5">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inquiring about STDC Nagarparkar resort booking"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#9A542E]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#25251F]/70 mb-1.5">
                  Your Message / Inquiry Details *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide clear details regarding your question or suggestion..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#F8F4EC]/60 border border-[#D8B786]/40 text-[#25251F] px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-[#9A542E]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-[#9A542E] hover:bg-[#b06135] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Send Official Inquiry'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
