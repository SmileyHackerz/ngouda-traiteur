import { MenuItem } from '../types';

export interface SummaryFlyerData {
  title: string;
  subtitle: string;
  heroImage: string;
  heroCaption: string;
  categories: {
    title: string;
    image: string;
    description: string;
  }[];
  pauseText: string;
  bannerTitle: string;
  bannerText: string;
  formulas: {
    name: string;
    desc: string;
  }[];
}

export const SUMMARY_FLYER: SummaryFlyerData = {
  title: 'Ngouda Traiteur',
  subtitle: 'Traiteur Événementiel',
  heroImage:
    '/images/flyers/sommaire-hero.jpg',
  heroCaption: "« L'art de recevoir, sur-mesure »",
  categories: [
    {
      title: 'Entrées',
      image: '/images/flyers/sommaire-entrees.jpg',
      description: 'Salades composées, charcuterie, saveurs fraîches et raffinées'
    },
    {
      title: 'Plats',
      image: '/images/flyers/sommaire-plats.jpg',
      description: 'Poulet, agneau, porc, poisson — rôtis et grillés à la perfection'
    },
    {
      title: 'Accompagnements',
      image: '/images/flyers/sommaire-accompagnements.jpg',
      description: 'Riz, couscous, plantain, légumes sautés, spécialités locales'
    },
    {
      title: 'Desserts',
      image: '/images/flyers/sommaire-desserts.jpg',
      description: 'Fruits de saison et douceurs sucrées'
    }
  ],
  pauseText: '☕ Pause café disponible en option sur chaque formule',
  bannerTitle: '100% Personnalisable',
  bannerText: 'Chaque événement est unique, conçu et dressé sur place selon vos envies.',
  formulas: [
    {
      name: "L'Essentiel Doré",
      desc: 'La formule chaleureuse et conviviale, idéale pour vos réceptions.'
    },
    {
      name: 'Éclat de Saveurs',
      desc: 'Une montée en gamme raffinée, riche en saveurs et en variété.'
    },
    {
      name: 'Prestige Ngouda',
      desc: "L'expérience la plus complète, pour les événements d'exception."
    }
  ],
};

/** Pause café : option disponible sur chaque formule, détaillée comme une carte à part. */
export const COFFEE_BREAK_FLYER: SummaryFlyerData & { intro: string; note: string } = {
  title: 'Ngouda Traiteur',
  subtitle: 'Pause Café — en option sur chaque menu',
  heroImage: '/images/flyers/cafe-hero.jpg',
  heroCaption: '« Un moment de douceur, avant ou après le repas »',
  intro:
    'Servie en matinée, à l’entracte d’un séminaire ou en fin de réception, la pause café accompagne chaque formule.',
  categories: [
    {
      title: 'Boissons chaudes',
      image: '/images/flyers/cafe-boissons.jpg',
      description: 'Thé, Café, Lait, Nescao'
    },
    {
      title: 'Mini-viennoiseries',
      image: '/images/flyers/cafe-viennoiseries.jpg',
      description: 'Croissants, pains au chocolat, brioches'
    },
    {
      title: 'Petits fours',
      image: '/images/flyers/cafe-petits-fours.jpg',
      description: 'Petits fours sucrés, amuse-bouches salés'
    },
    {
      title: 'Jus naturels',
      image: '/images/flyers/cafe-jus.jpg',
      description: 'Bissap, Gingembre, Bouye'
    }
  ],
  pauseText: 'Dressée sur place, servie à l’heure de votre choix',
  bannerTitle: 'En option sur chaque menu',
  bannerText: 'Ajoutez la pause café au Menu 1, 2 ou 3, ou à votre création sur-mesure.',
  note: 'Formule Prestige : petits fours sucrés, amuse-bouches salés, mini-viennoiseries et jus naturels.',
  formulas: []
};

