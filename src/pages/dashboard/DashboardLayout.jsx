import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router'; // was 'react-router'
import './dashboard-layout.css';

import Header from '../../components/Header';
import Sidebar from '../../menu/Sidebar';

const DashboardLayout = () => {
  
  const [expanded, setExpanded] = useState(true); // true = open (labels), false = collapsed (icons)

  return (
    <div className={`soko-shell ${expanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
     <Header />
     <Sidebar expanded={expanded} setExpanded={setExpanded} />
   
      {/* Page content */}
      <main className="soko-canvas">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
