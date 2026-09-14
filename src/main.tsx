import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { FlyersPrint, LogoPrint } from './print/PrintPages.tsx';
import './index.css';

// Pages d'export (PDF des cartes, PNG du logo) : `?print=flyers` ou `?print=logo&tone=light`
const params = new URLSearchParams(window.location.search);
const printMode = params.get('print');
const tone = params.get('tone') === 'dark' ? 'dark' : 'light';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {printMode === 'flyers' ? <FlyersPrint /> : printMode === 'logo' ? <LogoPrint tone={tone} /> : <App />}
  </StrictMode>
);
