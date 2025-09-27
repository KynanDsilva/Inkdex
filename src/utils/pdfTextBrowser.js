// src/utils/pdfTextBrowser.js
import * as pdfjs from 'pdfjs-dist';

// ↓ exact same build as the npm package
pdfjs.GlobalWorkerOptions.workerSrc =
  new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).href;

export async function extractPdfText(buffer) {
  const typedArray = new Uint8Array(buffer);
  const doc = await pdfjs.getDocument({ data: typedArray }).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  return text || '[No text found]';
}