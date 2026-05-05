// src/routes/business/search.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "react-toastify";

import { useLazySearchBusinessesQuery } from "../../services/businessApi";
import { useRequestBusinessMembershipMutation } from "../../services/businessMembershipApi";

import "../../styles/business/business-search.css";

function formatLabel(value) {
  if (!value) return "Unknown";

  return String(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInitials(name) {
  if (!name) return "B";

  return String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getVerificationTone(status) {
  if (status === "verified") return "verified";
  if (status === "requested") return "requested";
  if (status === "pending") return "pending";
  if (status === "rejected") return "rejected";
  return "neutral";
}

function getRelationshipTone(type) {
  if (type === "member") return "member";
  if (type === "pending_request") return "pending-request";
  return "none";
}

function BusinessSearchBadge({ children, tone = "neutral" }) {
  return (
    <span className={`business-search__badge business-search__badge--${tone}`}>
      {children}
    </span>
  );
}

function BusinessSearchCard({
  row,
  onRequestMembership,
  isRequestingMembership,
}) {
  const business = row?.business || {};
  const relationship = row?.relationship || {};

  const location = [business.city, business.state, business.country]
    .filter(Boolean)
    .join(", ");

  const verificationTone = getVerificationTone(business.verificationStatus);
  const relationshipTone = getRelationshipTone(relationship.type);

  return (
    <article className="business-search__card">
      <div className="business-search__logo-wrap">
        {business.logoUrl ? (
          <img
            src={business.logoUrl}
            alt={`${business.name} logo`}
            className="business-search__logo"
          />
        ) : (
          <div className="business-search__logo business-search__logo--fallback">
            {getInitials(business.name)}
          </div>
        )}
      </div>

      <div className="business-search__card-main">
        <div className="business-search__card-top">
          <div className="business-search__identity">
            <h3 className="business-search__business-name">
              {business.name || "Unnamed business"}
            </h3>

            <p className="business-search__handle">
              @{business.username || business.slug || "business"}
            </p>
          </div>

          <BusinessSearchBadge tone={verificationTone}>
            {formatLabel(business.verificationStatus || "unverified")}
          </BusinessSearchBadge>
        </div>

        {location ? (
          <p className="business-search__location">{location}</p>
        ) : (
          <p className="business-search__location business-search__location--muted">
            Location not shown
          </p>
        )}

        <div className="business-search__meta-row">
          <BusinessSearchBadge tone={relationshipTone}>
            {formatLabel(relationship.type || "none")}
          </BusinessSearchBadge>

          {relationship.role ? (
            <BusinessSearchBadge tone="role">
              {formatLabel(relationship.role)} ·{" "}
              {formatLabel(relationship.status)}
            </BusinessSearchBadge>
          ) : null}

          {row.canRequestMembership ? (
            <BusinessSearchBadge tone="can-request">
              Can request access
            </BusinessSearchBadge>
          ) : null}
        </div>

        <div className="business-search__card-actions">
          {row.canRequestMembership ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onRequestMembership(row)}
              disabled={isRequestingMembership}
            >
              {isRequestingMembership ? "Requesting..." : "Request to join"}
            </button>
          ) : relationship.type === "pending_request" ? (
            <button type="button" className="btn btn-secondary" disabled>
              Request pending
            </button>
          ) : relationship.type === "member" ? (
            <button type="button" className="btn btn-secondary" disabled>
              Already a member
            </button>
          ) : (
            <button type="button" className="btn btn-secondary" disabled>
              Not available
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function RequestMembershipModal({
  open,
  row,
  message,
  onMessageChange,
  onClose,
  onSubmit,
  isSubmitting = false,
}) {
  const business = row?.business || null;

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isSubmitting, onClose, open]);

  if (!open || !business) return null;

  const onBackdropClick = (event) => {
    if (event.target === event.currentTarget && !isSubmitting) {
      onClose?.();
    }
  };

  return (
    <div
      className="business-request-modal__backdrop"
      onClick={onBackdropClick}
      role="presentation"
    >
      <form
        className="business-request-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="business-request-modal-title"
        onSubmit={onSubmit}
      >
        <div className="business-request-modal__header">
          <div>
            <div className="business-request-modal__eyebrow">
              Request access
            </div>
            <h2
              id="business-request-modal-title"
              className="business-request-modal__title"
            >
              Join {business.name || "this business"}
            </h2>
          </div>

          <button
            type="button"
            className="btn btn-ghost business-request-modal__close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close request modal"
          >
            X
          </button>
        </div>

        <div className="business-request-modal__body">
          <div className="business-request-modal__business">
            {business.logoUrl ? (
              <img
                src={business.logoUrl}
                alt={`${business.name} logo`}
                className="business-request-modal__logo"
              />
            ) : (
              <div className="business-request-modal__logo business-request-modal__logo--fallback">
                {getInitials(business.name)}
              </div>
            )}

            <div className="business-request-modal__business-copy">
              <div className="business-request-modal__business-name">
                {business.name || "Unnamed business"}
              </div>
              <div className="business-request-modal__handle">
                @{business.username || business.slug || "business"}
              </div>
            </div>
          </div>

          <label className="business-request-modal__field">
            <span className="business-request-modal__label">Message</span>
            <textarea
              className="business-request-modal__textarea"
              value={message}
              onChange={(event) => onMessageChange(event.target.value)}
              placeholder="Share why you want to join..."
              rows={6}
              maxLength={500}
              disabled={isSubmitting}
              autoFocus
            />
          </label>

          <div className="business-request-modal__helper">
            <span>Optional, but helpful for admins reviewing requests.</span>
            <span>{message.length}/500</span>
          </div>
        </div>

        <div className="business-request-modal__footer">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit request"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function meta() {
  return [{ title: "Join a Business | Social Soko" }];
}

export default function BusinessSearchRoute() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get("query") || "";
  const initialPage = Number(searchParams.get("page") || 1);

  const [query, setQuery] = useState(initialQuery);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(20);
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery));
  const [requestingBusinessId, setRequestingBusinessId] = useState(null);
  const [selectedRequestRow, setSelectedRequestRow] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");

  const [
    searchBusinesses,
    { data, isFetching, isLoading, isError, error, isSuccess },
  ] = useLazySearchBusinessesQuery();

  const [requestBusinessMembership] = useRequestBusinessMembershipMutation();

  const trimmedQuery = query.trim();
  const queryIsTooShort = trimmedQuery.length > 0 && trimmedQuery.length < 2;

  const rows = Array.isArray(data?.data?.rows) ? data.data.rows : [];
  const count = Number(data?.data?.count || 0);
  const currentPage = Number(data?.data?.page || page || 1);
  const currentLimit = Number(data?.data?.limit || limit || 20);

  const totalPages = useMemo(() => {
    if (!count || !currentLimit) return 1;
    return Math.max(Math.ceil(count / currentLimit), 1);
  }, [count, currentLimit]);

  const canSearch = trimmedQuery.length >= 2 && !isFetching;

  useEffect(() => {
    if (!initialQuery || initialQuery.trim().length < 2) return;

    searchBusinesses({
      query: initialQuery.trim(),
      page: initialPage,
      limit,
    });
  }, [initialQuery, initialPage, limit, searchBusinesses]);

  function runSearch(nextPage = 1) {
    if (trimmedQuery.length < 2) return;

    setHasSearched(true);
    setPage(nextPage);

    setSearchParams({
      query: trimmedQuery,
      page: String(nextPage),
      limit: String(limit),
    });

    searchBusinesses({
      query: trimmedQuery,
      page: nextPage,
      limit,
    });
  }

  function onSubmit(event) {
    event.preventDefault();
    runSearch(1);
  }

  function onRequestMembership(row) {
    if (!row?.business?.id) return;

    setSelectedRequestRow(row);
    setRequestMessage("");
  }

  function onCloseRequestModal() {
    if (requestingBusinessId) return;

    setSelectedRequestRow(null);
    setRequestMessage("");
  }

  async function onSubmitMembershipRequest(event) {
    event.preventDefault();

    const business = selectedRequestRow?.business;

    if (!business?.id) return;

    setRequestingBusinessId(business.id);

    try {
      const response = await requestBusinessMembership({
        businessId: business.id,
        message: requestMessage.trim() || undefined,
      }).unwrap();

      toast.success(response?.message || "Membership request submitted.");
      setSelectedRequestRow(null);
      setRequestMessage("");

      if (trimmedQuery.length >= 2) {
        try {
          await searchBusinesses({
            query: trimmedQuery,
            page: currentPage,
            limit,
          }).unwrap();
        } catch (refreshError) {
          console.warn(
            "Membership request submitted, but refresh failed.",
            refreshError,
          );
        }
      }
    } catch (err) {
      toast.error(
        err?.error ||
          err?.message ||
          "Could not submit membership request. Please try again.",
      );
    } finally {
      setRequestingBusinessId(null);
    }
  }

  function onPreviousPage() {
    if (currentPage <= 1) return;
    runSearch(currentPage - 1);
  }

  function onNextPage() {
    if (currentPage >= totalPages) return;
    runSearch(currentPage + 1);
  }

  return (
    <div className="business-search">
      <section className="business-search__hero">
        <div>
          <p className="business-search__eyebrow">Join a business</p>
          <h1 className="business-search__title">
            Find the business you belong to
          </h1>
          <p className="business-search__subtitle">
            Search by business name, username, or slug. Only public-safe
            business discovery information is shown until your request is
            approved.
          </p>
        </div>
      </section>

      <section className="card business-search__search-panel">
        <form className="business-search__form" onSubmit={onSubmit}>
          <label className="business-search__field">
            <span className="business-search__label">Search businesses</span>
            <input
              className="business-search__input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, username, or slug..."
              autoComplete="off"
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary business-search__submit"
            disabled={!canSearch}
          >
            {isFetching ? "Searching…" : "Search"}
          </button>
        </form>

        {queryIsTooShort ? (
          <p className="business-search__hint business-search__hint--error">
            Search query must be at least 2 characters.
          </p>
        ) : (
          <p className="business-search__hint">
            Example: <strong>southern</strong>, <strong>prairie</strong>, or{" "}
            <strong>atlas</strong>.
          </p>
        )}
      </section>

      {isError ? (
        <section className="business-search__notice business-search__notice--error">
          {error?.error || error?.message || "Could not search businesses."}
        </section>
      ) : null}

      {isLoading || isFetching ? (
        <section className="business-search__loading-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="business-search__skeleton-card" />
          ))}
        </section>
      ) : null}

      {!isFetching && hasSearched && isSuccess ? (
        <section className="business-search__results-head">
          <div>
            <p className="business-search__eyebrow">Search results</p>
            <h2 className="business-search__section-title">
              {count ? `${count} businesses found` : "No businesses found"}
            </h2>
          </div>

          {count ? (
            <div className="business-search__page-meta">
              Page {currentPage} of {totalPages}
            </div>
          ) : null}
        </section>
      ) : null}

      {!isFetching && hasSearched && rows.length > 0 ? (
        <>
          <section className="business-search__grid">
            {rows.map((row) => (
              <BusinessSearchCard
                key={row?.business?.id}
                row={row}
                onRequestMembership={onRequestMembership}
                isRequestingMembership={
                  requestingBusinessId === row?.business?.id
                }
              />
            ))}
          </section>

          <div className="business-search__pagination">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onPreviousPage}
              disabled={currentPage <= 1 || isFetching}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={onNextPage}
              disabled={currentPage >= totalPages || isFetching}
            >
              Next
            </button>
          </div>
        </>
      ) : null}

      {!isFetching && hasSearched && isSuccess && rows.length === 0 ? (
        <section className="business-search__empty">
          <div className="business-search__empty-icon">⌕</div>
          <h2>No matching businesses</h2>
          <p>
            Try searching a different business name, username, or slug. If the
            business does not exist yet, an owner or admin may need to create
            it.
          </p>
        </section>
      ) : null}

      {!hasSearched ? (
        <section className="business-search__empty business-search__empty--idle">
          <div className="business-search__empty-icon">↗</div>
          <h2>Search before requesting access</h2>
          <p>
            Once you find the right business, you can request membership. Admins
            or owners will review and approve access.
          </p>
        </section>
      ) : null}

      <RequestMembershipModal
        open={Boolean(selectedRequestRow)}
        row={selectedRequestRow}
        message={requestMessage}
        onMessageChange={setRequestMessage}
        onClose={onCloseRequestModal}
        onSubmit={onSubmitMembershipRequest}
        isSubmitting={Boolean(requestingBusinessId)}
      />
    </div>
  );
}
