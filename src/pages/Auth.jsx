import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- Import your Auth Context and Firestore utils ---
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [college, setCollege] = useState('');

  const { currentUser, signup, login, logout, googleSignIn } = useAuth();
  const navigate = useNavigate();

  // Signup handler using context signup
  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Passwords do not match');
    try {
      setLoading(true);
      const cred = await signup(email, password, username);
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email,
        username,
        college,
        createdAt: serverTimestamp(),
      });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Login handler using context login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
    setLoading(false);
  };

  // Google Sign-In handler
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await googleSignIn();
      // Optional: create Firestore user doc if new user
      // const user = result.user;
      // await setDoc(doc(db, 'users', user.uid), { ... });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Logout handler
  const handleLogout = () => {
    logout();
  };

  if (currentUser) {
    return (
      <>
        <Header />
        <main className="min-h-[75vh] flex items-center justify-center px-6 text-white">
          <div className="text-center" data-aos="zoom-in">
            <h1 className="text-2xl mb-4">You are logged in as {currentUser.displayName}</h1>
            <button
              onClick={handleLogout}
              className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-[75vh] flex items-center justify-center px-6 py-20 text-white">
        <div
          className="w-full max-w-md bg-white text-black rounded-2xl shadow-lg p-8 overflow-hidden"
          data-aos="zoom-in"
          data-aos-duration="800"
        >
          <div className="flex rounded-full bg-gray-100 p-1 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                isLogin ? 'bg-black text-white' : 'text-gray-600'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition ${
                !isLogin ? 'bg-black text-white' : 'text-gray-600'
              }`}
            >
              Signup
            </button>
          </div>

          {error && <p className="text-red-500 text-center text-sm mb-4">{error}</p>}

          <div className="relative overflow-hidden">
            <div
              className={`flex transition-transform duration-300 ${
                isLogin ? 'translate-x-0' : '-translate-x-[100%]'
              }`}
            >
              <div className="w-full shrink-0 px-1">
                <form className="space-y-4" onSubmit={handleLogin}>
                  <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                  />
                  <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition disabled:bg-gray-500 mt-4"
                >
                  {loading ? 'Signing in...' : 'Sign in with Google'}
                </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-500"
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>
                  <p className="text-center text-sm text-gray-500">
                    <a href="#" className="hover:underline">
                      Forgot password?
                    </a>
                  </p>
                </form>
              </div>

              <div className="w-full shrink-0 px-1">
                <form className="space-y-4" onSubmit={handleSignup}>
                  <h2 className="text-2xl font-bold mb-2">Create account</h2>
                  <input
                    type="text"
                    placeholder="Username"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                  />
                  <input
                    type="text"
                    placeholder="College"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-500"
                  >
                    {loading ? 'Creating Account...' : 'Signup'}
                  </button>
                </form>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition disabled:bg-gray-500 mt-4"
                >
                  {loading ? 'Signing in...' : 'Sign up with Google'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
