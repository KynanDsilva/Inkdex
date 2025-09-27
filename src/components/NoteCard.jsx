import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { fetchSummary } from '../utils/useRemotePdfSummary';

export default function NoteCard({ file, index }) {
    const [author, setAuthor] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoad] = useState(false);
    const [summary, setSum] = useState('');

    /* ---------- load summary for a PDF ---------- */
    const loadSummary = async (url) => {
        setSummaryURL(url);
        setSummaryText('');
        setLoadingSum(true);
        try {
            const text = await fetchSummary(url);
            setSummaryText(text);
        } catch (e) {
            setSummaryText('❌ ' + e.message);
        } finally {
            setLoadingSum(false);
        }
    };

    // existing author fetch
    useEffect(() => {
        if (!file.ownerId) return;
        (async () => {
            const snap = await getDoc(doc(db, 'users', file.ownerId));
            setAuthor(snap.exists() ? snap.data().username || 'Anonymous' : 'Anonymous');
        })();
    }, [file.ownerId]);

    const handleSummarise = async () => {
        setShow(true);
        setLoad(true);
        setSum('');
        try {
            const bullets = await fetchSummary(file.fileURL);
            setSum(bullets);
        } catch (err) {
            setSum('❌ ' + err.message);
        } finally {
            setLoad(false);
        }
    };

    return (
        <>
            <div
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between hover:border-white transition"
                data-aos="zoom-in"
                data-aos-delay={100 * index}
            >
                <div>
                    <h3 className="text-lg font-semibold mb-2">{file.title}</h3>
                    <div className="text-gray-400 text-sm space-y-1">
                        <p><strong>Subject:</strong> {file.subject}</p>
                        <p><strong>Semester:</strong> {file.semester}</p>
                        <p><strong>Year:</strong> {file.year}</p>
                        <p><strong>College:</strong> {file.college}</p>
                        <p className="text-gray-500 text-xs">by {author}</p>
                    </div>
                </div>

                <div className="mt-3 space-y-2">
                    {/* NEW: one-click summary */}
                    <button
                        onClick={handleSummarise}
                        className="text-sm text-green-400 hover:underline"
                    >
                        Summarise Notes
                    </button>
                </div>
            </div>

            {/* Modal */}
            {show && (
                <>
                    {/* backdrop – clicking it closes panel */}
                    <div className="backdrop" onClick={() => setShow(false)} />

                    <aside className="drawer open p-6 text-white overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Note Summary</h3>
                            <button
                                onClick={() => setShow(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        {loading && <p className="animate-pulse">Creating summary…</p>}
                        {summary && !loading && (
                            <div className="prose prose-invert prose-sm text-gray-300 whitespace-pre-wrap">
                                {summary}
                            </div>
                        )}
                    </aside>
                </>
            )}
        </>
    );
}