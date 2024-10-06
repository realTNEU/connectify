import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";
import { CodeIcon, HamburgetMenuClose, HamburgetMenuOpen } from "./Icons";

function NavBar() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <NavLink to="/" className="nav-logo">
          <span>Connectify</span>
          <span className="icon">
            <CodeIcon />
          </span>
        </NavLink>

        <ul className={click ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "nav-links active" : "nav-links")}
              onClick={handleClick}
            >
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/room"
              className={({ isActive }) => (isActive ? "nav-links active" : "nav-links")}
              onClick={handleClick}
            >
              Room
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "nav-links active" : "nav-links")}
              onClick={handleClick}
            >
              Login
            </NavLink>
          </li>
        </ul>
        <div className="nav-icon" onClick={handleClick}>
          {click ? (
            <span className="icon">
              <HamburgetMenuOpen />{" "}
            </span>
          ) : (
            <span className="icon">
              <HamburgetMenuClose />
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
