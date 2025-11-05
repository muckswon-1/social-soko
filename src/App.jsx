import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
//import {createBrowserRouter, RouterProvider, Navigate} from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';

import LandingPage from './pages/landing-page/LandingPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Logout from './components/Auth/Logout';

import ForgotPassword from './components/Auth/ForgotPassword';
import PasswordResetForm from './components/Auth/PasswordResetForm';


//import Profile from './pages/dashboard/Profile';


import { ToastContainer } from 'react-toastify';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Privacy from './menu/privacy/Privacy';
 import VerifyEmail from './components/Auth/VerifyEmail'; // verify email from link sent to email
import UserProfile from './menu/profile/UserProfileTab';
import RootRouteError from './RootRouteError';
import { ProfileProvider } from './hooks/useProfile';
import Profile from './menu/profile/Profile';
import RootLayout from './RootLayout';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

// Public route component
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return !user ? children : <Navigate to="/dashboard" />;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <Routes>
            {/* Public */}
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <PasswordResetForm />
                </PublicRoute>
              }
            />

            {/* Auth-only */}
            <Route
              path="/logout"
              element={
                <ProtectedRoute>
                  <Logout />
                </ProtectedRoute>
              }
            />

            {/* Dashboard layout with nested routes */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* default tab */}
              {/* <Route index element={<Profile />} /> */}
              {/* <Route path="profile" element={<Profile />} /> */}
              <Route path="privacy-settings" element={<Privacy />} />
              <Route path='profile' element={<Profile />} />
              {/* Add more tabs later:
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="business" element={<BusinessSettings />} /> */}
            </Route>

            {/* Optional: keep old verify-email route but redirect to Account tab */}
            <Route
              path="/verify-email"
              element={<VerifyEmail/>}
            />
          </Routes>
        
      
      <ToastContainer />
      </ProfileProvider>
      </AuthProvider>
    </Router>

    
  );
};

export default App;
