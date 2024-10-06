import React, { useState } from "react";
import './Navbar.css'; 

const Navbar = () => {
  const [openNav, setOpenNav] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="#" className="navbar-brand">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="navbar-logo"
            alt="Flowbite Logo"
          />
          <span className="navbar-title">Flowbite</span>
        </a>
        <button
          type="button"
          className="navbar-toggler"
          onClick={() => setOpenNav(!openNav)}
          aria-controls="navbar-default"
          aria-expanded={openNav}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="navbar-icon"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div className={`navbar-menu ${openNav ? "active" : ""}`} id="navbar-default">
          <ul className="navbar-list">
            <li>
              <a
                href="#"
                className="navbar-link active"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="navbar-link"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="navbar-link"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="navbar-link"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="navbar-link"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
