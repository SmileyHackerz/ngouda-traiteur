import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface GoldDividerProps {
  className?: string;
  tone?: 'dark' | 'light';
}

/**
 * Séparateur de section : deux filets qui se tracent depuis le centre,
 * un losange or au milieu.
 */
export const GoldDivider: React.FC<GoldDividerProps> = ({ className = '', tone = 'dark' }) => {
  const reduce = useReducedMotion();
  const lineColor = tone === 'dark' ? 'bg-gold/45' : 'bg-gold/50';
  const bg = tone === 'dark' ? 'bg-surface' : 'bg-primary';

  const line = (origin: 'left' | 'right') => (
    <motion.span
      aria-hidden="true"
      className={`h-px flex-1 ${lineColor}`}
      style={{ transformOrigin: origin === 'left' ? 'right center' : 'left center' }}
      initial={{ scaleX: reduce ? 1 : 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
    />
  );

  return (
    <div className={`w-full max-w-[1280px] mx-auto px-5 md:px-16 flex items-center ${className}`} role="presentation">
      {line('left')}
      <span className={`px-4 ${bg} flex items-center justify-center`}>
        <span className="block w-1.5 h-1.5 rotate-45 bg-gold" />
      </span>
      {line('right')}
    </div>
  );
};
