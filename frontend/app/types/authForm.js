/**
 * Login form credentials shape
 *
 * @typedef {Object} LoginFormCredentials
 * @property {string} email
 * @property {string} password
 */


/**
 * Register form credentials shape
 * 
 * @typedef {Object} RegisterForm
 * @property {string} email
 * @property {string} password
 * @property {string} confirmPassword
 */


/**
 * Forgot password form credentials shape
 * 
 * @typedef {Object} ForgotPasswordForm
 * @property {string} email
 */

/**
 * Reset password form credentials shape
 * 
 * @typedef {Object} ResetPasswordForm
 * @property {string} password
 * @property {string} confirmPassword
 */


/**
 * @typedef {Object} UpdatePasswordForm
 * @property {string} email
 * @property {string} password
 * @property {string} confirmPassword
 * @property {string} [otp]
 * 
 */

/**
 * @typedef {Object} UpdateEmailForm
 * @property {string} currentEmail
 * @property {string} newEmail
 * @property {string} confirmEmail
 * @property {string} [otp]
 */

export {};
