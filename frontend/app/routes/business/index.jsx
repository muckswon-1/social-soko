// src/routes/business/index.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { authUserSelector } from "../../features/auth/authSlice";
import {
  useGetBusinessQuery,
  useRequestBusinessVerificationMutation,
} from "../../services/businessApi";
import sharedFormStyles from "../../styles/forms/forms.css?url";
import businessStyles from "../../styles/business/business.css?url";
import logoUploadStyles from "../../styles/business/logo-upload.css?url";
import { getInitials } from "../../utils/passwordUtils";
import BusinessEditForm from "./business-edit-form";
import { useNavigate } from "react-router";
import {
  canRequestBusinessVerification,
  getStatusDescription,
  getStatusLabel,
  getStatusPillClass,
} from "../../utils/businessHelpers";
import { ImageUp } from "lucide-react";

import BusinessLogoUpload from "./BusinessLogoUpload";


const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

export function links() {
  return [
    { rel: "stylesheet", href: sharedFormStyles },
    { rel: "stylesheet", href: businessStyles },
    { rel: "stylesheet", href: logoUploadStyles },
  ];
}

export function meta() {
  return [{ title: "Business | Social Soko" }];
}

export default function BusinessOverview() {
  const user = useSelector(authUserSelector);
  const userId = user?.id || null;
  const navigate = useNavigate();

  const { data, isLoading, isError, error, refetch } = useGetBusinessQuery(userId, {
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showLogoEditor, setShowLogoEditor] = useState(false);

  const [
    requestVerification,
    {
      isLoading: isRequesting,
      isError: isRequestError,
      error: requestError,
      isSuccess: isRequestSuccess,
    },
  ] = useRequestBusinessVerificationMutation();

  if (!user) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          You need to be signed in to manage your business profile.
        </div>
      </div>
    );
  }

  const business = data?.business || data?.data || null;

  // No business created yet → soft empty state
  if (error?.status === 403 && !business && !isLoading && !isEditing) {
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
              onClick={() =>
                navigate("/dashboard/business/create-business", {
                  replace: true,
                })
              }
            >
              Create Business
            </button>
          </div>
        </header>
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

  // Editing mode → show existing form
  if (isEditing || isLoading) {
    return <BusinessEditForm setIsEditing={setIsEditing} />;
  }

  // ---------- View mode: grouped business dashboard ----------

  const {
    id: businessId,
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
    verification_status,
    verification_rejected_at,
  } = business || {};

  const initials = getInitials(name);

  const verificationStatus = verification_status || "pending";

  const { canRequest, daysRemaining } = canRequestBusinessVerification({
    status: verificationStatus.toString().trim(),
    rejectedAt: verification_rejected_at,
    isLoading: isRequesting,
    cooldownDays: 0.000_694_444,
  });

  const handleRequestVerification = async () => {
    if (!businessId) return;

    try {
      await requestVerification({ id: businessId, userId: user.id }).unwrap();
    } catch (e) {
      console.error("Failed to request verification", e);
    }
  };

const showLogoMissingBanner = !logo_url && !showLogoEditor;

  
const normalizedLogoUrl = `${BACKEND_URL}${logo_url}`;

  return (
    <div className="card card--cozy business-card">
      {/* Top header */}
      <header className="business-header">
        <div className="business-header-left">
          <div className="business-avatar-wrap">
            <div className="business-avatar">
              {logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={normalizedLogoUrl} alt={name || "Business logo"} />
              ) : (
                initials
              )}
            </div>
            
            {logo_url && (
              <button
                type="button"
                className="business-avatar-change"
                onClick={() => setShowLogoEditor(true)}
              >
                Change logo
              </button>
            )}
          </div>
          <div>
            <h2 className="business-title">{name || "Your Business"}</h2>
            <p className="business-sub">
              Manage your public profile, contact details, and how partners
              discover you on Social Soko.
            </p>
          </div>
        </div>

        <div className="business-header-right">
          <div className="business-slug-wrap">
            <span className="business-slug-label">Public slug</span>
            <span className="business-slug-value">{slug || "not-set"}</span>
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

      {/* Logo reminder banner when missing */}
      {showLogoMissingBanner && (
        <section className="business-logo-banner">
          <div className="business-logo-banner__icon">
            <ImageUp
              className="business-logo-banner__icon-svg"
              aria-hidden="true"
            />
          </div>
          <div className="business-logo-banner__content">
            <div className="business-logo-banner__title">Add your logo</div>
            <p className="business-logo-banner__text">
              A clear logo helps buyers and partners recognize your brand at a
              glance. Upload one now or update it anytime.
            </p>
          </div>
          <div className="business-logo-banner__actions">
            <button
              type="button"
              className="btn btn-xxs"
              onClick={() => setShowLogoEditor(true)}
            >
              Upload logo
            </button>
          </div>
        </section>
      )}

      {/* Inline logo upload / replace editor */}
      {showLogoEditor && businessId && (
        <section className="business-logo-editor">

         <BusinessLogoUpload 
         businessId={businessId} 
         onSkip={() => setShowLogoEditor(false)}

         onDone={() => {
          setShowLogoEditor(false)
          refetch();
         }}
         />
        </section>
      )}

      {/* Verification status bar */}
      <section className="business-verification-bar">
        <div className="business-verification-main">
          <span className={getStatusPillClass(verificationStatus)}>
            {getStatusLabel(verificationStatus)}
          </span>
          <p className="business-verification-text">
            {getStatusDescription(verificationStatus)}
          </p>

          {verificationStatus === "rejected" &&
            daysRemaining != null &&
            daysRemaining > 0 && (
              <p className="business-verification-note">
                You'll be able to request verification again in{" "}
                <strong>
                  {daysRemaining} day{daysRemaining > 1 ? "s" : ""}
                </strong>
                .
              </p>
            )}
        </div>

        <div className="business-verification-actions">
          {canRequest && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleRequestVerification}
              disabled={isRequesting}
            >
              {isRequesting ? "Requesting…" : "Request verification"}
            </button>
          )}

          {!canRequest &&
            (verificationStatus === "verified" ||
              verificationStatus === "requested") && (
              <span className="business-verification-note">
                No action required right now.
              </span>
            )}
        </div>
      </section>

      {(isRequestError || isRequestSuccess) && (
        <section className="business-verification-feedback">
          {isRequestSuccess && (
            <p className="business-verification-feedback--success">
              Your verification request has been sent. We&apos;ll email you once
              it&apos;s reviewed.
            </p>
          )}
          {isRequestError && (
            <p className="business-verification-feedback--error">
              We couldn&apos;t send your verification request. Please try again
              later.
              {requestError?.data?.message && (
                <>
                  {" "}
                  <span className="business-verification-feedback--error-detail">
                    ({requestError.data.message})
                  </span>
                </>
              )}
            </p>
          )}
        </section>
      )}

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
              <dt>Logo</dt>
              <dd>
                {logo_url ? (
                  <span className="kv-muted">
                   Set -{" "}
                    <button
                      type="button"
                      className="business-inline-link"
                      onClick={() => setShowLogoEditor(true)}
                    >
                      change logo
                    </button>
                  </span>
                ) : (
                  <span className="kv-muted">
                    Not set -{" "}
                    <button
                      type="button"
                      className="business-inline-link"
                      onClick={() => setShowLogoEditor(true)}
                    >
                      upload now
                    </button>
                  </span>
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
              <dd>{postal_code || <span className="kv-muted">N/A</span>}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
