// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Firebase configuration from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyChz6MsFZyTflzhNruvX1nlIR4mD4BhE3s",
  authDomain: "up2date-6b2f1.firebaseapp.com",
  projectId: "up2date-6b2f1",
  storageBucket: "up2date-6b2f1.firebasestorage.app",
  messagingSenderId: "70966750261",
  appId: "1:70966750261:android:0e63f2b0317b213b1e157c",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const db = getFirestore(app); // Firestore instance
export const auth = getAuth(app); // Auth instance

// Export Firebase app for other uses
export default app;
