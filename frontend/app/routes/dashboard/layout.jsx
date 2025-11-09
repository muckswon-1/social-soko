import React, { useState } from "react";
import { Outlet } from "react-router";

import styles from "../../styles/dashboard/dashboard-layout.css?url";
import Sidebar from "../../components/Sidebar";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function DashboardLayout() {
  const [expanded, setExpanded] = useState(true); // true = wide sidebar, false = collapsed

  return (
    <div
      className={`dashboard-shell ${
        expanded ? "sidebar-expanded" : "sidebar-collapsed"
      }`}
    >
      {/* Sidebar region */}
      <aside className="dashboard-sidebar">
        <Sidebar expanded={expanded} setExpanded={setExpanded}  />
      </aside>

      {/* Main canvas region */}
      <section className="dashboard-main">
        <div className="dashboard-main-inner">
          {/* Child routes render here (pages can have their own horizontal menus) */}
          <Outlet />
        </div>
      </section>
    </div>
  );
}
