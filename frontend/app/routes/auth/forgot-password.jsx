import React, { useState } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import authStyles from "../../styles/auth/auth.css?url";
import formStyles from "../../styles/forms/forms.css?url";
import { forgotPassword } from "../../features/auth/authThunk";
import { authLoadingSelector } from "../../features/auth/authSlice";

export function links() {
  return [
    { rel: "stylesheet", href: authStyles },
    { rel: "stylesheet", href: formStyles },
  ];
}

export function meta() {
  return [{ title: "Social Soko | Forgot Password" }];
}

export default function ForgotPasswordRoute() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailLinkSentSuccess, setEmailLinkSentSuccess] = useState(false);

  const loading = useSelector(authLoadingSelector);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await dispatch(forgotPassword({ email })).unwrap();

      if (result?.success) {
        setEmailLinkSentSuccess(true);
      } else {
        setEmailLinkSentSuccess(false);
        setError(
          result?.error || "Unable to send reset link. Please try again.",
        );
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
    <title>Social Soko | Forgot Password</title>
    <div className="page page-auth">
      <main className="main-content">
        <div className="card auth-card">
          {emailLinkSentSuccess ? (
            <>
              <h2 className="auth-title">Check your email</h2>
              <p className="auth-subtitle">
                We&apos;ve sent a password reset link to{" "}
                <span className="kv-mono">{email}</span>. You can close this
                window or return to login.
              </p>
              <div className="auth-footer-links">
                <Link className="auth-link" to="/login">
                  Back to login
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="auth-title">Forgot Password</h2>
              <p className="auth-subtitle">
                Enter your email and we&apos;ll send you a secure link to reset
                your password.
              </p>

              {error && <div className="auth-error">{error}</div>}

              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-input"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary auth-button"
                  disabled={loading}
                >
                  {loading ? "Sending reset link..." : "Send reset link"}
                </button>
              </form>

              <div className="auth-footer-links">
                <p>
                  <Link className="auth-link" to="/login">
                    Back to login
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
    </>
  );
}
