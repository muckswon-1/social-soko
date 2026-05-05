import React, { useEffect } from "react";
import {
  Form,
  Link,
  useActionData,
  useNavigation,
} from "react-router";

import styles from "../../styles/auth/auth.css?url";
import formStyles from "../../styles/forms/forms.css?url";

import { hasErrors, toErrorList, validateAuthForm } from "./utils/authUtils";
import { createServerApi } from "../../lib/api.server";
import {
  normaliseAuthGenericError,
  normaliseMessageResponse,
} from "../../features/auth/authTransformers";
import { useNavigate } from "react-router";

/**
 * @typedef {import("../../types/reactRouterTypes").ActionArgs} ActionArgs
 * @typedef {import("../../types/authForm").RegisterForm} RegisterForm
 * @typedef {import("../../types/formError").FormError} FormError
 */



export function links() {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
    {
      rel: "stylesheet",
      href: formStyles,
    },
  ];
}

export function meta() {
  return [{ title: "Social Soko | Register" }];
}

export function loader() {
  return null;
}

/**
 * Register action
 *
 * 1) Local validation
 * 2) Call /auth/register on backend
 * 3) On success: return ok + message (no redirect; UI shows success)
 * 4) On failure: return field + form errors (normalized)
 *
 * @param {ActionArgs} args
 */
export async function action({ request }) {
  const formData = await request.formData();

  /** @type {RegisterForm} */
  const values = {
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
    confirmPassword: String(formData.get("confirmPassword") || ""),
  };

  // 1) Local validation (shared validator in authUtils)
  const fieldErrors = validateAuthForm(values, "register_form");

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

  // 2) Call backend register endpoint via server API
  const api = createServerApi(request);

  try {
    const response = await api.post("/auth/register", {
      email: values.email,
      password: values.password,
    });

    const normalised = normaliseMessageResponse(
      response,
      "Account created successfully.",
    );

    return Response.json(
      {
        ok: normalised.success,
        fieldErrors: {},
        formError: "",
        values: {
          email: values.email,
          password: "",
          confirmPassword: "",
        },
        message: normalised.message,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[register action] error:", error?.response || error);

    const normalised = normaliseAuthGenericError(error);

    return Response.json(
      {
        ok: false,
        fieldErrors: {},
        formError: normalised.error || normalised.message,
        values,
      },
      { status: normalised.status || 400 },
    );
  }
}

export default function Register() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  /** @type {{ ok?: boolean, fieldErrors?: FormError, formError?: string, values?: RegisterForm, message?: string } | undefined} */
  const actionData = useActionData();

  const fieldErrors = actionData?.fieldErrors || {};
  const formError = actionData?.formError || "";

  const values =
    actionData?.values ||
    /** @type {RegisterForm} */ ({
      email: "",
      password: "",
      confirmPassword: "",
    });

  const successMessage =
    actionData?.ok && actionData.message
      ? actionData.message
      : actionData?.ok
      ? "Account created successfully. You can now log in."
      : "";

  const passwordErrorItems = toErrorList(fieldErrors.password);

  // -----------------------------
  // AUTO REDIRECT AFTER SUCCESS
  // -----------------------------
  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        navigate("/login");
      }, 1800);

      return () => clearTimeout(timeout);
    }
  }, [successMessage, navigate]);

  // Scroll to error feedback
  useEffect(() => {
    if (formError || Object.keys(fieldErrors).length > 0) {
      const el =
        document.querySelector(".auth-error") ||
        document.querySelector(".form-error");
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [formError, fieldErrors]);

  return (
    <div className="page page-auth">
      <main className="main-content">
        <div className="card auth-card">
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">
            Join Social Soko and start building trusted B2B connections.
          </p>

          {/* SUCCESS STATE */}
          {successMessage && (
            <div className="auth-success">
              {successMessage}
              <br />
              <small>You will be redirected shortly…</small>
            </div>
          )}

          {/* ERROR STATE */}
          {!successMessage && formError && (
            <div className="auth-error">{formError}</div>
          )}

          {/* Disable form when succeeded */}
          <Form
            method="post"
            className="auth-form"
            noValidate
            style={successMessage ? { opacity: 0.45, pointerEvents: "none" } : {}}
          >
            {/* EMAIL */}
            <div className="form-field">
              <label htmlFor="email" className="form-label">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-control"
                autoComplete="email"
                defaultValue={values.email}
                disabled={!!successMessage}
              />

              {fieldErrors.email && (
                <div className="form-error">{fieldErrors.email}</div>
              )}
            </div>

            {/* PASSWORD */}
            <div className="form-field">
              <label htmlFor="password" className="form-label">
                Password
              </label>

              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-control"
                autoComplete="new-password"
                disabled={!!successMessage}
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

            {/* CONFIRM PASSWORD */}
            <div className="form-field">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="form-control"
                autoComplete="new-password"
                disabled={!!successMessage}
              />

              {fieldErrors.confirmPassword && (
                <div className="form-error">
                  {fieldErrors.confirmPassword}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-button"
              disabled={isSubmitting || !!successMessage}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>
          </Form>

          <div className="auth-footer-links">
            <p>
              Already have an account?{" "}
              <Link className="auth-link" to="/login">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
