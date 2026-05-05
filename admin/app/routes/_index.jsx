import React from "react";
// adjust this path to where you place the css file
import stylesHref from "../styles/admin-home.css?url";
import { requireAuthenticatedAmin } from "../utils/auth.server";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: stylesHref,
    },
  ];
}

export function meta() {
  return [{ title: "Social Soko Admin | Home" }];
}

export  async function loader({request}) {
  const user = await requireAuthenticatedAmin(request);

  return Response.json({user})

}

const AdminHome = () => {
  return (
    <div className="admin-home">
      {/* Header / Hero */}
      <header className="admin-home__header">
        <div className="admin-home__header-main">
          <div className="admin-home__badge">Admin Portal</div>
          <h1 className="admin-home__title">Welcome to Social Soko Admin</h1>
          <p className="admin-home__subtitle">
            Your central hub for managing users, businesses, and platform
            operations.
          </p>
        </div>

        <div className="admin-home__header-meta">
          <span className="admin-home__env">Environment: Development</span>
          <span className="admin-home__version">Build v0.1.0</span>
        </div>
      </header>

      {/* Primary navigation tiles */}
      <section className="admin-home__primary">
        <div className="card admin-home__primary-card">
          <h2 className="admin-home__primary-title">Admin Overview</h2>
          <p className="admin-home__primary-text">
            View high-level metrics, queues, and system activity across the
            platform.
          </p>
          <a href="/admin" className="admin-home__primary-link">
            Go to overview
          </a>
        </div>

        <div className="card admin-home__primary-card">
          <h2 className="admin-home__primary-title">Manage Users</h2>
          <p className="admin-home__primary-text">
            Search, inspect, and manage user accounts and access levels.
          </p>
          <a href="/admin/users" className="admin-home__primary-link">
            Go to users
          </a>
        </div>

        <div className="card admin-home__primary-card">
          <h2 className="admin-home__primary-title">Manage Businesses</h2>
          <p className="admin-home__primary-text">
            Review profiles, update details, and handle business verification.
          </p>
          <a href="/admin/businesses" className="admin-home__primary-link">
            Go to businesses
          </a>
        </div>
      </section>

      {/* Lower grid: recent activity + status */}
      <section className="admin-home__lower">
        <div className="card admin-home__recent-card">
          <div className="admin-home__section-header">
            <h2 className="admin-home__section-title">Recent Activity</h2>
            <span className="admin-home__section-hint">
              Placeholder — wire to real data later
            </span>
          </div>

          <ul className="admin-home__recent-list">
            <li className="admin-home__recent-item">
              <span className="admin-home__recent-label">Last viewed user</span>
              <span className="admin-home__recent-value">
                No recent users yet
              </span>
            </li>
            <li className="admin-home__recent-item">
              <span className="admin-home__recent-label">
                Last viewed business
              </span>
              <span className="admin-home__recent-value">
                No recent businesses yet
              </span>
            </li>
            <li className="admin-home__recent-item">
              <span className="admin-home__recent-label">
                Last admin section
              </span>
              <span className="admin-home__recent-value">
                This will update as you navigate
              </span>
            </li>
          </ul>
        </div>

        <div className="card admin-home__status-card">
          <div className="admin-home__section-header">
            <h2 className="admin-home__section-title">System Status</h2>
            <span className="admin-home__section-hint">
              Informational only (static for now)
            </span>
          </div>

          <ul className="admin-home__status-list">
            <li className="admin-home__status-item">
              <span className="admin-home__status-label">API Server</span>
              <span className="admin-home__status-pill admin-home__status-pill--ok">
                Online
              </span>
            </li>
            <li className="admin-home__status-item">
              <span className="admin-home__status-label">Email Worker</span>
              <span className="admin-home__status-pill admin-home__status-pill--ok">
                Running
              </span>
            </li>
            <li className="admin-home__status-item">
              <span className="admin-home__status-label">
                Background Jobs
              </span>
              <span className="admin-home__status-pill admin-home__status-pill--ok">
                Healthy
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Helpful links / docs */}
      <section className="admin-home__footer">
        <div className="card admin-home__links-card">
          <h2 className="admin-home__section-title">Helpful Links</h2>
          <p className="admin-home__links-text">
            Keep everything about Social Soko operations in one place.
          </p>
          <ul className="admin-home__links-list">
            <li>Internal admin guide (Notion / Docs)</li>
            <li>API documentation</li>
            <li>Contact developer / support</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AdminHome;
