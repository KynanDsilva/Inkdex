import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Profile() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  /* ---- read-only data ---- */
  const [college, setCollege] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      const snap = await getDoc(doc(db, 'users', currentUser.uid));
      if (snap.exists()) setCollege(snap.data().college || 'Not provided');
    })();
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <>
      <Header />
      <main
        className="max-w-2xl mx-auto px-6 py-20 text-white min-h-[70vh]"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h1
          className="text-4xl font-bold mb-8 text-center"
          data-aos="fade-down"
          data-aos-delay="200"
        >
          Profile
        </h1>

        {/* Info card (read-only) */}
        <div
          className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6"
          data-aos="zoom-in"
          data-aos-delay="400"
        >
          {/* Big user icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
              <i className="bx bx-user text-4xl text-gray-400" />
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Email</p>
            <p className="text-lg font-medium">{currentUser?.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Username</p>
            <p className="text-lg font-medium">
              {currentUser?.displayName || 'Not set'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">College</p>
            <p className="text-lg font-medium">{college}</p>
          </div>
        </div>

        {/* Big logout button */}
        <div
          className="mt-10 flex justify-center"
          data-aos="fade-up"
          data-aos-delay="600"
        >
          <button
            onClick={handleLogout}
            className="bg-white text-black px-10 py-3 rounded-full font-semibold text-lg hover:bg-gray-200 transition"
          >
            Logout
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}
