import React, { forwardRef } from 'react';
import { Coffee, Phone, Plus } from 'lucide-react';
import { MenuItem } from '../../types';
import { SUMMARY_FLYER, COFFEE_BREAK_FLYER, MENUS_DATA } from '../../data/menus.data';
import { CONTACT_DATA, BRAND } from '../../data/contact.data';
import { LogoMark } from './Logo';

/** Identifiants de cartes : la carte générale, les trois menus, la pause café. */
export type FlyerId = 'summary' | 'coffee' | (typeof MENUS_DATA)[number]['id'];

export const FLYER_TABS: { id: FlyerId; label: string; fileName: string }[] = [
  { id: 'summary', label: 'La carte', fileName: 'ngouda-traiteur-carte' },
  ...MENUS_DATA.map((m) => ({ id: m.id as FlyerId, label: `Menu ${m.number}`, fileName: `ngouda-traiteur-menu-${m.number}` })),
  { id: 'coffee', label: 'Pause café', fileName: 'ngouda-traiteur-pause-cafe' }
];

export const flyerTitle = (id: FlyerId) => {
  if (id === 'summary') return 'Vue d’ensemble des formules';
  if (id === 'coffee') return 'Pause café — en option';
  return MENUS_DATA.find((m) => m.id === id)?.name ?? '';
};

interface Sheet {
  subtitle: string;
  heroImage: string;
  heroCaption?: string;
  intro?: string;
  categories: { title: string; image: string; description: string }[];
  noteIcon: 'coffee' | 'none';
  noteLabel: string;
  noteText: string;
  bannerTitle: string;
  bannerText: string;
  formulas: { name: string; desc: string }[];
  /** Suppléments sur demande (menus) */
  options?: string[];
}

const buildSheet = (id: FlyerId): Sheet => {
  if (id === 'summary') {
    return {
      subtitle: SUMMARY_FLYER.subtitle,
      heroImage: SUMMARY_FLYER.heroImage,
      heroCaption: SUMMARY_FLYER.heroCaption,
      categories: SUMMARY_FLYER.categories,
      noteIcon: 'coffee',
      noteLabel: 'Pause café',
      noteText: SUMMARY_FLYER.pauseText.replace(/^☕\s*/, '').replace(/^Pause café\s*/i, ''),
      bannerTitle: SUMMARY_FLYER.bannerTitle,
      bannerText: SUMMARY_FLYER.bannerText,
      formulas: SUMMARY_FLYER.formulas
    };
  }
  if (id === 'coffee') {
    return {
      subtitle: COFFEE_BREAK_FLYER.subtitle,
      heroImage: COFFEE_BREAK_FLYER.heroImage,
      heroCaption: COFFEE_BREAK_FLYER.heroCaption,
      intro: COFFEE_BREAK_FLYER.intro,
      categories: COFFEE_BREAK_FLYER.categories,
      noteIcon: 'coffee',
      noteLabel: 'Service',
      noteText: COFFEE_BREAK_FLYER.pauseText,
      bannerTitle: COFFEE_BREAK_FLYER.bannerTitle,
      bannerText: COFFEE_BREAK_FLYER.bannerText,
      formulas: []
    };
  }
  const menu = MENUS_DATA.find((m) => m.id === id) as MenuItem;
  const pause = (menu.coffeeBreak || 'Pause café disponible en option').replace(/^☕\s*/, '');
  return {
    subtitle: menu.name,
    heroImage: menu.image,
    heroCaption: menu.caption,
    categories: menu.categories.map((c) => ({ title: c.title, image: c.image, description: c.items })),
    noteIcon: 'coffee',
    noteLabel: 'Pause café',
    noteText: pause.replace(/^Pause café[^—-]*[—-]\s*/i, ''),
    bannerTitle: menu.number === 3 ? 'Votre événement sur-mesure' : '100 % personnalisable',
    bannerText:
      menu.number === 3
        ? 'Chaque détail est conçu selon vos exigences. Dressage et service d’exception sur place.'
        : 'Chaque événement est unique, conçu et dressé sur place selon vos envies.',
    formulas: [],
    options: menu.options
  };
};

interface FlyerSheetProps {
  flyerId: FlyerId;
  className?: string;
}

