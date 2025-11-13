import React, { useState } from "react";
import {

  Link,
  useNavigate,
} from "react-router";


import { register } from "../../features/auth/authThunk";


import styles from "../../styles/auth/auth.css?url";
import formStyles from "../../styles/forms/forms.css?url";
import { validateRegisterForm } from "../../utils/formValidation";
import { useDispatch, useSelector } from "react-redux";
import { authLoadingSelector } from "../../features/auth/authSlice";
import { toast } from "react-toastify";

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


export default function Register() {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  const loading = useSelector(authLoadingSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) =>({...prev,[name]: value}));

    if(errors[name]){
      setErrors((prev) =>({...prev, [name]: ""}));
    }

    if(error) setError("")
    
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validateRegisterForm(formData);

    if(Object.keys(fieldErrors).length > 0){
      setErrors(fieldErrors);
      return;
    }

    setError("");

    try {
      const result = await dispatch(register({email: formData.email, password: formData.password})).unwrap();

      if(result?.success) {
        toast.success("Registration successful. You can now login.")
        navigate('/login', {replace: true});
      }

     

    } catch (error) {
      console.error('Error in register: ', error);
      setError(error?.error || "An error occurred during registration")
    }

  }



 
  return (
    <div className="page page-auth">
      <main className="main-content">
        <div className="card auth-card">
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">
            Join Social Soko and start building trusted B2B connections.
          </p>

          {error && (
            <div className="auth-error">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" >
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                onChange={handleChange}
                required
                className="form-input"
                autoComplete="email"
              />
                    {errors.email && (
                <div className="form-error">{errors.email}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={handleChange}
                required
                className="form-input"
                autoComplete="new-password"
              />
               {errors.password && (
                <div className="form-error">{errors.password}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                onChange={handleChange}
                required
                className="form-input"
                autoComplete="new-password"
              />
                   {errors.confirmPassword && (
                <div className="form-error">{errors.confirmPassword}</div>
              )}
            </div>

            {/* <div className="form-group">
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
            </div> */}

            <button
              type="submit"
              className="btn btn-primary auth-button"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

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
