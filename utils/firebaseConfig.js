// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2qTeA9b-3624x7tWIuxIvFMQNVzPHDJE",
  authDomain: "up2date1-376f2.firebaseapp.com",
  projectId: "up2date1-376f2",
  storageBucket: "up2date1-376f2.appspot.com",
  messagingSenderId: "504013271723",
  appId: "1:504013271723:web:f1a7b9001e2810a2023dee",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Export Firestore instance
export default app;
