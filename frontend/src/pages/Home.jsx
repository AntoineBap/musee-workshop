import "../styles/home.scss";
import { useEffect, useState } from "react";
import SearchInput from "../components/SearchInput/SearchInput.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  const [musees, setMusees] = useState([]);
  const [filters, setFilters] = useState({
    region: "",
    city: "",
    department: "",
    thematic: "",
    museum: "",
  });

  // construction dynamique de l'url
  const buildUrl = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;

    const clauses = [];
    if (filters.region) clauses.push(`region="${filters.region}"`);
    if (filters.city) clauses.push(`ville="${filters.city}"`);
    if (filters.department) clauses.push(`departement="${filters.department}"`);
    if (filters.thematic)
      clauses.push(`domaine_thematique="${filters.thematic}"`);
    if (filters.museum)
      clauses.push(`nom_officiel LIKE "%${filters.museum}%"`);

    const whereClause =
      clauses.length > 0 ? `?where=${encodeURIComponent(clauses.join(" AND "))}` : "";
    return `${baseUrl}${whereClause}`;
  };

  // on recupere les musées
  useEffect(() => {
    const url = buildUrl();
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.results && Array.isArray(data.results)) {

          const museesData = data.results.map((item) => ({
            id: item.identifiant,
            name: item.nom_officiel,
            adress: item.adresse,

          }));
          setMusees(museesData);
        } else {
          setMusees([]);
        }
      })
      .catch((err) => {
        console.error("Erreur lors de la récupération :", err);
        setMusees([]);
      });
  }, [filters]);

  return (
    <div className="home-container">
      <div className="searchpage">
        <div className="searchpage-titles">
          <h1>Rechercher un musée</h1>
          <h2>Explorer les 1222 musées de France</h2>
        </div>

        {/* Component de recherche importe*/}
        <SearchInput onSearch={setFilters} />

        {/* Liste des musees */}
        <div className="musees-list">
          {musees.length > 0 ? (
            musees.map((musee) => (
              <Link
                key={musee.id}
                to={`/musee/${musee.id}`}
                className="musee-link"
              > 
                
                  {musee.name},  
                {musee.adress}
              </Link>
            ))
          ) : (
            <p>Aucun musée trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
