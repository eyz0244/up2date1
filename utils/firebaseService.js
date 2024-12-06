import { auth, db } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// Save a new user's data to Firestore
export const saveUserData = async (userId, email) => {
  try {
    await setDoc(doc(db, "users", userId), {
      email: email,
      topics: [], // Initialize topics as an empty array
    });
    console.log("User data saved successfully in Firestore!");
  } catch (error) {
    console.error("Error saving user data:", error.message);
  }
};

// Add a topic to the user's topics array in Firestore
export const addUserTopic = async (userId, topic) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      topics: arrayUnion(topic),
    });
    console.log(`Topic "${topic}" added successfully!`);
  } catch (error) {
    console.error("Error adding topic:", error.message);
  }
};

// Retrieve user data from Firestore
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      console.log("User data retrieved successfully:", userDoc.data());
      return userDoc.data();
    } else {
      console.log("No user data found!");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user data:", error.message);
  }
};

// Sign up a new user
export const signUpUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;
    await saveUserData(userId, email); // Save user data to Firestore
    console.log("User signed up successfully!");
    return userCredential.user; // Return the signed-up user
  } catch (error) {
    console.error("Error signing up user:", error.message);
    throw error;
  }
};

// Log in an existing user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in successfully!");
    return userCredential.user; // Return the logged-in user
  } catch (error) {
    console.error("Error logging in user:", error.message);
    throw error;
  }
};

// Log out the current user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out successfully!");
  } catch (error) {
    console.error("Error logging out user:", error.message);
  }
};
