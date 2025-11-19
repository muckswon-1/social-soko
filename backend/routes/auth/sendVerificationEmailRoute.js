const express = require("express");
const { authRateLimiter, authSlowDown, verifyAccessToken } = require("../../middleware/security");
const sendVerificationEmail = require("../../controllers/auth/sendVerificationEmail");
const sendVerificationEmailRoute = express.Router();


/**
 * @swagger
 * /api/v1/auth/send-verification-email:
 *   post:
 *     summary: Send an email verification link
 *     description: >
 *       Sends an email verification link to the specified email address.  
 *       
 *       Behavior:
 *       - Requires a valid authenticated session (access token)  
 *       - Accepts an email in the request body  
 *       - If a matching user exists:
 *         - Deletes any existing `email_verification` tokens for that user  
 *         - Generates a new verification token (hashed for storage)  
 *         - Stores it with a 60-minute expiry  
 *         - Enqueues an email job using the `verifyEmail` template  
 *       - If the user does **not** exist:
 *         - Returns **200** with a generic success message  
 *       
 *       This design prevents email/account enumeration by always returning success.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Email verification link has been sent (or treated as sent)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Email verification link sent"
 *             examples:
 *               sent:
 *                 value:
 *                   success: true
 *                   message: "Email verification link sent"
 *       400:
 *         description: Validation error (email missing)
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
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               unauthorized:
 *                 value:
 *                   success: false
 *                   error: "Unauthorized"
 *                   code: "UNAUTHORIZED"
 */

module.exports = sendVerificationEmailRoute.post("/send-verification-email",authRateLimiter, authSlowDown, verifyAccessToken, sendVerificationEmail);