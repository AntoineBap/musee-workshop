import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFilter } from "@fortawesome/free-solid-svg-icons";
import { REGIONS, DEPARTEMENTS, DOMAINE_THEMATIQUE, MUSEES } from "../../data/museesList";
import "./SearchInput.scss";

const SearchInput = ({ onSearch }) => {
  const [museum, setMuseum] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("");
  const [thematic, setThematic] = useState("");

  const [museumSuggestions, setMuseumSuggestions] = useState([]);
  const [regionSuggestions, setRegionSuggestions] = useState([]);
  const [departmentSuggestions, setDepartmentSuggestions] = useState([]);
  const [thematicSuggestions, setThematicSuggestions] = useState([]);

  const [showFilters, setShowFilters] = useState(false);

  const wrapperRef = useRef(null);

  // perte de focus sur l'input ferme la liste
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMuseumSuggestions([]);
        setRegionSuggestions([]);
        setDepartmentSuggestions([]);
        setThematicSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // handlers des changements
  const handleMuseumChange = (value) => {
    setMuseum(value);
    if (!value) {
      setMuseumSuggestions([]);
      return;
    }
    const suggestions = MUSEES.filter(
      (m) => m && m.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 10);
    setMuseumSuggestions(suggestions);
  };

  const handleRegionChange = (value) => {
    setRegion(value);
    setRegionSuggestions(
      value ? REGIONS.filter((r) => r.toLowerCase().includes(value.toLowerCase())) : []
    );
  };

  const handleDepartmentChange = (value) => {
    setDepartment(value);
    setDepartmentSuggestions(
      value ? DEPARTEMENTS.filter((d) => d.toLowerCase().includes(value.toLowerCase())) : []
    );
  };

  const handleThematicChange = (value) => {
    setThematic(value);
    setThematicSuggestions(
      value ? DOMAINE_THEMATIQUE.filter((d) => d.toLowerCase().includes(value.toLowerCase())) : []
    );
  };

  const handleReset = () => {
    setRegion("");
    setCity("");
    setDepartment("");
    setThematic("");
    setMuseum("");
    setMuseumSuggestions([]);
    setRegionSuggestions([]);
    setDepartmentSuggestions([]);
    setThematicSuggestions([]);
    onSearch({ region: "", city: "", department: "", thematic: "", museum: "" });
  };

  // transmet les filtres au parent (`Home`)
  useEffect(() => {
    onSearch({ region, city, department, thematic, museum });
  }, [region, city, department, thematic, museum]);

  const buildMapSrc = (filters) => {
  const baseSrc = "https://data.culture.gouv.fr/explore/embed/dataset/musees-de-france-base-museofile/map/?disjunctive.region&disjunctive.departement&location=2,18.55609,-3.09761&static=false&datasetcard=false&scrollWheelZoom=false";
  const url = new URL(baseSrc);

  // Supprime les refine précédents
  Object.keys(url.searchParams)
    .filter(key => key.startsWith("refine."))
    .forEach(key => url.searchParams.delete(key));

  if (filters.region) url.searchParams.append("refine.region", filters.region);
  if (filters.department) url.searchParams.append("refine.departement", filters.department);
  if (filters.thematic && filters.thematic.length > 0) {
    filters.thematic.forEach(th => url.searchParams.append("refine.domaine_thematique", th));
  }

  return url.toString();
};

const filtersForMap = {
  region,
  department,
  thematic: thematic ? [thematic] : [],
};

const baseSrc = "https://data.culture.gouv.fr/explore/embed/dataset/musees-de-france-base-museofile/map/?disjunctive.region&disjunctive.departement&location=2,18.55609,-3.09761&static=false&datasetcard=false&scrollWheelZoom=false";
const iframeSrc = buildMapSrc(filtersForMap);


  



  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <div className="museum">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="glass-icon" />
        <input
          type="text"
          placeholder="Recherchez par nom..."
          value={museum}
          onChange={(e) => handleMuseumChange(e.target.value)}
        />
        {museumSuggestions.length > 0 && (
          <ul className="suggestions">
            {museumSuggestions.map((m, index) => (
              <li
                key={index}
                onClick={() => {
                  setMuseum(m);
                  setMuseumSuggestions([]);
                }}
              >
                {m}
              </li>
            ))}
          </ul>
        )}
        <button
          className="toggle-filters-btn"
          onClick={() => setShowFilters((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faFilter} className="filter-icon" />
          Filtres
        </button>
      </div>

      {/* Filtres */}
  
      {showFilters && (
        <div className="filters">
          <div className="filter-field">
            <label>Ville</label>
            <input
              type="text"
              placeholder="Nom de la ville..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="filter-field">
            <label>Région</label>
            <input
              type="text"
              placeholder="Toutes les régions"
              value={region}
              onChange={(e) => handleRegionChange(e.target.value)}
            />
            {regionSuggestions.length > 0 && (
              <ul className="suggestions">
                {regionSuggestions.map((r) => (
                  <li
                    key={r}
                    onClick={() => {
                      setRegion(r);
                      setRegionSuggestions([]);
                    }}
                  >
                    {r}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="filter-field">
            <label>Département</label>
            <input
              type="text"
              placeholder="Tous les départements"
              value={department}
              onChange={(e) => handleDepartmentChange(e.target.value)}
            />
            {departmentSuggestions.length > 0 && (
              <ul className="suggestions">
                {departmentSuggestions.map((d) => (
                  <li
                    key={d}
                    onClick={() => {
                      setDepartment(d);
                      setDepartmentSuggestions([]);
                    }}
                  >
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="filter-field">
            <label>Thématique</label>
            <input
              type="text"
              placeholder="Tous les domaines thématiques"
              value={thematic}
              onChange={(e) => handleThematicChange(e.target.value)}
            />
            {thematicSuggestions.length > 0 && (
              <ul className="suggestions">
                {thematicSuggestions.map((d) => (
                  <li
                    key={d}
                    onClick={() => {
                      setThematic(d);
                      setThematicSuggestions([]);
                    }}
                  >
                    {d}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Iframe dynamique
          <div className="map-preview">
            <iframe
              src={iframeSrc}
              width="800"
              height="300"
            />
          </div>  */}

          <button className="reset-filters" onClick={handleReset}>
            Réinitialiser les recherches
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchInput;

