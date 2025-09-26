import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDYmvgkvfFYv7ybDu3p78HKMRKTPy3e5Lc",
  authDomain: "inkdex-d80bc.firebaseapp.com",
  projectId: "inkdex-d80bc",
  storageBucket: "inkdex-d80bc.firebasestorage.app",
  messagingSenderId: "1057377892759",
  appId: "1:1057377892759:web:81875c125a1a9eb214ecd2",
  measurementId: "G-ZNFR7PRFSH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);