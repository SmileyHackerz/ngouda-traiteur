import React from 'react';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  id: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  align?: 'center' | 'left';
  tone?: 'dark' | 'light';
  className?: string;
}

/**
 * Titre de section : le titre porte seul le poids, un filet or court
 * le souligne, l'accroche suit en Source Serif.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  id,
  title,
  lead,
  align = 'center',
  tone = 'dark',
  className = ''
}) => {
  const isCenter = align === 'center';
  const titleColor = tone === 'dark' ? 'text-primary' : 'text-on-primary';
  const leadColor = tone === 'dark' ? 'text-on-surface-variant' : 'text-primary-fixed/85';

  return (
    <div className={`${isCenter ? 'text-center mx-auto items-center' : 'text-left items-start'} flex flex-col max-w-2xl ${className}`}>
      <Reveal as="h2" kind="rise" className={`font-display text-[2rem] leading-[1.12] sm:text-4xl md:text-[2.75rem] md:leading-[1.1] font-semibold ${titleColor}`}>
        <span id={id}>{title}</span>
      </Reveal>
      <Reveal kind="line" delay={0.15} className={`rule-gold mt-5 ${isCenter ? '' : 'self-start'}`} />
      {lead && (
        <Reveal as="p" kind="rise" delay={0.12} className={`mt-5 font-body text-[1.0625rem] sm:text-lg leading-relaxed ${leadColor} max-w-[60ch]`}>
          {lead}
        </Reveal>
      )}
    </div>
  );
};
