// app/lib/api.server.js
import axios from "axios";
import { serverGetCookieFromHeader } from "./csrf.server";

/**
 * Axios types (for editor intellisense / TS via JSDoc)
 * @typedef {import("axios").AxiosInstance} AxiosInstance
 * @typedef {import("axios").AxiosRequestConfig} AxiosRequestConfig
 * @typedef {import("axios").AxiosError} AxiosError
 */

const BACKEND_URL = import.meta.env.VITE_API_URL_INTERNAL;

/**
 * Server-side API client factory.
 *
 * - For use inside React Router loaders/actions (Node "server" context).
 * - Forwards incoming cookies to the backend.
 * - Automatically injects `X-CSRF-TOKEN` for unsafe, non-public auth routes.
 * - DOES NOT handle refresh-token logic anymore — that now lives in
 *   helpers like `ensureServerSession`, which can also forward Set-Cookie
 *   back to the browser.
 *
 * @param {Request} request - React Router / Remix request passed into loader/action.
 * @returns {AxiosInstance}
 */
export function createServerApi(request) {
  const cookieHeader = request?.headers?.get("cookie") || "";

  /** @type {AxiosInstance} */
  const api = axios.create({
    baseURL: `${BACKEND_URL}/api/v1`,
    timeout: 20_000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
  });

  /**
   * Request interceptor:
   * - For unsafe methods (POST/PUT/PATCH/DELETE) on non-public auth routes
   *   attach the CSRF token from the incoming cookies.
   */
  api.interceptors.request.use((config) => {
    /** @type {AxiosRequestConfig & { _skipRefresh?: boolean; _retry?: boolean }} */
    const cfg = config;

    const method = (cfg.method || "").toUpperCase();
    const isUnsafe = /^(POST|PUT|PATCH|DELETE)$/.test(method);
    const url = cfg.url || "";

    // Public auth endpoints that should NOT require CSRF
    const isPublicAuth = /^\/auth\/(login|register|forgot-password|send-verification-email|verify-email(?:\/[^/]+)?|reset-password(?:\/.*)?|email-update-with-digit-code|send-verification-digits-code|refresh-token)$/i.test(
      url,
    );

    if (isUnsafe && !isPublicAuth) {
      const csrf = serverGetCookieFromHeader("XSRF-TOKEN", cookieHeader);
      if (csrf) {
        cfg.headers = cfg.headers || {};
        cfg.headers["X-CSRF-TOKEN"] = csrf;
      }
    }

    return cfg;
  });

  /**
   * Response interceptor:
   * - Logs errors with method/url/status/data.
   * - NO refresh-token logic here anymore.
   *   If a loader/action needs to ensure a valid session, use
   *   `ensureServerSession(request)` before making other calls.
   */
  api.interceptors.response.use(
    (response) => response,
    /** @param {AxiosError & { config?: AxiosRequestConfig & { _skipRefresh?: boolean; _retry?: boolean } }} error */
    async (error) => {
      const { config, response } = error;

      // Network / timeout / no HTTP response at all
      if (!response || !config) {
        console.warn("[API error] network/timeout:", error.message);
        return Promise.reject(error);
      }

      const method = (config.method || "").toUpperCase();
      const url = config.url || "";

      console.warn(
        "[API error]",
        method,
        url,
        response.status,
        response.data,
      );

      // Let callers (or ensureServerSession) handle 401s, 403s, etc.
      return Promise.reject(error);
    },
  );

  return api;
}
