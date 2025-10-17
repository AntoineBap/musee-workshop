import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuthenticatedUser, storeInLocalStorage, removeFromLocalStorage } from "./common";

const AuthContext = createContext();

// fournit le contexte a l'app 
export const AuthProvider = ({ children }) => {
  const [connectedUser, setConnectedUser] = useState(null); // infos de l’user connecte (token, id, etc)
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect execute une seule fois au montage du composant
  useEffect(() => {
    async function initUser() {
      const { authenticated, user } = await getAuthenticatedUser(); // verifie si un user est deja stocke dans le localStorage
      setConnectedUser(user); // update les states selon les infos trouvees
      setAuthenticated(authenticated);
      setLoading(false);
    }
    initUser();
  }, []);

  // fonction de connexion
  const login = ({ token, userId }) => {
    storeInLocalStorage(token, userId); // stock le token et l’id dans le localStorage
    setConnectedUser({ token, userId }); // update les states locaux
    setAuthenticated(true);
  };

  // fonction de deconnexion
  const logout = () => {
    removeFromLocalStorage(); // supprime les donnees d’auth du localStorage
    setConnectedUser(null); // reset les states locaux
    setAuthenticated(false);
  };

  // envoie toute la data au composant enfant via le contexte
  return (
    <AuthContext.Provider
      value={{
        connectedUser, 
        authenticated,  
        login,          
        logout,          
        loading,         
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// hook pour acceder plus facilement au contexte
export const useAuth = () => useContext(AuthContext);
