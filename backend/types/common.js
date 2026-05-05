/**
 * ============================================================
 * COMMON PRIMITIVE TYPES (Backend + Shared)
 * ============================================================
 */

/**
 * @typedef {string} StringType
 */

/**
 * @typedef {number} NumberType
 */

/**
 * @typedef {boolean} BooleanType
 */

/**
 * UUID v4 expected.
 *
 * @typedef {string} UUID
 */

/**
 * ISO8601 string timestamp.
 *
 * @typedef {string} Timestamp
 * @example "2025-11-26T19:40:09.708Z"
 */

/**
 * @typedef {string | null} NullableString
 */

/**
 * @typedef {number | null} NullableNumber
 */

/**
 * @typedef {boolean | null} NullableBoolean
 */

/**
 * @template T
 * @typedef {T | null} Nullable
 */


/**
 * ============================================================
 * COLLECTIONS
 * ============================================================
 */

/**
 * @template T
 * @typedef {T[]} ArrayOf
 */

/**
 * @typedef {Object.<string, any>} Dictionary
 */

/**
 * @template T
 * @typedef {Object.<string, T>} RecordOf
 */


/**
 * ============================================================
 * API RESPONSE TYPES
 * ============================================================
 */

/**
 * @template T
 * @typedef {Object} ApiSuccessResponse
 * @property {true} success
 * @property {T} data
 * @property {string} [message]
 */

/**
 * @typedef {Object} ApiErrorResponse
 * @property {false} success
 * @property {string} error
 * @property {string} [code]
 * @property {number} [status]
 */

/**
 * @template T
 * @typedef {ApiSuccessResponse<T> | ApiErrorResponse} ApiResponse
 */


/**
 * ============================================================
 * PAGINATION
 * ============================================================
 */

/**
 * @typedef {Object} PaginationMeta
 * @property {number} page
 * @property {number} limit
 * @property {number} totalItems
 * @property {number} totalPages
 */

/**
 * @template T
 * @typedef {Object} PaginatedData
 * @property {Array<T>} items
 * @property {PaginationMeta} meta
 */


/**
 * ============================================================
 * SERIALIZABLE JSON TYPE
 * ============================================================
 */

/**
 * @typedef {null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }} JsonValue
 */


/**
 * ============================================================
 * UTILITY TYPES
 * ============================================================
 */

/**
 * @template T
 * @typedef {Partial<T>} PartialType
 */

/**
 * Recursive partial — every nested field becomes optional.
 * (JSDoc cannot fully model true recursion)
 *
 * @template T
 * @typedef {Object} DeepPartial
 */

/**
 * @template T
 * @typedef {(value: T) => void} Setter
 */

/**
 * OTP workflow status.
 *
 * @typedef {"request" | "verify" | "done"} OtpStatus
 */


/**
 * ============================================================
 * EXPRESS SPECIFIC TYPES
 * ============================================================
 */

/**
 * Base Express types (imported)
 *
 * @typedef {import("express").Request} ExpressRequest
 * @typedef {import("express").Response} ExpressResponse
 * @typedef {import("express").NextFunction} ExpressNextFunction
 * @typedef {ExpressRequest & {user?: import("./user").User}} RequestWithUser
 */


/**
 * ============================================================
 * AUTH / USER CONTEXT
 * ============================================================
 */

/**
 * User payload attached by auth middleware.
 *
 * Extend anytime your JWT/session includes new fields.
 *
 * @typedef {Object} AuthUser
 * @property {UUID} id
 * @property {StringType} email
 * @property {"admin" | "business" | "customer"} role
 * @property {BooleanType} [email_verified]
 * @property {BooleanType} [account_verified]
 * @property {Timestamp} [last_login_at]
 */


/**
 * Express Request with authenticated user.
 *
 * @typedef {ExpressRequest & { user?: AuthUser }} AuthedRequest
 */


/**
 * ============================================================
 * HANDLER SIGNATURES (for controllers / middlewares)
 * ============================================================
 */

/**
 * @callback AsyncRequestHandler
 * @param {ExpressRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 * @returns {Promise<void> | void}
 */


/**
 * Generic success response shape
 *
 * @template T
 * @typedef {Object} HandlerSuccessResult
 * @property {true} success
 * @property {number} status
 * @property {T} data
 */


/**
 * Generic error response shape
 *
 * @typedef {Object} HandlerErrorResult
 * @property {false} success
 * @property {number} status
 * @property {string} message
 */

/**
 * @template T
 * @typedef {HandlerSuccessResult<T> | HandlerErrorResult} HandlerResult
 */



/**
 * Authenticated version (req.user expected)
 *
 * @template T
 * @callback AsyncAuthedRequestHandler
 * @param {AuthedRequest} req
 * @param {ExpressResponse} res
 * @param {ExpressNextFunction} next
 * @returns {Promise<HandlerResult<T>> | HandlerResult<T> | void}
 */






export {};
