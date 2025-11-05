import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import './forgot-password.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const result = await forgotPassword(email);
      
      if (result.success) {
        setMessage(result.message);
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        
        <p className="auth-form-subtitle">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {message && (
          <div className="auth-message auth-message-success">
            {message}
          </div>
        )}
        
        {error && (
          <div className="auth-message auth-message-error">
            {error}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="auth-button"
        >
          {loading ? (
            <span className="auth-button-loading">
              <span className="auth-spinner"></span>
              Sending Reset Link...
            </span>
          ) : (
            'Send Reset Link'
          )}
        </button>
        
        <div className="auth-form-footer">
           <p> <Link to="/login">Back to login</Link></p>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;