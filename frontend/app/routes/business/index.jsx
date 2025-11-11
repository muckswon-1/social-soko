// src/routes/business/index.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { authUserSelector } from "../../features/auth/authSlice";
import { useGetBusinessQuery } from "../../services/businessApi";
import CreateBusiness from "./create-business";
import sharedFormStyles from "../../styles/forms/forms.css?url";
import businessStyles from "../../styles/business/business.css?url";
import { getInitials } from "../../utils/passwordUtils";
import BusinessEditForm from "./business-edit-form";
import { useNavigate } from "react-router";

export function links() {
  return [
    { rel: "stylesheet", href: sharedFormStyles },
    { rel: "stylesheet", href: businessStyles },
  ];
}

export function meta() {
  return [{ title: "Business | Social Soko" }];
}


export default function BusinessOverview() {
  const user = useSelector(authUserSelector);
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = useGetBusinessQuery(user?.id, {
    skip: !user?.id,
  });

  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          You need to be signed in to manage your business profile.
        </div>
      </div>
    );
  }

  // API error
  if (isError) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          We couldn&apos;t load your business details. Please try again later.
        </div>
      </div>
    );
  }

  const business = data?.business || data?.data || null;

  // No business created yet → soft empty state
  if (!business && !isLoading && !isEditing) {
    return (
      <div className="card card--cozy business-card">
        <header className="business-header">
          <div className="business-header-left">
            <div className="business-avatar">SB</div>
            <div>
              <h2 className="business-title">Create your business profile</h2>
              <p className="business-sub">
                Tell us who you are so partners can discover and trust you.
              </p>
            </div>
          </div>
          <div className="business-header-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => navigate("/dashboard/business/create-business",{replace: true})}
            >
              Create Business
            </button>
          </div>
        </header>
      </div>
    );
  }

  // Editing mode → show existing form; it already looks good
  if (isEditing || isLoading) {
    return (
      <BusinessEditForm isEditing={isEditing} setIsEditing={setIsEditing}/>
    
    );
  }

  // ---------- View mode: grouped business dashboard ----------

  const {
    name,
    slug,
    email,
    phone,
    website,
    logo_url,
    description,
    address,
    city,
    state,
    country,
    postal_code,
  } = business || {};

  const initials = getInitials(name);

  return (
    <div className="card card--cozy business-card">
      {/* Top header */}
      <header className="business-header">
        <div className="business-header-left">
          <div className="business-avatar">
            {logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo_url} alt={name || "Business logo"} />
            ) : (
              initials
            )}
          </div>
          <div>
            <h2 className="business-title">
              {name || "Your Business"}
            </h2>
            <p className="business-sub">
              Manage your public profile, contact details, and how partners
              discover you on Social Soko.
            </p>
          </div>
        </div>

        <div className="business-header-right">
          <div className="business-slug-wrap">
            <span className="business-slug-label">Public slug</span>
            <span className="business-slug-value">
              {slug || "not-set"}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-xxs"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </div>
      </header>

      {/* Groups grid */}
      <div className="business-grid">
        {/* Identity */}
        <section className="business-section">
          <h3 className="business-section-title">Profile</h3>
          <p className="business-section-text">
            A quick snapshot of who you are.
          </p>
          <dl className="business-kv">
            <div>
              <dt>Name</dt>
              <dd>{name || <span className="kv-muted">N/A</span>}</dd>
            </div>
            <div>
              <dt>Slug</dt>
              <dd>{slug || <span className="kv-muted">N/A</span>}</dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>
                {description ? (
                  description
                ) : (
                  <span className="kv-muted">Not provided</span>
                )}
              </dd>
            </div>
          </dl>
        </section>

        {/* Contact */}
        <section className="business-section">
          <h3 className="business-section-title">Contact</h3>
          <p className="business-section-text">
            How customers and partners can reach you.
          </p>
          <dl className="business-kv">
            <div>
              <dt>Email</dt>
              <dd>{email || <span className="kv-muted">N/A</span>}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>{phone || <span className="kv-muted">N/A</span>}</dd>
            </div>
          </dl>
        </section>

        {/* Online presence */}
        <section className="business-section">
          <h3 className="business-section-title">Online Presence</h3>
          <p className="business-section-text">
            Links and assets visible on your profile.
          </p>
          <dl className="business-kv">
            <div>
              <dt>Website</dt>
              <dd>
                {website ? (
                  <a
                    href={website}
                    target="_blank"
                    rel="noreferrer"
                    className="business-link"
                  >
                    {website}
                  </a>
                ) : (
                  <span className="kv-muted">Not provided</span>
                )}
              </dd>
            </div>
            <div>
              <dt>Logo URL</dt>
              <dd>
                {logo_url ? (
                  <span className="kv-mono">{logo_url}</span>
                ) : (
                  <span className="kv-muted">Not set</span>
                )}
              </dd>
            </div>
          </dl>
        </section>

        {/* Address */}
        <section className="business-section">
          <h3 className="business-section-title">Address</h3>
          <p className="business-section-text">
            Used for trust, discovery, and location-based matching.
          </p>
          <dl className="business-kv">
            <div>
              <dt>Street</dt>
              <dd>{address || <span className="kv-muted">N/A</span>}</dd>
            </div>
            <div>
              <dt>City</dt>
              <dd>{city || <span className="kv-muted">N/A</span>}</dd>
            </div>
            <div>
              <dt>State / Province</dt>
              <dd>{state || <span className="kv-muted">N/A</span>}</dd>
            </div>
            <div>
              <dt>Country</dt>
              <dd>{country || <span className="kv-muted">N/A</span>}</dd>
            </div>
            <div>
              <dt>Postal Code</dt>
              <dd>
                {postal_code || <span className="kv-muted">N/A</span>}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
