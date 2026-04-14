import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import sessionInfoStyles from "../../styles/privacy/index.css?url";
import errorStyles from "../../styles/error/error-boundary.css?url";

import { selectAuthUser } from "../../features/auth/authSlice";
import {
  sendVerificationEmail,
  refreshUser,
} from "../../features/auth/authThunk";
import { toast } from "react-toastify";
import { KeyValueRow } from "../components/KeyValueHelpers";
import EmailChip from "../components/EmailChip";
import { isRouteErrorResponse, Link } from "react-router";

export function links() {
  return [
    { rel: "stylesheet", href: sessionInfoStyles },
    { rel: "stylesheet", href: errorStyles },
  ];
}

export function meta() {
  return [{ title: "Social Soko | Session Info" }];
}

export default function SessionInfo() {
  const user = useSelector(selectAuthUser);
  const dispatch = useDispatch();

  const [sendingLink, setSendingLink] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const topEntries = useMemo(() => {
    if (!user || typeof user !== "object") return [];
    const priority = ["id", "_id", "email", "name", "username", "role"];
    const keys = Object.keys(user);
    const sorted = [
      ...priority.filter((k) => keys.includes(k)),
      ...keys.filter((k) => !priority.includes(k)).sort(),
    ];
    return sorted.map((k) => [k, user[k]]);
  }, [user]);

  if (!user) {
    return (
      <div className="layout-empty">
        <div className="layout-empty__inner">
          No active session found. Please sign in again to view your
          authentication details.
        </div>
      </div>
    );
  }

  const email = user.email;
  const emailVerified = !!(user.emailVerified || user.email_verified);

  const handleSendVerifyLink = async () => {
    if (!email) {
      toast.error("No email found on your account.");
      return;
    }
    setSendingLink(true);
    try {
      const res = await dispatch(sendVerificationEmail({email})).unwrap();
      if (res?.success) {
        toast.success(res.message || "Verification email sent");
      } else {
        toast.error(res?.message || "Failed to send verification email");
      }
    } finally {
      setSendingLink(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const { success, user } = await dispatch(refreshUser()).unwrap();
      console.log("Check refresh: ", success, user);

      if (success && user) {
        user.emailVerified
          ? toast.success("User email now verified")
          : toast.info("Email not verified");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error check email status");
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="card card--cozy session-card">
      {/* Header */}
      <header className="section-head">
        <div className="section-titles">
          <h2 className="section-title">Authentication &amp; Session</h2>
          <div className="section-sub">
            These values reflect your current authenticated user payload and
            session metadata.
          </div>
        </div>
      </header>

      {/* Email verification & actions */}
      <section
        className="session-inline-actions"
        aria-label="Email verification status"
      >
        <div className="session-email">
          <span className="form-label">Email</span>
          <span className="kv-mono">
            {email || <span className="kv-muted">N/A</span>}
          </span>
          <EmailChip verified={emailVerified} />
        </div>

        <div className="session-actions">
         

          {!emailVerified && (

            <>
             <button
            className="btn btn-xxs"
            onClick={handleRefresh}
            disabled={refreshing}
            type="button"
          >
            {refreshing ? "Refreshing…" : "Refresh status"}
          </button>
            
            <button
              className="btn btn-xxs btn-outline"
              onClick={handleSendVerifyLink}
              disabled={sendingLink || !email}
              type="button"
            >
              {sendingLink ? "Sending…" : "Send verify link"}
            </button>

            </>
          )}
        </div>
      </section>

      {/* Raw auth/user data */}
      <section className="kv-grid" aria-label="Authentication and user fields">
        {topEntries.map(([k, v]) => (
          <KeyValueRow key={k} k={k} v={v} />
        ))}
      </section>
    </div>
  );
}

export function ErrorBoundary({ error }) {
  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";
  let statusCode;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;

    if (error.status === 404) {
      title = "Page not found";
      message =
        "We couldn't find the page you're looking for. It may have been moved or doesn't exist.";
    } else if (error.status === 401 || error.status === 403) {
      title = "Access restricted";
      message =
        "You don't have permission to view this page. You may need to log in, switch accounts, or contact support.";
    } else {
      title = "Something went wrong";
      message = error.statusText || message;
    }
  } else if (error instanceof Error) {
    // Hide stack in production; show friendly text
    message = error.message || message;
  }

  return (
    <div className="error-shell">
      <div className="error-card">
        <div className="error-icon" aria-hidden="true">
          ⚠️
        </div>

        {statusCode && <div className="error-code">Error {statusCode}</div>}

        <h1 className="error-title">{title}</h1>
        <p className="error-message">{message}</p>

        <div className="error-actions">
          <Link to="/" className="btn btn-secondary">
            Back to Home
          </Link>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.location.reload();
              }
            }}
          >
            Retry
          </button>
        </div>

        {/* Optional: subtle technical info in dev; safe to ignore if no error.message */}
        {!isRouteErrorResponse(error) && error instanceof Error && (
          <details className="error-details">
            <summary>Technical details</summary>
            <pre>{error.stack || error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
