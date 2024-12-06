import { db } from "./firebaseConfig"; // Firestore instance
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

/**
 * Save user data to Firestore.
 * This creates a document in the 'users' collection with the user's email and an empty topics array.
 *
 * @param {string} userId - The user's unique ID (e.g., Firebase Authentication UID).
 * @param {string} email - The user's email address.
 */
export const saveUserData = async (userId, email) => {
  try {
    await setDoc(doc(db, "users", userId), {
      email: email,
      topics: [], // Initialize with an empty array
    });
    console.log("User data saved to Firestore!");
  } catch (error) {
    console.error("Error saving user data:", error.message);
  }
};

/**
 * Add a topic to the user's topics array in Firestore.
 *
 * @param {string} userId - The user's unique ID.
 * @param {string} topic - The topic to add.
 */
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

/**
 * Remove a topic from the user's topics array in Firestore.
 *
 * @param {string} userId - The user's unique ID.
 * @param {string} topic - The topic to remove.
 */
export const removeUserTopic = async (userId, topic) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      topics: arrayRemove(topic),
    });
    console.log(`Topic "${topic}" removed successfully!`);
  } catch (error) {
    console.error("Error removing topic:", error.message);
  }
};

/**
 * Retrieve user data from Firestore.
 *
 * @param {string} userId - The user's unique ID.
 * @returns {object|null} The user's data (email and topics) or null if the document doesn't exist.
 */
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
    return null;
  }
};

/**
 * Update a user's email in Firestore.
 *
 * @param {string} userId - The user's unique ID.
 * @param {string} newEmail - The new email address.
 */
export const updateUserEmail = async (userId, newEmail) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      email: newEmail,
    });
    console.log(`Email updated successfully to "${newEmail}"!`);
  } catch (error) {
    console.error("Error updating email:", error.message);
  }
};
