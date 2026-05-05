import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import authStyles from "../../styles/auth/auth.css?url";
import formStyles from "../../styles/forms/forms.css?url";
import { authLoadingSelector } from "../../features/auth/authSlice";
import { updatePassword } from "../../features/auth/authThunk";

export function links() {
  return [
    { rel: "stylesheet", href: authStyles },
    { rel: "stylesheet", href: formStyles },
  ];
}

export function meta() {
  return [{ title: "Social Soko | Reset Password" }];
}

export default function PasswordResetFormRoute() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(5);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const loading = useSelector(authLoadingSelector);

  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  const validate = () => {
    const next = {};

    if (!formData.password) {
      next.password = "Password is required";
    } else if (formData.password.length < 8) {
      next.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      next.password = "Must contain uppercase, lowercase, and a number";
    }

    if (!formData.confirmPassword) {
      next.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      next.confirmPassword = "Passwords do not match";
    }

    return next;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setError("");

    try {
      const result = await dispatch(
        updatePassword({
          password: formData.password,
          token,
        }),
      ).unwrap();

      if (result?.success) {
        setSuccess(true);
        setCountdown(5);
      } else {
        setError(
          result?.error || "Failed to reset password. Please try again.",
        );
      }
    } catch (err) {
      console.log(err);
      setError(err?.error || "Failed to reset password. Please try again.");
    }
  };

  useEffect(() => {
    if (!success) return;
    if (countdown === 0) {
      navigate("/login");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [success, countdown, navigate]);

  if (success) {
    return (
      <div className="page page-auth">
        <main className="main-content">
          <div className="card auth-card">
            <h2 className="auth-title">Password reset successful</h2>
            <p className="auth-success">
              You&apos;ll be redirected to login in {countdown} seconds.
            </p>
            <p className="auth-footer-links">
              <Link className="auth-link" to="/login">
                Go to login now
              </Link>
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="page page-auth">
      <main className="main-content">
        <div className="card auth-card">
          <h2 className="auth-title">Reset your password</h2>
          <p className="auth-subtitle">
            Must be at least 8 characters and include uppercase, lowercase, and
            a number.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                New password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              {errors.password && (
                <div className="form-error">{errors.password}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              {errors.confirmPassword && (
                <div className="form-error">{errors.confirmPassword}</div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-button"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>

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
