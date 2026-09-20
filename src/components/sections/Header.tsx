import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Menu, X, Home, UtensilsCrossed, Palette, Sparkles, CalendarDays, MessageCircle, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Logo, LogoMark, Wordmark } from '../ui/Logo';
import { CONTACT_DATA } from '../../data/contact.data';

interface HeaderProps {
  onOpenReservation: () => void;
}

export const NAV_LINKS = [
  { label: 'Accueil', href: '#accueil', icon: Home },
  { label: 'Nos Menus', href: '#menus', icon: UtensilsCrossed },
  { label: 'Notre Art', href: '#art', icon: Palette },
  { label: 'Événements', href: '#evenements', icon: Sparkles },
  { label: 'Réservation', href: '#reservation', icon: CalendarDays },
  { label: 'Contact', href: '#contact', icon: MessageCircle }
];

const EASE = [0.16, 1, 0.3, 1] as const;

export const Header: React.FC<HeaderProps> = ({ onOpenReservation }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('accueil');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const reduce = useReducedMotion();

  // Ombre + compaction après le premier défilement
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setIsScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Section active : observée plutôt que recalculée à chaque scroll
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.2, 0.5] }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Verrouille le défilement quand le tiroir est ouvert
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawerOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen]);

  const go = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setDrawerOpen(false);
    const el = document.getElementById(href.slice(1));
    if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }, [reduce]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[150] focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary font-label text-xs uppercase tracking-[0.18em]"
      >
        Aller au contenu principal
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
          isScrolled
            ? 'bg-surface/92 backdrop-blur-md border-b border-gold/25 shadow-[0_12px_40px_-24px_rgba(43,0,24,0.35)]'
            : 'bg-surface/70 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div
          className={`max-w-[1280px] mx-auto px-5 md:px-16 flex items-center justify-between transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isScrolled ? 'h-16 md:h-[68px]' : 'h-16 md:h-[84px]'
          }`}
        >
          {/* Mobile : bouton menu à gauche */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            aria-label="Ouvrir le menu"
            className="lg:hidden -ml-2 w-11 h-11 inline-flex items-center justify-center text-primary rounded-[3px] hover:bg-surface-container transition-colors"
          >
            <Menu className="w-6 h-6" strokeWidth={1.75} />
          </button>

          {/* Marque */}
          <a
            href="#accueil"
            onClick={(e) => go(e, '#accueil')}
            className="group inline-flex items-center rounded-[3px]"
            aria-label="N'Gouda Traiteur — retour à l'accueil"
          >
            {/* Mobile : lockup compact centré */}
            <span className="lg:hidden inline-flex items-center gap-2.5">
              <LogoMark className="w-9 h-9" />
              <Wordmark size="17px" />
            </span>
            {/* Desktop */}
            <span className="hidden lg:inline-flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-px">
              <Logo markSize={isScrolled ? 38 : 46} />
            </span>
          </a>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">
            {NAV_LINKS.filter((l) => l.href !== '#accueil').map((link) => {
              const isActive = activeSection === link.href.slice(1);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => go(e, link.href)}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative font-label text-[11.5px] uppercase tracking-[0.2em] py-2 transition-colors duration-200 ${
                    isActive ? 'text-primary font-semibold' : 'text-on-surface-variant hover:text-primary font-medium'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-gold"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <span className="hidden lg:inline-flex">
              <Button variant="primary" size="sm" onClick={onOpenReservation}>
                Demander un devis
              </Button>
            </span>
            <a
              href={CONTACT_DATA.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Écrire sur WhatsApp"
              className="lg:hidden -mr-2 w-11 h-11 inline-flex items-center justify-center text-primary rounded-[3px] hover:bg-surface-container transition-colors"
            >
              <MessageCircle className="w-6 h-6" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </header>

      {/* Tiroir mobile (glisse depuis la gauche) */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 z-[60] bg-primary/50 backdrop-blur-[2px] lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.nav
              key="drawer"
              id="mobile-drawer"
              aria-label="Menu mobile"
              className="fixed top-0 left-0 z-[70] h-[100dvh] w-[84vw] max-w-[340px] bg-surface flex flex-col shadow-[24px_0_60px_-30px_rgba(43,0,24,0.5)] lg:hidden"
              initial={{ x: reduce ? 0 : '-100%', opacity: reduce ? 0 : 1 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: reduce ? 0 : '-100%', opacity: reduce ? 0 : 1 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <div className="flex items-center justify-between px-6 h-16 border-b border-outline-variant/40">
                <Logo markSize={36} />
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Fermer le menu"
                  className="-mr-2 w-11 h-11 inline-flex items-center justify-center text-primary rounded-[3px] hover:bg-surface-container"
                >
                  <X className="w-6 h-6" strokeWidth={1.75} />
                </button>
              </div>

              <ul className="flex-1 overflow-y-auto px-6 py-4">
                {NAV_LINKS.map((link, i) => {
                  const Icon = link.icon;
                  const isActive = activeSection === link.href.slice(1);
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: reduce ? 0 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease: EASE }}
                    >
                      <a
                        href={link.href}
                        onClick={(e) => go(e, link.href)}
                        aria-current={isActive ? 'true' : undefined}
                        className={`group flex items-center gap-4 min-h-[52px] py-3 border-b border-outline-variant/30 transition-[padding,color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:pl-2 ${
                          isActive ? 'text-primary' : 'text-on-surface hover:text-primary'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-gold' : 'text-secondary'}`} strokeWidth={1.6} />
                        <span className="font-label text-[13px] font-semibold uppercase tracking-[0.16em]">{link.label}</span>
                        {isActive && <span className="ml-auto w-1.5 h-1.5 rotate-45 bg-gold" aria-hidden="true" />}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 border-t border-outline-variant/40 space-y-3">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => {
                    setDrawerOpen(false);
                    onOpenReservation();
                  }}
                  icon={<ArrowUpRight className="w-4 h-4" />}
                >
                  Demander un devis
                </Button>
                <a
                  href={CONTACT_DATA.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 font-label text-[11px] uppercase tracking-[0.18em] text-secondary py-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp · {CONTACT_DATA.phoneDisplay}
                </a>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
