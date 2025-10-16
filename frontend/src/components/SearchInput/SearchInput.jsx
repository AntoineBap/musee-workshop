import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFilter } from "@fortawesome/free-solid-svg-icons";
import {
  REGIONS,
  DEPARTEMENTS,
  DOMAINE_THEMATIQUE,
  MUSEES,
} from "../../data/museesList";
import "./SearchInput.scss";

const SearchInput = ({ filters, setFilters }) => {
  const [museum, setMuseum] = useState(filters.museum || "");
  const [regionInput, setRegionInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [departmentInput, setDepartmentInput] = useState("");
  const [thematicInput, setThematicInput] = useState("");

  const [museumSuggestions, setMuseumSuggestions] = useState([]);
  const [regionSuggestions, setRegionSuggestions] = useState([]);
  const [departmentSuggestions, setDepartmentSuggestions] = useState([]);
  const [thematicSuggestions, setThematicSuggestions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const wrapperRef = useRef(null);

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

  const handleMuseumChange = (value) => {
    setMuseum(value);
    setMuseumSuggestions(
      value
        ? MUSEES.filter((m) =>
            m.toLowerCase().includes(value.toLowerCase())
          ).slice(0, 10)
        : []
    );
    setFilters((prev) => ({ ...prev, museum: value }));
  };

  const handleRegionChange = (value) => {
    setRegionInput(value);
    setRegionSuggestions(
      value
        ? REGIONS.filter((r) => r.toLowerCase().includes(value.toLowerCase()))
        : []
    );
  };

  const handleDepartmentChange = (value) => {
    setDepartmentInput(value);
    setDepartmentSuggestions(
      value
        ? DEPARTEMENTS.filter((d) =>
            d.toLowerCase().includes(value.toLowerCase())
          )
        : []
    );
  };

  const handleThematicChange = (value) => {
    setThematicInput(value);
    setThematicSuggestions(
      value
        ? DOMAINE_THEMATIQUE.filter((t) =>
            t.toLowerCase().includes(value.toLowerCase())
          )
        : []
    );
  };

  const addFilter = (value, selectedArrayName) => {
    if (!value) return;
    setFilters((prev) => {
      const current = Array.isArray(prev[selectedArrayName])
        ? prev[selectedArrayName]
        : [];
      if (!current.includes(value)) {
        return { ...prev, [selectedArrayName]: [...current, value] };
      }
      return prev;
    });

    if (selectedArrayName === "thematic") setThematicInput([]);
    if (selectedArrayName === "city") setCityInput("");
    if (selectedArrayName === "region") setRegionInput("");
    if (selectedArrayName === "department") setDepartmentInput("");
  };


  const removeFilter = (value, selectedArrayName) => {
    setFilters((prev) => {
      const current = Array.isArray(prev[selectedArrayName])
        ? prev[selectedArrayName]
        : [];
      return {
        ...prev,
        [selectedArrayName]: current.filter((v) => v !== value),
      };
    });
  };

  const handleReset = () => {
    setFilters({
      region: "",
      city: "",
      department: "",
      thematic: [],
      museum: "",
    });
    setMuseum("");
    setRegionInput("");
    setCityInput("");
    setDepartmentInput("");
    setThematicInput("");
  };

  return (
    <div className="search-wrapper" ref={wrapperRef}>
      <div className="museum">

        {/* input musees */}
        <FontAwesomeIcon icon={faMagnifyingGlass} className="glass-icon" />
        <input
          type="text"
          placeholder="Recherchez par nom..."
          value={museum}
          onChange={(e) => handleMuseumChange(e.target.value)}
          onBlur={() => setTimeout(() => setMuseumSuggestions([]), 100)}
        />

        {museumSuggestions.length > 0 && (
          <ul className="suggestions">
            {museumSuggestions.map((m) => (
              <li key={m} onClick={() => handleMuseumChange(m)}>
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

      {showFilters && (
        <div className="filters">
          {/* Ville */}
          <div className="filter-field">
            <label>Ville</label>
            <input
              type="text"
              placeholder="Nom de la ville..."
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && addFilter(cityInput, "city")
              }
            />
            <div className="chips-container">
              {Array.isArray(filters.city) &&
                filters.city.map((c) => (
                  <div key={c} className="filter-chip">
                    {c}
                    <span onClick={() => removeFilter(c, "city")}>×</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Région */}
          <div className="filter-field">
            <label>Région</label>
            <input
              type="text"
              placeholder="Toutes les régions"
              value={regionInput}
              onChange={(e) => handleRegionChange(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && addFilter(regionInput, "region")
              }
              onBlur={() => setTimeout(() => setRegionSuggestions([]), 100)}
            />

            {regionSuggestions.length > 0 && (
              <ul className="suggestions">
                {regionSuggestions.map((r) => (
                  <li key={r} onClick={() => addFilter(r, "region")}>
                    {r}
                  </li>
                ))}
              </ul>
            )}
            <div className="chips-container">
              {Array.isArray(filters.region) &&
                filters.region.map((r) => (
                  <div key={r} className="filter-chip">
                    {r}
                    <span onClick={() => removeFilter(r, "region")}>×</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Département */}
          <div className="filter-field">
            <label>Département</label>
            <input
              type="text"
              placeholder="Tous les départements"
              value={departmentInput}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && addFilter(departmentInput, "department")
              }
              onBlur={() => setTimeout(() => setDepartmentSuggestions([]), 100)} 
            />

            {departmentSuggestions.length > 0 && (
              <ul className="suggestions">
                {departmentSuggestions.map((d) => (
                  <li key={d} onClick={() => addFilter(d, "department")}>
                    {d}
                  </li>
                ))}
              </ul>
            )}
            <div className="chips-container">
              {Array.isArray(filters.department) &&
                filters.department.map((d) => (
                  <div key={d} className="filter-chip">
                    {d}
                    <span onClick={() => removeFilter(d, "department")}>×</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Thématique */}
          <div className="filter-field">
            <label>Thématique</label>
            <input
              type="text"
              placeholder="Tous les domaines thématiques"
              value={thematicInput}
              onChange={(e) => handleThematicChange(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && addFilter(thematicInput, "thematic")
              }
              onBlur={() => setTimeout(() => setThematicSuggestions([]), 100)}
            />

            {thematicSuggestions.length > 0 && (
              <ul className="suggestions">
                {thematicSuggestions.map((t) => (
                  <li key={t} onClick={() => addFilter(t, "thematic")}>
                    {t}
                  </li>
                ))}
              </ul>
            )}
            <div className="chips-container">
              {Array.isArray(filters.thematic) &&
                filters.thematic.map((t) => (
                  <div key={t} className="filter-chip">
                    {t}
                    <span onClick={() => removeFilter(t, "thematic")}>×</span>
                  </div>
                ))}
            </div>
          </div>

          <button className="reset-filters" onClick={handleReset}>
            Réinitialiser les recherches
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
