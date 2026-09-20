import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Instagram, Facebook } from 'lucide-react';
import { CONTACT_DATA, BRAND } from '../../data/contact.data';
import { Logo } from '../ui/Logo';
import { NAV_LINKS } from './Header';

export const Footer: React.FC = () => {
  const [showLegal, setShowLegal] = useState(false);

  useEffect(() => {
    if (!showLegal) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowLegal(false);
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [showLegal]);

  return (
    <>
      <footer className="grain-dark relative bg-primary-deep text-on-primary overflow-hidden">
        <div className="relative z-[1] max-w-[1280px] mx-auto px-5 md:px-16 pt-16 pb-[max(2.5rem,env(safe-area-inset-bottom))] md:pt-20 md:pb-12">
          <div className="flex flex-col items-center text-center md:flex-row md:items-start md:justify-between md:text-left gap-12">
            <div className="flex flex-col items-center md:items-start">
              <Logo tone="light" layout="stacked" markSize={96} className="w-24" />
              <p className="mt-6 font-body italic text-[15px] text-primary-fixed/80 max-w-[34ch]">
                {BRAND.tagline}. Traiteur événementiel à {BRAND.city}.
              </p>
            </div>

            <nav aria-label="Plan du site" className="grid grid-cols-2 gap-x-12 gap-y-3">
              {NAV_LINKS.filter((l) => l.href !== '#accueil').map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="link-gold font-label text-[11.5px] uppercase tracking-[0.2em] text-primary-fixed/85 hover:text-on-primary transition-colors"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <address className="not-italic font-body text-[15px] leading-relaxed text-primary-fixed/85">
              <a href={CONTACT_DATA.whatsappUrl} target="_blank" rel="noopener noreferrer" className="block hover:text-on-primary transition-colors">
                {CONTACT_DATA.phoneDisplay}
              </a>
              <a href={`mailto:${CONTACT_DATA.email}`} className="block hover:text-on-primary transition-colors">
                {CONTACT_DATA.email}
              </a>
              <span className="block mt-2">
                {CONTACT_DATA.address}
                <br />
                {CONTACT_DATA.city}, {CONTACT_DATA.country}
              </span>
              <span className="block mt-2 font-label text-[11px] uppercase tracking-[0.16em] text-gold-light">
                {CONTACT_DATA.hoursShort}
              </span>
              <span className="mt-4 flex items-center justify-center md:justify-start gap-4">
                <a href="#" aria-label="Instagram" className="text-gold-light/80 hover:text-gold-light transition-colors">
                  <Instagram className="w-5 h-5" strokeWidth={1.5} />
                </a>
                <a href="#" aria-label="Facebook" className="text-gold-light/80 hover:text-gold-light transition-colors">
                  <Facebook className="w-5 h-5" strokeWidth={1.5} />
                </a>
              </span>
            </address>
          </div>

          <div className="hairline-gold mt-14 md:mt-16 opacity-60" />

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 font-label text-[11px] uppercase tracking-[0.16em] text-primary-fixed/60">
            <span>© {new Date().getFullYear()} {BRAND.name} · {BRAND.city}</span>
            <button type="button" onClick={() => setShowLegal(true)} className="link-gold hover:text-on-primary transition-colors">
              Mentions légales & confidentialité
            </button>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showLegal && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="legal-title"
            className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-primary-deep/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setShowLegal(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-surface w-full sm:max-w-lg max-h-[85vh] overflow-y-auto p-7 sm:p-9 border-t sm:border border-gold/40 rounded-t-2xl sm:rounded-[4px]"
            >
              <button
                type="button"
                onClick={() => setShowLegal(false)}
                aria-label="Fermer"
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 id="legal-title" className="font-display text-2xl text-primary font-semibold pr-10">
                Mentions légales & confidentialité
              </h3>
              <div className="mt-5 font-body text-[14.5px] leading-relaxed text-on-surface-variant space-y-3">
                <p>
                  <strong className="text-on-surface">Éditeur :</strong> {BRAND.name} — {CONTACT_DATA.address}, {CONTACT_DATA.city}, {CONTACT_DATA.country}.
                </p>
                <p>
                  <strong className="text-on-surface">Contact :</strong> {CONTACT_DATA.phoneDisplay} — {CONTACT_DATA.email}
                </p>
                <p>
                  <strong className="text-on-surface">Propriété intellectuelle :</strong> les textes, marques, photographies et créations culinaires
                  présentés sur ce site sont la propriété exclusive de {BRAND.name}.
                </p>
                <p>
                  <strong className="text-on-surface">Données personnelles :</strong> les informations saisies dans le formulaire de devis sont
                  transmises uniquement via votre application WhatsApp, vers notre numéro professionnel. Elles ne sont ni stockées
                  sur ce site ni cédées à des tiers.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
