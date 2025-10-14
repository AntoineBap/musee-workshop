import { useState, useEffect } from "react";
import { getAuthenticatedUser } from "./common";

export function useUser() {
  const [connectedUser, setConnectedUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    async function getUserDetails() {
      const { authenticated, user } = await getAuthenticatedUser();
      setConnectedUser(user);
      setAuthenticated(authenticated);
      setUserLoading(false);
    }
    getUserDetails();
  }, []);

  return {
    connectedUser,
    setConnectedUser,
    authenticated,
    setAuthenticated,          
    userLoading,
  };
}
