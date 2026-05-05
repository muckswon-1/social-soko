// src/routes/admin/index.jsx
import React from "react";
import { NavLink } from "react-router";
import adminDashboardStyles from "../../styles/dashboard/admin-dashboard.css?url";
import { useListUsersQuery } from "../../services/adminUserApi";
import { renderStatusPill } from "../components/StatusPill";
import { resolveVerificationStatus } from "../../utils/emailListHelpers";
import { useListBusinessesQuery } from "../../services/adminBusinessApi";


export function links() {
  return [{ rel: "stylesheet", href: adminDashboardStyles }];
}

export function meta() {
  return [{ title: "Admin Dashboard | Social Soko" }];
}

export default function AdminDashboard() {
  // Light “snapshot” queries – small limits for dashboard
  const {
    data: usersData,
    isLoading: isUsersLoading,
    isError: isUsersError,
  } = useListUsersQuery(
    { page: 1, limit: 5 },
    { refetchOnMountOrArgChange: true, refetchOnFocus:true, pollingInterval: 30 * 1000 }
  );

  const {
    data: businessesData,
    isLoading: isBusinessesLoading,
    isError: isBusinessesError,
  } = useListBusinessesQuery(
    { page: 1, limit: 10 },
    { refetchOnMountOrArgChange: true, refetchOnFocus:true, pollingInterval: 10 * 60 * 1000 }
  );

  const users = usersData?.items || [];
  const usersMeta = usersData?.meta || {};
  const totalUsers = usersMeta.totalItems ?? usersMeta.total ?? users.length ?? 0;

  const businesses = businessesData?.items || [];
  const businessesMeta = businessesData?.meta || {};
  const totalBusinesses =
    businessesMeta.totalItems ?? businessesMeta.total ?? businesses.length ?? 0;

  // Pending / requested verifications
  const reviewQueue = businesses.filter((b) => {
    const status = resolveVerificationStatus(b);
    return status === "requested" || status === "pending";
  });

  const totalPending = reviewQueue.length;

  // Just a placeholder – wire this to your email jobs service later
  const emailJobsQueued = 0;

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-dashboard-header">
        <div>
          <h1 className="admin-dashboard-title">Admin Overview</h1>
          <p className="admin-dashboard-subtitle">
            See key stats at a glance and jump into common admin workflows.
          </p>
        </div>

        <nav className="admin-dashboard-quick-links">
          <NavLink to="/admin/users" className="admin-quick-link">
            Users
          </NavLink>
          <NavLink to="/admin/businesses" className="admin-quick-link">
            Businesses
          </NavLink>
          <NavLink to="/admin/email-jobs" className="admin-quick-link">
            Email jobs
          </NavLink>
        </nav>
      </header>

      {/* KPI cards */}
      <section className="admin-kpi-grid">
        <article className="admin-kpi-card">
          <div className="admin-kpi-label">Total users</div>
          <div className="admin-kpi-value">
            {isUsersLoading ? "…" : totalUsers}
          </div>
          <p className="admin-kpi-caption">
            Registered accounts across the platform.
          </p>
        </article>

        <article className="admin-kpi-card">
          <div className="admin-kpi-label">Total businesses</div>
          <div className="admin-kpi-value">
            {isBusinessesLoading ? "…" : totalBusinesses}
          </div>
          <p className="admin-kpi-caption">
            Business profiles created by users.
          </p>
        </article>

        <article className="admin-kpi-card">
          <div className="admin-kpi-label">Pending verifications</div>
          <div className="admin-kpi-value">
            {isBusinessesLoading ? "…" : totalPending}
          </div>
          <p className="admin-kpi-caption">
            Businesses waiting for manual review.
          </p>
        </article>

        <article className="admin-kpi-card admin-kpi-card--muted">
          <div className="admin-kpi-label">Email jobs queued</div>
          <div className="admin-kpi-value">{emailJobsQueued}</div>
          <p className="admin-kpi-caption">
            Placeholder - wire to Email Jobs later.
          </p>
        </article>
      </section>

      {/* Main content grid: review queue + recent activity */}
      <section className="admin-main-grid">
        {/* Business verification queue */}
        <article className="admin-section-card">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Business verification queue</h2>
            <NavLink to="/admin/businesses" className="admin-section-link">
              View all businesses →
            </NavLink>
          </div>

          {isBusinessesLoading && (
            <div className="admin-section-empty">Loading businesses…</div>
          )}

          {isBusinessesError && !isBusinessesLoading && (
            <div className="admin-section-empty admin-section-empty--error">
              Failed to load businesses.
            </div>
          )}

          {!isBusinessesLoading && reviewQueue.length === 0 && (
            <div className="admin-section-empty">
              No businesses need review right now.
            </div>
          )}

          {!isBusinessesLoading && reviewQueue.length > 0 && (
            <ul className="admin-list">
              {reviewQueue.slice(0, 5).map((b) => (
                <li key={b.id} className="admin-list-item">
                  <div className="admin-list-main">
                    <div className="admin-list-title">
                      {b.name || "Untitled business"}
                    </div>
                    <div className="admin-list-subtitle">
                      {b.city || "Unknown city"},{" "}
                      {b.country || "Unknown country"}
                    </div>
                  </div>
                  <div className="admin-list-meta">
                    {renderStatusPill(b)}
                    {b.verification_requested_at && (
                      <span className="admin-list-meta-secondary">
                        Requested{" "}
                        {new Date(
                          b.verification_requested_at
                        ).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>

        {/* Recent users */}
        <article className="admin-section-card">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Recent users</h2>
            <NavLink to="/admin/users" className="admin-section-link">
              View all users →
            </NavLink>
          </div>

          {isUsersLoading && (
            <div className="admin-section-empty">Loading users…</div>
          )}

          {isUsersError && !isUsersLoading && (
            <div className="admin-section-empty admin-section-empty--error">
              Failed to load users.
            </div>
          )}

          {!isUsersLoading && users.length === 0 && (
            <div className="admin-section-empty">
              No users found yet.
            </div>
          )}

          {!isUsersLoading && users.length > 0 && (
            <ul className="admin-list">
              {users.map((u) => {
                const firstName = u.first_name || u.firstName || "";
                const lastName = u.last_name || u.lastName || "";
                const fullName =
                  (firstName || lastName) &&
                  `${firstName} ${lastName}`.trim();
                const createdAt =
                  u.created_at || u.createdAt
                    ? new Date(
                        u.created_at || u.createdAt
                      ).toLocaleDateString()
                    : "—";

                return (
                  <li key={u.id} className="admin-list-item">
                    <div className="admin-list-main">
                      <div className="admin-list-title">
                        {fullName || u.email || "Unknown user"}
                      </div>
                      <div className="admin-list-subtitle">
                        {u.email || "No email"}
                      </div>
                    </div>
                    <div className="admin-list-meta">
                      <span className="admin-list-meta-secondary">
                        Joined {createdAt}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </article>
      </section>

      {/* Lower grid – placeholders for future admin features */}
      <section className="admin-lower-grid">
        <article className="admin-section-card">
          <div className="admin-section-header">
            <h2 className="admin-section-title">System health (placeholder)</h2>
          </div>
          <p className="admin-placeholder-text">
            In the future, this area can show API latency, worker status,
            queue sizes, and error rates.
          </p>
        </article>

        <article className="admin-section-card">
          <div className="admin-section-header">
            <h2 className="admin-section-title">Recent email jobs (placeholder)</h2>
          </div>
          <p className="admin-placeholder-text">
            Hook this up to your email jobs service to see the last N jobs and
            their status (queued, sent, failed).
          </p>
        </article>
      </section>
    </div>
  );
}
