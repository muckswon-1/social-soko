const express = require("express");
const { authSlowDown, authRateLimiter, verifyAccessToken } = require("../../middleware/security");
const updatePasswordWithDigitCode = require("../../controllers/auth/updatePasswordWithDigitCode");
const updatePasswordWithDigitCodeRoute = express.Router();


/**
 * @swagger
 * /api/v1/auth/reset-password-with-digit-code:
 *   post:
 *     summary: Reset password using a 6-digit verification code
 *     description: >
 *       Resets a user's password using a previously sent six-digit verification code.  
 *       
 *       Flow:
 *       - User receives a 6-digit code in their email  
 *       - User submits the code + new password to this endpoint  
 *       - Code is validated via the verification token system  
 *       - Password is updated (with hashing & individual hooks)  
 *       - A "password reset success" email is queued  
 *       
 *       This endpoint **requires authentication**, because 6-digit verification is used
 *       only for sensitive authenticated account actions.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - digitCodes
 *               - password
 *             properties:
 *               digitCodes:
 *                 type: string
 *                 description: The 6-digit code sent to the user's email
 *                 example: "924615"
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: New account password
 *                 example: "newStrongPassword123"
 *     responses:
 *       200:
 *         description: Password updated successfully
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
 *                   example: "Password updated successfully"
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Password updated successfully"
 *       400:
 *         description: Validation error or invalid/expired digit code
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingCode:
 *                 value:
 *                   success: false
 *                   error: "digitCodes is required"
 *                   code: "BAD_REQUEST"
 *               weakPassword:
 *                 value:
 *                   success: false
 *                   error: "New password must be at least 8 characters"
 *                   code: "BAD_REQUEST"
 *               invalidCode:
 *                 value:
 *                   success: false
 *                   error: "Invalid or expired verification code"
 *                   code: "BAD_REQUEST"
 *       401:
 *         description: Unauthorized — user not authenticated (missing/invalid access token)
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

module.exports = updatePasswordWithDigitCodeRoute.post("/reset-password-with-digit-code",authRateLimiter,authSlowDown,verifyAccessToken, updatePasswordWithDigitCode)