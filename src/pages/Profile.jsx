import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { signOut, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Profile() {
  const { currentUser } = useAuth();
  const [college, setCollege] = useState('Loading...');
  const [username, setUsername] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollege = async () => {
      if (!currentUser) return;
      setUsername(currentUser.displayName || '');
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCollege(docSnap.data().college ?? '');
      } else {
        setCollege('');
      }
    };
    fetchCollege();
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      // Update Firestore college
      await setDoc(
        doc(db, 'users', currentUser.uid),
        { college: college },
        { merge: true }
      );
      // Update username via Firebase Auth
      await updateProfile(currentUser, { displayName: username });
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Try again.');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUsername(currentUser.displayName || '');
    setCollege(college || '');
    setError('');
  };

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-20 text-white min-h-[70vh]" data-aos="fade-up" data-aos-duration="1000">
        <h1 className="text-4xl font-bold mb-8 text-center" data-aos="fade-down" data-aos-delay="200">
          Profile
        </h1>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-6" data-aos="zoom-in" data-aos-delay="400">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
              <i className="bx bx-user text-4xl text-gray-400"></i>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Email</p>
            <p className="text-lg font-medium">{currentUser?.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Username</p>
            {isEditing ? (
              <input
                className="w-full px-4 py-2 rounded border border-gray-300 text-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            ) : (
              <p className="text-lg font-medium">{currentUser?.displayName || 'Not set'}</p>
            )}
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">College</p>
            {isEditing ? (
              <input
                className="w-full px-4 py-2 rounded border border-gray-300 text-black"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                disabled={loading}
              />
            ) : (
              <p className="text-lg font-medium">{college || 'Not set'}</p>
            )}
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <div className="flex gap-4 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="bg-gray-700 text-gray-100 px-6 py-2 rounded hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        <div className="mt-10 flex justify-center" data-aos="fade-up" data-aos-delay="600">
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
