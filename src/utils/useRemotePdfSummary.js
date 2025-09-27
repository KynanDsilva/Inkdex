import { extractPdfText } from './pdfTextBrowser';
import { summarise } from './gemini';

export async function fetchSummary(pdfURL) {
    const res = await fetch(pdfURL);
    const blob = await res.blob();
    const buf = await blob.arrayBuffer();
    const text = await extractPdfText(buf);
    if (!text.trim()) throw new Error('No text found in PDF');
    return await summarise(text);
}