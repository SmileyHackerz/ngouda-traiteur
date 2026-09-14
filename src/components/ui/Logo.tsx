import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * Identité Ngouda Traiteur.
 *
 * Le monogramme : une cloche de service en trait fin, dont le dôme
 * abrite le « N » — le plat que l'on dévoile. Le dôme peut se
 * soulever (prop `lift`) pour la séquence d'ouverture.
 */

type Tone = 'dark' | 'light';

interface MarkProps {
  className?: string;
  style?: React.CSSProperties;
  tone?: Tone;
  /** Anime le dôme qui se soulève pour révéler la lettre. */
  lift?: boolean;
  title?: string;
}

const TONES: Record<Tone, { cloche: string; letter: string }> = {
  // Sur fond ivoire
  dark: { cloche: '#C5A059', letter: '#2b0018' },
  // Sur fond bordeaux
  light: { cloche: '#C5A059', letter: '#fdfbf7' }
};

export const LogoMark: React.FC<MarkProps> = ({ className = '', style, tone = 'dark', lift = false, title }) => {
  const c = TONES[tone];
  const reduce = useReducedMotion();
  const animateLift = lift && !reduce;

  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      style={style}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {title && <title>{title}</title>}

      {/* Lettre révélée */}
      <motion.text
        x="50"
        y="69"
        textAnchor="middle"
        fontFamily="'Playfair Display', Georgia, serif"
        fontStyle="italic"
        fontWeight={600}
        fontSize="31"
        fill={c.letter}
        initial={animateLift ? { opacity: 0, y: 6 } : false}
        animate={animateLift ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.9, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        N
      </motion.text>

      {/* Cloche : dôme + pommeau */}
      <motion.g
        stroke={c.cloche}
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={animateLift ? { y: 0 } : false}
        animate={animateLift ? { y: [0, -14, -9] } : undefined}
        transition={{ duration: 1.4, delay: 0.55, ease: [0.16, 1, 0.3, 1], times: [0, 0.6, 1] }}
      >
        <path d="M14 74 A36 36 0 0 1 86 74" />
        <line x1="50" y1="30.5" x2="50" y2="37.5" strokeWidth="1.8" />
        <circle cx="50" cy="27" r="3.2" fill={c.cloche} stroke="none" />
      </motion.g>

      {/* Plateau */}
      <g stroke={c.cloche} strokeLinecap="round">
        <line x1="8" y1="80" x2="92" y2="80" strokeWidth="2.4" />
        <line x1="26" y1="86.5" x2="74" y2="86.5" strokeWidth="1.2" opacity="0.7" />
      </g>
    </svg>
  );
};

interface WordmarkProps {
  tone?: Tone;
  /** Taille de la ligne « NGOUDA » — tout le lockup est en em. */
  size?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const Wordmark: React.FC<WordmarkProps> = ({ tone = 'dark', size = '1.5rem', align = 'left', className = '' }) => {
  const name = tone === 'dark' ? 'text-primary' : 'text-on-primary';
  const sub = tone === 'dark' ? 'text-secondary' : 'text-gold-light';
  const line = tone === 'dark' ? 'bg-gold' : 'bg-gold/80';

  return (
    <span
      className={`inline-flex flex-col leading-none ${align === 'center' ? 'items-center' : 'items-start'} ${className}`}
      style={{ fontSize: size }}
    >
      <span className={`font-display font-semibold uppercase tracking-[0.22em] ${name}`} style={{ marginRight: '-0.22em' }}>
        Ngouda
      </span>
      <span className={`mt-[0.42em] inline-flex items-center gap-[0.55em] font-label font-semibold uppercase tracking-[0.42em] ${sub}`} style={{ fontSize: '0.4em' }}>
        <i className={`block h-px w-[1.6em] ${line}`} aria-hidden="true" />
        <span style={{ marginRight: '-0.42em' }}>Traiteur</span>
        <i className={`block h-px w-[1.6em] ${line}`} aria-hidden="true" />
      </span>
    </span>
  );
};

interface LogoProps {
  tone?: Tone;
  layout?: 'horizontal' | 'stacked';
  /** Taille du repère (mark) en px ; le wordmark suit. */
  markSize?: number;
  lift?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ tone = 'dark', layout = 'horizontal', markSize = 40, lift = false, className = '' }) => {
  if (layout === 'stacked') {
    return (
      <span className={`inline-flex flex-col items-center ${className}`}>
        <LogoMark tone={tone} lift={lift} className="block" style={{ width: markSize, height: markSize }} title="Ngouda Traiteur" />
        <Wordmark tone={tone} size={`${Math.round(markSize * 0.36)}px`} align="center" className="mt-[0.1em]" />
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-[0.55em] ${className}`} style={{ fontSize: markSize }}>
      <LogoMark tone={tone} className="block shrink-0" style={{ width: markSize, height: markSize }} title="Ngouda Traiteur" />
      <Wordmark tone={tone} size={`${Math.round(markSize * 0.56)}px`} />
    </span>
  );
};

/** Sceau circulaire : monogramme entouré du nom en capitales. */
export const LogoSeal: React.FC<{ className?: string; tone?: Tone; spin?: boolean }> = ({ className = '', tone = 'light', spin = true }) => {
  const c = TONES[tone];
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <path id="seal-path" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
      </defs>
      <circle cx="100" cy="100" r="92" stroke={c.cloche} strokeWidth="1" opacity="0.6" />
      <circle cx="100" cy="100" r="52" stroke={c.cloche} strokeWidth="0.8" opacity="0.5" />
      <motion.g
        style={{ originX: '100px', originY: '100px' }}
        animate={spin && !reduce ? { rotate: 360 } : undefined}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <text
          fill={c.cloche}
          fontFamily="'Hanken Grotesk', system-ui, sans-serif"
          fontSize="11.5"
          fontWeight={600}
          letterSpacing="4.2"
        >
          <textPath href="#seal-path" startOffset="0">
            NGOUDA TRAITEUR · DAKAR · L'ART DE RECEVOIR ·
          </textPath>
        </text>
      </motion.g>
      <g transform="translate(58 58) scale(0.84)">
        <text
          x="50"
          y="69"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontStyle="italic"
          fontWeight={600}
          fontSize="31"
          fill={c.letter}
        >
          N
        </text>
        <g stroke={c.cloche} strokeWidth="2.2" strokeLinecap="round">
          <path d="M14 74 A36 36 0 0 1 86 74" />
          <line x1="50" y1="30.5" x2="50" y2="37.5" strokeWidth="1.8" />
          <circle cx="50" cy="27" r="3.2" fill={c.cloche} stroke="none" />
          <line x1="8" y1="80" x2="92" y2="80" strokeWidth="2.4" />
          <line x1="26" y1="86.5" x2="74" y2="86.5" strokeWidth="1.2" opacity="0.7" />
        </g>
      </g>
    </svg>
  );
};
