/**
 * ----------------------------------------
 * COMMON PRIMITIVE TYPE ALIASES
 * ----------------------------------------
 */

/**
 * @typedef {string} StringType
 * A simple string alias for consistency in your types.
 */

/**
 * @typedef {number} NumberType
 * Numeric alias.
 */

/**
 * @typedef {boolean} BooleanType
 * Boolean alias.
 */

/**
 * @typedef {string} UUID
 * A universally unique ID (UUID v4 expected).
 */

/**
 * @typedef {string} Timestamp
 * Represents a date and time in the 
 * [ISO 8601 extended format](en.wikipedia.org).
 * The string always includes the time designator 'T' and ends with 'Z' 
 * to denote UTC (Coordinated Universal Time).
 * 
 * @example "2025-11-26T19:40:09.708Z"
 * @see developer.mozilla.org
 */


/**
 *  A string that can be null.
 * @typedef {string | null} NullableString
 */


/**
 * @typedef {number | null} NullableNumber
 */

/**
 * @typedef {boolean | null} NullableBoolean
 */

/**
 * ----------------------------------------
 * ARRAYS & COLLECTIONS
 * ----------------------------------------
 */

/**
 * @template T
 * @typedef {T[]} ArrayOf
 */

/**
 * @typedef {Object.<string, any>} Dictionary
 * Key-value object with any structure.
 */

/**
 * @template T
 * @typedef {Object.<string, T>} RecordOf
 * A typed dictionary (like TS Record<string, T>).
 */

/**
 * ----------------------------------------
 * API RESPONSE WRAPPERS
 * ----------------------------------------
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
 * ----------------------------------------
 * PAGINATION
 * ----------------------------------------
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
 * ----------------------------------------
 * JSON / SERIALIZABLE
 * ----------------------------------------
 */

/**
 * @typedef {null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }} JsonValue
 */

/**
 * ----------------------------------------
 * UTILITY TYPES
 * ----------------------------------------
 */

/**
 * @template T
 * @typedef {Partial<T>} PartialType
 */

/**
 * @template T
 * @typedef {Object} DeepPartial
 * Recursive partial — every nested field becomes optional.
 * NOTE: JSDoc cannot fully represent recursive types, so this is an approximation.
 */

/**
 * @template T
 * @typedef {(value: T) => void} Setter
 */

/**
 * @template T
 * @typedef {T | null} Nullable
 */

/**
 * @typedef {"request" | "verify" | "done"} OtpStatus
 */

export {}