import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import './password-reset-form.css';
import { useAuth } from '../../hooks/useAuth';

const PasswordResetForm = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);

  const navigate = useNavigate();
  const location = useLocation();
  const { updatePassword } = useAuth();

  // Extract token & id from URL
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get('token');
  const id = urlParams.get('id');

  const validate = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear field-level error as user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validate();

    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await updatePassword(id, token, formData.password);

      if (result.success) {
        setSuccess(true);
        setCountdown(5);
      } else {
        setError(result.error || 'Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError(err?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success countdown → navigate to login
  useEffect(() => {
    if (!success) return;

    if (countdown === 0) {
      navigate('/login');
      return;
    }

    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [success, countdown, navigate]);

  if (success) {
    return (
      <div className="auth-form-container">
        <div className="auth-form">
          <h2>Password Reset Successful</h2>
          <p className="success-message">
            Your password has been reset successfully. You will be redirected to the login page in {countdown} seconds.
          </p>
          <p className="success-message">
            <Link to="/login">Click here</Link> to go to login now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Reset Your Password</h2>
        <p className="form-description">
          Enter your new password below. It must be at least 8 characters long and contain uppercase,
          lowercase, and a number.
        </p>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            autoComplete="new-password"
            placeholder="Enter your new password"
            required
          />
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
            autoComplete="new-password"
            placeholder="Confirm your new password"
            required
          />
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        <div className="auth-form-footer">
          <p>
            <Link to="/login">Back to login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default PasswordResetForm;
