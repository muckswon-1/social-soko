import React, { useMemo, useState } from "react";
import "../../styles/users/users.css";
import { useListUsersQuery } from "../../services/adminUserApi";
import VerifyEmailTokenModal from "../components/VerifyEmailParameterToken";
import { useGenerateVerifyEmailTokenMutation } from "../../services/adminVerifyTokensApi";

/**
 * Presentational Users List
 *
 * Props (for when you wire data in later):
 * - users: array of user objects
 * - meta: { page, limit, totalItems, totalPages } (optional)
 * - isLoading: boolean
 * - isError: boolean
 * - error: any
 * - onRefresh?: () => void
 * - onPageChange?: (page: number) => void
 * - onSelectUser?: (user) => void   // e.g. to insert into JSON editor
 */
export default function Users({
 
  onRefresh,
  onPageChange,
  onSelectUser,
}) {
  const [localSearch, setLocalSearch] = useState("");
  const [tokenEmail, setTokenEmail] = useState(null);

  const {data, isLoading, isError, error, refetch, isFetching,} = useListUsersQuery({page: 1, limit: 50},{
    refetchOnMountOrArgChange: true
  });
  

  const users = data?.items || [];
  const meta = data?.meta || {}

   const total = meta.totalItems ?? meta.total;
  const page = meta.page ?? 1;
  const totalPages = meta.totalPages ?? 1;
  const limit = meta.limit  || 0;



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
            onClick={refetch}
            disabled={isLoading}
          >
            {isLoading ? "Refreshing…" : "Refresh"}
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
                  onClick={refetch}
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

                    const isVerified =   typeof user.email_verified === "boolean"   ? user.email_verified : null;
                      

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
                            {
                              isVerified === false && (
                              <button
                                type="button"
                                className="btn btn-ghost users-select-btn"
                                onClick={() => setTokenEmail(user.email)}

                              > Generate Verify Token</button>)
                            }

                            {!onSelectUser && isVerified !== false && ( <span className="users-actions-placeholder">
                              —
                            </span>)}
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

          {tokenEmail && (
          <VerifyEmailTokenModal
            email={tokenEmail}
            onClose={() => setTokenEmail(null)}
          />
        )
      }

      
    </div>

  );
}
