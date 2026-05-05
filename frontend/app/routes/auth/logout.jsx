// app/routes/logout.jsx

import React from "react";
import { redirect } from "react-router";

import authStyles from "../../styles/auth/auth.css?url";
import { store } from "../../store";
import { clearAuth } from "../../features/auth/authSlice";
import { createServerApi } from "../../lib/api.server";

/**
 * @typedef {{ request: Request }} ActionArgs
 */

/* ----------------------------------------
 * meta / links
 * ------------------------------------- */

export function links() {
  return [{ rel: "stylesheet", href: authStyles }];
}

export function meta() {
  return [{ title: "Social Soko | Logging out" }];
}

/* ----------------------------------------
 * loader
 *  - If user hits /logout via GET, just render the component.
 * ------------------------------------- */

export function loader() {
  return null;
}

/* ----------------------------------------
 * action
 *
 * 1) Calls backend /auth/logout
 * 2) Clears Redux auth state
 * 3) Redirects to /login
 * ------------------------------------- */

/**
 * @param {ActionArgs} args
 */
export async function action({ request }) {
  const api = createServerApi(request);

  console.log("[logout action] calling backend logout")

  try {
    await api.post("/auth/logout", {}, { _skipRefresh: true });
  } catch (error) {
    console.error("[logout action] backend logout failed", error?.response || error);
    // Even if backend fails, we still clear client auth.
  }

  // Clear Redux auth state
  store.dispatch(clearAuth());

  // Redirect user to login page
  return redirect("/login");
}

/* ----------------------------------------
 * Component
 *
 * In most cases, this will not be visible because the POST action
 * will redirect immediately. But it's a nice fallback.
 * ------------------------------------- */

export default function LogoutRoute() {
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
