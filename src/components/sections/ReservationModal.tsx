import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  User,
  MessageCircle,
  Heart,
  Sparkles,
  Wine,
  Briefcase,
  Cake,
  UtensilsCrossed,
  Copy
} from 'lucide-react';
import { EventCategory, ReservationFormData } from '../../types';
import { Coffee } from 'lucide-react';
import { Button } from '../ui/Button';
import { LogoMark } from '../ui/Logo';
import { MENUS_DATA } from '../../data/menus.data';
import { CONTACT_DATA, BRAND, buildWhatsAppUrl } from '../../data/contact.data';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedMenu?: string;
}

const INITIAL_FORM: ReservationFormData = {
  eventType: '',
  guestCount: '',
  eventDate: '',
  eventLocation: '',
  selectedMenu: '',
  coffeeBreak: false,
  customRequests: '',
  clientName: '',
  clientPhone: '',
  clientEmail: ''
};

const CUSTOM_MENU = 'Création 100% Sur-mesure';

const EVENT_TYPES: { label: EventCategory; description: string; icon: React.ElementType }[] = [
  { label: 'Mariage', description: 'Dîner assis, buffet ou cocktail', icon: Heart },
  { label: 'Gala', description: 'Soirée institutionnelle ou caritative', icon: Sparkles },
  { label: 'Cocktail', description: 'Réception debout, pièces cocktail', icon: Wine },
  { label: 'Corporate', description: 'Séminaire, lancement, pause café', icon: Briefcase },
  { label: 'Anniversaire', description: 'Fête privée, baptême, retrouvailles', icon: Cake },
  { label: 'Autre', description: 'Dites-nous tout à l’étape suivante', icon: UtensilsCrossed }
];

const MENU_OPTIONS = [
  ...MENUS_DATA.map((m) => ({
    name: m.name,
    desc: m.tagline
  })),
  {
    name: CUSTOM_MENU,
    desc: 'Composition personnalisée : viandes, poissons, accompagnements et pause café selon vos envies.'
  }
];

const STEP_TITLES = ['Type d’événement', 'Convives', 'Date & lieu', 'Menu', 'Coordonnées'];
const EASE = [0.16, 1, 0.3, 1] as const;

const formatDate = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

/** Message WhatsApp pré-rempli à partir du formulaire. */
export const buildQuoteMessage = (f: ReservationFormData, ref: string) => {
  const lines = [
    `Bonjour ${BRAND.name},`,
    `Je souhaite recevoir un devis pour mon événement.`,
    ``,
    `*Votre événement*`,
    `- Type : ${f.eventType}`,
    `- Convives : ${f.guestCount}`,
    `- Date : ${formatDate(f.eventDate)}`,
    `- Lieu : ${f.eventLocation}`,
    `- Menu : ${f.selectedMenu}`,
    `- Pause café : ${f.coffeeBreak ? 'oui, en option' : 'non'}`
  ];
  if (f.customRequests.trim()) lines.push(`- Souhaits : ${f.customRequests.trim()}`);
  lines.push(``, `*Vos coordonnées*`, `- Nom : ${f.clientName.trim()}`, `- Téléphone : ${f.clientPhone.trim()}`);
  if (f.clientEmail.trim()) lines.push(`- E-mail : ${f.clientEmail.trim()}`);
  lines.push(``, `Réf. ${ref}`);
  return lines.join('\n');
};

