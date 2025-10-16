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
      thematic: [], // tableau par défaut
      museum: "",
    });

    // construction dynamique de l'url
    const buildUrl = () => {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const clauses = [];

      if (filters.region) clauses.push(`region="${filters.region}"`);

      if (filters.city) {
        // logique OU pour plusieurs villes
        const cities = Array.isArray(filters.city) ? filters.city : [filters.city];
        clauses.push(cities.map((c) => `ville="${c}"`).join(" OR "));
      }

      if (filters.department) clauses.push(`departement="${filters.department}"`);

      if (filters.thematic && filters.thematic.length > 0) {
        const thematiquesValides = filters.thematic.filter(t => t && t.trim() !== "");
        if (thematiquesValides.length > 0) {
          // logique ET pour thématiques
          clauses.push(
            thematiquesValides.map(t => `domaine_thematique="${t}"`).join(" AND ")
          );
        }
      }

      if (filters.museum) clauses.push(`nom_officiel LIKE "%${filters.museum}%"`);

      // construction de la clause WHERE
      const whereClause =
        clauses.length > 0
          ? `?where=${encodeURIComponent(clauses.join(" AND "))}`
          : "?"; // si aucune clause, on met quand même "?"

      // on ajoute toujours limit=100
      const limitClause = "limit=100";

      // si whereClause contient déjà ?, on ajoute &limit=100
      const url = whereClause.length > 1
        ? `${baseUrl}${whereClause}&${limitClause}`
        : `${baseUrl}?${limitClause}`;

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
                ? item.domaine_thematique.filter(t => t && t.trim() !== "")
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
          <SearchInput
            filters={filters}
            setFilters={setFilters}
          />

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

                              setFilters(prev => {
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
                        {musee.adress}<br/>
                        {musee.postal_code}<br/>
                        {musee.city}<br/>
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
