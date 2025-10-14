import "../styles/home.scss";
import { useEffect, useState } from "react";
import SearchInput from "../components/SearchInput/SearchInput.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [musees, setMusees] = useState([]);
  const [filters, setFilters] = useState({
    region: "",
    city: "",
    department: "",
    thematic: "",
    museum: "",
  });

  const buildUrl = () => {
    const baseUrl =
      "https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/musees-de-france-base-museofile/records";

    const clauses = [];
    if (filters.region) clauses.push(`region="${filters.region}"`);
    if (filters.city) clauses.push(`ville="${filters.city}"`);
    if (filters.department) clauses.push(`departement="${filters.department}"`);
    if (filters.thematic)
      clauses.push(`domaine_thematique="${filters.thematic}"`);
    if (filters.museum) clauses.push(`nom_officiel LIKE "%${filters.museum}%"`);

    const whereClause =
      clauses.length > 0 ? `?where=${encodeURIComponent(clauses.join(" AND "))}` : "";
    return `${baseUrl}${whereClause}&limit=100`;
  };

  useEffect(() => {
    const url = buildUrl();
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.results && Array.isArray(data.results)) {
          const names = data.results.map((item) => item.nom_officiel);
          setMusees(names);
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

        {/* Composant unifié */}
        <SearchInput onSearch={setFilters} />

        {/* Liste des musées */}
        <div className="musees-list">
          {musees.length > 0 ? (
            musees.map((name) => <p key={name}>{name}</p>)
          ) : (
            <p>Aucun musée trouvé</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
