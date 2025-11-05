// RootLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';

import { ToastContainer } from 'react-toastify';
import { ProfileProvider } from './hooks/useProfile';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Outlet /> {/* children routes render here */}
      </ProfileProvider>
      <ToastContainer />
    </AuthProvider>
  );
}
