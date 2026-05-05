// src/components/admin/Businesses.jsx
import React, { useMemo, useState } from "react";
import "../../styles/businesses/businesses.css";
import { useListBusinessesQuery } from "../../services/adminBusinessApi";
import BusinessListAdminModal from "../components/BusinessListAdminModal";
import { businessFilter } from "../../utils/emailListHelpers";
import { renderStatusPill } from "../components/StatusPill";


/**
 * Admin Businesses List
 *
 * - Uses RTK: useListBusinessesQuery({ page, limit })
 * - Table: Name, Email, Contact, Status, Actions
 * - "Admin" opens a modal with full business info and admin actions.
 */
export default function Businesses({
  onPageChange,
}) {
  const [localSearch, setLocalSearch] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useListBusinessesQuery(
    { page: 1, limit: 50 },
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 60000,
    }
  );

  const businesses = data?.items || [];
  const meta = data?.meta || {};

  const total = meta.totalItems ?? meta.total;
  const page = meta.page ?? 1;
  const totalPages = meta.totalPages ?? 1;
  const limit = meta.limit || 0;

  const handleSearchChange = (e) => {
    setLocalSearch(e.target.value);
  };

  const filteredBusinesses = useMemo(() => businessFilter(businesses, localSearch), [businesses, localSearch]);

  const handlePrevPage = () => {
    if (!onPageChange) return;
    if (page > 1) onPageChange(page - 1);
  };

  const handleNextPage = () => {
    if (!onPageChange) return;
    if (page < totalPages) onPageChange(page + 1);
  };

  /**
   * Resolve verification status as a string.
   *
   * Priority:
   * - verification_status (string enum)
   * - verified (string enum: "pending", "requested", "verified", "rejected")
   * - boolean flags (is_verified, business_verified)
   */
 

  const handleOpenAdminModal = (business) => {
    setSelectedBusiness(business);
  };

  const handleCloseAdminModal = () => {
    setSelectedBusiness(null);
  };

  const handleRefreshClick = () => {
    refetch();
  };

  return (
    <div className="businesses-page">
      {/* Toolbar */}
      <div className="businesses-toolbar">
        <div className="businesses-toolbar-left">
          <label className="businesses-search-label">
            Search
            <input
              type="text"
              className="businesses-search-input"
              placeholder="Search by name, email, phone, contact…"
              value={localSearch}
              onChange={handleSearchChange}
            />
          </label>
        </div>

        <div className="businesses-toolbar-right">
          <button
            type="button"
            className="btn btn-admin businesses-refresh-btn"
            onClick={handleRefreshClick}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Card */}
      <div className="businesses-card">
        {isLoading && (
          <div className="empty-state">
            <div className="empty-state-inner">
              <p>Loading businesses…</p>
            </div>
          </div>
        )}

        {isError && !isLoading && (
          <div className="empty-state">
            <div className="empty-state-inner">
              <p>Failed to load businesses.</p>
              <pre className="businesses-error-pre">
                {JSON.stringify(error?.data || error, null, 2)}
              </pre>
              <button
                type="button"
                className="btn btn-admin businesses-refresh-inline"
                onClick={handleRefreshClick}
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {!isLoading && !isError && filteredBusinesses.length === 0 && (
          <div className="empty-state empty-state--inline">
            <div className="empty-state-inner">
              <p>No businesses found.</p>
            </div>
          </div>
        )}

        {!isLoading && !isError && filteredBusinesses.length > 0 && (
          <>
            <div className="businesses-meta">
              <span>Total businesses: {total}</span>
              {limit > 0 && totalPages > 1 && (
                <span>
                  Page {page} · {limit} per page
                </span>
              )}
            </div>

            <div className="businesses-table-wrapper">
              <table className="businesses-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBusinesses.map((b) => {
                    const contactName = b.contact_name || b.contactName || "";
                    const phone = b.phone || "—";
                    const email = b.email || "—";

                    return (
                      <tr key={b.id}>
                        <td>{b.name || "—"}</td>
                        <td className="businesses-cell-mono">{email}</td>
                        <td>
                          <div className="businesses-contact-name">
                            {contactName || "—"}
                          </div>
                          <div className="businesses-contact-phone">
                            {phone}
                          </div>
                        </td>
                        <td>{renderStatusPill(b)}</td>
                        <td className="businesses-actions-cell">
                          <button
                            type="button"
                            className="btn btn-ghost businesses-action-btn"
                            onClick={() => handleOpenAdminModal(b)}
                          >
                            Admin
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="businesses-pagination">
                <button
                  type="button"
                  className="btn btn-ghost businesses-page-btn"
                  onClick={handlePrevPage}
                  disabled={!onPageChange || page <= 1}
                >
                  Previous
                </button>
                <span className="businesses-page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost businesses-page-btn"
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

      {/* Admin modal */}
      {selectedBusiness && (
        <BusinessListAdminModal
          business={selectedBusiness}
          onClose={handleCloseAdminModal}
          onBusinessUpdated={() => {
            // After verify / admin action, refresh list
            refetch();
          }}
        />
      )}
    </div>
  );
}
