// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

// 1. Create the context
const AuthContext = createContext();

// 2. Create a custom hook to make it easy to use the context
export function useAuth() {
  return useContext(AuthContext);
}

// 3. Create the Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged is a listener from Firebase that checks for login/logout events
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // This cleans up the listener when the component unmounts to prevent memory leaks
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* We don't render the app until Firebase has checked the auth state */}
      {!loading && children}
    </AuthContext.Provider>
  );
}