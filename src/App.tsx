import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { InteractiveMap } from './components/InteractiveMap.tsx';
import { DestinationsSection } from './components/DestinationsSection.tsx';
import { EducationDirectory } from './components/EducationDirectory.tsx';
import { HealthcareSection } from './components/HealthcareSection.tsx';
import { AccommodationSection } from './components/AccommodationSection.tsx';
import { PublicServicesSection } from './components/PublicServicesSection.tsx';
import { CultureAndAdventures } from './components/CultureAndAdventures.tsx';
import { GallerySection } from './components/GallerySection.tsx';
import { TravelGuideAndFaq } from './components/TravelGuideAndFaq.tsx';
import { ContactAndFeedback } from './components/ContactAndFeedback.tsx';
import { Footer } from './components/Footer.tsx';
import { ListingDetailModal } from './components/ListingDetailModal.tsx';
import { CitizenSubmitModal } from './components/CitizenSubmitModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { GlobalSearchModal } from './components/GlobalSearchModal.tsx';
import { DirectoryItem, SiteSettings } from './types.ts';
import { INITIAL_DIRECTORY, INITIAL_SETTINGS } from './data/seedData.ts';

export default function App() {
  const [items, setItems] = useState<DirectoryItem[]>(INITIAL_DIRECTORY);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [selectedTown, setSelectedTown] = useState<string>('all');

  // Modals state
  const [activeItem, setActiveItem] = useState<DirectoryItem | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [inquirySubject, setInquirySubject] = useState<string>('');

  // Fetch live database state
  const loadPortalData = async () => {
    try {
      const [dirRes, settingsRes] = await Promise.all([
        fetch('/api/directory?status=verified'),
        fetch('/api/settings')
      ]);

      if (dirRes.ok) {
        const data = await dirRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        }
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        if (settingsData && settingsData.heroHeading) {
          setSettings(settingsData);
        }
      }
    } catch (err) {
      console.warn('Could not fetch live API data, using cached seed:', err);
    }
  };

  useEffect(() => {
    loadPortalData();
  }, []);

  const handleScrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInquiryForHotel = (hotelName: string) => {
    setInquirySubject(`Booking inquiry for ${hotelName}`);
    handleScrollTo('contact');
  };

  return (
    <div className="min-h-screen bg-[#F8F4EC] text-[#25251F] font-sans antialiased">
      {/* 1. Header Navigation with Live Emergency Notice */}
      <Navbar
        emergencyNotice={settings.emergencyNotice}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
      />

      {/* 2. Full-Width Cinematic Hero Section using exact uploaded image */}
      <Hero
        settings={settings}
        onExploreClick={() => handleScrollTo('destinations')}
        onMapClick={() => handleScrollTo('map')}
        onEducationClick={() => handleScrollTo('education')}
      />

      {/* 3. About Tharparkar — Heritage, Peace, Peacocks, and Talukas */}
      <AboutSection
        onTownSelect={(town) => {
          setSelectedTown(town);
          handleScrollTo('map');
        }}
      />

      {/* 4. Complete Interactive Tharparkar District Map (Leaflet) */}
      <InteractiveMap
        items={items}
        selectedTown={selectedTown}
        onTownChange={(t) => setSelectedTown(t)}
        onSelectItem={(item) => setActiveItem(item)}
      />

      {/* 5. Famous Tourist Destinations */}
      <DestinationsSection
        items={items}
        onSelectItem={(item) => setActiveItem(item)}
        onExploreMap={() => handleScrollTo('map')}
      />

      {/* 6. Education Directory (Schools, Colleges, TIEST NED, Nursing, STEVTA) */}
      <EducationDirectory
        items={items}
        onSelectItem={(item) => setActiveItem(item)}
        onTownFilterChange={(town) => setSelectedTown(town)}
      />

      {/* 7. Healthcare Directory (DHQ Mithi, THQ Hospitals, RHCs, Emergency) */}
      <HealthcareSection
        items={items}
        onSelectItem={(item) => setActiveItem(item)}
      />

      {/* 8. Accommodation & Hospitality (STDC Resorts, Motels, Desert Huts) */}
      <AccommodationSection
        items={items}
        onSelectItem={(item) => setActiveItem(item)}
        onInquiryClick={handleInquiryForHotel}
      />

      {/* 9. Government Offices & Private Business Directory */}
      <PublicServicesSection
        items={items}
        onSelectItem={(item) => setActiveItem(item)}
      />

      {/* 10. Local Culture, Ralli Handicrafts & Desert Adventures */}
      <CultureAndAdventures
        onPlanTripClick={() => handleScrollTo('contact')}
      />

      {/* 11. Image & Video Gallery with Lightbox */}
      <GallerySection />

      {/* 12. Travel Guide & Frequently Asked Questions */}
      <TravelGuideAndFaq />

      {/* 13. Contact & Citizen Feedback Form */}
      <ContactAndFeedback
        settings={settings}
        onOpenSubmitModal={() => setIsSubmitOpen(true)}
        prefilledSubject={inquirySubject}
      />

      {/* 14. Complete Footer with Emergency Telephone Directory & Admin link */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
      />

      {/* MODALS */}
      {/* Listing Detail Modal */}
      <ListingDetailModal
        item={activeItem}
        onClose={() => setActiveItem(null)}
        onDirections={(lat, lng) => {
          window.open(
            `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
            '_blank'
          );
        }}
      />

      {/* Citizen Place Submission Modal */}
      <CitizenSubmitModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSuccess={() => loadPortalData()}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={items}
        onSelectItem={(item) => setActiveItem(item)}
      />

      {/* Admin Dashboard Console */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onDataChanged={() => loadPortalData()}
        siteSettings={settings}
        onSettingsUpdated={(newSettings) => setSettings(newSettings)}
      />
    </div>
  );
}
