import React, { useMemo, useState } from "react";
import "../../styles/users/users.css";
import { useListUsersQuery } from "../../services/adminUserApi";
import VerifyEmailTokenModal from "../components/VerifyEmailParameterToken";
// Leaving this import in case your modal uses it internally
import { useGenerateVerifyEmailTokenMutation } from "../../services/adminVerifyTokensApi";

/**
 * Admin Users List
 *
 * Now includes:
 * - Admin actions modal per user (Generate verify token, Suspend, etc.)
 */
export default function Users({
  onRefresh,
  onPageChange,
  onSelectUser,
}) {
  const [localSearch, setLocalSearch] = useState("");
  const [tokenEmail, setTokenEmail] = useState(null);
  const [adminUser, setAdminUser] = useState(null); // user selected for admin actions

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useListUsersQuery(
    { page: 1, limit: 50 },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const users = data?.items || [];
  const meta = data?.meta || {};

  const total = meta.totalItems ?? meta.total;
  const page = meta.page ?? 1;
  const totalPages = meta.totalPages ?? 1;
  const limit = meta.limit || 0;

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
  };

  const filteredUsers = useMemo(() => {
    if (!localSearch.trim()) return users;

    const term = localSearch.toLowerCase();

    return users.filter((u) => {
      const email = u.email || "";
      const firstName = u.first_name || u.firstName || "";
      const lastName = u.last_name || u.lastName || "";

      return (
        email.toLowerCase().includes(term) ||
        firstName.toLowerCase().includes(term) ||
        lastName.toLowerCase().includes(term)
      );
    });
  }, [users, localSearch]);

  const handlePrevPage = () => {
    if (!onPageChange) return;
    if (page > 1) onPageChange(page - 1);
  };

  const handleNextPage = () => {
    if (!onPageChange) return;
    if (page < totalPages) onPageChange(page + 1);
  };

  const handleOpenAdminActions = (user) => {
    setAdminUser(user);
  };

  const handleCloseAdminActions = () => {
    setAdminUser(null);
  };

  const handleGenerateVerifyToken = () => {
    if (!adminUser?.email) return;
    setTokenEmail(adminUser.email);
    // leave the admin modal open or close it; up to you
    // here I'll keep it open so you can see the context
  };

  // Placeholder handlers for future RTK mutations
  const handleSuspendUser = () => {
    if (!adminUser) return;
    // TODO: wire to suspend mutation later
    console.log("[AdminAction] Suspend user:", adminUser.id);
  };

  const handleUnsuspendUser = () => {
    if (!adminUser) return;
    // TODO: wire to unsuspend mutation later
    console.log("[AdminAction] Unsuspend user:", adminUser.id);
  };

  const resolvedOnRefresh = onRefresh || refetch;

  return (
    <div className="users-page">
      {/* Toolbar */}
      <div className="users-toolbar">
        <div className="users-toolbar-left">
          <label className="users-search-label">
            Search
            <input
              type="text"
              className="users-search-input"
              placeholder="Search by name or email…"
              value={localSearch}
              onChange={handleSearchChange}
            />
          </label>
        </div>

        <div className="users-toolbar-right">
          <button
            type="button"
            className="btn btn-admin users-refresh-btn"
            onClick={resolvedOnRefresh}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="users-card">
        {isLoading && (
          <div className="empty-state">
            <div className="empty-state-inner">
              <p>Loading users…</p>
            </div>
          </div>
        )}

        {isError && !isLoading && (
          <div className="empty-state">
            <div className="empty-state-inner">
              <p>Failed to load users.</p>
              <pre className="users-error-pre">
                {JSON.stringify(error?.data || error, null, 2)}
              </pre>
              {error && (
                <button
                  type="button"
                  className="btn btn-admin users-refresh-inline"
                  onClick={resolvedOnRefresh}
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        )}

        {!isLoading && !isError && filteredUsers.length === 0 && (
          <div className="empty-state empty-state--inline">
            <div className="empty-state-inner">
              <p>No users found.</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && filteredUsers.length > 0 && (
          <>
            <div className="users-meta">
              <span>Total users: {total}</span>
              {limit > 0 && totalPages > 1 && (
                <span>
                  Page {page} · {limit} per page
                </span>
              )}
            </div>

            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Verified</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => {
                    const firstName =
                      user.first_name || user.firstName || "";
                    const lastName =
                      user.last_name || user.lastName || "";
                    const fullName =
                      (firstName || lastName) &&
                      `${firstName} ${lastName}`.trim();

                    const createdAt =
                      user.created_at || user.createdAt || null;
                    const createdDate = createdAt
                      ? new Date(createdAt).toLocaleString()
                      : "—";

                    const isVerified =
                      typeof user.email_verified === "boolean"
                        ? user.email_verified
                        : null;

                    return (
                      <tr key={user.id}>
                        <td className="users-cell-mono">{user.email}</td>
                        <td>{fullName || "—"}</td>
                        <td>
                          {isVerified === null ? (
                            "—"
                          ) : (
                            <span
                              className={
                                isVerified
                                  ? "users-pill users-pill--verified"
                                  : "users-pill users-pill--unverified"
                              }
                            >
                              {isVerified ? "Verified" : "Unverified"}
                            </span>
                          )}
                        </td>
                        <td>{createdDate}</td>
                        <td className="users-actions-cell">
                          {onSelectUser && (
                            <button
                              type="button"
                              className="btn btn-ghost users-select-btn"
                              onClick={() => onSelectUser(user)}
                            >
                              Use in JSON
                            </button>
                          )}

                          <button
                            type="button"
                            className="btn btn-ghost users-select-btn"
                            onClick={() => handleOpenAdminActions(user)}
                          >
                            Admin
                          </button>

                          {!onSelectUser && (
                            <span className="users-actions-placeholder">
                              {/* placeholder just to keep layout consistent */}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="users-pagination">
                <button
                  type="button"
                  className="btn btn-ghost users-page-btn"
                  onClick={handlePrevPage}
                  disabled={!onPageChange || page <= 1}
                >
                  Previous
                </button>
                <span className="users-page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost users-page-btn"
                  onClick={handleNextPage}
                  disabled={!onPageChange || page >= totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Existing verify-email modal (unchanged) */}
      {tokenEmail && (
        <VerifyEmailTokenModal
          email={tokenEmail}
          onClose={() => setTokenEmail(null)}
        />
      )}

      {/* New Admin Actions modal */}
      {adminUser && (
        <div
          className="users-modal-backdrop"
          onClick={handleCloseAdminActions}
        >
          <div
            className="users-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="users-modal-header">
              <div>
                <h2 className="users-modal-title">
                  Admin actions
                </h2>
                <p className="users-modal-subtitle">
                  {adminUser.email}{" "}
                  {adminUser.first_name || adminUser.last_name
                    ? `· ${(adminUser.first_name || adminUser.firstName || "")} ${
                        adminUser.last_name || adminUser.lastName || ""
                      }`.trim()
                    : ""}
                </p>
              </div>
              <div>
                {typeof adminUser.email_verified === "boolean" && (
                  <span
                    className={
                      adminUser.email_verified
                        ? "users-pill users-pill--verified"
                        : "users-pill users-pill--unverified"
                    }
                  >
                    {adminUser.email_verified ? "Verified" : "Unverified"}
                  </span>
                )}
              </div>
            </header>

            <div className="users-modal-body">
              {/* Quick info */}
              <section className="users-detail-section">
                <div className="users-detail-section-title">
                  Overview
                </div>
                <div className="users-detail-text">
                  <div>
                    <strong>User ID:</strong>{" "}
                    <span className="users-cell-mono">
                      {adminUser.id}
                    </span>
                  </div>
                  <div>
                    <strong>Created:</strong>{" "}
                    {adminUser.created_at || adminUser.createdAt
                      ? new Date(
                          adminUser.created_at || adminUser.createdAt
                        ).toLocaleString()
                      : "—"}
                  </div>
                </div>
              </section>

              {/* Actions */}
              <section className="users-detail-section">
                <div className="users-detail-section-title">
                  Actions
                </div>
                <div className="users-detail-text users-actions-grid">
                  {adminUser.email_verified === false && (
                    <button
                      type="button"
                      className="btn btn-admin btn-sm"
                      onClick={handleGenerateVerifyToken}
                    >
                      Generate email verify param token
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={handleSuspendUser}
                  >
                    Suspend account (TODO)
                  </button>

                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={handleUnsuspendUser}
                  >
                    Unsuspend account (TODO)
                  </button>
                </div>
              </section>
            </div>

            <footer className="users-modal-footer">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleCloseAdminActions}
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
