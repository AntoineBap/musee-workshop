import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_ROUTES, APP_ROUTES } from "../utils/constants";
import { useAuth } from "../lib/authContext";
import styles from "../styles/SignIn.module.scss";

function SignIn() {
  const navigate = useNavigate();
  const { authenticated, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ error: false, message: "" });

  useEffect(() => {
    if (authenticated) navigate(APP_ROUTES.DASHBOARD || "/");
  }, [authenticated, navigate]);

  const signIn = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(API_ROUTES.SIGN_IN, { email, password });

      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token); // <-- ajouté
        login({ token: response.data.token, userId: response.data.userId });
        navigate("/"); 
      }
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      setNotification({ error: true, message: backendMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(API_ROUTES.SIGN_UP, { email, password });
      if (!response?.data) return;
      setNotification({ error: false, message: "Compte créé, vous pouvez vous connecter" });
    } catch (err) {
      const backendMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      setNotification({ error: true, message: backendMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const notificationClass = notification.error ? styles.Error : styles.Success;

  return (
    <div className={`${styles.SignIn} container`}>
      <div className={`${styles.Notification} ${notificationClass}`}>
        {notification.message && <p>{notification.message}</p>}
      </div>

      <div className={styles.Form}>
        <label htmlFor="email">
          <p>Adresse email</p>
          <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label htmlFor="password">
          <p>Mot de passe</p>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>

        <div className={styles.Submit}>
          <button type="button" onClick={signIn} disabled={isLoading}>
            {isLoading && <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" />}
            Se connecter
          </button>

          <span>OU</span>

          <button type="button" onClick={signUp} disabled={isLoading}>
            {isLoading && <div className="mr-2 w-5 h-5 border-l-2 rounded-full animate-spin" />}
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
