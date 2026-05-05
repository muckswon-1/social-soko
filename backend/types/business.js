/**
 * ----------------------------------------
 * IMPORTED PRIMITIVES
 * ----------------------------------------
 */

/**
 * @typedef {import("./common").UUID} UUID
 * @typedef {import("./common").StringType} StringType
 * @typedef {import("./common").NullableString} NullableString
 * @typedef {import("./common").Timestamp} Timestamp
 */

/**
 * ----------------------------------------
 * BUSINESS MODEL (backend snake_case)
 * ----------------------------------------
 */

/**
 * @typedef {Object} Business
 *
 * @property {UUID} id
 *   Business UUID.
 *
 * @property {UUID} user_id
 *   FK → users.id
 *
 * @property {string} username
 *   Public business username.
 *
 * @property {string} name
 *   Official business name.
 *
 * @property {NullableString} description
 *   Short description or bio.
 *
 * @property {NullableString} website
 *   Business website URL.
 *
 * @property {NullableString} email
 *   Public-facing business email.
 *
 * @property {NullableString} phone_number
 *   E.164 formatted number.
 *
 * @property {NullableString} address
 *   Street address.
 *
 * @property {NullableString} city
 *   Business city.
 *
 * @property {NullableString} state
 *   Province/Region.
 *
 * @property {NullableString} postal_code
 *   Postal/ZIP code.
 *
 * @property {NullableString} country
 *   Country.
 *
 * @property {NullableString} slug
 *   SEO-friendly business slug.
 *
 * @property {NullableString} logo_url
 *   URL to business logo.
 *
 * @property {"requested"|"pending"|"verified"|"rejected"} verification_status
 *   Verification state.
 *
 * @property {NullableString} verification_requested_at
 *   ISO timestamp of verification request.
 *
 * @property {NullableString} verification_rejected_at
 *   When verification was rejected.
 *
 * @property {NullableString} verification_rejected_reason
 *   Reason for rejection.
 *
 * @property {NullableString} verified_at
 *   Timestamp when verified.
 *
 * @property {Timestamp} created_at
 *   Creation timestamp.
 *
 * @property {Timestamp} updated_at
 *   Last update timestamp.
 */


/**
 * ----------------------------------------
 * BUSINESS FORM (backend snake_case, as submitted by API)
 * ----------------------------------------
 */

/**
 * @typedef {Object} BusinessForm
 * @property {string} username
 * @property {string} user_id
 * @property {string} address
 * @property {string} city
 * @property {string} country
 * @property {string} description
 * @property {string} email
 * @property {string} name
 * @property {string} phone_number
 * @property {string} postal_code
 * @property {string} state
 * @property {string} website
 * @property {string} logo_url
 * @property {string} slug
 * @property {"pending"|"requested"|"rejected"|"verified"|""} verification_status
 * @property {string|null} verification_requested_at
 * @property {string|null} verification_rejected_at
 * @property {string|null} verification_rejected_reason
 * @property {string|null} verified_at
 * @property {string|null} created_at
 * @property {string|null} updated_at
 */

export {};
