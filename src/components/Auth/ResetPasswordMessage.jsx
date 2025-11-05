import React from 'react';
import { Link } from 'react-router-dom';
import './reset-password-message.css';

const ResetPasswordMessage = () => {
  return (
    <div className="auth-form-container">
      <div className="auth-form">
        <h2>Password Reset Requested</h2>
        <div className="success-message">
          <p>We've sent a password reset link to your email address.</p>
          <p>Please check your inbox (and spam/junk folder) and click the link to reset your password.</p>
        </div>
        <div className="auth-form-footer">
          <p>
            <Link to="/login">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordMessage;