import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import SummarizeButton from './SummarizeButton';

export default function NoteCard({ file, index }) {
  const [author, setAuthor] = useState('');

  useEffect(() => {
    if (!file.ownerId) return;
    (async () => {
      const snap = await getDoc(doc(db, 'users', file.ownerId));
      setAuthor(snap.exists() ? snap.data().username || 'Anonymous' : 'Anonymous');
    })();
  }, [file.ownerId]);

  return (
    <div
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between hover:border-white transition"
      data-aos="zoom-in"
      data-aos-delay={100 * index}
    >
      {/* 1. Title */}
      <div>
        <h3 className="text-lg font-semibold mb-2">{file.title}</h3>

        {/* 2. Tags row (subject, sem, year, college) */}
        <div className="text-gray-400 text-sm space-y-1">
          <p><strong>Subject:</strong> {file.subject}</p>
          <p><strong>Semester:</strong> {file.semester}</p>
          <p><strong>Year:</strong> {file.year}</p>
          <p><strong>College:</strong> {file.college}</p>
          <p className="text-gray-500 text-xs">by {author}</p>
        </div>
      </div>

      {/* 3. Actions */}
      <div className="mt-3 space-y-2">
        <SummarizeButton fileURL={file.fileURL} />
      </div>
    </div>
  );
}