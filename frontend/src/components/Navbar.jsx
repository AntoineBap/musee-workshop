import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.scss";
import { useAuth } from "../lib/authContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const { authenticated, logout } = useAuth();
  const { navigate } = useNavigate;

  const handleLogout = () => {
    logout();
    navigate("/signin")
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-item name">
          <NavLink to="/home">Musées de France</NavLink>
        </div>
        <ul className="navbar-item">
          <li className="works">
            <NavLink to="/home" className={({ isActive }) => "button " + (isActive ? "active-link" : "")}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              Recherche
            </NavLink>

          </li>
          {authenticated ? (
            <>
              <li className="profile">
                <NavLink to="/profile" className={({ isActive }) => (isActive ? "active-link" : "")}>
                  Profil
                </NavLink>
              </li>
              <li className="signout">
                <button onClick={handleLogout}><NavLink to="/signin" className={({ isActive }) => (isActive ? "active-link" : "")}>
                  Se déconnecter
                </NavLink></button>
              </li>
            </>
          ) : (
            <li className="signin">
              <NavLink to="/signin" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Se connecter
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
