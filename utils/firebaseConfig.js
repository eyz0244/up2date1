// Import the required Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyA2qTeA9b-3624x7tWIuxIvFMQNVzPHDJE",
  authDomain: "up2date1-376f2.firebaseapp.com",
  projectId: "up2date1-376f2",
  storageBucket: "up2date1-376f2.appspot.com",
  messagingSenderId: "504013271723",
  appId: "1:504013271723:web:f1a7b9001e2810a2023dee",
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app); // Authentication
export const db = getFirestore(app); // Firestore Database

export default app;
