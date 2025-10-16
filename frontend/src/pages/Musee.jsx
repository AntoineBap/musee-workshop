import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/authContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/leaflet.scss";
import L from "leaflet";
import "../styles/musee.scss";

// Icône personnalisée pour Leaflet
const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [35, 35],
  iconAnchor: [17, 35],
});

const Musee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { authenticated } = useAuth();

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

          if (authenticated) {
            const token = localStorage.getItem("token");
            const favRes = await fetch(
              `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/api/user/favorites`,
              { headers: { Authorization: token ? `Bearer ${token}` : "" } }
            );
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
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({ museumId: id }),
      });

      if (res.ok) setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Erreur favoris :", err);
    }
  };

  if (notFound) return <h1 className="musee-notfound">Musée non trouvé</h1>;
  if (!musee) return <h1 className="musee-loading">Chargement...</h1>;

  const { lat, lon } = musee.coordonnees || {};

  return (
    <div className="musee-page">
      <div className="musee-header">
        <h1>{musee.nom_officiel}</h1>
        <button className={`fav-btn ${isFavorite ? "active" : ""}`} onClick={toggleFavorite}>
          {isFavorite ? "★ Favori" : "☆ Ajouter aux favoris"}
        </button>
      </div>

      <div className="musee-content">
        {lat && lon && (
          <div className="musee-map">
            <MapContainer center={[lat, lon]} zoom={14} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lon]} icon={markerIcon}>
                <Popup>{musee.nom_officiel}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
        <div className="musee-info">
          <div className="adresse">
            {musee.adresse && <p><strong>Adresse :</strong> {musee.adresse}</p>}
            <p>
              {musee.code_postal && `${musee.code_postal}, `}
              {musee.ville && musee.ville}
            </p>
            <p>
              {musee.region && `${musee.region}, `}
              {musee.departement && musee.departement}
            </p>
          </div>

          {musee.url && (
            <p>
              🌐 <a href={`https://${musee.url}`} target="_blank" rel="noreferrer">{musee.url}</a>
            </p>
          )}
          {musee.telephone && <p>📞 {musee.telephone}</p>}

          {musee.categorie && <p><strong>Catégorie :</strong> {musee.categorie}</p>}
          {musee.domaine_thematique && (
            <p><strong>Domaines :</strong> {musee.domaine_thematique.join(", ")}</p>
          )}
          {musee.histoire && <p className="histoire"><strong>Histoire :</strong> {musee.histoire}</p>}
          {musee.atout && <p><strong>Atout :</strong> {musee.atout}</p>}
          {musee.themes && <p><strong>Thèmes :</strong> {musee.themes}</p>}
          {musee.interet && <p><strong>Intérêt :</strong> {musee.interet}</p>}
          {musee.annee_creation && <p><strong>Créé en :</strong> {musee.annee_creation}</p>}
          {musee.date_de_mise_a_jour && <p><em>Dernière mise à jour : {musee.date_de_mise_a_jour}</em></p>}
        </div>

        
      </div>
    </div>
  );
};

export default Musee;
