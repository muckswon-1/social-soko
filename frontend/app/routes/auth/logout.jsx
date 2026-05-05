import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import { logout } from "../features/auth/authThunk";

import authStyles from "../styles/auth/auth.css?url";

export function links() {
  return [{ rel: "stylesheet", href: authStyles }];
}

export function meta() {
  return [{ title: "Social Soko | Logging out" }];
}

export default function LogoutRoute() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const performLogout = async () => {
      try {
        await dispatch(logout()).unwrap();
      } finally {
        if (mounted) {
          navigate("/login");
        }
      }
    };

    performLogout();
    return () => {
      mounted = false;
    };
  }, [dispatch, navigate]);

  return (
    <div className="page page-auth">
      <main className="main-content">
        <div className="card auth-card">
          <p className="auth-subtitle">Logging you out...</p>
        </div>
      </main>
    </div>
  );
}
