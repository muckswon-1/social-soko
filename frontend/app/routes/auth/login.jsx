import { Form, redirect, useNavigation, Link, useActionData, useNavigate } from "react-router";
import styles from "../../styles/auth/login.css?url";

import {useDispatch} from "react-redux"
import { useState } from "react";
import { login } from "../../features/auth/authThunk";

export function links() {
    return [{rel: "stylesheet", href: styles}]
}


export function meta() {
    return [{title: "Social Soko | Login"}]
}


export default function Login() {
    
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";
    const navigate = useNavigate();

    const dispatch = useDispatch();


    const [formData, setFormData ]= useState({
      email: "",
      password: ""
    });
    const [error, setError] = useState("");

    //handle input change
    const handleInputChange = (e) => {
       const {name, value} = e.target;
       setFormData({...formData, [name]: value});

    }


   

    //Live validation without use state
    const handleEmailInput = (e) => {
        const value = e.target.value.trim();
        if(!value) {
            e.target.setCustomValidity("Email is required");
        }else  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)){
            e.target.setCustomValidity("Enter a valid email address")
        }else {
            e.target.setCustomValidity("")
        }
        e.target.reportValidity();
    }


    const handlePasswordInput = (e) => {
        const value = e.target.value;
    if (!value) {
      e.target.setCustomValidity("Password is required.");
    } else if (value.length < 6) {
      e.target.setCustomValidity("Password must be at least 6 characters.");
    } else {
      e.target.setCustomValidity("");
    }
    e.target.reportValidity();
    }

    const handleSubmit =  async (e) => {
       e.preventDefault();

       try {
        const response = await dispatch(login({email: formData.email, password: formData.password})).unwrap();
        if(response.success) {
          setError("")
          navigate('/dashboard')
        }
       } catch (error) {
        console.error('Error during login: ', error);
        setError(error.error || 'Login failed. Please try again')
       }

    }

    return (
        <div className="page page-auth">
      <main className="main-content">
        <div className="card auth-card">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">
            Log in to access your Social Soko workspace.
          </p>

          {error && (
            <div className="auth-error">{error}</div>
          )}

          <Form  
          method="post" 
          className="auth-form"
          onSubmit={handleSubmit}
          noValidate
          
          >
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                className="form-input"
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
                onInput={handleEmailInput}
                onChange={handleInputChange}
              />
               <span className="field-hint">Use your business or account email.</span>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                className="form-input"
                type="password"
                id="password"
                name="password"
                required
                autoComplete="current-password"
                onInput={handlePasswordInput}
                onChange={handleInputChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-button"
              disabled={isSubmitting}
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
                Reset password
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
    )
}