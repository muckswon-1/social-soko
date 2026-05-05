const express = require("express");
const { authSlowDown, authRateLimiter } = require("../../middleware/security");
const resetPasswordWithTokenParameter = require("../../controllers/auth/resetPasswordWithTokenParameter");
const resetPasswordWithTokenParameterRouter = express.Router();

/**
 * @swagger
 * /api/v1/auth/reset-password/{token}:
 *   post:
 *     summary: Reset password using a reset token
 *     description: >
 *       Resets the user's password using a one-time reset token that was sent by email.  
 *       
 *       Flow:
 *       - User clicks the reset link in their email (containing the token)  
 *       - Frontend calls this endpoint with:
 *         - `token` as a path parameter  
 *         - `password` in the JSON body  
 *       - Token is validated against the stored hashed token and expiry  
 *       - If valid, the user's password is updated and a confirmation email is sent  
 *       
 *       The token is single-use and expires after a limited time (e.g., 60 minutes).
 *     tags:
 *       - Auth
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Password reset token provided in the email link.
 *         schema:
 *           type: string
 *           example: "2f3a9e2c1f9b4cb7b1a4d2c9e7a4b3c1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: "newStrongPassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
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
 *                   example: "Password reset successful"
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Password reset successful"
 *       400:
 *         description: Invalid input or token-related error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingToken:
 *                 value:
 *                   success: false
 *                   error: "Reset token is required"
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
 *               invalidOrExpiredToken:
 *                 value:
 *                   success: false
 *                   error: "Invalid or expired reset token"
 *                   code: "BAD_REQUEST"
 *               samePassword:
 *                 value:
 *                   success: false
 *                   error: "New password must be different from the current password"
 *                   code: "BAD_REQUEST"
 */

module.exports = resetPasswordWithTokenParameterRouter.post("/reset-password/:token", authRateLimiter, authSlowDown,resetPasswordWithTokenParameter);