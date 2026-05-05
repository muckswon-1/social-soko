/**
 * @typedef {import("../../types/user").User} User
 * @typedef {import("../../types/responseError").ResponseError} ResponseError
 * @typedef {import("axios").AxiosResponse<any>} AxiosResponse
 * @typedef {import("axios").AxiosError<any>} AxiosError
 */

/**
 * Normalise different error shapes into a "response-like" object.
 *
 * Supports:
 *  - AxiosError (with .response)
 *  - AxiosResponse / fetch Response-like ({ status, data })
 *  - Plain Error / TypeError (non-HTTP errors)
 *
 * @param {any} input
 * @returns {{ status: number | null, data: any } | null}
 */
export function getResponseLike(input) {
  console.error("[getResponseLike] raw input:", input);

  if (!input) {
    return null;
  }

  // 1) AxiosError: has .response with { status, data }
  if (input.response && (typeof input.response.status === "number" || input.response.data)) {
    return input.response;
  }

  // 2) Already Response-like / AxiosResponse
  if (typeof input.status === "number" || input.data) {
    return {
      status: typeof input.status === "number" ? input.status : null,
      data: input.data ?? input,
    };
  }

  // 3) Plain JS Error (TypeError, ReferenceError, etc.)
  if (input instanceof Error) {
    console.error("[getResponseLike] non-HTTP error (logic/runtime):", input);

    return {
      status: null,
      data: {
        message: input.message || "Unexpected runtime error",
        name: input.name,
        // optional: keep stack only for debugging – do NOT show this to users
        stack: input.stack,
      },
    };
  }

  // 4) Unknown shape: still return something so normaliser has context
  console.error("[getResponseLike] unknown error shape:", input);

  return {
    status: null,
    data: {
      message: "Unexpected error type in getResponseLike",
      raw: input,
    },
  };
}


/**
 * Maps the raw API user (snake_case) to the UI user (camelCase).
 *
 * 
 *
 * @param {any} raw
 * @returns {User}
 */
export function mapApiUserToUiUser(raw) {
  if (!raw || typeof raw !== "object") {
    throw new Error("mapApiUserToUiUser: raw user is required");
  }

  return {
    id: raw.id,

    email: raw.email || "",
    role: raw.role || "customer",

    emailVerified: !!raw.email_verified,
    emailVerifiedAt: raw.email_verified_at || null,

    firstName: raw.first_name || null,
    lastName: raw.last_name || null,

    phoneNumber: raw.phone || null,
    phoneVerified:
      typeof raw.phone_verified === "boolean" ? raw.phone_verified : null,
    phoneVerifiedAt: raw.phone_verified_at || null,

    title: raw.title || null,
    bio: raw.bio || null,
    avatarUrl: raw.avatar_url || null,
    skills: raw.skills || null,

    accountVerified:
      typeof raw.account_verified === "boolean" ? raw.account_verified : null,

    lastLoginAt: raw.last_login_at || null,
    // You asked to ignore createdAt / updatedAt.
    createdAt: null,
    updatedAt: null,
  };
}

/**
 * Maps an API login *error payload* to a normalized UI ResponseError.
 *
 * @param {any} raw
 * @returns {ResponseError}
 */
export function mapApiLoginErrorToUiError(raw) {
    
  if (!raw) {
    return {
      status: null,
      success: false,
      error: null,
      code: null,
      message: null,
    };
  }

  const status =
    typeof raw.status === "number" ? raw.status : null;

  const success =
    typeof raw.success === "boolean" ? raw.success : false;

  const message =
    typeof raw.message === "string" ? raw.message : null;

  const errorText =
    typeof raw.error === "string"
      ? raw.error
      : message || "Login failed";

  const code =
    typeof raw.code === "string" ? raw.code : null;

  return {
    status,
    success,
    error: errorText,
    code,
    message,
  };
}

/**
 * Normalizes a successful login Axios response into:
 * { success, message, user }
 *
 * Expected response shape:
 *  status: 200
 *  data: {
 *    success: true,
 *    message?: string,
 *    user: { ...raw user... }
 *  }
 *
 * @param {AxiosResponse} response
 * @returns {{ success: boolean, message: string | null, user: User }}
 */
