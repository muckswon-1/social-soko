import React from "react";
import {
  getStatusLabel,
  getStatusDescription,
  getStatusPillClass,
} from "../../utils/businessHelpers";

export default function BusinessVerificationBar({
  verificationStatus,
  daysRemaining,
  canRequest,
  onRequest,
  isRequesting,
}) {
  return (
    <section className="business-verification-bar">
      <div className="business-verification-main">
        <span className={getStatusPillClass(verificationStatus)}>
          {getStatusLabel(verificationStatus)}
        </span>
        <p className="business-verification-text">
          {getStatusDescription(verificationStatus)}
        </p>

        {verificationStatus === "rejected" &&
          daysRemaining > 0 && (
            <p className="business-verification-note">
              You can request verification again in{" "}
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
            onClick={onRequest}
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
  );
}
