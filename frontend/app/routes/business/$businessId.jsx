// src/routes/business/$businessId/index.jsx

import React, { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";

import { selectAuthUser } from "../../features/auth/authSlice";
import { useFetchMyBusinessesQuery } from "../../services/businessApi";

import "../../styles/business/business.css";
import "../../styles/business/business-workspace.css";

/**
 * @typedef {import("../../types/business").Business} Business
 */

function formatLabel(value) {
  if (!value) return "Unknown";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
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

function getVerificationTone(status) {
  if (status === "verified") return "verified";
  if (status === "requested") return "requested";
  if (status === "rejected") return "danger";
  if (status === "pending") return "warning";
  return "neutral";
}

function BusinessBadge({ children, tone = "neutral" }) {
  return (
    <span className={`business-workspace__badge business-workspace__badge--${tone}`}>
      {children}
    </span>
  );
}

function InlineActionButton({ children, onClick, variant = "ghost", disabled = false }) {
  return (
    <button
      type="button"
      className={`business-workspace__inline-action business-workspace__inline-action--${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function WorkspaceCard({ eyebrow, title, copy, action, tone = "neutral" }) {
  return (
    <article className={`business-workspace__mini-card business-workspace__mini-card--${tone}`}>
      <div className="business-workspace__mini-card-top">
        <span className="business-workspace__mini-card-eyebrow">{eyebrow}</span>
        {action}
      </div>

      <h3 className="business-workspace__mini-card-title">{title}</h3>

      {copy ? (
        <p className="business-workspace__mini-card-copy">{copy}</p>
      ) : null}
    </article>
  );
}

function ReadinessItem({ label, complete, helper }) {
  return (
    <div className="business-workspace__readiness-item">
      <span
        className={
          complete
            ? "business-workspace__readiness-dot business-workspace__readiness-dot--complete"
            : "business-workspace__readiness-dot"
        }
      />

      <div>
        <div className="business-workspace__readiness-label">{label}</div>
        {helper ? (
          <div className="business-workspace__readiness-helper">{helper}</div>
        ) : null}
      </div>
    </div>
  );
}

export function meta() {
  return [{ title: "Business Overview | Social Soko" }];
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
  const isOwner = membershipRole === "owner";

  const hasLogo = Boolean(business?.logoUrl);
  const hasDescription = Boolean(business?.description);
  const hasWebsite = Boolean(business?.website);
  const hasContact = Boolean(business?.email || business?.phoneNumber);
  const hasLocation = Boolean(business?.city || business?.state || business?.country);

  const readinessItems = [
    { label: "Logo", complete: hasLogo, helper: hasLogo ? "Logo added" : "Add a logo for trust" },
    {
      label: "Description",
      complete: hasDescription,
      helper: hasDescription ? "Business story added" : "Add a short business description",
    },
    {
      label: "Contact",
      complete: hasContact,
      helper: hasContact ? "Contact information available" : "Add email or phone",
    },
    {
      label: "Location",
      complete: hasLocation,
      helper: hasLocation ? "Location information available" : "Add business location",
    },
  ];

  const completedReadiness = readinessItems.filter((item) => item.complete).length;
  const readinessPercent = Math.round((completedReadiness / readinessItems.length) * 100);

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
        <div className="layout-empty__inner">Loading business overview…</div>
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
            <div>We couldn&apos;t find that business in your memberships.</div>

            <div className="row-center">
              <Link to="/business" className="btn btn-secondary">
                Back to My Businesses
              </Link>

              <Link to="/business/join" className="btn btn-primary">
                Join a Business
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const verificationStatus = business.verificationStatus || "unverified";
  const verificationTone = getVerificationTone(verificationStatus);

  return (
    <div className="business-workspace">
      <section className="business-workspace__hero business-workspace__hero--overview">
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
              <div className="business-workspace__eyebrow">Business overview</div>

              <h1 className="business-workspace__title">{business.name}</h1>

              <div className="business-workspace__subtitle">
                @{business.username || business.slug}
              </div>

              <div className="business-workspace__badges">
                <BusinessBadge tone="role">{formatLabel(membershipRole)}</BusinessBadge>
                <BusinessBadge tone="status">{formatLabel(membershipStatus)}</BusinessBadge>
                <BusinessBadge tone={verificationTone}>
                  {formatLabel(verificationStatus)}
                </BusinessBadge>
              </div>
            </div>
          </div>

          <div className="business-workspace__hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate("/posts/new-post")}
            >
              Create post
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/business/${business.id}/profile`)}
            >
              View profile
            </button>
          </div>
        </div>

        <div className="business-workspace__hero-footer">
          <div className="business-workspace__hero-footer-item">
            <span>Created</span>
            <strong>{formatDate(business.createdAt)}</strong>
          </div>

          <div className="business-workspace__hero-footer-item">
            <span>Updated</span>
            <strong>{formatDate(business.updatedAt)}</strong>
          </div>

          <div className="business-workspace__hero-footer-item">
            <span>Access</span>
            <strong>{formatLabel(membershipRole)} · {formatLabel(membershipStatus)}</strong>
          </div>

          <div className="business-workspace__hero-footer-item business-workspace__hero-footer-item--wide">
            <span>Business identity</span>
            <strong>@{business.username || business.slug || "—"}</strong>
          </div>
        </div>
      </section>

      <div className="business-workspace__overview-grid">
        <main className="business-workspace__overview-main">
          <section className="business-workspace__section-header">
            <div>
              <p className="business-workspace__section-kicker">Workspace health</p>
              <h2 className="business-workspace__section-title">Next best actions</h2>
            </div>

            {canManage ? (
              <InlineActionButton
                variant="primary"
                onClick={() => navigate(`/business/${business.id}/profile`)}
              >
                Edit profile
              </InlineActionButton>
            ) : null}
          </section>

          <div className="business-workspace__mini-grid">
            <WorkspaceCard
              eyebrow="Profile readiness"
              title={`${readinessPercent}% complete`}
              copy={
                readinessPercent === 100
                  ? "Your business profile has the key public trust fields."
                  : "Complete your profile so buyers and sellers trust the business faster."
              }
              tone={readinessPercent === 100 ? "success" : "warning"}
              action={
                canManage ? (
                  <InlineActionButton
                    onClick={() => navigate(`/business/${business.id}/profile`)}
                  >
                    Improve
                  </InlineActionButton>
                ) : null
              }
            />

            <WorkspaceCard
              eyebrow="Verification"
              title={formatLabel(verificationStatus)}
              copy={
                verificationStatus === "verified"
                  ? "This business has passed verification."
                  : canManage
                    ? "Verification helps increase trust across the marketplace."
                    : "Verification status is managed by the business admins."
              }
              tone={verificationTone}
              action={
                canManage ? (
                  <InlineActionButton
                    onClick={() => navigate(`/business/${business.id}/profile`)}
                  >
                    Review
                  </InlineActionButton>
                ) : null
              }
            />

            <WorkspaceCard
              eyebrow="Members"
              title={canManage ? "Manage access" : "Member access"}
              copy={
                canManage
                  ? "Review members, roles, and pending membership requests."
                  : "Your current business access is controlled by admins and owners."
              }
              tone="neutral"
              action={
                canManage ? (
                  <InlineActionButton
                    onClick={() => navigate(`/business-memberships/${business.id}`)}
                  >
                    Open
                  </InlineActionButton>
                ) : null
              }
            />

            <WorkspaceCard
              eyebrow="Posting"
              title="Share an update"
              copy="Create business posts, updates, product news, and marketplace activity."
              tone="info"
              action={
                <InlineActionButton
                  variant="primary"
                  onClick={() => navigate("/posts/new-post")}
                >
                  Post
                </InlineActionButton>
              }
            />
          </div>

          <section className="card business-workspace__panel business-workspace__readiness-panel">
            <div className="business-workspace__section-header business-workspace__section-header--inside">
              <div>
                <p className="business-workspace__section-kicker">Profile checklist</p>
                <h2 className="business-workspace__section-title">
                  Build a trusted business profile
                </h2>
              </div>

              {canManage ? (
                <InlineActionButton
                  onClick={() => navigate(`/business/${business.id}/profile`)}
                >
                  Edit fields
                </InlineActionButton>
              ) : null}
            </div>

            <div className="business-workspace__readiness">
              <div className="business-workspace__readiness-meter">
                <div className="business-workspace__readiness-meter-top">
                  <span>Completion</span>
                  <strong>{readinessPercent}%</strong>
                </div>

                <div className="business-workspace__progress">
                  <span style={{ width: `${readinessPercent}%` }} />
                </div>
              </div>

              <div className="business-workspace__readiness-list">
                {readinessItems.map((item) => (
                  <ReadinessItem
                    key={item.label}
                    label={item.label}
                    complete={item.complete}
                    helper={item.helper}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="card business-workspace__panel">
            <div className="business-workspace__section-header business-workspace__section-header--inside">
              <div>
                <p className="business-workspace__section-kicker">Recent activity</p>
                <h2 className="business-workspace__section-title">Workspace timeline</h2>
              </div>
            </div>

            <div className="business-workspace__timeline">
              <div className="business-workspace__timeline-item">
                <div className="business-workspace__timeline-dot" />
                <div>
                  <div className="business-workspace__timeline-title">
                    Workspace is ready
                  </div>
                  <div className="business-workspace__timeline-copy">
                    This business dashboard is connected and ready for posts, members, verification, and analytics.
                  </div>
                </div>
              </div>

              <div className="business-workspace__timeline-item">
                <div className="business-workspace__timeline-dot" />
                <div>
                  <div className="business-workspace__timeline-title">
                    Recommended next step
                  </div>
                  <div className="business-workspace__timeline-copy">
                    {canManage
                      ? "Finish the profile, confirm contact information, then start posting business updates."
                      : "Use this space to follow business updates and activity available to your role."}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <aside className="business-workspace__overview-sidebar">
          <section className="card business-workspace__panel business-workspace__quick-panel">
            <div>
              <p className="business-workspace__section-kicker">Actions</p>
              <h2 className="business-workspace__section-title">Quick controls</h2>
              <p className="business-workspace__section-copy">
                Actions are filtered by your role in this business.
              </p>
            </div>

            <div className="business-workspace__action-stack">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/posts/new-post")}
              >
                Create post
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate(`/business/${business.id}/profile`)}
              >
                View profile
              </button>

              {canManage ? (
                <>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => navigate(`/business/${business.id}/profile?mode=edit`)}
                  >
                    Edit business profile
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => navigate(`/business-memberships/${business.id}`)}
                  >
                    Manage members
                  </button>
                </>
              ) : null}

              {isOwner ? (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => navigate(`/business/${business.id}/settings`)}
                >
                  Owner settings
                </button>
              ) : null}
            </div>
          </section>

          <section className="card business-workspace__panel business-workspace__access-panel">
            <div>
              <p className="business-workspace__section-kicker">Access</p>
              <h2 className="business-workspace__section-title">Your permissions</h2>
            </div>

            <div className="business-workspace__permission-list">
              <div className="business-workspace__permission-row">
                <span>Current role</span>
                <strong>{formatLabel(membershipRole)}</strong>
              </div>

              <div className="business-workspace__permission-row">
                <span>Status</span>
                <strong>{formatLabel(membershipStatus)}</strong>
              </div>

              <div className="business-workspace__permission-row">
                <span>Can edit profile</span>
                <strong>{canManage ? "Yes" : "No"}</strong>
              </div>

              <div className="business-workspace__permission-row">
                <span>Can manage members</span>
                <strong>{canManage ? "Yes" : "No"}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}