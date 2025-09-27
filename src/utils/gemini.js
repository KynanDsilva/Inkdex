import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function summarise(text) {
  const prompt = `Summarise the following in 4-6 short bullet points:\n\n${text}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}