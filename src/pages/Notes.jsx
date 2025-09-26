import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import Header from '../components/Header';
import Footer from '../components/Footer';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext'; // NEW: Import the auth context

export default function Notes() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth(); // NEW: Get the currently logged-in user

  useEffect(() => {
    // NEW: Only fetch notes if a user is logged in
    if (currentUser) {
      // The query now looks for documents where the 'userId' field
      // matches the logged-in user's unique ID (uid).
      const q = query(
        collection(db, 'notes'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const unsub = onSnapshot(q, (snap) => {
        setFiles(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      });

      // Cleanup the listener when the component unmounts
      return () => unsub();
    } else {
      // If no user is logged in, set files to empty and stop loading
      setFiles([]);
      setLoading(false);
    }
  }, [currentUser]); // NEW: The effect re-runs if the user logs in or out

  return (
    <>
      <Header />
      <main
        className="max-w-5xl mx-auto px-6 py-20 text-white"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h1 className="text-4xl font-bold mb-4" data-aos="fade-right" data-aos-delay="200">
          Your Notes
        </h1>
        <p className="text-gray-400 mb-8" data-aos="fade-right" data-aos-delay="400">
          Notes you have personally uploaded.
        </p>

        {/* NEW: Handle the case where there is no logged-in user */}
        {!currentUser ? (
          <p>
            Please <Link to="/auth" className="text-blue-400 hover:underline">login or sign up</Link> to see your notes.
          </p>
        ) : loading ? (
          <p>Loading your notes…</p>
        ) : files.length === 0 ? (
          <p>You haven’t uploaded any notes yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {files.map((file, i) => (
              <div
                key={file.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between hover:border-white transition"
                data-aos="zoom-in"
                data-aos-delay={100 * i}
              >
                <div>
                  <h3 className="text-lg font-semibold mb-2">{file.title}</h3>
                  <div className="text-gray-400 text-sm space-y-1">
                    <p><strong>Subject:</strong> {file.subject}</p>
                    <p><strong>Semester:</strong> {file.semester}</p>
                    <p><strong>Year:</strong> {file.year}</p>
                  </div>
                </div>
                <a
                  href={file.fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline mt-4 self-start"
                >
                  Download →
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
