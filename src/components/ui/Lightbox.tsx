import React, { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../../types';
import { BRAND } from '../../data/contact.data';

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export const Lightbox: React.FC<LightboxProps> = ({ items, currentIndex, onClose, onNavigate }) => {
  const reduce = useReducedMotion();
  const isOpen = currentIndex !== null;
  const item = currentIndex !== null ? items[currentIndex] : null;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && currentIndex !== null) onNavigate((currentIndex + 1) % items.length);
      if (e.key === 'ArrowLeft' && currentIndex !== null) onNavigate((currentIndex - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  const navBtn = 'absolute top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full border border-gold/40 bg-primary/40 backdrop-blur-sm text-gold-light hover:bg-gold hover:text-primary flex items-center justify-center transition-colors';

  return (
    <AnimatePresence>
      {isOpen && item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-primary-deep/95 backdrop-blur-md p-3 sm:p-8"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-11 h-11 rounded-full text-on-primary/80 hover:text-on-primary hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" strokeWidth={1.5} />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((currentIndex - 1 + items.length) % items.length);
                }}
                aria-label="Photo précédente"
                className={`${navBtn} left-2 sm:left-6`}
              >
                <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((currentIndex + 1) % items.length);
                }}
                aria-label="Photo suivante"
                className={`${navBtn} right-2 sm:right-6`}
              >
                <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </>
          )}

          <motion.figure
            key={item.id}
            initial={{ opacity: 0, scale: reduce ? 1 : 0.97, filter: reduce ? 'none' : 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col"
          >
            <div className="flex-1 min-h-0 flex items-center justify-center">
              <img src={item.image} alt={item.alt} className="max-h-[70vh] w-auto max-w-full object-contain border border-gold/30 select-none" />
            </div>
            <figcaption className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-on-primary">
              <div>
                <span className="font-label text-[10.5px] uppercase tracking-[0.24em] text-gold-light">
                  {item.category} · {currentIndex + 1} / {items.length}
                </span>
                <h3 className="mt-1 font-display text-xl sm:text-2xl font-medium">{item.title}</h3>
                <p className="mt-1 font-body text-[14px] text-primary-fixed/80 max-w-[60ch] leading-relaxed">{item.description}</p>
              </div>
              <span className="font-label text-[10px] uppercase tracking-[0.24em] text-on-primary/50 shrink-0">
                {BRAND.name} · {BRAND.city}
              </span>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
