import React from "react";
import { NavLink, useLocation } from "react-router";
import "../../styles/components/left-rail.css";

function getLinkClassName(isActive) {
  return ["left-rail__link", isActive ? "left-rail__link--active" : ""]
    .filter(Boolean)
    .join(" ");
}

const LeftRail = () => {
  const { pathname } = useLocation();
  const isBusinessActive =
    pathname === "/business" ||
    pathname.startsWith("/business/") ||
    pathname === "/business-memberships" ||
    pathname.startsWith("/business-memberships/");

  return (
    <nav className="left-rail" aria-label="Primary navigation">
      <div className="left-rail__section">
        <div className="left-rail__title">Main</div>
        <NavLink
          to="/"
          end
          className={({ isActive }) => getLinkClassName(isActive)}
        >
          Home
        </NavLink>
      </div>

      <div className="left-rail__section">
        <NavLink
          to="/business"
          className={() => getLinkClassName(isBusinessActive)}
        >
          Business
        </NavLink>
      </div>
    </nav>
  );
};

export default LeftRail;
