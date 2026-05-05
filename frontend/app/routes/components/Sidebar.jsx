import React from "react";
import {
  Form,
  NavLink,
  useNavigate,
} from "react-router";
import { useDispatch,} from "react-redux";
import "../../styles/components/sidebar.css";
import { logout } from "../../features/auth/authThunk";

export default function Sidebar({handleToggle, expanded}) {
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


  const handleNavClick = () => {
    if(expanded) {
      handleToggle()
    }
  }
  

  return (
    <>
     {/* Backdrop for mobile overlay */}
     {/* <div className={`sidebar-backdrop ${expanded ? "sidebar-backdrop--visible" : ""}`} onClick={handleToggle}></div> */}

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
          to="/dashboard"
          end
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">🏠</span>
          {expanded && <span className="sidebar-label">Feed</span>}
        </NavLink>


        <NavLink
          to="/dashboard/business"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">📊</span>
          {expanded && (
            <span className="sidebar-label">My Business</span>
          )}
        </NavLink> 

        
        <NavLink
          to="/dashboard/account-settings"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? "active" : ""}`
          }
        >
          <span className="sidebar-icon">🔐</span>
          {expanded && (
            <span className="sidebar-label">Account Settings</span>
          )}
        </NavLink>
      </nav>

      {/* Footer / Logout */}
      <Form method="post" action="/logout" className="sidebar-footer">
        <button type="submit" className="sidebar-link sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-icon">⏻</span>
          {expanded && <span className="sidebar-label">Logout</span>}
        </button>
      </Form>
    </aside>
    </>
  );
}
