import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { forgotPassword } from '../../features/auth/authThunk';
import './forgot-password.css';
import { useDispatch, useSelector } from 'react-redux';
import { authLoadingSelector } from '../../features/auth/authSlice';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [emailLinkSentSuccess, setEmailLinkSentSuccess] = useState(false);
  
  const loading = useSelector(authLoadingSelector);
  const dispatch = useDispatch();
  
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    

    try {
      const result =  await dispatch(forgotPassword({email})).unwrap();
      
      if (result.success) {
        setEmailLinkSentSuccess(true);
       
      } else {
        setEmailLinkSentSuccess(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } 
  };

  return (
   
    emailLinkSentSuccess ? (
        <>
          <p>Password Reset Link Sent to your email.</p>
          <p> You can now close this window</p>
          </>
    ):(


     <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Forgot Password</h2>
        
        <p className="auth-form-subtitle">
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        
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
    )
   
  );
};

export default ForgotPassword;