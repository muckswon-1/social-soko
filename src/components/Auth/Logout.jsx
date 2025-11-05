import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router';

const Logout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      navigate('/login');
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