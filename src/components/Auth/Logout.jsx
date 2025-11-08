import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { logout } from '../../features/auth/authThunk';
import { useDispatch } from 'react-redux';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await dispatch(logout()).unwrap();
      } finally {
        navigate('/login')
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="loading-container">
      <p>Logging out...</p>
    </div>
  );
};

export default Logout;