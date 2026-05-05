// app/routes/forgot-password.jsx (or wherever this file lives)

import React, { useEffect } from "react";
import { Form, Link, useActionData, useNavigation } from "react-router";

import authStyles from "../../styles/auth/auth.css?url";
import formStyles from "../../styles/forms/forms.css?url";
import emailValidator from "email-validator";
import { hasErrors } from "./utils/authUtils";
import { createServerApi } from "../../lib/api.server";
import { normaliseAuthGenericError, normaliseMessageResponse } from "../../features/auth/authTransformers";

/** @typedef {import("../../types/formError").FormError} FormError */
/** @typedef {import("../../types/authForm").ForgotPasswordForm} ForgotPasswordForm */
/** @typedef {import("../../types/common").NullableString} NullableString */

export function links() {
  return [
    { rel: "stylesheet", href: authStyles },
    { rel: "stylesheet", href: formStyles },
  ];
}

export function meta() {
  return [{ title: "Social Soko | Forgot Password" }];
}

/**
 * Forgot Password action
 * - Validates email
 * - Returns structured errors like the login action
 * - No backend logic yet (no call to /auth/forgot-password)
 *
 * @param {{ request: Request }} args
 */
export async function action({ request }) {
  const formData = await request.formData();

  /** @type {ForgotPasswordForm} */
  const values = {
    email: String(formData.get("email") || ""),
  };

  /** @type {FormError} */
  const fieldErrors = {};

  /** @type {string[]} */
  const emailErrors = [];

  if (!values.email) {
    emailErrors.push("Email is required.");
  } else if (!emailValidator.validate(values.email)) {
    emailErrors.push("Email is invalid.");
  }

  if (emailErrors.length === 1) {
    fieldErrors.email = emailErrors[0];
  } else if (emailErrors.length > 1) {
    fieldErrors.email = emailErrors;
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

 const apiServer = createServerApi(request);

 try {
  const response = await apiServer.post("/auth/forgot-password", values);

  const normalised = normaliseMessageResponse(response,"Password reset link sent");

  if(normalised.success){
      return Response.json(
    {
      ok: true,
      fieldErrors: {},
      formError: "",
      values,
      message: normalised.message ||
        "If this email is registered, a password reset link will be sent.",
    },
    { status: 200 },
  );
  }

 } catch (error) {
  const resetLinkError = normaliseAuthGenericError(error," Failed to send reset password email");

  return Response.json(
    {
      ok: false,
      fieldErrors: {},
      formError: resetLinkError.error || "Sending passsword reset link failed. Please try again.",
      values,
    },
    { status: resetLinkError.status || 400 },
    
  )
 }


}


export default function ForgotPasswordRoute() {
  const navigation = useNavigation();

  /** @type {{
   *   ok?: boolean,
   *   fieldErrors?: FormError,
   *   formError?: string,
   *   values?: ForgotPasswordForm,
   *   message?: string
   * } | undefined} */
  const actionData = useActionData();

  /** @type {FormError} */
  const fieldErrors = actionData?.fieldErrors || {};
  const formError = actionData?.formError || "";

  /** @type {ForgotPasswordForm} */
  const values = actionData?.values || { email: "" };

  const successMessage =
    actionData?.ok && actionData.message
      ? actionData.message
      : actionData?.ok
      ? "Password reset link sent successfully."
      : "";

  /**@type {boolean} */
  const loading = navigation.state === "submitting";

  // Scroll to first error on render/update (same pattern as login)
  useEffect(() => {
    if (formError || (fieldErrors && Object.keys(fieldErrors).length > 0)) {
      const el =
        document.querySelector(".auth-error") ||
        document.querySelector(".form-error");
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [formError, fieldErrors]);

  return (
    <>
      <title>Social Soko | Forgot Password</title>
      <div className="page page-auth">
        <main className="main-content">
          <div className="card auth-card">
            {successMessage ? (
              <>
                <h2 className="auth-title">Check your email</h2>
                <p className="auth-subtitle">
                  {successMessage}{" "}
                  {values.email && (
                    <>
                      for{" "}
                      <span className="kv-mono">
                        {values.email}
                      </span>
                      .
                    </>
                  )}
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
                  Enter your email and we'll send you a secure link to
                  reset your password.
                </p>

                {/* Top-level form error (same style as login) */}
                {!successMessage && formError && (
                  <div className="auth-error">{formError}</div>
                )}

                <Form
                  className="auth-form"
                  method="post"
                  noValidate
                  style={
                    successMessage
                      ? { opacity: 0.45, pointerEvents: "none" }
                      : {}
                  }
                >
                  <div className="form-field">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control"
                      autoComplete="email"
                      required
                      defaultValue={values.email}
                      disabled={!!successMessage}
                    />
                    {fieldErrors.email && (
                      <p className="form-error">{fieldErrors.email}</p>
                    )}
                    <span className="field-hint">
                      Use the email associated with your account.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary auth-button"
                    disabled={loading || !!successMessage}
                  >
                    {loading ? "Sending reset link..." : "Send reset link"}
                  </button>
                </Form>

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
