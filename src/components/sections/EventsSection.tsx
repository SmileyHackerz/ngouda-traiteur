import React from 'react';
import { Maximize2 } from 'lucide-react';
import { EVENT_FORMATS, GALLERY_ITEMS } from '../../data/gallery.data';
import { SectionHeading } from '../ui/SectionHeading';
import { RevealGroup, RevealItem } from '../ui/Reveal';

interface EventsSectionProps {
  onOpenLightbox: (index: number) => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ onOpenLightbox }) => {
  const indexFor = (image: string) => Math.max(0, GALLERY_ITEMS.findIndex((g) => g.image === image));

  return (
    <section id="evenements" aria-labelledby="events-heading" className="grain-dark relative py-24 md:py-32 bg-primary text-on-primary overflow-hidden">
      <div className="relative z-[1] max-w-[1280px] mx-auto px-5 md:px-16">
        <div className="lg:flex lg:items-end lg:justify-between lg:gap-12">
          <SectionHeading
            id="events-heading"
            tone="light"
            align="left"
            title="Événements de prestige"
            lead="Mariages, galas, cocktails d'entreprise : quelques instants saisis lors de nos dernières réceptions à Dakar."
          />
        </div>

        {/* Mobile : carrousel — Desktop : trois panneaux */}
        <RevealGroup
          as="ul"
          stagger={0.12}
          className="mt-12 md:mt-16 flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-none -mx-5 px-5 md:mx-0 md:px-0 scroll-px-5 pb-2 md:pb-0"
        >
          {EVENT_FORMATS.map((f, i) => {
            const idx = indexFor(f.image);
            const item = GALLERY_ITEMS[idx];
            return (
              <RevealItem key={f.title} as="li" className="snap-center shrink-0 w-[78vw] max-w-[320px] md:w-auto md:max-w-none">
                <button
                  type="button"
                  onClick={() => onOpenLightbox(idx)}
                  aria-label={`Agrandir : ${f.title}`}
                  className={`group relative block w-full text-left overflow-hidden bg-primary-container aspect-[3/4] ${i === 1 ? 'md:mt-10' : ''}`}
                >
                  <img
                    src={f.image}
                    alt={item?.alt ?? f.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary/20 to-transparent transition-opacity duration-500" />
                  <span className="absolute top-4 right-4 w-10 h-10 rounded-full border border-gold/60 bg-primary/40 backdrop-blur-sm flex items-center justify-center text-gold-light opacity-0 translate-y-1 transition-[opacity,transform] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100">
                    <Maximize2 className="w-4 h-4" strokeWidth={1.6} />
                  </span>
                  <span className="absolute inset-x-0 bottom-0 p-6">
                    <span className="block font-display text-2xl md:text-[1.7rem] font-medium leading-tight">{f.title}</span>
                    <span className="mt-2 block font-body text-[14px] leading-relaxed text-primary-fixed/85 max-w-[34ch]">
                      {f.description}
                    </span>
                    <span className="mt-4 block h-px w-10 bg-gold transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-20" />
                  </span>
                </button>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
};