const resolvePreselected = (value: string) => {
  if (!value) return '';
  const found = MENUS_DATA.find((m) => m.name === value || m.shortName === value || value.includes(m.shortName));
  if (found) return found.name;
  return CUSTOM_MENU;
};

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, preselectedMenu = '' }) => {
  const reduce = useReducedMotion();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [formData, setFormData] = useState<ReservationFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof ReservationFormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reservationRef, setReservationRef] = useState('');
  const [copied, setCopied] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (preselectedMenu) {
      setFormData((p) => ({ ...p, selectedMenu: resolvePreselected(preselectedMenu) }));
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && handleClose();
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, preselectedMenu]);

  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => firstFieldRef.current?.focus({ preventScroll: true }), 350);
    return () => clearTimeout(t);
  }, [currentStep, isOpen]);

  const set = <K extends keyof ReservationFormData>(key: K, value: ReservationFormData[K]) => {
    setFormData((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: '' }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^\d+\s]/g, '');
    if (val && !val.startsWith('+')) {
      val = val.startsWith('221') ? '+' + val : '+221 ' + val;
    }
    set('clientPhone', val);
  };

  const validateStep = (step: number) => {
    const next: typeof errors = {};
    if (step === 1 && !formData.eventType) next.eventType = 'Choisissez le type de réception.';
    if (step === 2) {
      const n = Number(formData.guestCount);
      if (!formData.guestCount || Number.isNaN(n) || n < 10) next.guestCount = 'Indiquez au moins 10 convives.';
    }
    if (step === 3) {
      if (!formData.eventDate) next.eventDate = 'Indiquez la date prévue.';
      else if (new Date(formData.eventDate + 'T00:00:00') < new Date(new Date().toDateString()))
        next.eventDate = 'La date est déjà passée.';
      if (!formData.eventLocation.trim()) next.eventLocation = 'Précisez le lieu ou le quartier.';
    }
    if (step === 4 && !formData.selectedMenu) next.selectedMenu = 'Choisissez un menu ou le sur-mesure.';
    if (step === 5) {
      if (formData.clientName.trim().length < 2) next.clientName = 'Indiquez votre nom.';
      if (formData.clientPhone.replace(/\D/g, '').length < 9) next.clientPhone = 'Indiquez un numéro joignable sur WhatsApp.';
      if (formData.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail))
        next.clientEmail = 'Cette adresse e-mail semble incomplète.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validateStep(currentStep)) return;
    setDirection(1);
    setCurrentStep((s) => Math.min(s + 1, 5));
  };
  const goPrev = () => {
    setErrors({});
    setDirection(-1);
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const whatsappUrl = reservationRef ? buildWhatsAppUrl(buildQuoteMessage(formData, reservationRef)) : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;
    const ref = 'NT-' + Math.floor(1000 + Math.random() * 9000);
    setReservationRef(ref);
    setIsSubmitted(true);
    // Ouvre WhatsApp avec le récapitulatif — dans le geste utilisateur, donc non bloqué
    window.open(buildWhatsAppUrl(buildQuoteMessage(formData, ref)), '_blank', 'noopener,noreferrer');
  };

  const handleClose = useCallback(() => {
    onClose();
    // Laisse l'animation de sortie se jouer avant de réinitialiser
    setTimeout(() => {
      setIsSubmitted(false);
      setCurrentStep(1);
      setDirection(1);
      setFormData(INITIAL_FORM);
      setErrors({});
      setReservationRef('');
      setCopied(false);
    }, 400);
  }, [onClose]);

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(buildQuoteMessage(formData, reservationRef));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* presse-papiers indisponible */
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  const stepVariants = {
    enter: (d: number) => ({ x: reduce ? 0 : d * 28, opacity: 0, filter: reduce ? 'none' : 'blur(4px)' }),
    center: { x: 0, opacity: 1, filter: 'blur(0px)' },
    exit: (d: number) => ({ x: reduce ? 0 : d * -28, opacity: 0, filter: reduce ? 'none' : 'blur(4px)' })
  };

  const FieldError: React.FC<{ id: string; msg?: string }> = ({ id, msg }) =>
    msg ? (
      <p id={id} role="alert" className="mt-2 font-label text-xs text-error">
        {msg}
      </p>
    ) : null;

  const Label: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block font-label text-[10.5px] font-semibold uppercase tracking-[0.2em] text-secondary">
      {children}
    </label>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="quote-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reservation-modal-title"
          className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-primary-deep/70 backdrop-blur-sm sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleClose}
        >
          {/* Mobile : feuille depuis le bas — Desktop : dialogue centré */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? { opacity: 0 } : { y: '100%', opacity: 1 }}
            animate={reduce ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: '100%', opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative w-full sm:max-w-2xl h-[92dvh] sm:h-auto sm:max-h-[90vh] bg-surface flex flex-col rounded-t-[22px] sm:rounded-[4px] border-t sm:border border-gold/40 shadow-[0_-30px_80px_-20px_rgba(26,0,15,0.6)] sm:shadow-[0_40px_100px_-30px_rgba(26,0,15,0.7)] overflow-hidden"
          >
            {/* Poignée mobile */}
            <span className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-outline-variant" aria-hidden="true" />

            {/* En-tête */}
            <div className="flex items-center justify-between gap-4 px-6 pt-6 pb-4 sm:px-8 sm:pt-6 border-b border-outline-variant/40">
              <div className="flex items-center gap-3.5">
                <LogoMark className="w-10 h-10 shrink-0" />
                <div>
                  <span className="block font-label text-[10px] uppercase tracking-[0.28em] text-secondary">{BRAND.name}</span>
                  <h2 id="reservation-modal-title" className="font-display text-lg sm:text-xl text-primary font-semibold leading-tight">
                    {isSubmitted ? 'Votre demande est prête' : 'Demande de devis'}
                  </h2>
                </div>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={handleClose}
                aria-label="Fermer"
                className="-mr-2 w-11 h-11 flex items-center justify-center rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progression segmentée */}
            {!isSubmitted && (
              <div className="px-6 sm:px-8 pt-5">
                <div className="flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={5} aria-valuenow={currentStep} aria-label="Progression du formulaire">
                  {STEP_TITLES.map((t, i) => {
                    const n = i + 1;
                    const done = n < currentStep;
                    const active = n === currentStep;
                    return (
                      <button
                        key={t}
                        type="button"
                        disabled={n >= currentStep}
                        onClick={() => {
                          setDirection(-1);
                          setCurrentStep(n);
                        }}
                        aria-label={`${done ? 'Revenir à' : 'Étape'} ${n} : ${t}`}
                        className="group flex-1 py-2 -my-2"
                      >
                        <span className="block h-1 rounded-full bg-surface-container-highest overflow-hidden">
                          <motion.span
                            className="block h-full bg-gold"
                            initial={false}
                            animate={{ scaleX: done || active ? 1 : 0 }}
                            style={{ transformOrigin: 'left center' }}
                            transition={{ duration: 0.5, ease: EASE }}
                          />
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-label text-[10.5px] uppercase tracking-[0.2em] text-secondary">
                    Étape {currentStep} / 5
                  </span>
                  <span className="font-display italic text-sm text-primary">{STEP_TITLES[currentStep - 1]}</span>
                </div>
              </div>
            )}

            {/* Corps */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="max-w-md mx-auto flex flex-col items-center text-center"
                >
                  <motion.span
                    initial={{ scale: reduce ? 1 : 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                    className="w-16 h-16 rounded-full bg-primary border border-gold flex items-center justify-center"
                  >
                    <svg className="w-8 h-8 text-gold-light" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <motion.path d="M20 6L9 17l-5-5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3, ease: EASE }} />
                    </svg>
                  </motion.span>

                  <h3 className="mt-5 font-display text-2xl sm:text-[1.75rem] text-primary font-semibold">
                    WhatsApp s'ouvre avec votre récapitulatif
                  </h3>
                  <p className="mt-2 font-body text-[15px] text-on-surface-variant leading-relaxed">
                    Il ne reste qu'à appuyer sur <em>Envoyer</em>. Si rien ne s'est ouvert, utilisez le bouton ci-dessous.
                  </p>

                  <dl className="mt-6 w-full text-left bg-surface-container-low border border-outline-variant/40 p-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 font-body text-[14.5px]">
                    {[
                      ['Réf.', reservationRef],
                      ['Événement', `${formData.eventType} · ${formData.guestCount} convives`],
                      ['Date', formatDate(formData.eventDate)],
                      ['Lieu', formData.eventLocation],
                      ['Menu', formData.selectedMenu],
                      ['Pause café', formData.coffeeBreak ? 'Oui, en option' : 'Non'],
                      ['Contact', `${formData.clientName} · ${formData.clientPhone}`]
                    ].map(([k, v]) => (
                      <React.Fragment key={k}>
                        <dt className="font-label text-[10.5px] uppercase tracking-[0.18em] text-secondary pt-0.5">{k}</dt>
                        <dd className="text-on-surface">{v}</dd>
                      </React.Fragment>
                    ))}
                  </dl>

                  <div className="mt-6 w-full flex flex-col gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 min-h-[54px] px-8 bg-[#25D366] hover:bg-[#1fbd5a] text-white font-label text-xs font-semibold uppercase tracking-[0.2em] rounded-[3px] transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Ouvrir WhatsApp
                    </a>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button variant="outline" size="md" onClick={copyMessage} icon={<Copy className="w-4 h-4" />} iconPosition="left" className="flex-1">
                        {copied ? 'Copié !' : 'Copier le message'}
                      </Button>
                      <Button variant="outline" size="md" onClick={handleClose} className="flex-1">
                        Fermer
                      </Button>
                    </div>
                  </div>
                  <p className="mt-5 font-body text-[13px] text-on-surface-variant">
                    Ou appelez-nous : <a href={`tel:${CONTACT_DATA.phoneRaw}`} className="text-primary underline decoration-gold underline-offset-4">{CONTACT_DATA.phoneDisplay}</a>
                  </p>
                </motion.div>
              ) : (
                <form
                  noValidate
                  className="h-full flex flex-col"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (currentStep < 5) goNext();
                    else handleSubmit(e);
                  }}
                >
                  <AnimatePresence mode="wait" custom={direction} initial={false}>
                    <motion.div
                      key={currentStep}
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      {/* 1 — Type */}
                      {currentStep === 1 && (
                        <fieldset>
                          <legend className="font-display text-xl sm:text-2xl text-primary font-semibold">Quel type de réception organisez-vous ?</legend>
                          <div className="mt-5 grid grid-cols-2 gap-3" role="radiogroup" aria-describedby={errors.eventType ? 'err-type' : undefined}>
                            {EVENT_TYPES.map((t) => {
                              const Icon = t.icon;
                              const sel = formData.eventType === t.label;
                              return (
                                <button
                                  key={t.label}
                                  type="button"
                                  role="radio"
                                  aria-checked={sel}
                                  onClick={() => set('eventType', t.label)}
                                  className={`relative flex flex-col items-start gap-2 p-4 min-h-[104px] text-left border rounded-[4px] transition-[border-color,background-color,box-shadow] duration-300 ${
                                    sel
                                      ? 'border-primary bg-primary text-on-primary shadow-[0_16px_32px_-20px_rgba(43,0,24,0.6)]'
                                      : 'border-outline-variant/60 bg-surface-container-lowest hover:border-gold'
                                  }`}
                                >
                                  <Icon className={`w-6 h-6 ${sel ? 'text-gold-light' : 'text-gold'}`} strokeWidth={1.5} />
                                  <span className="font-display text-base font-semibold leading-tight">{t.label}</span>
                                  <span className={`font-body text-[12.5px] leading-snug ${sel ? 'text-primary-fixed/85' : 'text-on-surface-variant'}`}>{t.description}</span>
                                  {sel && <Check className="absolute top-3 right-3 w-4 h-4 text-gold-light" />}
                                </button>
                              );
                            })}
                          </div>
                          <FieldError id="err-type" msg={errors.eventType} />
                        </fieldset>
                      )}

                      {/* 2 — Convives */}
                      {currentStep === 2 && (
                        <div>
                          <h3 className="font-display text-xl sm:text-2xl text-primary font-semibold">Combien de convives attendez-vous ?</h3>
                          <p className="mt-1.5 font-body text-[15px] text-on-surface-variant">Une estimation suffit ; elle nous permet de dimensionner la brigade et le dressage.</p>
                          <div className="mt-7">
                            <Label htmlFor="guestCount">Nombre de convives</Label>
                            <div className="relative mt-1">
                              <Users className="w-5 h-5 absolute left-0 top-1/2 -translate-y-1/2 text-gold" strokeWidth={1.6} />
                              <input
                                ref={firstFieldRef}
                                id="guestCount"
                                type="number"
                                inputMode="numeric"
                                min={10}
                                max={5000}
                                value={formData.guestCount}
                                onChange={(e) => set('guestCount', e.target.value === '' ? '' : Number(e.target.value))}
                                placeholder="ex. 120"
                                aria-invalid={!!errors.guestCount}
                                aria-describedby={errors.guestCount ? 'err-guests' : undefined}
                                className="field-underline pl-8 font-display text-2xl"
                              />
                            </div>
                            <FieldError id="err-guests" msg={errors.guestCount} />
                          </div>
                          <div className="mt-6 flex flex-wrap gap-2">
                            {[30, 50, 100, 200, 350, 500].map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() => set('guestCount', n)}
                                className={`px-3.5 py-2 min-h-[40px] font-label text-xs tracking-wide border rounded-[3px] transition-colors ${
                                  formData.guestCount === n ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/70 hover:border-gold'
                                }`}
                              >
                                {n}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 3 — Date & lieu */}
                      {currentStep === 3 && (
                        <div>
                          <h3 className="font-display text-xl sm:text-2xl text-primary font-semibold">Quand et où aura lieu la réception ?</h3>
                          <p className="mt-1.5 font-body text-[15px] text-on-surface-variant">Nous nous déplaçons à Dakar, sur la Petite-Côte et en région.</p>
                          <div className="mt-7 space-y-7">
                            <div>
                              <Label htmlFor="eventDate">Date prévue</Label>
                              <div className="relative mt-1">
                                <Calendar className="w-5 h-5 absolute left-0 top-1/2 -translate-y-1/2 text-gold pointer-events-none" strokeWidth={1.6} />
                                <input
                                  ref={firstFieldRef}
                                  id="eventDate"
                                  type="date"
                                  min={minDate}
                                  value={formData.eventDate}
                                  onChange={(e) => set('eventDate', e.target.value)}
                                  aria-invalid={!!errors.eventDate}
                                  aria-describedby={errors.eventDate ? 'err-date' : undefined}
                                  className="field-underline pl-8"
                                />
                              </div>
                              <FieldError id="err-date" msg={errors.eventDate} />
                            </div>
                            <div>
                              <Label htmlFor="eventLocation">Lieu ou quartier</Label>
                              <div className="relative mt-1">
                                <MapPin className="w-5 h-5 absolute left-0 top-1/2 -translate-y-1/2 text-gold" strokeWidth={1.6} />
                                <input
                                  id="eventLocation"
                                  type="text"
                                  value={formData.eventLocation}
                                  onChange={(e) => set('eventLocation', e.target.value)}
                                  placeholder="ex. Almadies, Keur Massar, Saly…"
                                  aria-invalid={!!errors.eventLocation}
                                  aria-describedby={errors.eventLocation ? 'err-loc' : undefined}
                                  className="field-underline pl-8"
                                />
                              </div>
                              <FieldError id="err-loc" msg={errors.eventLocation} />
                              <div className="mt-4 flex flex-wrap gap-2">
                                {['Almadies', 'Plateau', 'Keur Massar', 'Rufisque', 'Saly', 'Autre région'].map((loc) => (
                                  <button
                                    key={loc}
                                    type="button"
                                    onClick={() => set('eventLocation', loc)}
                                    className={`px-3 py-1.5 min-h-[36px] font-label text-xs border rounded-[3px] transition-colors ${
                                      formData.eventLocation === loc ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant/70 hover:border-gold'
                                    }`}
                                  >
                                    {loc}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 4 — Menu */}
                      {currentStep === 4 && (
                        <fieldset>
                          <legend className="font-display text-xl sm:text-2xl text-primary font-semibold">Quel menu vous ferait plaisir ?</legend>
                          <p className="mt-1.5 font-body text-[15px] text-on-surface-variant">Une de nos signatures, ou une création entièrement sur-mesure.</p>
                          <div className="mt-5 space-y-2.5" role="radiogroup">
                            {MENU_OPTIONS.map((m) => {
                              const sel = formData.selectedMenu === m.name;
                              return (
                                <button
                                  key={m.name}
                                  type="button"
                                  role="radio"
                                  aria-checked={sel}
                                  onClick={() => set('selectedMenu', m.name)}
                                  className={`w-full flex items-start gap-4 p-4 text-left border rounded-[4px] transition-[border-color,background-color] duration-300 ${
                                    sel ? 'border-primary bg-primary/[0.04]' : 'border-outline-variant/60 bg-surface-container-lowest hover:border-gold'
                                  }`}
                                >
                                  <span className={`mt-1 w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${sel ? 'border-primary bg-primary' : 'border-outline'}`}>
                                    {sel && <span className="w-1.5 h-1.5 rounded-full bg-gold-light" />}
                                  </span>
                                  <span>
                                    <span className="block font-display text-base font-semibold text-primary">{m.name}</span>
                                    <span className="block mt-1 font-body text-[13px] leading-snug text-on-surface-variant">{m.desc}</span>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                          <FieldError id="err-menu" msg={errors.selectedMenu} />

                          {/* Options sur demande */}
                          <div className="mt-4 space-y-2.5">
                            {[
                              {
                                key: 'coffeeBreak' as const,
                                icon: Coffee,
                                title: 'Ajouter la pause café',
                                text: 'Thé, café, lait, Nescao, mini-viennoiseries, petits fours et jus naturels (bissap, gingembre, bouye).'
                              }
                            ].map((opt) => {
                              const Icon = opt.icon;
                              const checked = formData[opt.key];
                              return (
                                <label
                                  key={opt.key}
                                  className={`flex items-start gap-4 p-4 border rounded-[4px] cursor-pointer transition-[border-color,background-color] duration-300 ${
                                    checked ? 'border-gold bg-gold/[0.08]' : 'border-outline-variant/60 bg-surface-container-lowest hover:border-gold'
                                  }`}
                                >
                                  <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => set(opt.key, e.target.checked)} />
                                  <span
                                    aria-hidden="true"
                                    className={`mt-0.5 w-5 h-5 shrink-0 border rounded-[3px] flex items-center justify-center transition-colors ${
                                      checked ? 'bg-primary border-primary' : 'border-outline'
                                    }`}
                                  >
                                    {checked && <Check className="w-3.5 h-3.5 text-gold-light" />}
                                  </span>
                                  <span>
                                    <span className="flex items-center gap-2 font-display text-base font-semibold text-primary">
                                      <Icon className="w-4 h-4 text-gold" strokeWidth={1.6} /> {opt.title}
                                    </span>
                                    <span className="block mt-1 font-body text-[13px] leading-snug text-on-surface-variant">{opt.text} En option.</span>
                                  </span>
                                </label>
                              );
                            })}
                          </div>

                          <div className="mt-6">
                            <Label htmlFor="customRequests">Souhaits, allergies, options (facultatif)</Label>
                            <textarea
                              id="customRequests"
                              rows={3}
                              value={formData.customRequests}
                              onChange={(e) => set('customRequests', e.target.value)}
                              placeholder="ex. 15 convives végétariens, pause café le matin, service à table…"
                              className="mt-2 w-full bg-surface-container-lowest border border-outline-variant/70 focus:border-gold focus:outline-none rounded-[4px] p-3.5 font-body text-[15px] text-on-surface placeholder:text-[#9a8d91] transition-colors"
                            />
                          </div>
                        </fieldset>
                      )}

                      {/* 5 — Coordonnées */}
                      {currentStep === 5 && (
                        <div>
                          <h3 className="font-display text-xl sm:text-2xl text-primary font-semibold">Comment vous joindre ?</h3>
                          <p className="mt-1.5 font-body text-[15px] text-on-surface-variant">
                            En validant, WhatsApp s'ouvrira avec votre demande pré-remplie ; vous n'aurez qu'à l'envoyer.
                          </p>
                          <div className="mt-7 space-y-6">
                            <div>
                              <Label htmlFor="clientName">Nom complet</Label>
                              <div className="relative mt-1">
                                <User className="w-5 h-5 absolute left-0 top-1/2 -translate-y-1/2 text-gold" strokeWidth={1.6} />
                                <input
                                  ref={firstFieldRef}
                                  id="clientName"
                                  type="text"
                                  autoComplete="name"
                                  value={formData.clientName}
                                  onChange={(e) => set('clientName', e.target.value)}
                                  placeholder="ex. Awa Diop"
                                  aria-invalid={!!errors.clientName}
                                  aria-describedby={errors.clientName ? 'err-name' : undefined}
                                  className="field-underline pl-8"
                                />
                              </div>
                              <FieldError id="err-name" msg={errors.clientName} />
                            </div>
                            <div>
                              <Label htmlFor="clientPhone">Numéro WhatsApp</Label>
                              <div className="relative mt-1">
                                <Phone className="w-5 h-5 absolute left-0 top-1/2 -translate-y-1/2 text-gold" strokeWidth={1.6} />
                                <input
                                  id="clientPhone"
                                  type="tel"
                                  inputMode="tel"
                                  autoComplete="tel"
                                  value={formData.clientPhone}
                                  onChange={handlePhoneChange}
                                  placeholder="+221 77 000 00 00"
                                  aria-invalid={!!errors.clientPhone}
                                  aria-describedby={errors.clientPhone ? 'err-phone' : undefined}
                                  className="field-underline pl-8"
                                />
                              </div>
                              <FieldError id="err-phone" msg={errors.clientPhone} />
                            </div>
                            <div>
                              <Label htmlFor="clientEmail">E-mail (facultatif)</Label>
                              <div className="relative mt-1">
                                <Mail className="w-5 h-5 absolute left-0 top-1/2 -translate-y-1/2 text-gold" strokeWidth={1.6} />
                                <input
                                  id="clientEmail"
                                  type="email"
                                  autoComplete="email"
                                  value={formData.clientEmail}
                                  onChange={(e) => set('clientEmail', e.target.value)}
                                  placeholder="vous@exemple.com"
                                  aria-invalid={!!errors.clientEmail}
                                  aria-describedby={errors.clientEmail ? 'err-email' : undefined}
                                  className="field-underline pl-8"
                                />
                              </div>
                              <FieldError id="err-email" msg={errors.clientEmail} />
                            </div>
                          </div>
                          <p className="mt-6 font-body text-[12.5px] text-on-surface-variant/80">
                            Vos informations partent uniquement dans votre message WhatsApp ; rien n'est stocké sur ce site.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </form>
              )}
            </div>

            {/* Pied : navigation des étapes */}
            {!isSubmitted && (
              <div className="px-6 sm:px-8 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-outline-variant/40 bg-surface flex items-center justify-between gap-3">
                {currentStep > 1 ? (
                  <Button type="button" variant="tertiary" onClick={goPrev}>
                    <span className="inline-flex items-center gap-1.5">
                      <ArrowLeft className="w-3.5 h-3.5" /> Retour
                    </span>
                  </Button>
                ) : (
                  <Button type="button" variant="tertiary" onClick={handleClose}>
                    Annuler
                  </Button>
                )}
                {currentStep < 5 ? (
                  <Button type="button" variant="primary" size="md" onClick={goNext} icon={<ArrowRight className="w-4 h-4" />}>
                    Continuer
                  </Button>
                ) : (
                  <Button type="button" variant="gold" size="md" onClick={handleSubmit as unknown as React.MouseEventHandler<HTMLButtonElement>} icon={<MessageCircle className="w-4 h-4" />}>
                    <span className="sm:hidden">Envoyer</span>
                    <span className="hidden sm:inline">Envoyer sur WhatsApp</span>
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
