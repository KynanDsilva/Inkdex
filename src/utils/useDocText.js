import mammoth from 'mammoth';
import { extractPdfText } from './pdfTextBrowser';

export async function extractText(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const buffer = await file.arrayBuffer();

  if (ext === 'pdf') return extractPdfText(buffer);
  if (ext === 'docx') {
    const res = await mammoth.extractRawText({ buffer });
    return res.value;
  }
  if (ext === 'txt') return new TextDecoder().decode(buffer);
  throw new Error('Unsupported format');
}