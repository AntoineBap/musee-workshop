import React, { useEffect, useState } from "react";
import { useAuth } from "../lib/authContext";
import { Link } from "react-router-dom";

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
          const url = `${import.meta.env.VITE_BASE_URL}?where=${encodeURIComponent(
            `identifiant="${id}"`
          )}`;
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

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (!authenticated) return <p>Veuillez vous connecter pour voir votre profil.</p>;
  if (loading) return <p>Chargement des favoris...</p>;

  return (
    <div className="home-container">
      <div className="searchpage">
        <div className="searchpage-titles">
          <h1>Mes Favoris</h1>
        </div>

        {favorites.length === 0 ? (
          <p>Vous n’avez pas encore ajouté de favoris.</p>
        ) : (
          <div className="musees-wrapper">
            <div className="musees-list">
              {favorites.map((musee) => (
                <Link
                  key={musee.identifiant || musee._id || musee.museumId}
                  to={`/musee/${musee.identifiant}`}
                  className="musee-link"
                >
                  <div className="musee-card">
                    <p className="card-title">{capitalizeFirstLetter(musee.nom_officiel || musee.name || "Musée inconnu")}</p>
                    {musee.domaine_thematique && musee.domaine_thematique.length > 0 && (
                      <p className="card-thematic">
                        {musee.domaine_thematique.map((t, index) => (
                          <span key={index} className="thematic-tag">
                            {t}
                          </span>
                        ))}
                      </p>
                    )}
                    <p className="card-adress">
                      {musee.adresse && <>{musee.adresse}<br/></>}
                      {musee.code_postal && <>{musee.code_postal}<br/></>}
                      {musee.ville && <>{musee.ville}<br/></>}
                      {musee.departement && <>{musee.departement}</>}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
