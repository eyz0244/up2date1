// sessionManager.js
let currentSessionId = null;
let sessionExpiry = null;

export const createSession = () => {
  currentSessionId = Math.random().toString(36).substr(2, 9);
  sessionExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
  return currentSessionId;
};

export const validateSession = () => {
  if (!currentSessionId || !sessionExpiry) return false;
  if (new Date() > sessionExpiry) {
    currentSessionId = null;
    sessionExpiry = null;
    return false;
  }
  return true;
};

export const clearSession = () => {
  currentSessionId = null;
  sessionExpiry = null;
};
