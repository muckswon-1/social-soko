import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import authStyles from "../../styles/auth/auth.css?url";
import verifyStyles from "../../styles/auth/verify-email.css?url";
import { verifyEmail, refreshUser } from "../../features/auth/authThunk";
import {
  authUserSelector,
  authLoadingSelector,
} from "../../features/auth/authSlice";

export function links() {
  return [
    { rel: "stylesheet", href: authStyles },
    { rel: "stylesheet", href: verifyStyles },
  ];
}

export function meta() {
  return [{ title: "Social Soko | Verify Email" }];
}

export default function VerifyEmailRoute() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [successFlag, setSuccessFlag] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector(authLoadingSelector);
  const user = useSelector(authUserSelector);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    const verifyToken = searchParams.get("token");

    if (!verifyToken) {
      setError(
        "Invalid verification link. Please request a new verification email.",
      );
      return;
    }

    const checkEmailVerified = async () => {
      try {
        const res = await dispatch(
          verifyEmail({
            token: verifyToken,
          }),
        ).unwrap();

        if (res?.success) {
          setMessage("Your email has been verified successfully!");
          setSuccessFlag(true);
          await dispatch(refreshUser());

          setTimeout(() => {
            navigate(user ? "/dashboard/profile" : "/login");
          }, 3000);
        } else {
          setError(
            res?.error || "Email verification failed. Please try again.",
          );
        }
      } catch (err) {
        setError(
          "Email verification failed. Please try again or request a new verification email.",
        );
      }
    };

    checkEmailVerified();
  }, [dispatch, navigate, searchParams, user]);

  if (loading) {
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
