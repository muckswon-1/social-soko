import React, { useEffect, useState } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
  useLocation,
  useNavigate,
} from "react-router";

import authStyles from "../../styles/auth/auth.css?url";
import formStyles from "../../styles/forms/forms.css?url";
import { createServerApi } from "../../lib/api.server";
import {
  validateAuthForm,
  hasErrors,
  toErrorList,
} from "./utils/authUtils";
import { normaliseAuthGenericError, normaliseMessageResponse } from "../../features/auth/authTransformers";

/** @typedef {import("../../types/formError").FormError} FormError */
/** @typedef {import("../../types/common").NullableString} NullableString */
/** @typedef {{ password: string; confirmPassword: string }} ResetPasswordForm */

export function links() {
  return [
    { rel: "stylesheet", href: authStyles },
    { rel: "stylesheet", href: formStyles },
  ];
}

export function meta() {
  return [{ title: "Social Soko | Reset Password" }];
}

/**
 * Reset Password action
 * - Validates password using the same rules as login (via validateAuthForm)
 * - Validates confirmPassword (match)
 * - Calls backend /auth/reset-password/:token via server API
 * - Returns structured errors/success similar to login & forgot-password
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
        fieldErrors: {},
        formError: "Password reset link is invalid or missing.",
        values: { password: "", confirmPassword: "" },
      },
      { status: 400 },
    );
  }

  const formData = await request.formData();

  /** @type {ResetPasswordForm} */
  const values = {
    password: String(formData.get("password") || ""),
    confirmPassword: String(formData.get("confirmPassword") || ""),
  };

  /** @type {FormError} */
  const fieldErrors = {};

  // 🔐 Use the same password validation as login.
  // Assumes validateAuthForm knows how to handle "reset_password_form".
  const passwordValidationErrors = validateAuthForm(
    { password: values.password },
    "reset_password_form",
  );

  if (passwordValidationErrors.password) {
    fieldErrors.password = passwordValidationErrors.password;
  }

  // Confirm password checks (not part of login validator)
  if (passwordValidationErrors.confirmPassword) {
    fieldErrors.confirmPassword = passwordValidationErrors.confirmPassword;
  }

  if (hasErrors(fieldErrors)) {
    return Response.json(
      {
        ok: false,
        fieldErrors,
        formError: "Please fix the errors below.",
        values,
      },
      { status: 400 },
    );
  }

  const api = createServerApi(request);

  try {
    const response = await api.post(
      `/auth/reset-password/${token}`,
      { password: values.password },
      { _skipRefresh: true },
    );

    const normalise = normaliseMessageResponse(response)

    const message = normalise.message || "Password reset successful. You can now log in with your new password.";

    return Response.json(
      {
        ok: true,
        fieldErrors: {},
        formError: "",
        values: { password: "", confirmPassword: "" },
        message,
      },
      { status: 200 },
    );
  } catch (error) {
    const normalised = normaliseAuthGenericError(
      error,
      "Failed to reset password. Please try again.",
    );

    return Response.json(
      {
        ok: false,
        fieldErrors: {},
        formError:
          normalised.error || "Failed to reset password. Please try again.",
        values,
      },
      { status: normalised.status || 400 },
    );
  }
}

export default function PasswordResetFormRoute() {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();

  const isSubmitting = navigation.state === "submitting";

  /** @type {{
   *   ok?: boolean,
   *   fieldErrors?: FormError,
   *   formError?: string,
   *   values?: ResetPasswordForm,
   *   message?: string
   * } | undefined} */
  const actionData = useActionData();

  /** @type {FormError} */
  const fieldErrors = actionData?.fieldErrors || {};
  const formError = actionData?.formError || "";
  /** @type {ResetPasswordForm} */
  const values = actionData?.values || { password: "", confirmPassword: "" };

  const successMessage =
    actionData?.ok && actionData.message
      ? actionData.message
      : actionData?.ok
      ? "Password reset successful."
      : "";

  const [countdown, setCountdown] = useState(5);

  const isSuccess = !!actionData?.ok;

  // Start/reset countdown when we have a successful reset
  useEffect(() => {
    if (isSuccess) {
      setCountdown(5);
    }
  }, [isSuccess]);

  // Redirect after countdown hits 0
  useEffect(() => {
    if (!isSuccess) return;

    if (countdown === 0) {
      navigate("/login");
      return;
    }

    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [isSuccess, countdown, navigate]);

  // Scroll to first error like login/forgot-password
  useEffect(() => {
    if (!formError && (!fieldErrors || Object.keys(fieldErrors).length === 0)) {
      return;
    }

    const el =
      document.querySelector(".auth-error") ||
      document.querySelector(".form-error");

    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [formError, fieldErrors]);

  // Normalise password errors as list (like login)
  const passwordErrorItems = toErrorList(fieldErrors.password);

  // Confirm password error can be string or array – simplify to first string
  let confirmPasswordError = "";
  if (Array.isArray(fieldErrors.confirmPassword)) {
    confirmPasswordError = fieldErrors.confirmPassword[0] || "";
  } else if (typeof fieldErrors.confirmPassword === "string") {
    confirmPasswordError = fieldErrors.confirmPassword;
  }

  // If success → show success card with countdown
  if (isSuccess) {
    return (
      <>
        <title>Social Soko | Reset Password</title>
        <div className="page page-auth">
          <main className="main-content">
            <div className="card auth-card">
              <h2 className="auth-title">Password reset successful</h2>
              <p className="auth-success">
                {successMessage}
                <br />
                <small>
                  You'll be redirected to login in {countdown} seconds.
                </small>
              </p>
              <p className="auth-footer-links">
                <Link className="auth-link" to="/login">
                  Go to login now
                </Link>
              </p>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <title>Social Soko | Reset Password</title>
      <div className="page page-auth">
        <main className="main-content">
          <div className="card auth-card">
            <h2 className="auth-title">Reset your password</h2>
            <p className="auth-subtitle">
              Must meet the same requirements as your login password.
            </p>

            {/* Top-level error banner */}
            {formError && <div className="auth-error">{formError}</div>}

            <Form className="auth-form" method="post" noValidate>
              <div className="form-field">
                <label htmlFor="password" className="form-label">
                  New password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  autoComplete="new-password"
                  required
                  defaultValue={values.password}
                  disabled={isSubmitting}
                />
                {passwordErrorItems.length > 0 && (
                  <div className="form-error">
                    <ul className="form-error-list">
                      {passwordErrorItems.map((msg, idx) => (
                        <li key={idx}>{msg}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  autoComplete="new-password"
                  required
                  defaultValue={values.confirmPassword}
                  disabled={isSubmitting}
                />
                {confirmPasswordError && (
                  <div className="form-error">{confirmPasswordError}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary auth-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Resetting..." : "Reset password"}
              </button>
            </Form>

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
    </>
  );
}
