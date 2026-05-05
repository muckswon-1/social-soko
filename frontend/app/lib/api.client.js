// app/lib/api.server.js
import axios from "axios";


/**
 * The backend API base URL.
 * @type {NullableString}
 */
const BACKEND_URL = import.meta.env.VITE_API_URL_BROWSER;
const BACKEND_URL_LOCALHOST = import.meta.env.VITE_API_URL_BROWSER_LOCALHOST;


const hostname = window.location.hostname;


const BASE_URL = hostname === "localhost" || hostname === "127.0.0.1" ? BACKEND_URL_LOCALHOST : BACKEND_URL;


console.log(BACKEND_URL);


/**
 * Axios instance configured for authenticated API requests.
 * Automatically sends cookies (HTTP-only access tokens & refresh tokens).
 *
 * @type {import("axios").AxiosInstance}
 */
export const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 20000,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-CSRF-TOKEN",
  withXSRFToken: true,
});

/**
 * Indicates whether a token refresh request is currently being processed.
 * Used to prevent multiple refresh requests from happening simultaneously.
 * @type {boolean}
 */
let isRefreshing = false;

/**
 * Queue of callbacks (Promises) waiting for a refresh to complete.
 * @type {Array<() => void>}
 */
let waiters = [];

/**
 * Resolves all queued API requests that were waiting for token refresh.
 * Called after refresh completes successfully.
 *
 * @returns {void}
 */
function notifyWaiters() {
  waiters.forEach((resumeFn) => {
    try {
      resumeFn();
    } catch {}
  });
  waiters = [];
}

/**
 * Determines if a given URL is a public authentication route, meaning it
 * should not trigger a refresh attempt on 401 responses.
 *
 * @param {string} url
 * @returns {boolean}
 */
function isPublicAuthRoute(url) {
  return /^\/auth\/(register|login|forgot-password|verify-email(?:\/[^/]+)?|reset-password(?:\/.*)?|email-update-with-digit-code|refresh-token)$/i.test(
    url
  );
}

/**
 * Axios Response Error Interceptor.
 *
 * Handles:
 * - Access token expiration (401)
 * - Deduplicated refresh-token flow
 * - Retrying the original request once new tokens are issued
 *
 * @param {import("axios").AxiosError} error
 * @returns {Promise<never> | Promise<import("axios").AxiosResponse>}
 */
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const config = error.config || {};
    const response = error.response;

    // No response → network or timeout, bubble up
    if (!response) return Promise.reject(error);

    const url = config.url || "";
    const publicAuth = isPublicAuthRoute(url);

    // Do not attempt refresh on:
    // - Public routes (login, register, forgot-password, etc.)
    // - Requests that explicitly skip refresh
    if (publicAuth || config._skipRefresh) {
      return Promise.reject(error);
    }

    // Handle expired access token (HTTP 401)
    if (response.status === 401 && !config._retry) {
      // If refresh is already in progress → queue this request
      if (isRefreshing) {
        await new Promise((resolve) => waiters.push(resolve));
        config._retry = true;
        return apiClient(config);
      }

      // First request encountering an expired token → start refresh flow
      isRefreshing = true;
      config._retry = true;

      try {
        // Hit refresh endpoint with refresh token cookie
        await apiClient.post(
          "/auth/refresh-token",
          {},
          { _skipRefresh: true }
        );

        // Unblock all queued requests
        notifyWaiters();

        // Retry original request
        return apiClient(config);
      } catch (refreshError) {
        // Refresh failed → session ended, must log in again
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // If not 401 or already retried → bubble up error
    return Promise.reject(error);
  }
);