export function normaliseUserLoginResponse(response) {
  if (!response) {
    throw new Error("normaliseUserLoginResponse: response is required");
  }

  const { status, data } = response;

  if (status === 200 && data) {
    const {
      success = true,
      message = null,
      user: rawUser,
      access_token_expires_at,
    } = data || {};

    if (!rawUser) {
      throw new Error(
        `normaliseUserLoginResponse: missing user in response data (status=${status})`
      );
    }

    
    return {
      success: !!success,
      message,
      accessTokenExpiresAt: access_token_expires_at,
      user: mapApiUserToUiUser(rawUser),
    };
  }

  throw new Error(
    `normaliseUserLoginResponse: failed to normalise response (status=${status})`
  );
}

/**
 * Normalizes a *failed* login error (AxiosError or similar)
 * into a ResponseError object.
 *
 * @param {AxiosError | any} error
 * @returns {ResponseError}
 */
export function normaliseUserLoginError(error) {
   
 

  const resp = getResponseLike(error);



  if (!resp) {
    // No proper response, generic network/unknown error
    return {
      status: null,
      success: false,
      error: "Login failed",
      code: null,
      message: "An unknown error occurred during login",
    };
  }

  const { status, data } = resp;
  const base = mapApiLoginErrorToUiError({
    ...(data || {}),
    status,
  });

  return base;
}

/**
 * Generic API error normalizer for non-login auth flows.
 *
 * @param {AxiosError | any} error
 * @param {string} fallbackMessage
 * @returns {ResponseError}
 */
export function normaliseAuthGenericError(error, fallbackMessage) {
  
  const resp = getResponseLike(error);

  if (!resp) {
    return {
      status: null,
      success: false,
      error: fallbackMessage,
      code: null,
      message: fallbackMessage,
    };
  }

  const { status, data } = resp;

  const message =
    typeof data?.message === "string" ? data.message : fallbackMessage;

  const errorText =
    typeof data?.error === "string" ? data.error : message;

  const code =
    typeof data?.code === "string" ? data.code : null;

  return {
    status: typeof status === "number" ? status : null,
    success: false,
    error: errorText || fallbackMessage,
    code,
    message,
  };
}

/**
 * Normalize /auth/verify success:
 * Expected shape:
 *   data: { success: true, user: rawUser }  OR
 *   data: { user: rawUser }
 *
 * @param {AxiosResponse} response
 * @returns {{ success: boolean, user: User, accessTokenExpiresAt: number }}
 */
export function normaliseVerifySessionResponse(response) {
  if (!response) {
    throw new Error("normaliseVerifySessionResponse: response is required");
  }

  const { data } = response;
  const rawUser = data?.user || data?.data?.user;

  if (!rawUser) {
    throw new Error("normaliseVerifySessionResponse: user is missing");
  }

  return {
    success: typeof data?.success === "boolean" ? data.success : true,
    user: mapApiUserToUiUser(rawUser),
    accessTokenExpiresAt: typeof data.access_token_expires_at === "number" ? data.access_token_expires_at :  null,
  };
}

/**
 * Normalize /auth/refresh-user success:
 * Expected shape:
 *   data: { data: rawUser } OR { user: rawUser }
 *
 * @param {AxiosResponse} response
 * @returns {{ success: boolean, user: User }}
 */
export function normaliseRefreshUserResponse(response) {
  if (!response) {
    throw new Error("normaliseRefreshUserResponse: response is required");
  }

  const { data } = response;
  const rawUser = data?.data || data?.user;

  if (!rawUser) {
    throw new Error("normaliseRefreshUserResponse: user is missing");
  }

  return {
    success: typeof data?.success === "boolean" ? data.success : true,
    user: mapApiUserToUiUser(rawUser),
  };
}

/**
 * Generic success normalizer for endpoints that just return a message.
 *
 * Expected shape:
 *   data: { success?: boolean, message?: string }
 *
 * @param {AxiosResponse} response
 * @param {string} defaultMessage
 * @returns {{ success: boolean, message: string }}
 */
export function normaliseMessageResponse(response, defaultMessage) {
  if (!response) {
    throw new Error("normaliseMessageResponse: response is required");
  }

  const { data } = response;

  const success =
    typeof data?.success === "boolean" ? data.success : true;

  const message =
    typeof data?.message === "string" ? data.message : defaultMessage;

  return {
    success,
    message,
  };
}
