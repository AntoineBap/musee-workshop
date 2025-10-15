import React, { useEffect, useState } from "react";
import { useAuth } from "../lib/authContext";

const Profile = () => {
    const { user, authenticated } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    if (!authenticated) return;

    const fetchFavorites = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

        try {
        const res = await fetch(`${API_URL}/api/user/favorites`, {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
        });
        const data = await res.json();
        const favoriteIds = data.favorites || [];

        const museePromises = favoriteIds.map((id) => {
            const url = `${import.meta.env.VITE_BASE_URL}?where=${encodeURIComponent(`identifiant="${id}"`)}`;
            return fetch(url)
            .then((res) => res.json())
            .then((data) => data.results[0] || { identifiant: id, nom_officiel: "Musée inconnu" });
        });

        const museeData = await Promise.all(museePromises);
        setFavorites(museeData);
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    fetchFavorites();
    }, [authenticated]);



  if (!authenticated)
    return <p>Veuillez vous connecter pour voir votre profil.</p>;
  if (loading) return <p>Chargement des favoris...</p>;

  return (
    <div>
      <h1>Mon Profil</h1>
      <h2>Mes Favoris</h2>

      {favorites.length === 0 ? (
        <p>Vous n’avez pas encore ajouté de favoris.</p>
      ) : (
        <ul>
          {favorites.map((fav) => (
            <li key={fav.identifiant || fav._id || fav.museumId}>
              {fav.nom_officiel || fav.name || "Musée inconnu"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
