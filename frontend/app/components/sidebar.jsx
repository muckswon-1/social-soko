import React from "react";
import { NavLink } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authThunk";
import "../styles/components/sidebar.css";

export default function Sidebar({ expanded, setExpanded }) {
  const dispatch = useDispatch();

  return (
    <aside className={`sidebar ${expanded ? "expanded" : "collapsed"}`} aria-label="Main menu">
      {/* Sidebar Header / Toggle */}
      <div className="sidebar-header">
        <button
          className="sidebar-toggle"
          onClick={() => setExpanded((v) => !v)}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {expanded ? "«" : "»"}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <span className="sidebar-icon">👤</span>
          {expanded && <span className="sidebar-label">Profile</span>}
        </NavLink>

        <NavLink
          to="/dashboard/business"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <span className="sidebar-icon">🏘️</span>
          {expanded && <span className="sidebar-label">My Business</span>}
        </NavLink>

        <NavLink
          to="/dashboard/privacy-settings"
          className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
        >
          <span className="sidebar-icon">🔐</span>
          {expanded && <span className="sidebar-label">Privacy & Security</span>}
        </NavLink>
      </nav>

      {/* Footer / Logout */}
      <div className="sidebar-footer">
        <button className="sidebar-link sidebar-logout" onClick={() => dispatch(logout())}>
          <span className="sidebar-icon">⏻</span>
          {expanded && <span className="sidebar-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
