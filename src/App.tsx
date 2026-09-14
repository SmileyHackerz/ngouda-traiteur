import React, { useState, useCallback } from 'react';
import { Header } from './components/sections/Header';
import { Hero } from './components/sections/Hero';
import { MenusSection } from './components/sections/MenusSection';
import { ArtSection } from './components/sections/ArtSection';
import { EventsSection } from './components/sections/EventsSection';
import { ReservationSection } from './components/sections/ReservationSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/sections/Footer';
import { GoldDivider } from './components/ui/GoldDivider';
import { MenuPdfModal } from './components/ui/MenuPdfModal';
import { Lightbox } from './components/ui/Lightbox';
import { ReservationModal } from './components/sections/ReservationModal';
import { GALLERY_ITEMS } from './data/gallery.data';
import { MenuItem } from './types';

export default function App() {
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [preselectedMenu, setPreselectedMenu] = useState('');

  const [activeMenuPdf, setActiveMenuPdf] = useState<MenuItem | null>(null);
  const [activeFlyerId, setActiveFlyerId] = useState<string | null>(null);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openFlyer = (menu: MenuItem | null, flyerId?: string) => {
    setActiveMenuPdf(menu);
    setActiveFlyerId(flyerId || menu?.id || 'summary');
  };
  const closeFlyer = useCallback(() => {
    setActiveMenuPdf(null);
    setActiveFlyerId(null);
  }, []);

  const openReservation = (menuName = '') => {
    setPreselectedMenu(menuName);
    setIsReservationOpen(true);
  };
  const closeReservation = useCallback(() => {
    setIsReservationOpen(false);
    setPreselectedMenu('');
  }, []);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  return (
    <div className="min-h-screen bg-surface text-on-surface texture-paper flex flex-col">
      <Header onOpenReservation={() => openReservation()} />

      <main id="main-content" className="flex-grow">
        <Hero onOpenReservation={() => openReservation()} />

        <MenusSection onSelectMenu={(name) => openReservation(name)} onViewMenuPdf={openFlyer} />

        <ArtSection />

        <EventsSection onOpenLightbox={setLightboxIndex} />

        <ReservationSection onOpenReservation={() => openReservation()} />

        <GoldDivider />

        <ContactSection />
      </main>

      <Footer />

      <MenuPdfModal
        menu={activeMenuPdf}
        initialFlyerId={activeFlyerId || undefined}
        onClose={closeFlyer}
        onChooseMenu={(name) => openReservation(name)}
      />

      <Lightbox items={GALLERY_ITEMS} currentIndex={lightboxIndex} onClose={closeLightbox} onNavigate={setLightboxIndex} />

      <ReservationModal isOpen={isReservationOpen} onClose={closeReservation} preselectedMenu={preselectedMenu} />
    </div>
  );
}
