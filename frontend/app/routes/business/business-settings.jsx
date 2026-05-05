// src/routes/business/settings.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ImageUp } from "lucide-react";

import { selectAuthUser } from "../../features/auth/authSlice";
import {
  useGetBusinessQuery,
  useRequestBusinessVerificationMutation,
} from "../../services/businessApi";

import sharedFormStyles from "../../styles/forms/forms.css?url";
import businessStyles from "../../styles/business/business.css?url";
import logoUploadStyles from "../../styles/business/logo-upload.css?url";

import { getInitials } from "../../utils/passwordUtils";
import {
  canRequestBusinessVerification,
  getStatusDescription,
  getStatusLabel,
  getStatusPillClass,
} from "../../utils/businessHelpers";

import BusinessEditForm from "./business-edit-form";
import BusinessLogoUpload from "./BusinessLogoUpload";
import CreateBusinessBanner from "./CreateBusinessBanner";

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

 /**
    * @typedef {import("./utils/businessTransformers").Business} Business
    * 
    */

   /**
  * 
  * @typedef {import("../posts/utils/postTransformers").ErrorResponse} BusinessErrors
  */


export function links() {
  return [
    { rel: "stylesheet", href: sharedFormStyles },
    { rel: "stylesheet", href: businessStyles },
    { rel: "stylesheet", href: logoUploadStyles },
  ];
}

export function meta() {
  return [{ title: "Business Settings | Social Soko" }];
}

export default function BusinessSettings() {
  const user = useSelector(selectAuthUser);
  const userId = user?.id || null;
  const navigate = useNavigate();

  const {
    data,
    isLoading: isGetBusinessLoading,
    isError: isGetBusinessError,
    error,
    refetch,
  } = useGetBusinessQuery(userId, {
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


  /**@type {Business | null | undefined} */
  const business = data?.business || null;
  /**@type {BusinessErrors | null | undefined} */
  const getBusinessError = error;




  if(!business && !isGetBusinessLoading)  return <CreateBusinessBanner />;


  if (!user) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          You need to be signed in to manage your business settings.
        </div>
      </div>
    );
  }


  // No business created yet → settings empty state
  if (getBusinessError?.status === 403 && !business && !isGetBusinessLoading && !isEditing) {
    return (
      <div className="card card--cozy business-card">
        <header className="business-header">
          <div className="business-header-left">
            <div className="business-avatar">SB</div>
            <div>
              <h2 className="business-title">Set up your business</h2>
              <p className="business-sub">
                Create a business profile first, then you'll be able to
                manage its settings here.
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
              Create business
            </button>
          </div>
        </header>
      </div>
    );
  }

  // API error
  if (isGetBusinessError) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          {getBusinessError || "We couldn't load your business details. Please try again later."}
        </div>
      </div>
    );
  }

  // Editing mode → show full edit form
  if (isEditing || isGetBusinessLoading) {
    return <BusinessEditForm setIsEditing={setIsEditing} />;
  }

  // ---------- View mode: settings overview ----------

  const {
    id: businessId,
    name,
    slug,
    email,
    phoneNumber,
    website,
    logoUrl,
    description,
    address,
    city,
    state,
    country,
    postalCode,
    verificationStatus,
    verificationRejectedAt,
  } = business || {};

  const initials = getInitials(name);
  const normalizedLogoUrl = logoUrl ? `${BACKEND_URL}${logoUrl}` : null;
  

  const { canRequest, daysRemaining } = canRequestBusinessVerification({
    status: verificationStatus.toString().trim(),
    rejectedAt: verificationRejectedAt,
    isLoading: isRequesting,
    // keep your tiny cooldown for now
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

  const showLogoMissingBanner = !logoUrl && !showLogoEditor;


  return (
    <div className="card card--cozy business-card">
      {/* Top header */}
      <header className="business-header">
        <div className="business-header-left">
          <div className="business-avatar-wrap">
            <div className="business-avatar">
              {normalizedLogoUrl ? (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img src={normalizedLogoUrl} alt={name || "Business logo"} />
              ) : (
                initials
              )}
            </div>

            <button
              type="button"
              className="business-avatar-change"
              onClick={() => setShowLogoEditor(true)}
            >
              {logoUrl ? "Change logo" : "Add logo"}
            </button>
          </div>

          <div>
            <h2 className="business-title">Business settings</h2>
            <p className="business-sub">
              Update your public profile, contact details, and how partners see
              your business on Social Soko.
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
            Edit details
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
              setShowLogoEditor(false);
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
              Your verification request has been sent. We'll email you once
              it's reviewed.
            </p>
          )}
          {isRequestError && (
            <p className="business-verification-feedback--error">
              We couldn't send your verification request. Please try again
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

      {/* Groups grid – detailed settings overview */}
      <div className="business-grid">
        {/* Profile */}
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
              <dd>{phoneNumber || <span className="kv-muted">N/A</span>}</dd>
            </div>
          </dl>
        </section>

        {/* Online presence */}
        <section className="business-section">
          <h3 className="business-section-title">Online presence</h3>
          <p className="business-section-text">
            Links and assets visible on your public profile.
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
                {logoUrl ? (
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
              <dt>Postal code</dt>
              <dd>{postalCode || <span className="kv-muted">N/A</span>}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
