import React from "react";
import {
  NavLink,
  useNavigate,
} from "react-router";
import { useDispatch,} from "react-redux";
import "../../styles/components/sidebar.css";
// import { logout } from "../../features/auth/authThunk";


export default function Sidebar({handleToggle, expanded}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => console.log('Logged out')

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
      className={`sidebar ${expanded ? "expanded" : "collapsed"}`}
      aria-label="Main menu"
    >
      {/* Sidebar Header / Toggle */}
      <div className="sidebar-header">
        <button
          className="sidebar-toggle"
          onClick={handleToggle}
          aria-label={
            expanded ? "Collapse sidebar" : "Expand sidebar"
          }
        >
          {expanded ? "«" : "»"}
        </button>
      </div>

      {/* Nav Links */}
      <nav className="sidebar-nav">
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">👮🏿‍♂️</span>
          {expanded && <span className="sidebar-label">Admin</span>}
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">👭</span>
          {expanded && (
            <span className="sidebar-label">Users</span>
          )}
        </NavLink>

         <NavLink
          to="/admin/businesses"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">💰</span>
          {expanded && (
            <span className="sidebar-label">Businesses</span>
          )}
        </NavLink>


        <NavLink
          to="/admin/email-jobs"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">📧</span>
          {expanded && (
            <span className="sidebar-label">Email Jobs</span>
          )}
        </NavLink>

        
      </nav>

      {/* Footer / Logout */}
      <div className="sidebar-footer">
        <button className="sidebar-link sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-icon">⏻</span>
          {expanded && <span className="sidebar-label">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
