
import {
  Form,
  useNavigation,
  Link,
  useActionData,
  redirect,
} from "react-router";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";

import styles from "../../styles/auth/auth.css?url";
import formStyles from "../../styles/forms/forms.css?url";
import { createServerApi } from "../../lib/api.server";
import {
  normaliseUserLoginError,
  normaliseUserLoginResponse
} from "../../features/auth/authTransformers";
import {  hasErrors, toErrorList, validateAuthForm } from "./utils/authUtils";
import { forwardSetCookie } from "../../lib/forwardSetCookie.server";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../../features/auth/authSlice";

import { setUser } from "../../features/auth/authSlice";
import {  store } from "../../store";



/**
 * @typedef {import("../../types/common").StringType} StringType
 * @typedef {import("../../types/formError").FormError} FormError
 * @typedef {import("../../types/responseError").ResponseError} ResponseError
 * @typedef {import("../../types/authForm").LoginFormCredentials} LoginForm
 * @typedef {import("../../types/user").User} User
 */


/* ----------------------------------------
 * meta / links
 * ------------------------------------- */

export function meta() {
  return [{ title: "Social Soko | Login" }];
}

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: formStyles },
  ];
}

/* ----------------------------------------
 * loader
 *  - In future: redirect if already logged in, prefill email, etc.
 * ------------------------------------- */

export function loader() {
  return null;
}

/* ----------------------------------------
 * action
 *
 * Handles:
 *  1) Local validation
 *  2) Calls backend /auth/login via server API
 *  3) Normalizes user + sets Redux auth state
 *  4) Returns structured field/form errors OR success payload
 * ------------------------------------- */

/**
 * @param {{ request: Request }} args
 */
export async function action({ request }) {
  const formData = await request.formData();

  /** @type {LoginForm} */
  const values = {
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  };

  const url = new URL(request.url);
  const nextRaw = url.searchParams.get("next");

  const safeNext = nextRaw && nextRaw.startsWith("/") ? decodeURIComponent(nextRaw) : "/";

  // 1) Local validation
  const fieldErrors = validateAuthForm(values, "login_form");

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

  // // 2) Call backend login endpoint
  try {
    const response = await api.post(
      "/auth/login",
      {
        email: values.email,
        password: values.password,
      },
      { _skipRefresh: true },
    );
     const headers = new Headers();

     const normalised = normaliseUserLoginResponse(response);
     if(normalised.user){
      store.dispatch(setUser(normalised.user));
      console.log(store.getState());
     }



    forwardSetCookie(response, headers);
    return redirect(safeNext, {
      headers,
    });


  } catch (error) {
    /** @type {ResponseError} */
    const normalised = normaliseUserLoginError(error);

    return Response.json(
      {
        ok: false,
        fieldErrors: {},
        formError: normalised.error || "Login failed. Please try again.",
        values,
      },
      { status: normalised.status || 400 },
    );
  }
}

/* ----------------------------------------
 * Component
 * ------------------------------------- */

export default function Login() {
  
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
 



  /** @type {{ ok?: boolean, fieldErrors?: FormError, formError?: string, values?: LoginForm, message?: string user?: User} | undefined} */
  const actionData = useActionData();

  const fieldErrors = actionData?.fieldErrors || {};
  const formError = actionData?.formError || "";
  const values = actionData?.values || { email: "", password: "" };

  const successMessage = actionData?.ok && actionData?.message ? actionData.message : actionData?.ok && actionData?.user ? "Login successful" : "";
  const user = actionData?.user || null;

  console.log("User: ", user);
   

  const passwordErrorItems = toErrorList(fieldErrors.password);


  // Scroll to first error on render/update
   useEffect(() => {
    // No action result yet → nothing to do
    if (!actionData) return;

    const currentFieldErrors = actionData.fieldErrors || {};
    const currentFormError = actionData.formError || "";

    const hasAnyError =
      !!currentFormError || Object.keys(currentFieldErrors).length > 0;

    if (!hasAnyError) return;

    const el =
      document.querySelector(".auth-error") ||
      document.querySelector(".form-error");

    if (el && typeof el.scrollIntoView === "function") {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [actionData]);


  return (
    <div className="page page-auth">
      <main className="main-content">
        <div className="card auth-card">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">
            Log in to access your Social Soko workspace.
          </p>

          {/* Success banner */}
          {successMessage && (
            <div className="auth-success">
              {successMessage}
              <br />
              <small>Redirecting to your dashboard…</small>
            </div>
          )}

          {/* Only show error banner when NOT in success state */}
          {!successMessage && formError && (
            <div className="auth-error">{formError}</div>
          )}

          <Form
            method="post"
            className="auth-form"
            noValidate
            style={successMessage ? { opacity: 0.45, pointerEvents: "none" } : {}}
          >
            {/* Email field */}
            <div className="form-field">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                className="form-control"
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                defaultValue={values.email}
                disabled={!!successMessage}
              />
              {fieldErrors.email && (
                <p className="form-error">{fieldErrors.email}</p>
              )}
              <span className="field-hint">
                Use your business or account email.
              </span>
            </div>

            {/* Password field */}
            <div className="form-field">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                className="form-control"
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
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

            <button
              type="submit"
              className="btn btn-primary auth-button"
              disabled={isSubmitting || !!successMessage}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </Form>

          <div className="auth-footer-links">
            <p>
              Don&apos;t have an account?{" "}
              <Link className="auth-link" to="/register">
                Register here
              </Link>
            </p>
            <p>
              Forgot password?{" "}
              <Link className="auth-link" to="/forgot-password">
                Forgot password
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}





