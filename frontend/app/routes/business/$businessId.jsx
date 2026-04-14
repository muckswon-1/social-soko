// src/routes/business/$businessId/index.jsx

import React, { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";

import { selectAuthUser } from "../../features/auth/authSlice";
import { useFetchMyBusinessesQuery } from "../../services/businessApi";

import "../../styles/business/business-dashboard.css";
import "../../styles/business/business.css";
import "../../styles/business/business-workspace.css";

/**
 * @typedef {import("../../types/business").Business} Business
 */

function formatLabel(value) {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function BusinessBadge({ children, tone = "neutral" }) {
  return (
    <span className={`business-workspace__badge business-workspace__badge--${tone}`}>
      {children}
    </span>
  );
}

function OverviewStatCard({ label, value, helper }) {
  return (
    <article className="card business-workspace__stat-card">
      <div className="business-workspace__stat-label">{label}</div>
      <div className="business-workspace__stat-value">{value}</div>
      {helper ? <div className="business-workspace__stat-helper">{helper}</div> : null}
    </article>
  );
}

export function meta() {
  return [{ title: "Business Dashboard | Social Soko" }];
}

export default function BusinessDashboard() {
  const navigate = useNavigate();
  const { businessId } = useParams();
  const user = useSelector(selectAuthUser);

  const userId = user?.id || null;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchMyBusinessesQuery(
    { page: 1, limit: 100 },
    {
      skip: !userId,
      refetchOnMountOrArgChange: true,
    }
  );

  const rows = Array.isArray(data?.data?.rows)
    ? data.data.rows
    : Array.isArray(data?.rows)
      ? data.rows
      : [];

  const selectedRow = useMemo(() => {
    if (!businessId) return null;

    return (
      rows.find((row) => row?.business?.id === businessId) ||
      rows.find((row) => row?.business?.slug === businessId) ||
      null
    );
  }, [rows, businessId]);

  const business = selectedRow?.business || null;
  const membershipRole = selectedRow?.membershipRole || null;
  const membershipStatus = selectedRow?.membershipStatus || null;

  const canManage = membershipRole === "owner" || membershipRole === "admin";

  if (!userId) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          You need to be signed in to view this business dashboard.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">Loading business dashboard…</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          <div className="stack-sm">
            <div>
              {error?.error || "An error occurred while loading this business."}
            </div>

            <div>
              <button type="button" className="btn btn-primary" onClick={() => refetch()}>
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          <div className="stack-sm">
            <div>
              We couldn&apos;t find that business in your memberships.
            </div>

            <div className="row-center">
              <Link to="/dashboard/business" className="btn btn-secondary">
                Back to My Businesses
              </Link>
              <Link to="/dashboard/business/request-membership" className="btn btn-primary">
                Join a Business
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="business-workspace stack-lg">
      <section className="card business-workspace__hero">
        <div className="business-workspace__hero-main">
          <div className="business-workspace__identity">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={`${business.name} logo`}
                className="business-workspace__logo"
              />
            ) : (
              <div className="business-workspace__logo business-workspace__logo--fallback">
                {business?.name?.slice(0, 1)?.toUpperCase() || "B"}
              </div>
            )}

            <div className="business-workspace__identity-copy">
              <div className="business-workspace__eyebrow">Business workspace</div>
              <h1 className="business-workspace__title">{business.name}</h1>
              <div className="business-workspace__subtitle">
                @{business.username || business.slug}
              </div>

              <div className="business-workspace__badges">
                <BusinessBadge tone="role">{formatLabel(membershipRole)}</BusinessBadge>
                <BusinessBadge tone="status">{formatLabel(membershipStatus)}</BusinessBadge>
                <BusinessBadge tone={business.verificationStatus === "verified" ? "verified" : "neutral"}>
                  {formatLabel(business.verificationStatus || "unverified")}
                </BusinessBadge>
              </div>
            </div>
          </div>

          <div className="business-workspace__hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/dashboard/posts/explore")}
            >
              Create post
            </button>

            {canManage ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(`/dashboard/business/${business.id}/settings`)}
              >
                Manage business
              </button>
            ) : null}
          </div>
        </div>

        <div className="business-workspace__hero-meta">
          <div className="business-workspace__meta-item">
            <span className="business-workspace__meta-label">Slug</span>
            <span className="business-workspace__meta-value">{business.slug || "—"}</span>
          </div>

          <div className="business-workspace__meta-item">
            <span className="business-workspace__meta-label">Created</span>
            <span className="business-workspace__meta-value">
              {formatDate(business.createdAt)}
            </span>
          </div>

          <div className="business-workspace__meta-item">
            <span className="business-workspace__meta-label">Last updated</span>
            <span className="business-workspace__meta-value">
              {formatDate(business.updatedAt)}
            </span>
          </div>

          <div className="business-workspace__meta-item">
            <span className="business-workspace__meta-label">Membership</span>
            <span className="business-workspace__meta-value">
              {formatLabel(membershipRole)} · {formatLabel(membershipStatus)}
            </span>
          </div>
        </div>
      </section>

      <section className="business-workspace__stats-grid">
        <OverviewStatCard label="Verification" value={formatLabel(business.verificationStatus || "unverified")} helper="Trust and identity status" />
        <OverviewStatCard label="Role" value={formatLabel(membershipRole)} helper="Your current access level" />
        <OverviewStatCard label="Membership" value={formatLabel(membershipStatus)} helper="Access standing in this business" />
        <OverviewStatCard label="Business Handle" value={`@${business.username || business.slug || "—"}`} helper="Public-facing identity" />
      </section>

      <div className="business-workspace__grid">
        <div className="business-workspace__main stack-md">
          <section className="card business-workspace__panel">
            <div className="card-header">
              <div>
                <h2 className="card-title">Overview</h2>
                <p className="card-subtitle">
                  Core details and next actions for this business.
                </p>
              </div>
            </div>

            <div className="business-workspace__details-grid">
              <div className="business-workspace__detail">
                <span className="business-workspace__detail-label">Name</span>
                <span className="business-workspace__detail-value">{business.name || "—"}</span>
              </div>

              <div className="business-workspace__detail">
                <span className="business-workspace__detail-label">Username</span>
                <span className="business-workspace__detail-value">{business.username || "—"}</span>
              </div>

              <div className="business-workspace__detail">
                <span className="business-workspace__detail-label">Slug</span>
                <span className="business-workspace__detail-value">{business.slug || "—"}</span>
              </div>

              <div className="business-workspace__detail">
                <span className="business-workspace__detail-label">Verification</span>
                <span className="business-workspace__detail-value">
                  {formatLabel(business.verificationStatus || "unverified")}
                </span>
              </div>
            </div>
          </section>

          <section className="card business-workspace__panel">
            <div className="card-header">
              <div>
                <h2 className="card-title">Recent activity</h2>
                <p className="card-subtitle">
                  This area will grow into posts, inquiries, and member activity.
                </p>
              </div>
            </div>

            <div className="business-workspace__timeline">
              <div className="business-workspace__timeline-item">
                <div className="business-workspace__timeline-dot" />
                <div>
                  <div className="business-workspace__timeline-title">
                    Workspace ready
                  </div>
                  <div className="business-workspace__timeline-copy">
                    This business dashboard is connected and ready for posts, members, and analytics.
                  </div>
                </div>
              </div>

              <div className="business-workspace__timeline-item">
                <div className="business-workspace__timeline-dot" />
                <div>
                  <div className="business-workspace__timeline-title">
                    Next recommended step
                  </div>
                  <div className="business-workspace__timeline-copy">
                    {canManage
                      ? "Complete your business profile and request verification if needed."
                      : "Explore the business and wait for expanded permissions if your role changes."}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="business-workspace__sidebar stack-md">
          <section className="card business-workspace__panel">
            <div className="card-header">
              <div>
                <h3 className="card-title">Quick actions</h3>
                <p className="card-subtitle">
                  Most-used actions for this business.
                </p>
              </div>
            </div>

            <div className="business-workspace__action-list">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/dashboard/posts/explore")}
              >
                Create post
              </button>

              {canManage ? (
                <>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate(`/dashboard/business/${business.id}/settings`)}
                  >
                    Edit business details
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => navigate(`/dashboard/business/${business.id}/members`)}
                  >
                    Manage members
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate("/dashboard/business")}
                >
                  View my businesses
                </button>
              )}
            </div>
          </section>

          <section className="card business-workspace__panel">
            <div className="card-header">
              <div>
                <h3 className="card-title">Workspace notes</h3>
                <p className="card-subtitle">
                  Planned modules for this business.
                </p>
              </div>
            </div>

            <ul className="business-workspace__list">
              <li>Posts and updates</li>
              <li>Membership requests</li>
              <li>Business analytics</li>
              <li>Verification workflow</li>
              <li>Trust and activity history</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}