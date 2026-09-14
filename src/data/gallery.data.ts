import { GalleryItem } from '../types';

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'table-honneur',
    type: 'image',
    title: 'Table d’honneur',
    category: 'Mariage',
    description:
      'Nappage ivoire, chemin de table doré, compositions florales et arche de ballons : la salle est prête à accueillir les mariés.',
    image: '/images/table-honneur.jpg',
    alt: 'Table d’honneur d’un mariage dressée avec nappage ivoire, fleurs blanches et arche de ballons',
    span: 'wide'
  },
  {
    id: 'bar-fruits',
    type: 'image',
    title: 'Bar à fruits frais',
    category: 'Buffet',
    description:
      'Ananas, raisins, agrumes et bananes sculptés et dressés sur marbre, à l’image de la générosité de nos buffets.',
    image: '/images/bar-fruits.jpg',
    alt: 'Buffet de fruits frais découpés et présentés en corbeilles sur une table en marbre',
    span: 'tall'
  },
  {
    id: 'service-corbeilles',
    type: 'image',
    title: 'Service & corbeilles cadeaux',
    category: 'Réception',
    description:
      'Chaque invité est accueilli avec attention : corbeilles garnies, rubans et service à table discret.',
    image: '/images/service-corbeilles.jpg',
    alt: 'Invitée recevant une corbeille cadeau garnie et rubannée lors d’une réception',
    span: 'square'
  },
  {
    id: 'corbeilles-fruits',
    type: 'image',
    title: 'Corbeilles royales',
    category: 'Buffet',
    description:
      'Nos corbeilles de fruits frais ponctuent les buffets de couleur et de fraîcheur, du cocktail au dessert.',
    image: '/images/corbeilles-fruits.jpg',
    alt: 'Corbeilles de fruits frais colorés dressées pour un cocktail en extérieur',
    span: 'square'
  }
];

export const EVENT_FORMATS = [
  {
    title: 'Mariages',
    description: 'Dîner assis, buffet d’apparat ou cocktail : nous orchestrons la table des mariés et celle de leurs invités.',
    image: '/images/table-honneur.jpg'
  },
  {
    title: 'Dîners de gala',
    description: 'Soirées institutionnelles, caritatives ou privées, servies avec une brigade dédiée.',
    image: '/images/service-corbeilles.jpg'
  },
  {
    title: 'Cocktails & buffets',
    description: 'Bars à fruits, pièces cocktail et stations gourmandes pour des réceptions debout élégantes.',
    image: '/images/bar-fruits.jpg'
  }
];
