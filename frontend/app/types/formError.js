/**
 * A single field error message.
 * Null means "no error".
 *
 * @typedef {string | null} FieldError
 */

/**
 * Generic form error object.
 * Keys = field names
 * Values = error message (or null if no error)
 *
 * Example:
 * {
 *   email: "Invalid email",
 *   password: "Too short",
 *   phone: null
 * }
 *
 * @typedef {Object.<string, FieldError>} FormError
 */

export {};
