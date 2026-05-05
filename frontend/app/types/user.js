/**
 * @typedef {import("./common").UUID} UUID
 * @typedef {import("./common").StringType} StringType
 * @typedef {import("./common").NullableString} NullableString
 * @typedef {import("./common").Timestamp} Timestamp
 */

/**
 * User Model (Frontend Shape)
 *
 * This is the normalized UI shape after mapping from the backend
 * (snake_case → camelCase).
 *
 * Backend → Frontend mapping examples:
 * - first_name              → firstName
 * - last_name               → lastName
 * - email_verified          → emailVerified
 * - email_verified_at       → emailVerifiedAt
 * - phone                   → phoneNumber
 * - phone_verified          → phoneVerified
 * - phone_verified_at       → phoneVerifiedAt
 * - avatar_url              → avatarUrl
 * - account_verified        → accountVerified
 * - last_login_at           → lastLoginAt
 *
 * @typedef {Object} User
 *
 * @property {UUID} id
 *
 * @property {StringType} email
 * @property {"admin" | "business" | "customer"} role
 *
 * @property {boolean} emailVerified
 * @property {Timestamp | null} emailVerifiedAt
 *
 * @property {NullableString} firstName
 * @property {NullableString} lastName
 *
 * @property {NullableString} phoneNumber
 * @property {boolean | null} phoneVerified
 * @property {Timestamp | null} phoneVerifiedAt
 *
 * @property {NullableString} title
 * @property {NullableString} bio
 * @property {NullableString} avatarUrl
 * @property {NullableString} skills
 *
 * @property {boolean | null} accountVerified
 *
 * @property {Timestamp | null} lastLoginAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export {}


