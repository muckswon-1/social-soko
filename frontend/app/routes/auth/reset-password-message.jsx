import React from "react";
import { Link } from "react-router";

import authStyles from "../styles/auth/auth.css?url";

export function links() {
  return [{ rel: "stylesheet", href: authStyles }];
}

export function meta() {
  return [
    {
      title: "Social Soko | Password Reset Requested",
    },
  ];
}

export default function ResetPasswordMessageRoute() {
  return (
    <div className="page page-auth">
      <main className="main-content">
        <div className="card auth-card">
          <h2 className="auth-title">Password reset requested</h2>
          <div className="auth-success">
            <p>We've sent a password reset link to your email.</p>
            <p>
              Please check your inbox (and spam) and follow the link to
              continue.
            </p>
          </div>
          <div className="auth-footer-links">
            <p>
              <Link className="auth-link" to="/login">
                Back to login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
