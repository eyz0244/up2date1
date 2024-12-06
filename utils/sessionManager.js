import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseService";

let currentSessionId = null;
let sessionExpiry = null;

/**
 * Create a new session and set an expiry time (1 hour from now).
 */
export const createSession = () => {
  currentSessionId = Math.random().toString(36).substr(2, 9);
  sessionExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  return currentSessionId;
};

/**
 * Validate the current session.
 * @returns {boolean} - Whether the session is valid.
 */
export const validateSession = () => {
  if (!currentSessionId || !sessionExpiry) return false;
  if (new Date() > sessionExpiry) {
    clearSession();
    return false;
  }
  return true;
};

/**
 * Clear the current session.
 */
export const clearSession = () => {
  currentSessionId = null;
  sessionExpiry = null;
  console.log("Session cleared.");
};

/**
 * Sync session state with Firebase Auth.
 * @param {function} callback - Function to handle logged-in or logged-out state.
 */
export const syncSessionWithAuth = (callback) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      createSession();
      console.log("Session synced with Firebase Auth. User is logged in.");
      callback(true); // Notify app of logged-in state
    } else {
      clearSession();
      console.log("Session cleared. User is logged out.");
      callback(false); // Notify app of logged-out state
    }
  });
};
