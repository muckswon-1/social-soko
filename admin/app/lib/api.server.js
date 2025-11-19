// app/lib/api.server.js
import axios from "axios";
import serverGetCookieFromHeader from "./csrf.server";


const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

export function createServerApi(request) {
  const cookieHeader = request.headers.get("cookie") || "";

  const api = axios.create({
    baseURL: `${BACKEND_URL}/api/v1`,
    timeout: 20000,
    withCredentials: true,
  
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });

  api.interceptors.request.use((config) => {
    const method = (config.method || "").toUpperCase();
    const unsafe = /^(POST|PUT|PATCH|DELETE)$/.test(method);
    const url = config.url || "";

    const isPublicAuth =
      /^\/auth\/(login|register|forgot-password|send-verification-email|verify-email(?:\/[^/]+)?|reset-password(?:\/.*)?|refresh-token)$/i.test(
        url,
      );

    if (unsafe && !isPublicAuth) {
      const csrf = serverGetCookieFromHeader("XSRF-TOKEN", cookieHeader);
      if (csrf) {
        config.headers = config.headers || {};
        config.headers["X-CSRF-TOKEN"] = csrf;
      }
    }

    return config;
  });

  // your 401/refresh-token logic can live here (server-side only) if needed

  let isRefreshing = false;
  let waiters = [];

  const notifyWaiters = () => {
    waiters.forEach((request) => request());
    waiters = [];
  };

  api.interceptors.response.use(
    (r) => r,
    async (error) => {
      const { config, response } = error;

      if (!response) return Promise.reject(error); // network timeout

      console.warn(
        "[API error]",
        config?.method?.toUpperCase(),
        config?.url,
        response?.status,
        response?.data,
      );

      // Don't attempt to refresh for public auth endpoints or explcit opt-out

      // Could be public routes: verify-email|send-verification-email|forgot-password|reset-password|email-update-with-digit-code|send-verification-digits-code|reset-password-with-digit-code

      const url = (config && config.url) || "";
      // const isPublicAuth = /^\/auth\/(verify-email| send-verification-email | forgot-password)/.test(url);
      const isPublicAuth =
        /^\/auth\/(register|login|forgot-password|send-verification-email|verify-email(?:\/[^/]+)?|reset-password(?:\/.*)?|email-update-with-digit-code|refresh-token)$/.test(
          url,
        );

      console.log(`is ${url} a public auth route?: ${isPublicAuth}`);

      if (isPublicAuth || config?._skipRefresh) {
        return Promise.reject(error);
      }

      if (response.status === 401 && !config._retry) {
        // queue requests while refreshing
        if (isRefreshing) {
          await new Promise((resolve) => waiters.push(resolve));
          config._retry = true;
          return api(config);
        }

        isRefreshing = true;
        config._retry = true;

        try {
          await api.post("/auth/refresh-token", {}, { _skipRefresh: true }); // uses refresh cookie, sets new access cookie
          notifyWaiters();
          return api(config);
        } catch (error) {
          // refresh failed - user mut login again
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    },
  );

  return api;
}
