import React from "react";
import {
  Form,
  useActionData,
  useNavigation,
  redirect,
  Link,
} from "react-router";

import { store } from "../../store";
import { register as registerThunk } from "../../features/auth/authThunk";

import styles from "../../styles/auth/auth.css?url";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
}

export function meta() {
  return [{ title: "Social Soko | Register" }];
}

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email")?.trim();
  const password = formData.get("password")?.trim();
  const confirmPassword = formData.get("confirmPassword")?.trim();
  const role = formData.get("role") || "customer";

  if (!email || !password || !confirmPassword) {
    return {
      error: "Please fill in all required fields.",
    };
  }

  if (password !== confirmPassword) {
    return {
      error: "Passwords do not match.",
    };
  }

  if (password.length < 6) {
    return {
      error: "Password must be at least 6 characters.",
    };
  }

  try {
    const result = await store
      .dispatch(
        registerThunk({
          email,
          password,
          role,
        }),
      )
      .unwrap();

    if (result?.success) {
      return redirect("/login?registered=1");
    }

    return {
      error: result?.error || "Registration failed. Please try again.",
    };
  } catch (err) {
    return {
      error: err?.message || "An error occurred during registration.",
    };
  }
}

export default function Register() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="page page-auth">
      <main className="main-content">
        <div className="card auth-card">
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">
            Join Social Soko and start building trusted B2B connections.
          </p>

          {actionData?.error && (
            <div className="auth-error">{actionData.error}</div>
          )}

          <Form method="post" className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="form-input"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="form-input"
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="form-input"
                defaultValue="customer"
              >
                <option value="customer">Customer</option>
                <option value="business">Business Owner</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-button"
              disabled={isSubmitting}
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