/** Carte imprimable : reprend la mise en page du flyer papier. */
export const FlyerSheet = forwardRef<HTMLDivElement, FlyerSheetProps>(({ flyerId, className = '' }, ref) => {
  const sheet = buildSheet(flyerId);

  return (
    <div
      ref={ref}
      className={`relative w-full max-w-[560px] mx-auto bg-[#fdfbf7] text-on-surface p-5 sm:p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] ${className}`}
    >
      <div className="absolute inset-[9px] sm:inset-[12px] border border-gold pointer-events-none" style={{ boxShadow: 'inset 0 0 0 3px rgba(74, 14, 46, 0.08)' }} />

      <div className="relative z-[1] flex flex-col gap-4">
        {/* En-tête */}
        <div className="flex flex-col items-center text-center pt-1">
          <LogoMark className="w-12 h-12" style={{ width: 48, height: 48 }} />
          <span className="mt-1 font-display text-[26px] font-semibold uppercase tracking-[0.2em] text-primary" style={{ marginRight: '-0.2em' }}>
            {BRAND.shortName}
          </span>
          <span className="font-label text-[10.5px] font-semibold uppercase tracking-[0.34em] text-secondary">{sheet.subtitle}</span>
          <div className="hairline-gold w-2/3 mt-2.5" />
        </div>

        {/* Visuel */}
        <div className="relative overflow-hidden h-[140px] sm:h-[160px] border border-gold/50">
          <img src={sheet.heroImage} alt="" className="w-full h-full object-cover" />
          {sheet.heroCaption && (
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary-container/95 via-primary-container/60 to-transparent pt-8 pb-2.5 px-3 text-center">
              <span className="font-display italic text-base sm:text-lg text-on-primary">{sheet.heroCaption}</span>
            </div>
          )}
        </div>

        {sheet.intro && (
          <p className="font-body text-[12px] sm:text-[13px] leading-snug text-on-surface-variant text-center px-2">{sheet.intro}</p>
        )}

        {/* Catégories */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {sheet.categories.map((cat) => (
            <div key={cat.title} className="text-center">
              <span className="block font-label text-[10.5px] font-semibold uppercase tracking-[0.2em] text-primary mb-1.5">{cat.title}</span>
              <div className="w-full h-[68px] sm:h-[80px] overflow-hidden border border-gold/60 bg-surface-container-high">
                <img src={cat.image} alt="" className="w-full h-full object-cover" />
              </div>
              <p className="mt-1.5 font-body text-[11px] sm:text-[12px] leading-snug text-on-surface-variant px-1">{cat.description}</p>
            </div>
          ))}
        </div>

        {/* Notes : options sur demande, pause café */}
        <div className="border border-dashed border-gold/70 bg-gold/[0.07] py-2 px-3 font-body text-[11.5px] sm:text-[12px] leading-snug text-on-surface text-center space-y-1">
          {sheet.options && sheet.options.length > 0 && (
            <p className="flex items-start justify-center gap-2">
              <Plus className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" strokeWidth={1.6} />
              <span>
                <strong className="font-semibold">En option</strong> — {sheet.options.join(', ')}, sur demande
              </span>
            </p>
          )}
          <p className="flex items-start justify-center gap-2">
            <Coffee className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" strokeWidth={1.6} />
            <span>
              <strong className="font-semibold">{sheet.noteLabel}</strong> — {sheet.noteText}
            </span>
          </p>
        </div>

        {/* Bandeau */}
        <div className="bg-primary-container text-on-primary text-center py-2.5 px-3">
          <span className="block font-label text-[10.5px] font-semibold uppercase tracking-[0.28em] text-gold-light">{sheet.bannerTitle}</span>
          <span className="block mt-0.5 font-body text-[11.5px] sm:text-[12px] leading-snug text-primary-fixed/90">{sheet.bannerText}</span>
        </div>

        {sheet.formulas.length > 0 && (
          <ul className="space-y-1.5 px-1">
            {sheet.formulas.map((f) => (
              <li key={f.name} className="border-l border-gold pl-3">
                <span className="block font-display text-[13px] font-semibold text-primary">{f.name}</span>
                <span className="block font-body text-[11px] text-on-surface-variant leading-snug">{f.desc}</span>
              </li>
            ))}
          </ul>
        )}

        {flyerId === 'coffee' && (
          <p className="font-body italic text-[11.5px] text-on-surface-variant text-center px-2">{COFFEE_BREAK_FLYER.note}</p>
        )}

        {/* Pied */}
        <div className="border-t border-gold pt-2.5 text-center">
          <span className="inline-flex items-center gap-1.5 font-label text-[12px] font-semibold text-primary">
            <Phone className="w-3.5 h-3.5 text-gold" strokeWidth={1.6} />
            {CONTACT_DATA.phoneDisplay} — Devis personnalisé
          </span>
          <span className="block mt-0.5 font-label text-[10.5px] uppercase tracking-[0.18em] text-secondary">
            {CONTACT_DATA.city} · {CONTACT_DATA.address}
          </span>
        </div>
      </div>
    </div>
  );
});
FlyerSheet.displayName = 'FlyerSheet';
