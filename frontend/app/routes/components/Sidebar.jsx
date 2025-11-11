import React from "react";
import {
  NavLink,
  useFetcher,
  useNavigate,
  useRouteLoaderData,
} from "react-router";
import { useDispatch,} from "react-redux";
import "../../styles/components/sidebar.css";
import { logout } from "../../features/auth/authThunk";


export default function Sidebar({handleToggle, isCollapsed}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
   try {
      await dispatch(logout()).unwrap();
      navigate("/login", {replace: true})
   } catch (error) {
    console.error("Error loggin out: ", error)
   }
  };
  

  return (
    <aside
      className={`sidebar ${!isCollapsed ? "expanded" : "collapsed"}`}
      aria-label="Main menu"
    >
      {/* Sidebar Header / Toggle */}
      <div className="sidebar-header">
        <button
          className="sidebar-toggle"
          onClick={handleToggle}
          aria-label={
            !isCollapsed ? "Collapse sidebar" : "Expand sidebar"
          }
        >
          {!isCollapsed ? "«" : "»"}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="sidebar-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">🏠</span>
          {!isCollapsed && <span className="sidebar-label">Home</span>}
        </NavLink>

        <NavLink
          to="/dashboard/business"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">🏘️</span>
          {!isCollapsed && (
            <span className="sidebar-label">My Business</span>
          )}
        </NavLink>

             <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">👤</span>
          {!isCollapsed && <span className="sidebar-label">Profile</span>}
        </NavLink>



        <NavLink
          to="/dashboard/privacy"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">🔐</span>
          {!isCollapsed && (
            <span className="sidebar-label">Privacy & Security</span>
          )}
        </NavLink>
      </nav>

      {/* Footer / Logout */}
      <div className="sidebar-footer">
        <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-icon">⏻</span>
          {!isCollapsed && <span className="sidebar-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
