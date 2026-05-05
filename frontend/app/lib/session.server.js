// app/lib/session.server.js

/** @typedef {import("axios").AxiosResponse} AxiosResponse */
/** @typedef {import("../types/user").User} User */
/** @typedef {import("../types/common").NullableNumber} NullableNumber */
/** @typedef {import("../types/common").NullableString} NullableString */
/** @typedef {import("../types/responseError").ResponseError} ResponseError */

import {
  normaliseAuthGenericError,
  normaliseVerifySessionResponse,
} from "../features/auth/authTransformers";
import { createServerApi } from "./api.server";
import { forwardSetCookie } from "./forwardSetCookie.server";

/**
 * @typedef {Object} EnsureServerSessionResult
 * @property {boolean} success
 * @property {User | null} user
 * @property {Headers} headers
 * @property {NullableNumber} [accessTokenExpiresAt]
 * @property {NullableString} [error]
 */

/**
 * Ensure there's a valid session for this request.
 *
 * @param {Request} request
 * @returns {Promise<EnsureServerSessionResult>}
 */
export async function ensureServerSession(request) {
  const api = createServerApi(request);
  const headers = new Headers();

  try {
    const response = await api.get("/auth/verify", { _skipRefresh: true });
    forwardSetCookie(response, headers);

    const normalised = normaliseVerifySessionResponse(response);

    if (!normalised.success || !normalised.user) {
      return { success: false, user: null, headers };
    }

    return {
      success: true,
      user: normalised.user,
      headers,
    };
  } catch (error) {
    /** @type {ResponseError} */
    const normalised = normaliseAuthGenericError(
      error,
      "Failed to verify session on the server",
    );

    if (normalised.status === 401 || normalised.status === 403) {
      try {
        const refreshResponse = await api.post(
          "/auth/refresh-token",
          {},
          { _skipRefresh: true },
        );
        forwardSetCookie(refreshResponse, headers);

        // Try verify again after refresh
        const verifyResponse = await api.get("/auth/verify", {
          _skipRefresh: true,
        });
        forwardSetCookie(verifyResponse, headers);
        const normalisedVerifyRes =
          normaliseVerifySessionResponse(verifyResponse);

        if (!normalisedVerifyRes.success || !normalisedVerifyRes.user) {
          // ❌ still no user → NOT success
          return { success: false, user: null, headers };
        }

        return {
          success: true,
          user: normalisedVerifyRes.user,
          headers,
        };
      } catch (err) {
        // Refresh failed
        return { success: false, user: null, headers };
      }
    }

    // Non-auth error → bubble up
    throw error;
  }
}

