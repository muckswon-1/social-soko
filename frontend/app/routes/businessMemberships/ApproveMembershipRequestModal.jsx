import React from "react";

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

function getRequestMessage(request) {
  return String(request?.message || "").trim();
}

export default function ApproveMembershipRequestModal({
  open,
  request,
  onClose,
  onConfirm,
  isSubmitting = false,
}) {
  if (!open || !request) return null;

  const requester = request.user || null;
  const message = getRequestMessage(request);
  const hasMessage = Boolean(message);

  const onBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="membership-approval-modal__backdrop"
      onClick={onBackdropClick}
      role="presentation"
    >
      <div
        className="membership-approval-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="membership-approval-modal-title"
      >
        <div className="membership-approval-modal__header">
          <div>
            <div className="membership-approval-modal__eyebrow">
              Review membership request
            </div>
            <h2
              id="membership-approval-modal-title"
              className="membership-approval-modal__title"
            >
              Approve request
            </h2>
          </div>

          <button
            type="button"
            className="btn btn-ghost membership-approval-modal__close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close approval modal"
          >
            ✕
          </button>
        </div>

        <div className="membership-approval-modal__body">
          <div className="membership-approval-modal__identity">
            <div className="membership-approval-modal__avatar">
              {getInitials(requester)}
            </div>

            <div className="membership-approval-modal__identity-copy">
              <div className="membership-approval-modal__name">
                {getRequesterName(requester)}
              </div>
              <div className="membership-approval-modal__email">
                {requester?.email || "—"}
              </div>
            </div>
          </div>

          <div
            className={
              hasMessage
                ? "membership-approval-modal__message membership-approval-modal__message--filled"
                : "membership-approval-modal__message membership-approval-modal__message--empty"
            }
          >
            <div className="membership-approval-modal__message-top">
              <span className="membership-approval-modal__message-label">
                Requester note
              </span>
              <span className="membership-approval-modal__message-meta">
                {hasMessage ? `${message.length} chars` : "No note"}
              </span>
            </div>
            <p className="membership-approval-modal__message-text">
              {hasMessage
                ? message
                : "No message was included with this request. You can still approve the membership if the user looks right."}
            </p>
          </div>

          <div className="membership-approval-modal__grid">
            <div className="membership-approval-modal__field">
              <span className="membership-approval-modal__label">
                Requested role
              </span>
              <span className="membership-approval-modal__value">Member</span>
            </div>

            <div className="membership-approval-modal__field">
              <span className="membership-approval-modal__label">Status</span>
              <span className="membership-approval-modal__value">
                {formatLabel(request.status)}
              </span>
            </div>

            <div className="membership-approval-modal__field">
              <span className="membership-approval-modal__label">
                Requested on
              </span>
              <span className="membership-approval-modal__value">
                {formatDate(request.createdAt)}
              </span>
            </div>

            <div className="membership-approval-modal__field">
              <span className="membership-approval-modal__label">
                Request ID
              </span>
              <span className="membership-approval-modal__value membership-approval-modal__value--mono">
                {request.id ? `${request.id.slice(0, 8)}...` : "—"}
              </span>
            </div>
          </div>

          <div className="membership-approval-modal__notice">
            <div className="membership-approval-modal__notice-title">
              What happens next
            </div>
            <ul className="membership-approval-modal__notice-list">
              <li>This request will be approved.</li>
              <li>The user will be added to the business immediately.</li>
              <li>Their role will be set to the approved membership role.</li>
            </ul>
          </div>
        </div>

        <div className="membership-approval-modal__footer">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onConfirm?.(request)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Approving..." : "Approve membership"}
          </button>
        </div>
      </div>
    </div>
  );
}
