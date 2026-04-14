// src/menu/dashboard/components/BusinessCard.jsx
import React from "react";
import { useNavigate } from "react-router";

function formatRole(role) {
  if (!role) return "Unknown";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function formatVerification(status) {
  if (!status) return "Unverified";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function BusinessCard({
  business,
  membershipRole,
  membershipStatus,
}) {
  const initials =
    business?.name
      ?.split(" ")
      ?.slice(0, 2)
      ?.map((part) => part[0])
      ?.join("")
      ?.toUpperCase() || "B";

      const navigate = useNavigate();


    const onOpenDashboardClick = (e) => {
         e.stopPropagation();

  if (!business?.id) return;

  navigate(`/business/${business.id}`);
    }

  return (
    <article className="business-card">
      <div className="business-card__top">
        <div className="business-card__identity">
          {business?.logoUrl ? (
            <img
              src={business.logoUrl}
              alt={`${business.name} logo`}
              className="business-card__logo"
            />
          ) : (
            <div className="business-card__logo business-card__logo--fallback">
              {initials}
            </div>
          )}

          <div className="business-card__title-wrap">
            <h3 className="business-card__title">{business?.name}</h3>
            <div className="business-card__handle">
              @{business?.username || business?.slug}
            </div>
          </div>
        </div>

        <div className="business-card__badges">
          <span className={`business-card__badge business-card__badge--role`}>
            {formatRole(membershipRole)}
          </span>

          <span
            className={`business-card__badge business-card__badge--verification business-card__badge--${business?.verificationStatus || "unverified"}`}
          >
            {formatVerification(business?.verificationStatus)}
          </span>
        </div>
      </div>

      <div className="business-card__meta">
        <div>
          <span className="business-card__meta-label">Slug</span>
          <span className="business-card__meta-value">{business?.slug}</span>
        </div>

        <div >
          <span className="business-card__meta-label">Status</span>
          <span className="business-card__meta-value">
            {membershipStatus || "Unknown"}
          </span>
        </div>
      </div>

      <div className="business-card__footer">
        <button 
        onClick={ e => onOpenDashboardClick(e)}
        type="button" className="btn btn-primary">
          Open dashboard
        </button>
        <button type="button" className="btn btn-secondary">
          Manage
        </button>
      </div>
    </article>
  );
}