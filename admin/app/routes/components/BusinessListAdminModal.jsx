// src/components/admin/BusinessAdminModal.jsx
import React, { useMemo, useState, useEffect } from "react";
import "../../styles/businesses/business-list-modal.css";
import { useAdminVerifyBusinessMutation } from "../../services/adminVerifyBusinessApi";
import { renderStatusPill } from "./StatusPill";
import {
  generateTasks,
  resolveVerificationStatus,
} from "../../utils/emailListHelpers";

export default function BusinessListAdminModal({
  business,
  onClose,
  onBusinessUpdated, // optional: called after verify or 422
  onSuspendBusiness,
  onRejectBusiness,
  onMarkRequested,
}) {
  // If nothing is passed, don't render at all
  if (!business) return null;

  // Local copy that we can update when verify succeeds or fails with a 422
  const [currentBusiness, setCurrentBusiness] = useState(business);

  // Keep in sync if parent passes a new business object (e.g. refetch)
  useEffect(() => {
    setCurrentBusiness(business);
  }, [business]);

  const [
    adminVerifyBusiness,
    { isError, isLoading, isSuccess, error },
  ] = useAdminVerifyBusinessMutation();

  // Destructure from the local state instead of the prop
  const {
    id,
    name,
    email,
    phone,
    description,
    website,
    slug,
    address,
    city,
    state,
    postal_code,
    country,
    createdAt,
    updatedAt,
    user_id,
    verification_requested_at,
    verified_at,
    verification_rejected_at,
  } = currentBusiness || {};

  // Normalised status & tasks based on *current* business
  const status = useMemo(
    () => resolveVerificationStatus(currentBusiness),
    [currentBusiness]
  );

  const derivedTasks = useMemo(
    () => generateTasks(currentBusiness),
    [currentBusiness]
  );

  const canVerifyNow =
    status === "requested" || status === "pending" || status === "unverified";

  const handleVerifyClick = async () => {
    try {
      // On success, this is whatever you return from transformResponse
      const updated = await adminVerifyBusiness({ id }).unwrap();

      // If you returned the updated business, keep the modal in sync
      if (updated && typeof updated === "object") {
        setCurrentBusiness(updated);
        onBusinessUpdated?.(updated);
      }
    } catch (err) {
      console.error("[AdminVerify] Failed to verify business:", err);

      // If transformErrorResponse returned an updated business (422 case)
      if (err?.business && typeof err.business === "object") {
        setCurrentBusiness(err.business);
        onBusinessUpdated?.(err.business);
      }
    }
  };

  const handleSuspendClick = () => {
    if (onSuspendBusiness) {
      onSuspendBusiness(currentBusiness);
    } else {
      console.log("[AdminAction] Suspend business:", id);
    }
  };

  const handleRejectClick = () => {
    if (onRejectBusiness) {
      onRejectBusiness(currentBusiness);
    } else {
      console.log("[AdminAction] Reject business verification:", id);
    }
  };

  const handleMarkRequestedClick = () => {
    if (onMarkRequested) {
      onMarkRequested(currentBusiness);
    } else {
      console.log(
        "[AdminAction] Mark business verification requested:",
        id
      );
    }
  };

  return (
    <div className="businesses-modal-backdrop" onClick={onClose}>
      <div
        className="businesses-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="businesses-modal-header">
          <div>
            <div className="businesses-modal-title">
              {name || "Business details"}
            </div>
            <div className="businesses-modal-subtitle">
              {email || "No email"} · {phone || "No phone"}
            </div>
          </div>
          {/* Status pill uses local business state */}
          <div>{renderStatusPill(currentBusiness)}</div>
        </div>

        {/* Body */}
        <div className="businesses-modal-body">
          {/* Overview */}
          {(description || website || slug) && (
            <section className="businesses-detail-section">
              <div className="businesses-detail-section-title">
                Overview
              </div>
              <div className="businesses-detail-text">
                {description && <p>{description}</p>}
                {website && (
                  <p>
                    <strong>Website:</strong>{" "}
                    <span className="businesses-cell-mono">
                      {website}
                    </span>
                  </p>
                )}
                {slug && (
                  <p>
                    <strong>Slug:</strong>{" "}
                    <span className="businesses-cell-mono">
                      {slug}
                    </span>
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Address */}
          {(address || city || state || postal_code || country) && (
            <section className="businesses-detail-section">
              <div className="businesses-detail-section-title">
                Address
              </div>
              <div className="businesses-detail-text">
                {address && <div>{address}</div>}
                <div>
                  {[city, state].filter(Boolean).join(", ")}
                </div>
                <div>
                  {[postal_code, country].filter(Boolean).join(" · ")}
                </div>
              </div>
            </section>
          )}

          {/* System info + verification status */}
          <section className="businesses-detail-section">
            <div className="businesses-detail-section-title">System</div>
            <div className="businesses-detail-text">
              <div>
                <strong>Business ID:</strong>{" "}
                <span className="businesses-cell-mono">{id}</span>
              </div>
              <div>
                <strong>Owner User ID:</strong>{" "}
                <span className="businesses-cell-mono">
                  {user_id || "—"}
                </span>
              </div>
              <div>
                <strong>Created:</strong>{" "}
                {createdAt ? new Date(createdAt).toLocaleString() : "—"}
              </div>
              <div>
                <strong>Updated:</strong>{" "}
                {updatedAt ? new Date(updatedAt).toLocaleString() : "—"}
              </div>

              {verification_requested_at && (
                <div>
                  <strong>Verification requested at:</strong>{" "}
                  {new Date(verification_requested_at).toLocaleString()}
                </div>
              )}

              {verified_at && (
                <div>
                  <strong>Verified at:</strong>{" "}
                  {new Date(verified_at).toLocaleString()}
                </div>
              )}

              {verification_rejected_at && (
                <div>
                  <strong>Last rejected at:</strong>{" "}
                  {new Date(verification_rejected_at).toLocaleString()}
                </div>
              )}

              <div className="businesses-system-status-row">
                <strong>Verification status:</strong>{" "}
                {renderStatusPill(currentBusiness)}
              </div>

              {/* Error / success feedback */}
              {isLoading && (
                <div className="businesses-detail-text">
                  Processing verification…
                </div>
              )}
              {isSuccess && (
                <div className="businesses-detail-text businesses-success-text">
                  Business verified successfully.
                </div>
              )}
              {isError && (
                <div className="businesses-detail-text businesses-error-block">
                  <div className="businesses-error-title">
                    Verification failed
                  </div>
                  {error?.message && (
                    <div className="businesses-error-message">
                      {error.message}
                    </div>
                  )}
                  {Array.isArray(error?.reasons) &&
                    error.reasons.length > 0 && (
                      <ul className="businesses-error-reasons">
                        {error.reasons.map((reason, idx) => (
                          <li key={idx}>{reason}</li>
                        ))}
                      </ul>
                    )}
                </div>
              )}
            </div>
          </section>

          {/* Tasks */}
          <section className="businesses-detail-section">
            <div className="businesses-detail-section-title">Tasks</div>
            <div className="businesses-detail-text">
              <ul className="businesses-tasks-list">
                {derivedTasks.map((task, idx) => (
                  <li key={idx}>{task}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Admin actions */}
          <section className="businesses-detail-section">
            <div className="businesses-detail-section-title">
              Admin Actions
            </div>
            <div className="businesses-detail-text businesses-actions-grid">
              {canVerifyNow && (
                <button
                  type="button"
                  className="btn btn-admin btn-sm"
                  onClick={handleVerifyClick}
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying…" : "Verify business"}
                </button>
              )}

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleMarkRequestedClick}
              >
                Mark as verification requested (TODO)
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleRejectClick}
              >
                Reject verification (TODO)
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={handleSuspendClick}
              >
                Suspend business (TODO)
              </button>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="businesses-modal-footer">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
