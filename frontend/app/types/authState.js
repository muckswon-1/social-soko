
/**
 * @typedef {import("./user").User} User
 * @typedef {import("./common").Timestamp} Timestamp
 */


/**
 * @typedef {Object} AuthState
 * @property {User | null} user
 * @property {boolean} loading
 * @property {boolean} bootstraping
 * @property {Timestamp} accessTokenExpiresAt
 * @property {unknown | null} error
 */

export {}