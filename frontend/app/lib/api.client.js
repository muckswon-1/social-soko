// app/lib/api.client.js
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

export const apiClient = axios.create({
  baseURL: `${BACKEND_URL}/api/v1`,
  timeout: 20000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  xsrfCookieName: "XSRF-TOKEN",   // cookie name from backend
  xsrfHeaderName: "X-CSRF-TOKEN", // header Axios will send
});

// Skip CSRF header for public auth routes like login/register/etc
apiClient.interceptors.request.use((config) => {
  const method = (config.method || "").toUpperCase();
  const unsafe = /^(POST|PUT|PATCH|DELETE)$/.test(method);
  const url = config.url || "";

  const isPublicAuth = /^\/auth\/(login|register|forgot-password|send-verification-email|verify-email(?:\/[^/]+)?|reset-password(?:\/.*)?|refresh-token)$/i.test(
    url
  );

  if (unsafe && isPublicAuth) {
    // Axios may auto-add X-CSRF-TOKEN if cookie exists; strip it for these
    if (config.headers) {
      delete config.headers["X-CSRF-TOKEN"];
      delete config.headers["x-csrf-token"];
    }
  }

  return config;
}


);
