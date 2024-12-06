// firebaseService.js
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  collection,
  getDocs,
  arrayUnion,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChz6MsFZyTflzhNruvX1nlIR4mD4BhE3s",
  authDomain: "up2date-6b2f1.firebaseapp.com",
  projectId: "up2date-6b2f1",
  storageBucket: "up2date-6b2f1.firebasestorage.app",
  messagingSenderId: "70966750261",
  appId: "1:70966750261:android:0e63f2b0317b213b1e157c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Firestore instance
export const auth = getAuth(app); // Auth instance

// Firestore Functions

/**
 * Save a new user's data in Firestore.
 * @param {string} userId - The user's UID.
 * @param {string} email - The user's email.
 */
export const saveUserData = async (userId, email) => {
  try {
    await setDoc(doc(db, "users", userId), {
      email,
      topics: [], // Initialize with an empty array
    });
    console.log("User data saved successfully!");
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

/**
 * Add a topic to the user's topics array in Firestore.
 * @param {string} userId - The user's UID.
 * @param {string} topic - The topic to add.
 */
export const addUserTopic = async (userId, topic) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      topics: arrayUnion(topic), // Add topic to the array
    });
    console.log("Topic added successfully!");
  } catch (error) {
    console.error("Error adding topic:", error);
  }
};

/**
 * Retrieve a user's data from Firestore.
 * @param {string} userId - The user's UID.
 * @returns {Object} - User data.
 */
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("No user data found!");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

/**
 * Subscribe to real-time updates of a user's data in Firestore.
 * @param {string} userId - The user's UID.
 * @param {function} callback - Function to handle updated data.
 * @returns {function} - Unsubscribe function.
 */
export const subscribeToUserData = (userId, callback) => {
  try {
    const unsubscribe = onSnapshot(doc(db, "users", userId), (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      } else {
        console.log("No user data found!");
      }
    });
    return unsubscribe; // Call this to stop listening
  } catch (error) {
    console.error("Error subscribing to user data:", error);
  }
};

/**
 * Fetch all documents in the "users" collection.
 * @returns {Array} - Array of user documents.
 */
export const fetchAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("All users fetched successfully!");
    return users;
  } catch (error) {
    console.error("Error fetching all users:", error);
  }
};

// Authentication Functions

/**
 * Sign up a new user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Object} - Firebase user object.
 */
export const signUpUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid; // Firebase Auth's UID
    await saveUserData(userId, email); // Save user data in Firestore
    console.log("User signed up successfully!");
    return userCredential.user;
  } catch (error) {
    console.error("Error signing up user:", error);
    throw error; // Rethrow for frontend error handling
  }
};

/**
 * Log in an existing user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Object} - Firebase user object.
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User logged in successfully!");
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

/**
 * Log out the current user.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully!");
  } catch (error) {
    console.error("Error logging out user:", error);
    throw error;
  }
};

/**
 * Sync Firebase Auth state with your app.
 * @param {function} callback - Function to handle logged-in or logged-out state.
 */
export const syncAuthState = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in:", user);
      callback(true, user);
    } else {
      console.log("User is logged out.");
      callback(false, null);
    }
  });
};
