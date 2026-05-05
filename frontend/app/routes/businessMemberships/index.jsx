import React, { useMemo, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

import { selectAuthUser } from "../../features/auth/authSlice";

import "../../styles/business/business-members.css";
import { useFetchBusinessMembershipsQuery } from "../../services/businessMembershipApi";

function getName(user) {
  if (!user) return "Unknown";
  return (
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.email ||
    "Unknown"
  );
}

function getInitials(user) {
  const name = getName(user);
  return name
    .split(" ")
    .slice(0, 2)
    .map((x) => x[0])
    .join("")
    .toUpperCase();
}

export default function BusinessMembersIndex() {
  const { businessId } = useParams();
  const user = useSelector(selectAuthUser);
  const userId = user?.id;

  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, refetch } =
    useFetchBusinessMembershipsQuery(
      { businessId, page: 1, limit: 50 },
      { skip: !businessId || !userId }
    );

  const rows = data?.data?.rows || [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return rows;

    return rows.filter((r) => {
      const name = getName(r.user).toLowerCase();
      const email = r.user?.email?.toLowerCase() || "";
      const role = r.role?.toLowerCase() || "";
      return name.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [rows, search]);

  if (!userId) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          You must be logged in.
        </div>
      </div>
    );
  }

  return (
    <div className="business-members-page stack-lg">
      {/* Toolbar */}
      <div className="business-members-toolbar">
        <div className="business-members-toolbar__left">
          <input
            type="text"
            placeholder="Search members..."
            className="business-members-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="business-members-toolbar__right">
          <span className="text-sm text-muted">
            {rows.length} members
          </span>

          <button className="btn btn-ghost" onClick={refetch}>
            Refresh
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="card">
          <div className="text-sm text-muted">Loading members…</div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="card">
          <div className="stack-sm">
            <div>{error?.error || "Failed to load members"}</div>
            <button className="btn btn-primary" onClick={refetch}>
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Empty */}
      {!isLoading && filtered.length === 0 && (
        <div className="card">
          <div className="empty-state empty-state--inline">
            <div className="empty-state-inner">
              No members found.
            </div>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="business-members-list">
        {filtered.map((row) => {
          const isSelf = row.userId === userId;

          return (
            <div key={row.id} className="business-member-row">
              {/* LEFT */}
              <div className="business-member-left">
                <div className="business-member-avatar">
                  {getInitials(row.user)}
                </div>

                <div className="business-member-info">
                  <div className="business-member-name">
                    {getName(row.user)}
                    {isSelf && (
                      <span className="business-member-you">You</span>
                    )}
                  </div>

                  <div className="business-member-email">
                    {row.user?.email}
                  </div>
                </div>
              </div>

              {/* CENTER */}
              <div className="business-member-meta">
                <span className={`pill pill-role-${row.role}`}>
                  {row.role}
                </span>

                <span className={`pill pill-status-${row.status}`}>
                  {row.status}
                </span>
              </div>

              {/* RIGHT */}
              <div className="business-member-actions">
                {!isSelf ? (
                  <>
                    <button className="btn btn-ghost btn-sm">
                      Change Role
                    </button>

                    <button className="btn btn-secondary btn-sm">
                      Remove
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-muted">Current user</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}