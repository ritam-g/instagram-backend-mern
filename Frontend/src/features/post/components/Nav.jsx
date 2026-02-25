import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./nav.scss";

function Nav() {
  const location = useLocation();

  return (
    <nav className="nav">
      <div className="nav__wrapper">

        <div className="nav__left">
          <Link to="/" className="nav__logo">
            InstaClone
          </Link>
        </div>

        <div className="nav__right">
          <Link
            to="/feed-page"
            className={`nav__link ${
              location.pathname === "/feed-page" ? "active" : ""
            }`}
          >
            Home
          </Link>

          <Link
            to="/createpost"
            className={`nav__link ${
              location.pathname === "/create-post" ? "active" : ""
            }`}
          >
            Create
          </Link>
          <Link
            to="/"
            className={`nav__link `}
          >
            Login
          </Link>

          <div className="nav__avatar">
            <img
              src="https://i.pravatar.cc/100"
              alt="user"
            />
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Nav;