import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuthenticatedUser, storeInLocalStorage, removeFromLocalStorage } from "./common";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [connectedUser, setConnectedUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Vérifie si un utilisateur est déjà connecté au montage
  useEffect(() => {
    async function initUser() {
      const { authenticated, user } = await getAuthenticatedUser();
      setConnectedUser(user);
      setAuthenticated(authenticated);
      setLoading(false);
    }
    initUser();
  }, []);

  const login = ({ token, userId }) => {
    storeInLocalStorage(token, userId);
    setConnectedUser({ token, userId });
    setAuthenticated(true);
  };

  const logout = () => {
    removeFromLocalStorage();
    setConnectedUser(null);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ connectedUser, authenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
