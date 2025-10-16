import "../styles/home.scss";
import { useEffect, useState } from "react";
import SearchInput from "../components/SearchInput/SearchInput.jsx";
import { Link } from "react-router-dom";

const Home = () => {
  const [musees, setMusees] = useState([]);
  const [filters, setFilters] = useState({
    region: [],
    city: [],
    department: [],
    thematic: [],
    museum: "",
  });

  // construction dynamique de l'url
  const buildUrl = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const clauses = [];

    // Région (gère plusieurs régions)
    if (filters.region.length > 0)
      clauses.push(filters.region.map((r) => `region="${r}"`).join(" OR "));

    // Ville
    if (filters.city.length > 0)
      clauses.push(filters.city.map((c) => `ville="${c}"`).join(" OR "));

    // Département
    if (filters.department.length > 0)
      clauses.push(
        filters.department.map((d) => `departement="${d}"`).join(" OR ")
      );

    // Thématique
    if (filters.thematic.length > 0)
      clauses.push(
        filters.thematic.map((t) => `domaine_thematique="${t}"`).join(" AND ")
      );

    // Musée
    if (filters.museum) clauses.push(`nom_officiel LIKE "%${filters.museum}%"`);

    const whereClause =
      clauses.length > 0
        ? `?where=${encodeURIComponent(clauses.join(" AND "))}`
        : "?";

    const limitClause = "limit=100";
    const url = `${baseUrl}${whereClause}&${limitClause}`;

    return url;
  };

  // récupération des musées
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
            postal_code: item.code_postal,
            thematic: Array.isArray(item.domaine_thematique)
              ? item.domaine_thematique.filter((t) => t && t.trim() !== "")
              : [],

            department: item.departement,
            city: item.ville,
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

  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="home-container">
      <div className="searchpage">
        <div className="searchpage-titles">
          <h1>Rechercher un musée</h1>
          <h2>Explorer les 1222 musées de France</h2>
        </div>

        {/* Component de recherche */}
        <SearchInput filters={filters} setFilters={setFilters} />

        {/* Liste des musées */}
        <div className="musees-wrapper">
          <div className="musees-list">
            {musees.length > 0 ? (
              musees.map((musee) => (
                <Link
                  key={musee.id}
                  to={`/musee/${musee.id}`}
                  className="musee-link"
                >
                  <div className="musee-card">
                    <p className="card-title">
                      {capitalizeFirstLetter(musee.name)}
                    </p>
                    <p className="card-thematic">
                      {musee.thematic.map((t, index) => (
                        <span
                          key={index}
                          className="thematic-tag"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();

                            setFilters((prev) => {
                              const current = Array.isArray(prev.thematic)
                                ? prev.thematic
                                : [];
                              if (!current.includes(t)) {
                                return { ...prev, thematic: [...current, t] };
                              }
                              return prev;
                            });
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </p>
                    <p className="card-adress">
                      {musee.adress}
                      <br />
                      {musee.postal_code}
                      <br />
                      {musee.city}
                      <br />
                      {musee.department}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p>Aucun musée trouvé</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
