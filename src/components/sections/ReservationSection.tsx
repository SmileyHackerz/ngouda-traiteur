import React from 'react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal';
import { RESERVATION_PROCESS_STEPS, CONTACT_DATA } from '../../data/contact.data';

interface ReservationSectionProps {
  onOpenReservation: () => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({ onOpenReservation }) => {
  return (
    <section id="reservation" aria-labelledby="reservation-heading" className="py-24 md:py-32 bg-surface-container-low">
      <div className="max-w-[1280px] mx-auto px-5 md:px-16">
        <SectionHeading
          id="reservation-heading"
          title="Concevons votre événement"
          lead="Décrivez-nous votre projet en quelques étapes. Nous revenons vers vous sous 24 heures avec une proposition détaillée, directement sur WhatsApp."
        />

        <RevealGroup as="ol" className="mt-14 md:mt-16 grid md:grid-cols-3 gap-10 md:gap-8 max-w-5xl mx-auto" stagger={0.14}>
          {RESERVATION_PROCESS_STEPS.map((step) => (
            <RevealItem key={step.stepNumber} as="li" className="relative text-center md:text-left">
              <span className="font-display italic text-5xl md:text-6xl leading-none text-gold/60 select-none" aria-hidden="true">
                {String(step.stepNumber).padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-display text-2xl text-primary font-semibold">{step.title}</h3>
              <p className="mt-2.5 font-body text-[15px] leading-relaxed text-on-surface-variant max-w-[36ch] mx-auto md:mx-0">
                {step.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal kind="rise" delay={0.2} className="mt-14 md:mt-16 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <Button variant="primary" size="lg" onClick={onOpenReservation} icon={<ArrowUpRight className="w-4 h-4" />}>
            Réserver maintenant
          </Button>
          <a
            href={CONTACT_DATA.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 min-h-[54px] px-8 border border-gold text-primary font-label text-xs font-semibold uppercase tracking-[0.2em] rounded-[3px] hover:bg-primary hover:text-on-primary hover:border-primary transition-colors duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            Échanger sur WhatsApp
          </a>
        </Reveal>
      </div>
    </section>
  );
};
