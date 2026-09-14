import React from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

const EASE = [0.16, 1, 0.3, 1] as const;

type Kind = 'rise' | 'fade' | 'mask' | 'line';

interface RevealProps {
  children?: React.ReactNode;
  kind?: Kind;
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'li' | 'figure' | 'span' | 'p' | 'h2' | 'h3';
  once?: boolean;
  amount?: number;
}

/**
 * Apparitions à l'arrivée dans le viewport.
 * - rise : texte, cartes (léger déplacement + fondu, flou résiduel)
 * - fade : fondu seul
 * - mask : images — le cache se retire du bas vers le haut
 * - line : filets — tracé de gauche à droite
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  kind = 'rise',
  delay = 0,
  duration,
  className = '',
  as = 'div',
  once = true,
  amount = 0.25
}) => {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  const variants: Record<Kind, Variants> = {
    rise: {
      hidden: { opacity: 0, y: reduce ? 0 : 22, filter: reduce ? 'none' : 'blur(6px)' },
      show: { opacity: 1, y: 0, filter: 'blur(0px)' }
    },
    fade: {
      hidden: { opacity: 0 },
      show: { opacity: 1 }
    },
    mask: {
      hidden: { clipPath: reduce ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)', opacity: reduce ? 0 : 1 },
      show: { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }
    },
    line: {
      hidden: { scaleX: 0, opacity: reduce ? 0 : 1 },
      show: { scaleX: 1, opacity: 1 }
    }
  };

  const d = duration ?? (kind === 'mask' ? 1.1 : kind === 'line' ? 0.9 : 0.8);
  const viewport = { once, amount, margin: '0px 0px -8% 0px' };

  // Le cache (clip-path) réduit la boîte visible à zéro, ce qui empêche
  // l'observateur d'intersection de déclencher : on observe donc un
  // conteneur non clippé et on anime l'enfant.
  if (kind === 'mask') {
    return (
      <Tag className={className} initial="hidden" whileInView="show" viewport={viewport}>
        <motion.div variants={variants.mask} transition={{ duration: d, delay, ease: EASE }} className="w-full h-full">
          {children}
        </motion.div>
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      variants={variants[kind]}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      transition={{ duration: d, delay, ease: EASE }}
      style={kind === 'line' ? { transformOrigin: 'left center' } : undefined}
    >
      {children}
    </Tag>
  );
};

/** Conteneur qui échelonne l'apparition de ses enfants `RevealItem`. */
export const RevealGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  amount?: number;
  as?: 'div' | 'ul' | 'ol';
}> = ({ children, className = '', stagger = 0.09, delay = 0, amount = 0.2, as = 'div' }) => {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount, margin: '0px 0px -8% 0px' }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {children}
    </Tag>
  );
};

export const RevealItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article' | 'figure';
}> = ({ children, className = '', as = 'div' }) => {
  const reduce = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 24, filter: reduce ? 'none' : 'blur(5px)' },
        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: EASE } }
      }}
    >
      {children}
    </Tag>
  );
};
