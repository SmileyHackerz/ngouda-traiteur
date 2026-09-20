import { ContactDetails } from '../types';

export const BRAND = {
  name: "N'Gouda Traiteur",
  shortName: "N'Gouda",
  descriptor: 'Traiteur Événementiel',
  city: 'Dakar',
  tagline: "L'art de recevoir, sur-mesure",
  chef: 'Marie Ngouda'
};

export const CONTACT_DATA: ContactDetails = {
  phoneDisplay: '+221 78 536 46 55',
  phoneRaw: '+221785364655',
  whatsappNumber: '221785364655',
  whatsappUrl:
    'https://wa.me/221785364655?text=' +
    encodeURIComponent("Bonjour N'Gouda Traiteur, je souhaite obtenir des informations pour un événement."),
  email: 'contact@mariengouda.com',
  address: 'Keur Massar, Jaxaay Unité 4',
  city: 'Dakar',
  country: 'Sénégal'
};

/** Ouvre une conversation WhatsApp avec un message pré-rempli. */
export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${CONTACT_DATA.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const RESERVATION_PROCESS_STEPS = [
  {
    stepNumber: 1,
    title: 'Votre demande',
    description: 'Décrivez votre événement en cinq étapes : format, convives, date, menu, coordonnées.',
    icon: 'edit_document'
  },
  {
    stepNumber: 2,
    title: "L'échange",
    description: 'Nous vous rappelons sous 24 h pour affiner chaque détail et convenir d’une dégustation.',
    icon: 'forum'
  },
  {
    stepNumber: 3,
    title: 'Le jour J',
    description: 'Notre brigade dresse, sert et sublime chaque instant. Vous n’avez plus qu’à recevoir.',
    icon: 'celebration'
  }
];
