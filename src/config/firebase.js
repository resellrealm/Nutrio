import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKey-ReplaceWithActualKey",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "nutrio-v11.firebaseapp.com",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "nutrio-v11",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "nutrio-v11.appspot.com",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
