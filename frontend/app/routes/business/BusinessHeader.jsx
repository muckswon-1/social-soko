// src/routes/business/BusinessHeader.jsx
import React from "react";
import { getInitials } from "../../utils/passwordUtils";

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;


 /**
    * @typedef {import("./utils/businessTransformers").Business} Business
    * 
    */

/**
 * 
 * @param {{business: Business}} 
 * @returns 
 */

export default function BusinessHeader({ business }) {
  if (!business) return null;

  const { name, slug, logoUrl} = business;

  const initials = getInitials(name);
  const normalizedLogoUrl = logoUrl ? `${BACKEND_URL}${logoUrl}` : null;

  return (
    <header className="business-header business-header--dashboard">
      {/* Left: avatar + name + description */}
      <div className="business-header-main">
        <div className="business-avatar-wrap">
          <div className="business-avatar">
            {normalizedLogoUrl ? (
              <img src={normalizedLogoUrl} alt={name || "Business logo"} />
            ) : (
              initials
            )}
          </div>
        </div>

        <div className="business-header-text">
          <h2 className="business-title">{name || "Your Business"}</h2>
          <p className="business-sub">
            Manage your public profile, contact details, and how partners
            discover you on Social Soko.
          </p>
        </div>
      </div>

      {/* Right: slug only */}
      <div className="business-header-meta">
        <div className="business-slug-wrap">
          <span className="business-slug-label">Public slug</span>
          <span
            className="business-slug-pill"
            title={slug || "not-set"}
          >
            {slug || "not-set"}
          </span>
        </div>
      </div>
    </header>
  );
}
