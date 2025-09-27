import { useState } from 'react';
import { extractText } from '../utils/useDocText';
import { summarise } from '../utils/gemini';

export default function DocSummary() {
  const [file, setFile]     = useState(null);
  const [loading, setLoad]  = useState(false);
  const [summary, setSum]   = useState('');

  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setSum('');
    setLoad(true);
    try {
      const text = await extractText(f);
      const bullet = await summarise(text);
      setSum(bullet);
    } catch (err) {
      setSum('❌ ' + err.message);
    } finally {
      setLoad(false);
    }
  };

  const copy = () => navigator.clipboard.writeText(summary);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-white">
      <h2 className="text-2xl font-bold mb-4">AI Document Summary</h2>

      {/* Upload */}
      <label className="block mb-4">
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFile}
          className="hidden"
        />
        <div className="cursor-pointer rounded-lg border-2 border-dashed border-gray-600
                        p-6 text-center hover:border-white transition">
          {file ? file.name : 'Drop / click to upload PDF, DOCX, or TXT'}
        </div>
      </label>

      {/* Loading */}
      {loading && <p className="text-gray-400">Reading & summarising…</p>}

      {/* Summary */}
      {summary && !loading && (
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Summary</h3>
            <button
              onClick={copy}
              className="text-sm bg-white text-black px-3 py-1 rounded hover:bg-gray-200"
            >
              Copy
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-gray-300">{summary}</pre>
        </div>
      )}
    </div>
  );
}