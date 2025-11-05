import React from 'react';
import { NavLink } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import  './sidebar.css'


const Sidebar = ({expanded, setExpanded}) => {
    const { logout } = useAuth();

    return (
        <>
            {/* Left Sidebar (toggle is here) */}
      <aside className="soko-sidebar" aria-label="Main menu">
        <div className="sb-header">
          <button
            className="sb-toggle"
            onClick={() => setExpanded(v => !v)}
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {expanded ? '<' : '>'}
          </button>
        </div>

        <nav className="sb-nav">
          <NavLink to="/dashboard/profile" className="sb-link">
            <span className="sb-ico" aria-hidden>👤</span>
            <span className="sb-label">Profile</span>
          </NavLink>

          <NavLink to="/dashboard/privacy-settings" className="sb-link">
            <span className="sb-ico" aria-hidden>🔐</span>
            <span className="sb-label">Privacy and Security</span>
          </NavLink>
          {/* add more links as you scale */}
        </nav>

        <div className="sb-footer">
          <button className="sb-link sb-logout" onClick={logout}>
            <span className="sb-ico" aria-hidden>⏻</span>
            <span className="sb-label">Logout</span>
          </button>
        </div>
      </aside>
        </>
    );
}

export default Sidebar;
