import React, { useState } from 'react';
import { createWorker } from 'tesseract.js';

export default function SummarizeButton({ fileURL }) {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState('');
    const [summary, setSummary] = useState('');
    const [error, setError] = useState('');

    const handleSummarize = async () => {
        setShowModal(true);
        setIsLoading(true);
        setError('');
        setSummary('');
        setProgress('Initializing OCR...');

        try {
            // 1. Initialize Tesseract Worker
            const worker = await createWorker('eng', 1, {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        setProgress(`Recognizing Text: ${Math.round(m.progress * 100)}%`);
                    }
                },
            });

            // 2. Perform OCR on the PDF file URL
            // NOTE: This can be slow for large, multi-page PDFs.
            // Tesseract.js needs to fetch the file, which can cause CORS issues if not configured correctly in Firebase Storage.
            const { data: { text } } = await worker.recognize(fileURL);
            await worker.terminate();

            if (!text) {
                throw new Error("Could not extract any text from the document.");
            }

            setProgress('Text extracted. Summarizing...');

            // 3. Call Gemini API for Summarization
            const apiKey = ""; // Leave blank
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const payload = {
                contents: [{
                    parts: [{ text: `Summarize the following text in a few concise bullet points:\n\n${text}` }]
                }],
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            const summaryText = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!summaryText) {
                throw new Error("Failed to generate a summary from the API response.");
            }

            setSummary(summaryText);

        } catch (err) {
            console.error("Summarization error:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
            setProgress('');
        }
    };

    return (
        <>
            <button
                onClick={handleSummarize}
                className="text-sm text-green-400 hover:underline mt-2 self-start">
                Summarize Notes
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-2xl text-white relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Note Summary</h2>

                        {isLoading && (
                            <div className="text-center">
                                <p className="text-lg animate-pulse">{progress || 'Processing...'}</p>
                            </div>
                        )}

                        {error && <p className="text-red-500">{error}</p>}

                        {summary && (
                            <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
                                {summary.split('\n').map((line, index) => (
                                    <p key={index}>{line}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}