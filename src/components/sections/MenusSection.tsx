import React, { useRef, useState, useEffect } from 'react';
import { ArrowRight, ArrowUpRight, Coffee, FileText, Plus } from 'lucide-react';
import { MenuItem } from '../../types';
import { MENUS_DATA, CUSTOM_MENU_INFO } from '../../data/menus.data';
import { Button } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal';

interface MenusSectionProps {
  onSelectMenu: (menuName: string) => void;
  onViewMenuPdf: (menu: MenuItem | null, initialFlyerId?: string) => void;
}

const ROMAN = ['I', 'II', 'III'];

const MenuCard: React.FC<{
  menu: MenuItem;
  index: number;
  onSelectMenu: (name: string) => void;
  onViewMenuPdf: (menu: MenuItem, id: string) => void;
}> = ({ menu, index, onSelectMenu, onViewMenuPdf }) => (
  <article className="group h-full flex flex-col bg-surface-container-lowest border border-outline-variant/40 hover:border-gold/70 transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(43,0,24,0.35)]">
    <div className="relative aspect-[4/3] overflow-hidden bg-surface-dim">
      <img
        src={menu.image}
        alt={menu.alt}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
      <span className="absolute top-4 left-4 inline-flex items-baseline gap-1.5 text-on-primary">
        <span className="font-label text-[10px] uppercase tracking-[0.28em] opacity-80">Menu</span>
        <span className="font-display italic text-2xl leading-none text-gold-light">{ROMAN[index] ?? menu.number}</span>
      </span>
      <span className="absolute bottom-4 left-5 right-5 font-body italic text-[15px] text-primary-fixed/95">
        {menu.tagline}
      </span>
    </div>

    <div className="flex-1 flex flex-col p-6 md:p-7">
      <h3 className="font-display text-[1.6rem] leading-tight text-primary font-semibold">{menu.shortName}</h3>
      <p className="mt-3 font-body text-[15px] leading-relaxed text-on-surface-variant">{menu.description}</p>

      <ul className="list-diamond mt-5 space-y-2 font-body text-[14px] leading-snug text-on-surface">
        {menu.categories.map((cat) => (
          <li key={cat.title}>
            <span className="font-label text-[10.5px] font-semibold uppercase tracking-[0.16em] text-secondary mr-1.5">{cat.title}</span>
            {cat.items}
          </li>
        ))}
      </ul>

      <div className="mt-5 space-y-2 font-body text-[13px] leading-snug text-on-surface-variant">
        {menu.options?.map((opt) => (
          <p key={opt} className="flex items-start gap-2">
            <Plus className="w-4 h-4 text-gold shrink-0 mt-0.5" strokeWidth={1.6} />
            <span>
              <span className="font-label text-[10.5px] font-semibold uppercase tracking-[0.16em] text-secondary mr-1.5">Option</span>
              {opt}, sur demande
            </span>
          </p>
        ))}
        <button
          type="button"
          onClick={() => onViewMenuPdf(menu, 'coffee')}
          className="flex items-start gap-2 text-left hover:text-primary transition-colors"
          title="Voir le détail de la pause café"
        >
          <Coffee className="w-4 h-4 text-gold shrink-0 mt-0.5" strokeWidth={1.6} />
          <span>
            <span className="font-label text-[10.5px] font-semibold uppercase tracking-[0.16em] text-secondary mr-1.5">Option</span>
            Pause café — <span className="link-gold text-primary">voir le détail</span>
          </span>
        </button>
      </div>

      <div className="mt-auto pt-6 flex items-center justify-between gap-4 border-t border-outline-variant/40 mt-6">
        <Button variant="tertiary" onClick={() => onViewMenuPdf(menu, menu.id)} icon={<ArrowUpRight className="w-3.5 h-3.5" />}>
          Voir la carte
        </Button>
        <Button variant="primary" size="sm" onClick={() => onSelectMenu(menu.name)} icon={<ArrowRight className="w-3.5 h-3.5" />}>
          Choisir
        </Button>
      </div>
    </div>
  </article>
);

export const MenusSection: React.FC<MenusSectionProps> = ({ onSelectMenu, onViewMenuPdf }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Indicateur du carrousel mobile
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const cards = Array.from(el.children) as HTMLElement[];
      const center = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (i: number) => {
    const el = trackRef.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - 20, behavior: 'smooth' });
  };

  return (
    <section id="menus" aria-labelledby="menus-heading" className="py-24 md:py-32 bg-surface-container-low">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16">
        <SectionHeading
          id="menus-heading"
          title="Nos menus signatures"
          lead="Trois formules de référence, cuisinées avec des produits choisis et dressées sur le lieu de votre événement. Chacune peut être ajustée à vos envies."
        />
      </div>

      {/* Mobile : carrousel à défilement magnétique */}
      <div className="md:hidden mt-12">
        <div
          ref={trackRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none px-5 pb-2 scroll-px-5"
          role="list"
          aria-label="Menus signatures"
        >
          {MENUS_DATA.map((menu, i) => (
            <div key={menu.id} role="listitem" className="snap-center shrink-0 w-[86vw] max-w-[360px]">
              <MenuCard menu={menu} index={i} onSelectMenu={onSelectMenu} onViewMenuPdf={onViewMenuPdf} />
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-center gap-2" aria-hidden="true">
          {MENUS_DATA.map((m, i) => (
            <button
              key={m.id}
              type="button"
              onClick={() => scrollTo(i)}
              className={`h-1 rounded-full transition-[width,background-color] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                i === active ? 'w-7 bg-gold' : 'w-2.5 bg-outline-variant'
              }`}
              tabIndex={-1}
            />
          ))}
        </div>
      </div>

      {/* Desktop : grille */}
      <RevealGroup className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-14 max-w-[1280px] mx-auto px-5 md:px-16" stagger={0.12}>
        {MENUS_DATA.map((menu, i) => (
          <RevealItem key={menu.id} className="h-full">
            <MenuCard menu={menu} index={i} onSelectMenu={onSelectMenu} onViewMenuPdf={onViewMenuPdf} />
          </RevealItem>
        ))}
      </RevealGroup>

      {/* Sur-mesure */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 mt-12 md:mt-16">
        <Reveal kind="rise" className="grain-dark relative overflow-hidden bg-primary text-on-primary px-6 py-10 sm:px-10 md:px-14 md:py-14 border border-gold/30">
          <div className="relative z-[1] grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h3 className="font-display text-[1.75rem] sm:text-3xl md:text-[2.25rem] leading-tight font-medium">
                {CUSTOM_MENU_INFO.title}
              </h3>
              <p className="mt-4 font-body text-[15px] sm:text-base leading-relaxed text-primary-fixed/85 max-w-[60ch]">
                {CUSTOM_MENU_INFO.description}
              </p>
              <ul className="list-diamond mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-2.5 font-body text-[14px] text-primary-fixed/90">
                {CUSTOM_MENU_INFO.perks.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-stretch">
              <Button variant="gold" size="lg" onClick={() => onSelectMenu('Création 100% Sur-mesure')} icon={<ArrowUpRight className="w-4 h-4" />}>
                Devis personnalisé
              </Button>
              <Button variant="outline-light" size="lg" onClick={() => onViewMenuPdf(null, 'summary')} icon={<FileText className="w-4 h-4" />} iconPosition="left">
                La carte complète
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
