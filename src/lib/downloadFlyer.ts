import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

export type FlyerFormat = 'png' | 'pdf';

/** Rasterise une carte (DOM) en PNG haute définition. */
const captureFlyer = async (node: HTMLElement) => {
  // Attend que les polices et images soient prêtes pour un rendu fidèle
  await document.fonts?.ready;
  await Promise.all(
    Array.from(node.querySelectorAll('img')).map(
      (img) =>
        img.complete ||
        new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
  const dataUrl = await toPng(node, {
    pixelRatio: 3,
    cacheBust: true,
    backgroundColor: '#fdfbf7',
    style: { boxShadow: 'none', margin: '0' }
  });
  return { dataUrl, width: node.offsetWidth, height: node.offsetHeight };
};

const triggerDownload = (href: string, fileName: string) => {
  const a = document.createElement('a');
  a.href = href;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

/**
 * Télécharge la carte affichée en PNG ou en PDF (une page, au format de la carte).
 */
export const downloadFlyer = async (node: HTMLElement, fileName: string, format: FlyerFormat) => {
  const { dataUrl, width, height } = await captureFlyer(node);

  if (format === 'png') {
    triggerDownload(dataUrl, `${fileName}.png`);
    return;
  }

  // Page aux proportions exactes de la carte, largeur A4 (210 mm)
  const pageW = 210;
  const pageH = (height / width) * pageW;
  const pdf = new jsPDF({ orientation: pageH > pageW ? 'portrait' : 'landscape', unit: 'mm', format: [pageW, pageH] });
  pdf.addImage(dataUrl, 'PNG', 0, 0, pageW, pageH, undefined, 'FAST');
  pdf.save(`${fileName}.pdf`);
};
