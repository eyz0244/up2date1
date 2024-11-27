import React, { createContext, useState } from "react";
import { createSession, validateSession, clearSession } from "./sessionManager";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(validateSession());
  const [sessionId, setSessionId] = useState(null);

  const login = () => {
    const newSession = createSession();
    setSessionId(newSession);
    setIsLoggedIn(true);
  };

  const logout = () => {
    clearSession();
    setSessionId(null);
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, login, logout, sessionId }}>
      {children}
    </UserContext.Provider>
  );
};
