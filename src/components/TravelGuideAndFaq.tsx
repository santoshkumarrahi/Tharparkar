import React, { useState } from 'react';
import {
  HelpCircle,
  Compass,
  ChevronDown,
  Navigation,
  Calendar,
  ShieldCheck,
  Sun,
  MapPin
} from 'lucide-react';
import { FAQS } from '../data/seedData.ts';

export const TravelGuideAndFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="guide" className="py-20 lg:py-28 bg-[#F8F4EC] relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D8B786]/30 text-[#9A542E] text-xs font-bold uppercase tracking-widest mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Visitor Preparation & Insights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#25251F] tracking-tight">
            Travel Guide & Frequently Asked Questions
          </h2>
          <div className="w-20 h-1 bg-[#9A542E] my-4 rounded-full" />
          <p className="text-base text-[#25251F]/80 leading-relaxed">
            Essential travel tips, road route distances, seasonal weather advisories, and cultural etiquette for your journey across District Tharparkar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Practical Travel Guide Column */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-bold font-serif text-[#25251F]">
              Planning Your Journey to Thar
            </h3>

            {/* Travel Card 1 */}
            <div className="bg-white p-5 rounded-2xl border border-[#D8B786]/30 shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#D8B786]/20 text-[#9A542E] shrink-0">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#25251F]">
                  Road Route from Karachi (330 km)
                </h4>
                <p className="text-xs text-[#25251F]/70 mt-1 leading-relaxed">
                  Take the M-9 Motorway to Hyderabad, proceed through Mirpurkhas and Naukot onto the smooth 4-lane desert highway into Mithi (approx 4.5 to 5 hours).
                </p>
              </div>
            </div>

            {/* Travel Card 2 */}
            <div className="bg-white p-5 rounded-2xl border border-[#D8B786]/30 shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#9A542E]/15 text-[#9A542E] shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#25251F]">
                  Prime Seasonal Windows
                </h4>
                <p className="text-xs text-[#25251F]/70 mt-1 leading-relaxed">
                  <strong>Monsoon (Sawan - Jul to Sep):</strong> Blooming green desert pastures and gushing Karoonjhar springs.
                  <br />
                  <strong>Winter (Oct to Feb):</strong> Sunny 24°C days, crisp campfire evenings and clear celestial stargazing.
                </p>
              </div>
            </div>

            {/* Travel Card 3 */}
            <div className="bg-white p-5 rounded-2xl border border-[#D8B786]/30 shadow-sm flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#D8B786]/20 text-[#9A542E] shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-[#25251F]">
                  Cultural Etiquette & Peacock Welfare
                </h4>
                <p className="text-xs text-[#25251F]/70 mt-1 leading-relaxed">
                  Peacocks are deeply revered and protected across Tharparkar. Please remove footwear when entering sacred temples and shrines, and respect local photography preferences.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive FAQs Accordion Column */}
          <div className="lg:col-span-7 space-y-3.5">
            <h3 className="text-2xl font-bold font-serif text-[#25251F] mb-6">
              Common Questions & Answers
            </h3>

            {FAQS.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-[#D8B786]/30 shadow-sm overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-base text-[#25251F] hover:text-[#9A542E] transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#9A542E] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-[#25251F]/75 leading-relaxed border-t border-gray-100 pt-3 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
