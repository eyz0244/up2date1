// In-memory session variables
let currentSessionId = null;
let sessionExpiry = null;

// Create a new session
export const createSession = () => {
  currentSessionId = Math.random().toString(36).substr(2, 9);
  sessionExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  console.log("Session created:", currentSessionId);
  return currentSessionId;
};

// Validate the current session
export const validateSession = () => {
  if (!currentSessionId || !sessionExpiry) return false;
  if (new Date() > sessionExpiry) {
    clearSession(); // Expire the session
    return false;
  }
  return true;
};

// Clear the current session
export const clearSession = () => {
  console.log("Session cleared");
  currentSessionId = null;
  sessionExpiry = null;
};
