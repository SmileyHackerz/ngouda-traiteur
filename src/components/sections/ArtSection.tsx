import React from 'react';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal } from '../ui/Reveal';
import { BRAND } from '../../data/contact.data';

const PILLARS = [
  {
    title: 'Produits choisis',
    text: 'Viandes, poissons et fruits sélectionnés chaque matin auprès de nos fournisseurs de confiance.'
  },
  {
    title: 'Dressage sur place',
    text: 'Nos équipes montent buffets et tables directement sur le lieu de votre réception.'
  },
  {
    title: 'Service attentif',
    text: 'Une brigade discrète et souriante, du premier verre au dernier café.'
  }
];

export const ArtSection: React.FC = () => {
  return (
    <section id="art" aria-labelledby="art-heading" className="py-24 md:py-32 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 grid gap-14 lg:grid-cols-12 lg:gap-16 items-center">
        {/* Portrait en arche */}
        <div className="lg:col-span-5 relative flex justify-center">
          <Reveal kind="mask" className="relative w-full max-w-[380px] lg:max-w-none">
            <figure className="relative overflow-hidden rounded-t-full border-b-4 border-gold bg-surface-dim aspect-[4/5]">
              <img
                src="/images/cheffe-portrait.jpg"
                alt={`${BRAND.chef}, cheffe fondatrice de ${BRAND.name}, dans une salle de réception dressée`}
                loading="lazy"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/85 via-primary/25 to-transparent" />
              <figcaption className="absolute bottom-6 inset-x-6 text-center text-on-primary">
                <span className="block font-display text-2xl font-medium">{BRAND.chef}</span>
                <span className="block mt-1 font-label text-[10.5px] uppercase tracking-[0.28em] text-gold-light">
                  Cheffe fondatrice
                </span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* Récit */}
        <div className="lg:col-span-7 text-center lg:text-left">
          <SectionHeading
            id="art-heading"
            align="left"
            className="mx-auto lg:mx-0 items-center lg:items-start text-center lg:text-left"
            title="Créateurs d’émotions"
          />

          <Reveal as="p" kind="rise" delay={0.1} className="mt-7 font-display italic text-xl sm:text-2xl leading-snug text-primary max-w-[40ch] mx-auto lg:mx-0">
            « L'excellence n'est pas un acte, mais une habitude. Chaque réception est une toile vierge où nous peignons avec des saveurs. »
          </Reveal>

          <Reveal as="p" kind="rise" delay={0.18} className="mt-6 font-body text-[1.0625rem] sm:text-lg leading-relaxed text-on-surface-variant max-w-[58ch] mx-auto lg:mx-0">
            Chez {BRAND.name}, nous cultivons un savoir-faire artisanal et une exigence sans compromis.
            Fondée par {BRAND.chef}, la maison marie la générosité de la table sénégalaise à la rigueur
            du service à la française, pour des événements de vingt à plus de mille convives.
          </Reveal>

          <dl className="mt-10 grid sm:grid-cols-3 gap-8 sm:gap-6 text-left">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} kind="rise" delay={0.2 + i * 0.1} className="border-t border-gold/50 pt-4">
                <dt className="font-display text-lg text-primary font-semibold">{p.title}</dt>
                <dd className="mt-2 font-body text-[14.5px] leading-relaxed text-on-surface-variant">{p.text}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
