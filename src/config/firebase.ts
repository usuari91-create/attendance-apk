import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, enableIndexedDbPersistence, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, Auth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID'
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

export function initFirebase() {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  auth = getAuth(app);

  // Enable offline persistence
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.warn('Current browser does not support persistence.');
    }
  });

  // Set auth persistence
  setPersistence(auth, browserLocalPersistence).catch(console.error);

  // For local development with emulator
  // if (import.meta.env.DEV && import.meta.env.VITE_USE_EMULATOR === 'true') {
  //   connectFirestoreEmulator(db, 'localhost', 8080);
  // }

  return { app, db, auth };
}

export function getDb() {
  if (!db) initFirebase();
  return db;
}

export function getAuthInstance() {
  if (!auth) initFirebase();
  return auth;
}

export { db, auth };