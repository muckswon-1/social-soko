import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { refreshUser, verifyEmail } from '../../features/auth/authThunk';
import { useDispatch, useSelector } from 'react-redux';
import { authLoadingSelector, authUserSelector } from '../../features/auth/authSlice';


const VerifyEmail = () => {
 
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [successFlag, setSuccessFlag] = useState(false);

  const ranRef = useRef(false);

  const loading  = useSelector(authLoadingSelector);
  const user = useSelector(authUserSelector);
  const dispatch = useDispatch();

  useEffect(() => {

    if(ranRef.current) return;
    ranRef.current = true;
    const verifyToken = searchParams.get('token');

    
    if (!verifyToken) {
      setError('Invalid verification link. Please request a new verification email.');
   
      return;
    }


    // Simulate API call to verify token
    const checkEmailVerified = async () => {
      try {
        
         const  res = await dispatch(verifyEmail({token:verifyToken})).unwrap();

         const success = res?.success;

         console.log(success);

         if(success){
              setMessage('Your email has been verified successfully!');
              dispatch(refreshUser());

              setSuccessFlag(true);

              // Navigate to login / dashboard based on user authentication status
              setTimeout(() => {
                navigate(user ? '/dashboard/account' : '/login');
                }, 3000);
         }

      } catch (err) {
        console.error(err);
        setError('Email verification failed. Please try again or request a new verification email.');
        setMessage('Verification failed');
      }
    };

    checkEmailVerified();
  }, [searchParams, navigate, user]);

  if (loading) {
    return (
      <div className="verification-container">
        <div className="verification-card">
          <div className="loading-spinner"></div>
          <p>Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="verification-container">
      <div className="verification-card">
        {successFlag ? (
          <>
            <div className="success-icon">✓</div>
            <h2>Email Verified</h2>
            <p>{message}</p>
            <p className="redirect-message">You will be redirected to Social Soko</p>
          </>
        ) : (
          <>
            <div className="error-icon">⚠️</div>
            <h2>Verification Failed</h2>
            <p>{error}</p>
            <div className="verification-actions">
              <button 
                className="btn btn-outline"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </button>
              <button 
                className="btn"
                onClick={() => navigate('/resend-verification')}
              >
                Resend Verification Email
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;