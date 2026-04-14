// src/menu/profile/BusinessMemberships.jsx
import React from "react";
import { useGetMyMembershipsQuery } from "../../services/businessMembersApi";
import Skeleton from "../components/Skeleton";



export default function BusinessMemberships() {
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useGetMyMembershipsQuery();

  const memberships = data?.memberships ?? [];

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div className="card card--cozy profile-card">
      <header className="section-head profile-header">
        <div className="section-titles">
          <h2 className="section-title">Your Businesses & Roles</h2>
          <p className="section-sub">
            See which businesses you belong to and your role in each.
          </p>
        </div>

        <div className="inline-actions profile-actions">
          <button
            type="button"
            className="btn btn-xxs btn-ghost"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </header>

      {isError && (
        <div className="kv-muted">
          Could not load business memberships. Please try again later.
        </div>
      )}

      {!isError && memberships.length === 0 && (
        <div className="kv-muted">
          You're not linked to any businesses yet.
          <br />
          Once you create or join a business, it will appear here.
        </div>
      )}

      {!isError && memberships.length > 0 && (
        <section className="kv-grid" aria-label="Business memberships">
          {memberships.map((m) => {
            const biz = m.Business || {};
            const location = [biz.city, biz.country].filter(Boolean).join(", ");

            return (
              <div
                key={m.id}
                className="kv-row biz-membership-row"
              >
                <div className="biz-membership-main">
                  <div className="biz-membership-name">
                    <span className="kv-label">
                      {biz.name || "Unnamed Business"}
                    </span>
                    {biz.username && (
                      <span className="kv-mono biz-membership-username">
                        @{biz.username}
                      </span>
                    )}
                  </div>

                  {location && (
                    <div className="kv-muted biz-membership-location">
                      {location}
                    </div>
                  )}
                </div>

                <div className="biz-membership-chips">
                  <span className="chip chip--neutral">
                    {m.role ? m.role.charAt(0).toUpperCase() + m.role.slice(1) : "Member"}
                  </span>
                  {biz.verification_status && (
                    <span
                      className={`chip ${
                        biz.verification_status === "verified"
                          ? "chip--success"
                          : biz.verification_status === "rejected"
                          ? "chip--danger"
                          : "chip--warning"
                      }`}
                    >
                      {biz.verification_status === "pending" &&
                        "Verification Pending"}
                      {biz.verification_status === "requested" &&
                        "Verification Requested"}
                      {biz.verification_status === "verified" && "Verified"}
                      {biz.verification_status === "rejected" && "Rejected"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
