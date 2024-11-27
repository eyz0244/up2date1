import { db } from "./firebaseConfig"; // Import Firestore instance
import auth from "@react-native-firebase/auth"; // Firebase Auth
import firebase from "@react-native-firebase/firestore"; // Ensure this is installed

// Firestore Functions

// Save a new user's data
export const saveUserData = async (userId, email, password) => {
  try {
    await db.collection("users").doc(userId).set({
      email: email,
      password: password, // Store hashed password here
      topics: [], // Initialize with an empty array
    });
    console.log("User data saved successfully!");
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

// Add a topic to the user's topics array
export const addUserTopic = async (userId, topic) => {
  try {
    const userRef = db.collection("users").doc(userId);
    await userRef.update({
      topics: firebase.firestore.FieldValue.arrayUnion(topic),
    });
    console.log("Topic added successfully!");
  } catch (error) {
    console.error("Error adding topic:", error);
  }
};

// Retrieve user data
export const getUserData = async (userId) => {
  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (userDoc.exists) {
      return userDoc.data();
    } else {
      console.log("No user data found!");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

// Subscribe to user data for real-time updates
export const subscribeToUserData = (userId, callback) => {
  try {
    const unsubscribe = db.collection("users").doc(userId).onSnapshot((doc) => {
      if (doc.exists) {
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

// Authentication Functions

// Sign up a new user
export const signUpUser = async (email, password) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    console.log("User signed up:", userCredential.user);
    // Optional: Save user data in Firestore after signup
    const userId = userCredential.user.uid; // Use Firebase Auth's UID as user ID
    await saveUserData(userId, email, password); // Store user info in Firestore
  } catch (error) {
    console.error("Error signing up user:", error);
  }
};

// Log in an existing user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    console.log("User logged in:", userCredential.user);
    return userCredential.user; // Optionally return the user object
  } catch (error) {
    console.error("Error logging in user:", error);
  }
};

// Log out the current user
export const logoutUser = async () => {
  try {
    await auth().signOut();
    console.log("User logged out successfully!");
  } catch (error) {
    console.error("Error logging out user:", error);
  }
};
