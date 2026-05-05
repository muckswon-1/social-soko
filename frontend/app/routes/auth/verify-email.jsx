import React, { useEffect, useRef } from "react";
import {
  useNavigate,
  useActionData,
  useNavigation,
  useSubmit,
  Link,
} from "react-router";

import authStyles from "../../styles/auth/auth.css?url";
import verifyStyles from "../../styles/auth/verify-email.css?url";
import { createServerApi } from "../../lib/api.server";
import { normaliseAuthGenericError, normaliseMessageResponse } from "../../features/auth/authTransformers";

/** @typedef {{ ok?: boolean, message?: string, error?: string, loggedIn?: boolean }} VerifyEmailResult */

export function links() {
  return [
    { rel: "stylesheet", href: authStyles },
    { rel: "stylesheet", href: verifyStyles },
  ];
}

export function meta() {
  return [{ title: "Social Soko | Verify Email" }];
}

/**
 * Verify Email action
 *
 * - Reads token from the URL (?token=...)
 * - Calls backend /auth/verify-email/:token
 * - Optionally checks if user is logged in via /auth/verify
 * - Returns structured JSON for the component to render
 *
 * @param {{ request: Request }} args
 */
export async function action({ request }) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";

  if (!token) {
    return Response.json(
      {
        ok: false,
        message: "",
        error:
          "Invalid verification link. Please request a new verification email.",
        loggedIn: false,
      },
      { status: 400 },
    );
  }

  const api = createServerApi(request);

  try {
    // Verify email with token
    const response = await api.post(
      `/auth/verify-email/${token}`,
      {},
      { _skipRefresh: true, withCredentials: false },
    );

    const normalised = normaliseMessageResponse(response);

    const message =  normalised.message || "Your email has been verified successfully!";

    // Optionally, check if the user is logged in (has a valid session cookie)
    let loggedIn = false;
    try {
      const verifyResponse = await api.get("/auth/verify", {
        _skipRefresh: true,
      });
      if (verifyResponse?.data?.user) {
        loggedIn = true;
      }
    } catch {
      // If /auth/verify fails, we just treat as not logged in
      loggedIn = false;
    }

    return Response.json(
      {
        ok: true,
        message,
        error: "",
        loggedIn,
      },
      { status: 200 },
    );
  } catch (error) {
    const normalised = normaliseAuthGenericError(
      error,
      "Email verification failed. Please try again.",
    );

    return Response.json(
      {
        ok: false,
        message: "",
        error:
          normalised.error ||
          "Email verification failed. Please try again or request a new verification email.",
        loggedIn: false,
      },
      { status: normalised.status || 400 },
    );
  }
}

export default function VerifyEmailRoute() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const navigation = useNavigation();
  const ranRef = useRef(false);

  /** @type {VerifyEmailResult | undefined} */
  const actionData = useActionData();

  const loading =
    navigation.state === "submitting" && (!actionData || !actionData.ok);

  const successFlag = !!actionData?.ok;
  const message =
    actionData?.ok && actionData.message
      ? actionData.message
      : actionData?.ok
      ? "Your email has been verified successfully!"
      : "";
  const error =
    !actionData?.ok && actionData
      ? actionData.error ||
        "Email verification failed. Please try again or request a new verification email."
      : "";

  // Auto-submit the action once on mount
  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    // We don't need to send any body — token is in the URL query string.
    submit(null, { method: "post" });
  }, [submit]);

  // Redirect after success (3 seconds), either to dashboard or login
  useEffect(() => {
    if (!successFlag || !actionData) return;

    const target = actionData.loggedIn ? "/dashboard" : "/login";
    const t = setTimeout(() => navigate(target), 3000);
    return () => clearTimeout(t);
  }, [successFlag, actionData, navigate]);

  // Show loading state while verifying
  if (loading && !successFlag && !error) {
    return (
      <div className="page page-auth">
        <main className="main-content">
          <div className="card auth-card ve-card">
            <div className="ve-spinner" />
            <p className="auth-subtitle">Verifying your email...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page page-auth">
      <main className="main-content">
        <div className="card auth-card ve-card">
          {successFlag ? (
            <>
              <div className="ve-icon ve-icon--success">✓</div>
              <h2 className="auth-title">Email verified</h2>
              <p className="auth-subtitle">{message}</p>
              <p className="form-hint">You&apos;ll be redirected shortly.</p>
            </>
          ) : (
            <>
              <div className="ve-icon ve-icon--error">!</div>
              <h2 className="auth-title">Verification failed</h2>
              <p className="auth-error">{error}</p>
              <div className="inline-actions ve-actions">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => navigate("/login")}
                >
                  Back to login
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => navigate("/resend-verification")}
                >
                  Resend email
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
