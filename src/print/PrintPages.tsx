import React from 'react';
import { FlyerSheet, type FlyerId } from '../components/ui/FlyerSheet';
import { Logo } from '../components/ui/Logo';
import { MENUS_DATA } from '../data/menus.data';

/**
 * Pages hors-site destinées à l'export (PDF des cartes, PNG du logo).
 * Accessibles via `?print=flyers` et `?print=logo[&tone=dark]`.
 */

const PRINT_CSS = `
  @page { size: A4 portrait; margin: 0; }
  html, body { background: #fdfbf7 !important; margin: 0; }
  .print-page { width: 210mm; height: 297mm; display: flex; align-items: center; justify-content: center; page-break-after: always; break-after: page; background: #fdfbf7; }
  .print-page:last-child { page-break-after: auto; break-after: auto; }
  .print-page .flyer { width: 176mm; }
  .print-page .flyer > div { box-shadow: none !important; max-width: none !important; padding: 9mm !important; }
`;

const ORDER: FlyerId[] = [...MENUS_DATA.map((m) => m.id as FlyerId), 'coffee'];

export const FlyersPrint: React.FC = () => (
  <>
    <style>{PRINT_CSS}</style>
    {ORDER.map((id) => (
      <div key={id} className="print-page">
        <div className="flyer">
          <FlyerSheet flyerId={id} className="text-[15px]" />
        </div>
      </div>
    ))}
  </>
);

export const LogoPrint: React.FC<{ tone: 'dark' | 'light' }> = ({ tone }) => (
  <div
    className={`w-screen h-screen flex items-center justify-center ${tone === 'light' ? 'bg-primary' : 'bg-[#fdfbf7]'}`}
  >
    <Logo tone={tone} layout="stacked" markSize={420} />
  </div>
);
