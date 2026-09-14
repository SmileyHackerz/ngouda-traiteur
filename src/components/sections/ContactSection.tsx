import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock } from 'lucide-react';
import { CONTACT_DATA } from '../../data/contact.data';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal';

const ROWS = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: CONTACT_DATA.phoneDisplay,
    hint: 'Réponse rapide, 7 j / 7',
    href: CONTACT_DATA.whatsappUrl,
    external: true
  },
  {
    icon: Phone,
    label: 'Téléphone',
    value: CONTACT_DATA.phoneDisplay,
    hint: 'Du lundi au samedi, 9 h – 20 h',
    href: `tel:${CONTACT_DATA.phoneRaw}`
  },
  {
    icon: Mail,
    label: 'E-mail',
    value: CONTACT_DATA.email,
    hint: 'Devis détaillé sous 24 h',
    href: `mailto:${CONTACT_DATA.email}`
  },
  {
    icon: MapPin,
    label: 'Atelier',
    value: `${CONTACT_DATA.address}`,
    hint: `${CONTACT_DATA.city}, ${CONTACT_DATA.country} · sur rendez-vous`
  }
];

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-24 md:py-32">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id="contact-heading"
            align="left"
            className="items-start text-left"
            title="Parlons de votre réception"
            lead="Une question, une date à bloquer, un menu à imaginer ? Écrivez-nous : nous répondons vite et avec plaisir."
          />

          <Reveal kind="rise" delay={0.2} className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-6 font-body text-[15px] text-on-surface-variant">
            <div className="border-t border-gold/50 pt-4">
              <span className="flex items-center gap-2 font-label text-[10.5px] font-semibold uppercase tracking-[0.2em] text-secondary">
                <Clock className="w-3.5 h-3.5" strokeWidth={1.6} /> Zone d'intervention
              </span>
              <p className="mt-2 leading-relaxed">
                Dakar et sa presqu'île, Keur Massar, Rufisque, la Petite-Côte (Saly, Somone) et les régions sur devis.
              </p>
            </div>
            <div className="border-t border-gold/50 pt-4">
              <span className="font-label text-[10.5px] font-semibold uppercase tracking-[0.2em] text-secondary">Formats</span>
              <p className="mt-2 leading-relaxed">
                Mariages, banquets, réceptions d'entreprise, galas, buffets et pauses café — de 20 à plus de 1 000 convives.
              </p>
            </div>
          </Reveal>
        </div>

        <RevealGroup as="ul" className="lg:col-span-7 lg:pt-3 divide-y divide-outline-variant/40 border-y border-outline-variant/40" stagger={0.08}>
          {ROWS.map((row) => {
            const Icon = row.icon;
            const inner = (
              <>
                <span className="w-11 h-11 rounded-full border border-gold/60 text-gold flex items-center justify-center shrink-0 transition-colors duration-300 group-hover:bg-primary group-hover:border-primary group-hover:text-gold-light">
                  <Icon className="w-[18px] h-[18px]" strokeWidth={1.6} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-label text-[10.5px] font-semibold uppercase tracking-[0.2em] text-secondary">{row.label}</span>
                  <span className="block mt-0.5 font-display text-lg sm:text-xl text-primary font-medium truncate">{row.value}</span>
                  <span className="block mt-0.5 font-body text-[13.5px] text-on-surface-variant">{row.hint}</span>
                </span>
              </>
            );
            return (
              <RevealItem as="li" key={row.label}>
                {row.href ? (
                  <a
                    href={row.href}
                    target={row.external ? '_blank' : undefined}
                    rel={row.external ? 'noopener noreferrer' : undefined}
                    className="group flex items-center gap-5 py-5 sm:py-6 transition-[padding] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:pl-2"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="group flex items-center gap-5 py-5 sm:py-6">{inner}</div>
                )}
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
};
