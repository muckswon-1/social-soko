const express = require("express");
const { authSlowDown, authRateLimiter } = require("../../middleware/security");
const register = require("../../controllers/auth/register");
const registerRoute = express.Router();



/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user account
 *     description: >
 *       Creates a new user account with email and password.  
 *       The password is hashed before storage. If the email is already in use,
 *       the request will fail with a 409 response.  
 *       On successful registration, an email verification token is generated and
 *       verification + welcome emails are queued using the email job system.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterRequest"
 *           examples:
 *             basic:
 *               summary: Basic registration payload
 *               value:
 *                 email: "newuser@example.com"
 *                 password: "averystrongpassword"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthSuccessResponse"
 *             examples:
 *               created:
 *                 value:
 *                   success: true
 *                   message: "User created successfully"
 *                   data:
 *                     user:
 *                       id: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *                       email: "newuser@example.com"
 *                       first_name: null
 *                       last_name: null
 *                       role: "user"
 *                       phone: null
 *                       phone_verified: false
 *                       email_verified: false
 *                       account_verified: false
 *       400:
 *         description: Validation error (missing fields or weak password)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingEmail:
 *                 value:
 *                   success: false
 *                   error: "email is required"
 *                   code: "BAD_REQUEST"
 *               missingPassword:
 *                 value:
 *                   success: false
 *                   error: "password is required"
 *                   code: "BAD_REQUEST"
 *               weakPassword:
 *                 value:
 *                   success: false
 *                   error: "Password must be at least 8 characters"
 *                   code: "BAD_REQUEST"
 *       409:
 *         description: Email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               emailInUse:
 *                 value:
 *                   success: false
 *                   error: "Email already in use"
 *                   code: "CONFLICT"
 */
module.exports = registerRoute.post(
  "/register",
  authSlowDown,
  authRateLimiter,
  register
);

