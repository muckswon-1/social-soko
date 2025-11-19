const express = require("express");
const { authRateLimiter, authSlowDown } = require("../../middleware/security");
const verifyToken = require("../../controllers/auth/verifyToken");
const verifyEmailRouter = express.Router();

/**
 * @swagger
 * /api/v1/auth/verify-email/{token}:
 *   post:
 *     summary: Verify a user's email address
 *     description: >
 *       Verifies a user's email using a one-time verification token that was
 *       sent to their email address after registration or email update.  
 *       
 *       Flow:
 *       - User clicks the email verification link  
 *       - Frontend extracts the token from the URL  
 *       - Token is passed to this endpoint  
 *       - Token is validated using the `email_verification` token type  
 *       - If valid, the user's email is marked as verified  
 *       - An email verification success message is sent  
 *       
 *       Tokens are single-use and stored hashed (SHA-256).
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Email verification token sent to the user's email
 *         schema:
 *           type: string
 *           example: "23f9b1c7d2e94f6a9b4c7d8e5f1a2c9b"
 *     responses:
 *       200:
 *         description: Email verified successfully
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
 *                   example: "Email verified successfully"
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Email verified successfully"
 *       400:
 *         description: Invalid token, expired token, or email already verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingToken:
 *                 value:
 *                   success: false
 *                   error: "Verification token is required"
 *                   code: "BAD_REQUEST"
 *               invalidOrExpired:
 *                 value:
 *                   success: false
 *                   error: "Invalid or expired verification token"
 *                   code: "BAD_REQUEST"
 *               alreadyVerified:
 *                 value:
 *                   success: false
 *                   error: "Email already verified"
 *                   code: "BAD_REQUEST"
 */

module.exports = verifyEmailRouter.post("/verify-email/:token",authRateLimiter, authSlowDown,verifyToken );