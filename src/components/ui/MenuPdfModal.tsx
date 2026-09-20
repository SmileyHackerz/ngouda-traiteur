import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, ArrowRight, Phone, Download, FileText, Image as ImageIcon, Loader2 } from 'lucide-react';
import { MenuItem } from '../../types';
import { MENUS_DATA } from '../../data/menus.data';
import { CONTACT_DATA } from '../../data/contact.data';
import { FlyerSheet, FLYER_TABS, flyerTitle, type FlyerId } from './FlyerSheet';
import { Button } from './Button';
import { downloadFlyer, type FlyerFormat } from '../../lib/downloadFlyer';

interface MenuPdfModalProps {
  menu: MenuItem | null;
  initialFlyerId?: string;
  onClose: () => void;
  onChooseMenu: (menuName: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export const MenuPdfModal: React.FC<MenuPdfModalProps> = ({ menu, initialFlyerId, onClose, onChooseMenu }) => {
  const reduce = useReducedMotion();
  const isOpen = Boolean(menu || initialFlyerId);
  const [activeTab, setActiveTab] = useState<FlyerId>('summary');
  const [busy, setBusy] = useState<FlyerFormat | null>(null);
  const [error, setError] = useState('');
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialFlyerId) setActiveTab(initialFlyerId as FlyerId);
    else if (menu) setActiveTab(menu.id as FlyerId);
  }, [menu, initialFlyerId]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  const activeMenu = MENUS_DATA.find((m) => m.id === activeTab) ?? null;
  const tab = FLYER_TABS.find((t) => t.id === activeTab) ?? FLYER_TABS[0];

  const handleDownload = async (format: FlyerFormat) => {
    if (!sheetRef.current || busy) return;
    setBusy(format);
    setError('');
    try {
      await downloadFlyer(sheetRef.current, tab.fileName, format);
    } catch {
      setError('Le téléchargement a échoué. Réessayez ou faites une capture d’écran.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="flyer-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="menu-modal-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-primary-deep/80 backdrop-blur-md sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={reduce ? { opacity: 0 } : { y: '100%' }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-2xl h-[94dvh] sm:h-auto sm:max-h-[92vh] bg-primary-deep text-on-primary border-t sm:border border-gold/40 rounded-t-[22px] sm:rounded-[4px] flex flex-col overflow-hidden"
          >
            <span className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-on-primary/30" aria-hidden="true" />

            {/* En-tête */}
            <div className="px-5 sm:px-7 pt-6 sm:pt-5 pb-4 border-b border-gold/25 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="block font-label text-[10px] uppercase tracking-[0.28em] text-gold-light">N'Gouda Traiteur · La carte</span>
                <h2 id="menu-modal-title" className="mt-0.5 font-display text-lg sm:text-xl font-semibold leading-tight truncate">
                  {flyerTitle(activeTab)}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fermer"
                className="-mr-2 w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-on-primary/80 hover:text-on-primary hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Onglets */}
            <div className="px-5 sm:px-7 py-3 border-b border-gold/20 flex gap-1 overflow-x-auto scrollbar-none" role="tablist" aria-label="Cartes">
              {FLYER_TABS.map((t) => {
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(t.id)}
                    className={`relative shrink-0 px-4 py-2 min-h-[40px] font-label text-[11.5px] font-semibold uppercase tracking-[0.18em] rounded-[3px] transition-colors ${
                      active ? 'text-primary' : 'text-on-primary/70 hover:text-on-primary'
                    }`}
                  >
                    {active && (
                      <motion.span layoutId="flyer-tab" className="absolute inset-0 bg-gold rounded-[3px]" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                    )}
                    <span className="relative">{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Feuille */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#0e0008]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -6 }}
                  transition={{ duration: 0.3, ease: EASE }}
                >
                  <FlyerSheet ref={sheetRef} flyerId={activeTab} />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="px-5 sm:px-7 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-gold/25 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 font-label text-[10.5px] uppercase tracking-[0.2em] text-on-primary/60 mr-1">
                  <Download className="w-3.5 h-3.5" strokeWidth={1.6} /> Télécharger
                </span>
                <button
                  type="button"
                  onClick={() => handleDownload('pdf')}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 border border-gold/50 text-gold-light hover:bg-gold hover:text-primary font-label text-[11px] font-semibold uppercase tracking-[0.18em] rounded-[3px] transition-colors disabled:opacity-60"
                >
                  {busy === 'pdf' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" strokeWidth={1.6} />}
                  PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload('png')}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 border border-gold/50 text-gold-light hover:bg-gold hover:text-primary font-label text-[11px] font-semibold uppercase tracking-[0.18em] rounded-[3px] transition-colors disabled:opacity-60"
                >
                  {busy === 'png' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5" strokeWidth={1.6} />}
                  Image
                </button>
              </div>

              {activeMenu ? (
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onChooseMenu(activeMenu.name);
                  }}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Choisir cette formule
                </Button>
              ) : (
                <a href={`tel:${CONTACT_DATA.phoneRaw}`} className="inline-flex items-center gap-2 font-label text-xs text-gold-light hover:text-on-primary transition-colors">
                  <Phone className="w-3.5 h-3.5" strokeWidth={1.6} />
                  {CONTACT_DATA.phoneDisplay}
                </a>
              )}
              {error && (
                <p role="alert" className="w-full font-label text-xs text-[#ffb4a8]">
                  {error}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
