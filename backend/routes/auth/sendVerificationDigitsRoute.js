const express = require("express");
const { authSlowDown, authRateLimiter, verifyAccessToken } = require("../../middleware/security");
const sendVerificationDigits = require("../../controllers/auth/sendVerificationDigits");
const sendVerificationDigitsRoute = express.Router();

/**
 * @swagger
 * /api/v1/auth/send-verification-digits-code:
 *   post:
 *     summary: Send a six-digit verification code for sensitive actions
 *     description: >
 *       Sends a six-digit verification code to the user's email for sensitive operations
 *       such as password reset or account security actions.  
 *       
 *       Behavior:
 *       - Requires a valid authenticated session (access token)  
 *       - Accepts an email address in the request body  
 *       - If the user exists:
 *         - Deletes any existing `verification_digits` tokens for that user  
 *         - Generates a new 6-digit code  
 *         - Stores it with a 60-minute expiry  
 *         - Enqueues an email job to send the code  
 *       - If the user does **not** exist:
 *         - Still returns a 200 success message (to prevent email/account enumeration)  
 *       
 *       The same generic success message is always returned.
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
 *         description: Six-digit verification code has been sent (or treated as sent)
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
 *                   example: "Password reset code sent to your email"
 *             examples:
 *               sent:
 *                 value:
 *                   success: true
 *                   message: "Password reset code sent to your email"
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
module.exports = sendVerificationDigitsRoute.post("/send-verification-digits-code",authSlowDown, authRateLimiter, verifyAccessToken,sendVerificationDigits);
