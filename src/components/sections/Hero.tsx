import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Logo, LogoSeal } from '../ui/Logo';
import { BRAND } from '../../data/contact.data';

interface HeroProps {
  onOpenReservation: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const HERO_IMAGE = '/images/salle-reception.jpg';

export const Hero: React.FC<HeroProps> = ({ onOpenReservation }) => {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const scrollToMenus = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('menus')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };

  // Le titre se dévoile ligne par ligne, sous un cache
  const Line: React.FC<{ children: React.ReactNode; delay: number; className?: string }> = ({ children, delay, className = '' }) => (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: reduce ? 0 : '110%', opacity: reduce ? 0 : 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );

  return (
    <section
      ref={ref}
      id="accueil"
      aria-label="Accueil"
      className="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden bg-primary"
    >
      {/* Photographie plein cadre, voile bordeaux */}
      <motion.div className="absolute inset-[-10%] z-0" style={{ y: imgY }}>
        <motion.img
          src={HERO_IMAGE}
          alt="Grande salle de réception dressée : tables rondes nappées de blanc, centres de table et éclairage de gala"
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          initial={{ scale: reduce ? 1 : 1.1, filter: reduce ? 'none' : 'blur(5px)' }}
          animate={{ scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.8, ease: EASE }}
        />
      </motion.div>
      <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(43,0,24,0.55)_0%,rgba(43,0,24,0.62)_55%,rgba(27,0,15,0.9)_100%)]" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(26,0,15,0.55)_100%)]" />

      {/* Sceau tournant, discret, desktop */}
      <div className="absolute right-8 bottom-10 z-[2] hidden xl:block w-40 h-40 opacity-70">
        <LogoSeal tone="light" />
      </div>

      {/* Contenu */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full max-w-4xl mx-auto px-5 md:px-16 pt-28 pb-24 md:pt-36 md:pb-28 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
          className="mb-10 md:mb-12"
        >
          <span className="hidden md:block">
            <Logo tone="light" layout="stacked" markSize={116} lift />
          </span>
          <span className="md:hidden">
            <Logo tone="light" layout="stacked" markSize={96} lift />
          </span>
        </motion.div>

        <h1 className="font-display text-on-primary font-medium text-[2.5rem] leading-[1.06] sm:text-5xl md:text-6xl lg:text-[4.5rem] max-w-[14ch] tracking-[-0.01em]">
          <Line delay={0.55}>L'art de recevoir,</Line>
          <Line delay={0.68} className="italic font-normal text-gold-light">sur-mesure</Line>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.95, ease: EASE }}
          className="mt-6 md:mt-7 font-body text-base sm:text-lg md:text-xl text-primary-fixed/85 max-w-[46ch] leading-relaxed"
        >
          Traiteur événementiel à {BRAND.city}. Une cuisine généreuse, un dressage soigné et un service
          attentif pour vos mariages, galas et réceptions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: EASE }}
          className="mt-9 md:mt-11 w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
        >
          <Button variant="gold" size="lg" onClick={onOpenReservation} icon={<ArrowUpRight className="w-4 h-4" />}>
            Demander un devis
          </Button>
          <Button variant="outline-light" size="lg" onClick={scrollToMenus}>
            Découvrir nos menus
          </Button>
        </motion.div>
      </motion.div>

      {/* Indicateur de défilement */}
      <motion.a
        href="#menus"
        onClick={scrollToMenus}
        aria-label="Faire défiler vers nos menus"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-gold-light/80 hover:text-gold-light transition-colors"
      >
        <span className="font-label text-[10px] uppercase tracking-[0.3em]">Découvrir</span>
        <ArrowDown className="w-4 h-4 animate-float-y" strokeWidth={1.5} />
      </motion.a>
    </section>
  );
};
