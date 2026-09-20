export interface MenuCourse {
  title: string;
  description: string;
  winePairing?: string;
}

export interface MenuCategory {
  title: string;
  image: string;
  items: string;
}

export interface MenuItem {
  id: string;
  name: string;
  shortName: string;
  number: number;
  tagline: string;
  description: string;
  image: string;
  alt: string;
  caption?: string;
  coursesCount: string;
  priceIndication?: string;
  coffeeBreak?: string;
  categories: MenuCategory[];
  highlights: string[];
  courses?: MenuCourse[];
}

export interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  title: string;
  category: string;
  description: string;
  image: string;
  videoUrl?: string;
  duration?: string;
  alt: string;
  /** Ratio d'affichage dans la mosaïque desktop */
  span?: 'wide' | 'tall' | 'square';
}

export type EventCategory = 'Mariage' | 'Gala' | 'Cocktail' | 'Corporate' | 'Anniversaire' | 'Autre';

export interface ReservationFormData {
  eventType: EventCategory | '';
  guestCount: number | '';
  eventDate: string;
  eventLocation: string;
  selectedMenu: string;
  coffeeBreak: boolean;
  customRequests: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
}

export interface ContactDetails {
  phoneDisplay: string;
  phoneRaw: string;
  whatsappNumber: string;
  whatsappUrl: string;
  email: string;
  address: string;
  city: string;
  country: string;
  /** Horaires d'ouverture, forme longue et courte */
  hours: string;
  hoursShort: string;
}
