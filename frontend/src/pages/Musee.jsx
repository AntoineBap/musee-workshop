import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/authContext";

const Musee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, authenticated } = useAuth();

  const [musee, setMusee] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMusee = async () => {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const url = `${baseUrl}?where=${encodeURIComponent(`identifiant="${id}"`)}`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.results && data.results.length > 0) {
          const museumData = data.results[0];
          setMusee(museumData);

          // check si le musée est en favori
          if (authenticated) {
            const token = localStorage.getItem("token");
            const favRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/user/favorites`, {
              headers: { Authorization: token ? `Bearer ${token}` : "" },
            });
            const favData = await favRes.json();
            const favoriteIds = favData.favorites || [];
            setIsFavorite(favoriteIds.includes(museumData.identifiant));
          }
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error(err);
        setNotFound(true);
      }
    };

    fetchMusee();
  }, [id, authenticated]);

  const toggleFavorite = async () => {
    if (!authenticated) {
      navigate("/signin");
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/api/user/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ museumId: id }),
      });

      if (res.ok) setIsFavorite(!isFavorite);
      else console.error("Erreur lors de l’ajout aux favoris :", res.status);
    } catch (err) {
      console.error("Erreur favoris :", err);
    }
  };

  if (notFound) return <p>Musée non trouvé</p>;
  if (!musee) return <p>Chargement...</p>;

  return (
    <div className="work">
      <div className="work-container">
        <h1>{musee.nom_officiel}</h1>
        {musee.histoire && <p>{musee.histoire}</p>}
        <button
          onClick={toggleFavorite}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: isFavorite ? "#ff6b6b" : "#ddd",
            color: isFavorite ? "#fff" : "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isFavorite ? "★ Favori" : "☆ Ajouter aux favoris"}
        </button>
      </div>
    </div>
  );
};

export default Musee;
