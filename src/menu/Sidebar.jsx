import React from 'react';
import { NavLink } from 'react-router';

import  './sidebar.css'
import { logout } from '../features/auth/authThunk';
import { useDispatch } from 'react-redux';


const Sidebar = ({expanded, setExpanded}) => {
    const dispatch = useDispatch();

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

           <NavLink to="/dashboard/business" className="sb-link">
            <span className="sb-ico" aria-hidden>🏘️</span>
            <span className="sb-label">My Business</span>
          </NavLink>

          

          <NavLink to="/dashboard/privacy-settings" className="sb-link">
            <span className="sb-ico" aria-hidden>🔐</span>
            <span className="sb-label">Privacy and Security</span>
          </NavLink>

          {/* add more links as you scale */}
        </nav>

        <div className="sb-footer">
          <button className="btn sb-link sb-logout" onClick={() => dispatch(logout())}>
            <span className="sb-ico" aria-hidden>⏻</span>
            <span className="sb-label">Logout</span>
          </button>
        </div>
      </aside>
        </>
    );
}

export default Sidebar;
