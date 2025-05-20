import { jsPDF } from 'jspdf';

export const generateSpeelpleinPDF = (speelplein) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.text(speelplein.Speelplein, 20, 20);
  
  doc.setFontSize(14);
  doc.text(`Leeftijd: ${speelplein.Leeftijdsgroep}`, 20, 40);
  doc.text(`Openingsuren: ${speelplein.Openingsuren}`, 20, 50);
  // ... meer info
  
  doc.save(`${speelplein.Speelplein}.pdf`);
}; 