export const MENUS_DATA: MenuItem[] = [
  {
    id: 'menu-1-essentiel-dore',
    name: "Menu 1 — L'Essentiel Doré",
    shortName: "L'Essentiel Doré",
    number: 1,
    tagline: 'La formule chaleureuse & conviviale pour vos réceptions',
    description:
      'Une sélection soignée alliant fraîcheur des crudités, grillades savoureuses (poulet, agneau, porc), accompagnements traditionnels et fruits de saison.',
    image: '/images/flyers/menu1-hero.jpg',
    alt: 'Poulet et agneau grillés au feu de bois pour le Menu 1 L’Essentiel Doré',
    caption: '« Formule personnalisable — Devis sur demande »',
    coursesCount: 'Menu 1 Complet',
    priceIndication: 'Devis sur demande',
    coffeeBreak:
      '☕ Pause café disponible en option — Thé, Café, Lait, Nescao, petits fours, mini-viennoiseries, jus naturels (Bissap, Gingembre, Bouye)',
    categories: [
      {
        title: 'Entrée',
        image: '/images/flyers/menu1-entree.jpg',
        items: 'Salade de crudités, Niçoise, Mexicaine'
      },
      {
        title: 'Plat',
        image: '/images/flyers/menu1-plat.jpg',
        items: 'Poulet rôti grillé, Agneau rôti grillé, Rôti de porc'
      },
      {
        title: 'Accompagnement',
        image: '/images/flyers/menu1-accompagnement.jpg',
        items: 'Frites, Plantain, Jardinière de légumes, Couscous, Riz blanc, Thiébou Yaap'
      },
      {
        title: 'Dessert',
        image: '/images/flyers/menu1-dessert.jpg',
        items: 'Fruits de saison'
      }
    ],
    highlights: [
      'Entrées fraîches : Salade de crudités, Niçoise, Mexicaine',
      'Viandes rôties & grillées : Poulet, Agneau, Porc',
      'Accompagnements variés : Frites, Plantain, Couscous, Thiébou Yaap',
      'Dessert : Fruits frais de saison & Pause café en option'
    ],
    courses: [
      {
        title: 'Entrée Fraîche',
        description: 'Salade de crudités croquantes, Niçoise traditionnelle ou Mexicaine assaisonnée.'
      },
      {
        title: 'Plat Principal & Grillades',
        description: 'Assortiment de viandes rôties et grillées : Poulet rôti grillé, Agneau tendre et Rôti de porc.'
      },
      {
        title: 'Accompagnements au Choix',
        description: 'Frites dorées, bananes plantains frites (Alloco), jardinière de légumes, couscous fin, riz blanc parfumé et Thiébou Yaap.'
      },
      {
        title: 'Douceur de Clôture',
        description: 'Panier gourmand de fruits de saison tranchés.'
      }
    ]
  },
  {
    id: 'menu-2-eclat-de-saveurs',
    name: 'Menu 2 — Éclat de Saveurs',
    shortName: 'Éclat de Saveurs',
    number: 2,
    tagline: 'Une montée en gamme raffinée, riche en saveurs et en variété',
    description:
      'Un équilibre parfait entre terre et mer avec des salades exotiques, assiette de charcuterie fine, pilons panés croustillants, viandes rôties et un large éventail d’accompagnements.',
    image: '/images/flyers/menu2-hero.jpg',
    alt: 'Gigot d’agneau rôti aux herbes et épices pour le Menu 2 Éclat de Saveurs',
    caption: '« Devis personnalisé »',
    coursesCount: 'Menu 2 Élevé',
    priceIndication: 'Devis personnalisé',
    coffeeBreak:
      '☕ Pause café disponible en option — jus locaux pressés, boissons chaudes, gourmandises assorties',
    categories: [
      {
        title: 'Entrées',
        image: '/images/flyers/menu2-entrees.jpg',
        items: 'Salade chinoise, Fruits de mer, Mexicaine, Assiette de charcuterie'
      },
      {
        title: 'Plats',
        image: '/images/flyers/menu2-plats.jpg',
        items: 'Poulet rôti grillé, Pilons panés, Agneau rôti grillé, Rôti de porc'
      },
      {
        title: 'Accompagnements',
        image: '/images/flyers/menu2-accompagnements.jpg',
        items: 'Frites, Plantain, Légumes sautés, Pommes de terre sautées, Couscous, Riz blanc, Thiébou Yaap'
      },
      {
        title: 'Dessert',
        image: '/images/flyers/menu2-dessert.jpg',
        items: 'Fruits de saison'
      }
    ],
    highlights: [
      'Entrées terre & mer : Salade chinoise, Fruits de mer, Mexicaine, Charcuterie',
      'Plats gourmands : Poulet rôti, Pilons panés, Agneau rôti grillé, Porc',
      'Accompagnements riches : Pommes sautées, Légumes sautés, Plantain, Thiébou Yaap',
      'Pause café avec jus locaux pressés'
    ],
    courses: [
      {
        title: 'Entrées Terroir & Océan',
        description: 'Salade chinoise parfumée, cocktail de fruits de mer, salade mexicaine relevée et plateau de charcuterie fine.'
      },
      {
        title: 'Plats de Viandes Rôties & Grillées',
        description: 'Poulet rôti grillé croustillant, pilons panés dorés, agneau rôti fondant et rôti de porc aux aromates.'
      },
      {
        title: 'Accompagnements Traiteur',
        description: 'Frites maison, plantains mûrs dorés, poêlée de légumes sautés, pommes de terre sautées persillées, couscous, riz blanc et Thiébou Yaap.'
      },
      {
        title: 'Dessert de Saison',
        description: 'Sélection fraîche de fruits de saison.'
      }
    ]
  },
  {
    id: 'menu-3-prestige-ngouda',
    name: 'Menu 3 — Prestige Ngouda',
    shortName: 'Prestige Ngouda',
    number: 3,
    tagline: "L'expérience la plus complète, pour les événements d'exception",
    description:
      'La signature d’excellence pour vos grands galas et mariages prestigieux. Pigeons rôtis, poisson au four, agneau grillé, macédoine de crevettes, et spécialités locales authentiques (Attiéké, Ablo, Thiébou Yaap, Gratin).',
    image: '/images/table-honneur.jpg',
    alt: 'Table d’apparat et buffet d’exception pour le Menu 3 Prestige Ngouda',
    caption: '« Devis personnalisé »',
    coursesCount: 'Prestige Haute Volée',
    priceIndication: 'Devis personnalisé',
    coffeeBreak:
      '☕ Pause café prestige — Thé, Café, Lait, Nescao, petits fours sucrés, amuse-bouches salés, mini-viennoiseries, jus naturels (Bissap, Gingembre, Bouye)',
    categories: [
      {
        title: 'Entrées',
        image: '/images/flyers/menu3-entrees.jpg',
        items: 'Salade chinoise, Niçoise, Tomate au thon, Macédoine de légumes aux crevettes'
      },
      {
        title: 'Plats',
        image: '/images/flyers/menu3-plats.jpg',
        items: 'Poulet pané, Agneau rôti grillé, Rôti de porc, Pigeons rôtis, Poisson au four'
      },
      {
        title: 'Accompagnements',
        image: '/images/flyers/menu3-accompagnements.jpg',
        items: 'Frites, Plantain, Légumes sautés, Gratin, Couscous, Riz blanc, Thiébou Yaap, Attiéké, Ablo, Vermicelles'
      },
      {
        title: 'Dessert',
        image: '/images/flyers/menu3-dessert.jpg',
        items: 'Fruits de saison'
      }
    ],
    highlights: [
      'Entrées d’apparat : Macédoine crevettes, Tomates au thon, Niçoise, Salade chinoise',
      'Plats nobles : Pigeons rôtis, Poisson au four, Agneau rôti grillé, Poulet pané',
      'Accompagnements royaux : Attiéké, Ablo, Gratin, Vermicelles, Thiébou Yaap',
      'Pause café Prestige complète : petits fours sucrés, amuse-bouches salés & jus frais'
    ],
    courses: [
      {
        title: 'Prélude Gourmand & Océan',
        description: 'Macédoine de légumes aux crevettes fraîches, tomates farcies au thon, salade Niçoise et salade chinoise.'
      },
      {
        title: 'Mets de Célébration',
        description: 'Pigeons rôtis d’exception, poisson noble cuit au four, agneau rôti grillé tendre, poulet pané doré et rôti de porc.'
      },
      {
        title: 'Symphonie des Accompagnements',
        description: 'Frites croustillantes, plantain doré, poêlée de légumes, gratin fondant, couscous, riz blanc parfumé, Thiébou Yaap mijoté, Attiéké ivoirien, Ablo moelleux et vermicelles dorés.'
      },
      {
        title: 'Fraîcheur Sucrée',
        description: 'Coupe d’abondance de fruits frais de saison.'
      }
    ]
  }
];

export const CUSTOM_MENU_INFO = {
  title: 'Votre Événement 100% sur-mesure',
  description:
    'Chaque événement est unique, conçu et dressé sur place selon vos plus hautes exigences. Choix personnalisé des viandes, poissons, accompagnements traditionnels et pauses café sur-mesure.',
  ctaText: 'Demander un Devis Personnalisé',
  perks: [
    'Conception et dressage sur place selon vos envies',
    'Pause café en option : viennoiseries, amuse-bouches et jus naturels (Bissap, Gingembre, Bouye)',
    'Événements de 20 à plus de 1 000 convives',
    'Déplacement partout à Dakar, Keur Massar, Rufisque et régions'
  ]
};

