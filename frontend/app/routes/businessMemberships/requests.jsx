import React, { useMemo, useState } from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

import "../../styles/business/business-membership-requests.css";
import {
  useListMembershipRequestsQuery,
  useApproveMembershipRequestMutation,
} from "../../services/businessMembershipApi";
import { selectAuthUser } from "../../features/auth/authSlice";
import ApproveMembershipRequestModal from "./ApproveMembershipRequestModal";

function getRequesterName(requester) {
  if (!requester) return "Unknown";
  return (
    requester.fullName ||
    [requester.firstName, requester.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() ||
    requester.email ||
    "Unknown"
  );
}

function getInitials(requester) {
  const name = getRequesterName(requester);
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatLabel(value) {
  if (!value) return "Unknown";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function getRequestMessage(request) {
  return String(request?.message || "").trim();
}

function getMessagePreview(message, limit = 220) {
  if (!message) return "";
  if (message.length <= limit) return message;

  return `${message.slice(0, limit).trim()}...`;
}

function RequestMessagePreview({ request }) {
  const message = getRequestMessage(request);
  const hasMessage = Boolean(message);

  return (
    <div
      className={
        hasMessage
          ? "membership-request-message membership-request-message--filled"
          : "membership-request-message membership-request-message--empty"
      }
    >
      <div className="membership-request-message__header">
        <span className="membership-request-message__label">
          Requester note
        </span>
        <span className="membership-request-message__meta">
          {hasMessage ? `${message.length} chars` : "No note"}
        </span>
      </div>

      <p className="membership-request-message__text">
        {hasMessage
          ? getMessagePreview(message)
          : "No message was included with this membership request."}
      </p>
    </div>
  );
}

export default function BusinessMembershipRequestsPage() {
  const { businessId } = useParams();
  const user = useSelector(selectAuthUser);

  const userId = user?.id || null;
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error, refetch } =
    useListMembershipRequestsQuery(
      { businessId, page: 1, limit: 50 },
      {
        skip: !businessId || !userId,
        refetchOnMountOrArgChange: true,
      },
    );

  //Modal
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [approveRequest, { isLoading: isApproving }] =
    useApproveMembershipRequestMutation();

  const rows = Array.isArray(data?.data?.rows) ? data.data.rows : [];

  const count = data?.data?.count || 0;

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;

    return rows.filter((row) => {
      const name = getRequesterName(row.user).toLowerCase();
      const email = row?.user?.email?.toLowerCase() || "";
      const message = getRequestMessage(row).toLowerCase();
      const status = row?.status?.toLowerCase() || "";
      return (
        name.includes(q) ||
        email.includes(q) ||
        message.includes(q) ||
        status.includes(q)
      );
    });
  }, [rows, search]);

  const onApproveClick = async (request) => {
    if (!businessId || !request?.id) return;

    try {
      await approveRequest({ businessId, requestId: request.id }).unwrap();
      setSelectedRequest(null);
    } catch (err) {
      console.error("Failed to approve membership request", err);
    }
  };

  if (!userId) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          You need to be signed in to view membership requests.
        </div>
      </div>
    );
  }

  return (
    <div className="membership-requests-page stack-lg">
      <section className="membership-requests-toolbar">
        <div className="membership-requests-toolbar__left">
          <label className="membership-requests-search-label">
            <span className="sr-only">Search requests</span>
            <input
              type="text"
              className="membership-requests-search-input"
              placeholder="Search requests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>

        <div className="membership-requests-toolbar__right">
          <span className="membership-requests-count">
            {count} request{count === 1 ? "" : "s"}
          </span>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => refetch()}
          >
            Refresh
          </button>
        </div>
      </section>

      {isLoading ? (
        <div className="card membership-requests-card">
          <div className="text-sm text-muted">Loading membership requests…</div>
        </div>
      ) : null}

      {isError ? (
        <div className="card membership-requests-card">
          <div className="stack-sm">
            <div className="text-sm">
              {error?.error || "Failed to load membership requests."}
            </div>

            <div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => refetch()}
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && !isError && filteredRows.length === 0 ? (
        <div className="card membership-requests-card">
          <div className="empty-state empty-state--inline">
            <div className="empty-state-inner">
              {rows.length === 0
                ? "No pending membership requests yet."
                : "No requests matched your search."}
            </div>
          </div>
        </div>
      ) : null}

      {!isLoading && !isError && filteredRows.length > 0 ? (
        <div className="membership-requests-list">
          {filteredRows.map((row) => {
            const hasMessage = Boolean(getRequestMessage(row));

            return (
              <article
                key={row.id}
                className={
                  hasMessage
                    ? "membership-request-row membership-request-row--with-message"
                    : "membership-request-row membership-request-row--without-message"
                }
              >
                <div className="membership-request-row__left">
                  <div className="membership-request-avatar">
                    {getInitials(row.user)}
                  </div>

                  <div className="membership-request-info">
                    <div className="membership-request-name">
                      {getRequesterName(row.user)}
                    </div>

                    <div className="membership-request-email">
                      {row?.user?.email || "—"}
                    </div>
                  </div>
                </div>

                <div className="membership-request-row__center">
                  <span className="membership-request-pill membership-request-pill--status">
                    {formatLabel(row.status)}
                  </span>

                  <span className="membership-request-date">
                    {formatDate(row.createdAt)}
                  </span>
                </div>

                <div className="membership-request-row__right">
                  <button
                    type="button"
                    className="btn btn-primary membership-request-action"
                    onClick={() => setSelectedRequest(row)}
                    disabled={isApproving}
                  >
                    Review
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary membership-request-action"
                    disabled
                    title="Reject flow coming soon"
                  >
                    Reject
                  </button>
                </div>

                <RequestMessagePreview request={row} />
              </article>
            );
          })}
        </div>
      ) : null}

      <ApproveMembershipRequestModal
        open={Boolean(selectedRequest)}
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onConfirm={onApproveClick}
        isSubmitting={isApproving}
      />
    </div>
  );
}
