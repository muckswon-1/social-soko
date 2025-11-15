import React, { useMemo, useState } from "react";
import "../../styles/businesses/businesses.css";
import { useListBusinessesQuery } from "../../services/adminBusinessApi";

/**
 * Admin Businesses List
 *
 * Mirrors Users list, but for businesses:
 * - Uses RTK: useListBusinessesQuery({ page, limit })
 * - Table: Name, Email, Contact, Verified, Actions
 * - "Details" opens a modal with full business info and space for future actions (e.g., Verify)
 */
export default function Businesses({
  onRefresh,
  onPageChange,
  onVerifyBusiness, // optional, for when you wire verification later
}) {
  const [localSearch, setLocalSearch] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  // For now: same as Users – fixed page=1, limit=50
  // You can later pass page from props or local state.
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

  const filteredBusinesses = useMemo(() => {
    if (!localSearch.trim()) return businesses;

    const term = localSearch.toLowerCase();

    return businesses.filter((b) => {
      const name = b.name || "";
      const email = b.email || "";
      const phone = b.phone || "";
      const contactName = b.contact_name || b.contactName || "";

      return (
        name.toLowerCase().includes(term) ||
        email.toLowerCase().includes(term) ||
        phone.toLowerCase().includes(term) ||
        contactName.toLowerCase().includes(term)
      );
    });
  }, [businesses, localSearch]);

  const handlePrevPage = () => {
    if (!onPageChange) return;
    if (page > 1) onPageChange(page - 1);
  };

  const handleNextPage = () => {
    if (!onPageChange) return;
    if (page < totalPages) onPageChange(page + 1);
  };

  const resolveVerified = (b) => {
    if (typeof b.is_verified === "boolean") return b.is_verified;
    if (typeof b.verified === "boolean") return b.verified;
    if (typeof b.business_verified === "boolean") return b.business_verified;
    return null;
  };

  const renderVerifiedPill = (b) => {
    const isVerified = resolveVerified(b);

    if (isVerified === true) {
      return (
        <span className="businesses-pill businesses-pill--verified">
          Verified
        </span>
      );
    }

    if (isVerified === false) {
      return (
        <span className="businesses-pill businesses-pill--unverified">
          Unverified
        </span>
      );
    }

    return (
      <span className="businesses-pill businesses-pill--unknown">—</span>
    );
  };

  const handleOpenDetails = (business) => {
    setSelectedBusiness(business);
  };

  const handleCloseDetails = () => {
    setSelectedBusiness(null);
  };

  const handleVerifyClick = () => {
    if (selectedBusiness && onVerifyBusiness) {
      onVerifyBusiness(selectedBusiness);
    }
  };

  const handleRefreshClick = () => {
    if (onRefresh) onRefresh();
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
                    <th>Verified</th>
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
                        <td>{renderVerifiedPill(b)}</td>
                        <td className="businesses-actions-cell">
                          <button
                            type="button"
                            className="btn btn-ghost businesses-action-btn"
                            onClick={() => handleOpenDetails(b)}
                          >
                            Details
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

      {/* Details Modal */}
      {selectedBusiness && (
        <div
          className="businesses-modal-backdrop"
          onClick={handleCloseDetails}
        >
          <div
            className="businesses-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="businesses-modal-header">
              <div>
                <div className="businesses-modal-title">
                  {selectedBusiness.name || "Business details"}
                </div>
                <div className="businesses-modal-subtitle">
                  {selectedBusiness.email || "No email"} ·{" "}
                  {selectedBusiness.phone || "No phone"}
                </div>
              </div>
              <div>{renderVerifiedPill(selectedBusiness)}</div>
            </div>

            <div className="businesses-modal-body">
              {/* Description */}
              {(selectedBusiness.description ||
                selectedBusiness.website ||
                selectedBusiness.slug) && (
                <div className="businesses-detail-section">
                  <div className="businesses-detail-section-title">
                    Overview
                  </div>
                  {selectedBusiness.description && (
                    <div className="businesses-detail-text">
                      {selectedBusiness.description}
                    </div>
                  )}
                  {selectedBusiness.website && (
                    <div className="businesses-detail-text">
                      <strong>Website:</strong>{" "}
                      <span className="businesses-cell-mono">
                        {selectedBusiness.website}
                      </span>
                    </div>
                  )}
                  {selectedBusiness.slug && (
                    <div className="businesses-detail-text">
                      <strong>Slug:</strong>{" "}
                      <span className="businesses-cell-mono">
                        {selectedBusiness.slug}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Address */}
              {(selectedBusiness.address ||
                selectedBusiness.city ||
                selectedBusiness.state ||
                selectedBusiness.postal_code ||
                selectedBusiness.country) && (
                <div className="businesses-detail-section">
                  <div className="businesses-detail-section-title">
                    Address
                  </div>
                  <div className="businesses-detail-text">
                    {selectedBusiness.address && (
                      <div>{selectedBusiness.address}</div>
                    )}
                    <div>
                      {[selectedBusiness.city, selectedBusiness.state]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                    <div>
                      {[selectedBusiness.postal_code, selectedBusiness.country]
                        .filter(Boolean)
                        .join(" · ")}
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="businesses-detail-section">
                <div className="businesses-detail-section-title">
                  System
                </div>
                <div className="businesses-detail-text">
                  <div>
                    <strong>Created:</strong>{" "}
                    {selectedBusiness.createdAt
                      ? new Date(
                          selectedBusiness.createdAt
                        ).toLocaleString()
                      : "—"}
                  </div>
                  <div>
                    <strong>Updated:</strong>{" "}
                    {selectedBusiness.updatedAt
                      ? new Date(
                          selectedBusiness.updatedAt
                        ).toLocaleString()
                      : "—"}
                  </div>
                  {selectedBusiness.user_id && (
                    <div>
                      <strong>Owner User ID:</strong>{" "}
                      <span className="businesses-cell-mono">
                        {selectedBusiness.user_id}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Future actions (Verify, etc.) */}
              <div className="businesses-detail-section">
                <div className="businesses-detail-section-title">
                  Admin Actions
                </div>
                <div className="businesses-detail-text">
                  <p>
                    Use this area to verify, suspend, or update this
                    business record.
                  </p>
                </div>
              </div>
            </div>

            <div className="businesses-modal-footer">
              {onVerifyBusiness && resolveVerified(selectedBusiness) === false && (
                <button
                  type="button"
                  className="btn btn-admin"
                  onClick={handleVerifyClick}
                >
                  Verify Business
                </button>
              )}
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleCloseDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
