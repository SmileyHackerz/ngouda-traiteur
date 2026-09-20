# N'Gouda Traiteur — site vitrine

Site one-page de **N'Gouda Traiteur**, traiteur événementiel à Dakar.

- React 19 + TypeScript + Vite 6
- Tailwind CSS 4 (`@tailwindcss/vite`), `motion` pour les animations, `lucide-react` pour les icônes
- Aucune clé d'API nécessaire : le formulaire de devis ouvre WhatsApp avec un message pré-rempli.

## Lancer en local

```bash
npm install
npm run dev
```

Le site est servi sur http://localhost:3000.

## Structure

- `src/components/sections/` — sections de la page (Header, Hero, Menus, Art, Événements, Réservation, Contact, Footer) et la modale de devis
- `src/components/ui/` — briques réutilisables (Logo, Button, Reveal, SectionHeading, FlyerSheet, Lightbox…)
- `src/data/` — contenus : coordonnées (`contact.data.ts`), menus (`menus.data.ts`), galerie (`gallery.data.ts`)
- `public/images/` — photographies ; `public/brand/` — logo en SVG (bordeaux, ivoire, monogramme)

## Modifier les coordonnées

Numéro WhatsApp, e-mail et adresse sont centralisés dans `src/data/contact.data.ts`.

## Exports (cartes PDF, logo PNG)

Deux pages hors-site servent à l'export :

- `http://localhost:3000/?print=flyers` — les 3 menus + la pause café, une carte par page A4
- `http://localhost:3000/?print=logo&tone=light` (fond bordeaux) ou `&tone=dark` (fond ivoire)

Avec Chrome en mode headless (serveur `npm run dev` lancé) :

```bash
chrome --headless=new --no-pdf-header-footer --virtual-time-budget=15000 --print-to-pdf=cartes.pdf "http://localhost:3000/?print=flyers"
```

Dans le site, chaque carte se télécharge aussi en PDF ou en image depuis la fenêtre « Voir la carte ».
