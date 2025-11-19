const express = require('express')
const sendResetPasswordLinkEmailRoute = express.Router();
const { authSlowDown, authRateLimiter } = require('../../middleware/security');
const sendResetPasswordLinkEmail = require('../../controllers/auth/sendResetPasswordLinkEmail');


/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Send password reset link to email
 *     description: >
 *       Initiates the password reset process.  
 *       
 *       This endpoint:
 *       - Accepts an email address  
 *       - Generates a secure reset token if the user exists  
 *       - Sends a password reset email via the EmailJob queue  
 *       - **Always returns 200** to avoid exposing whether an email exists in the system  
 *       
 *       The reset link will contain the reset token sent to the user's email.
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
 *         description: Password reset email has been sent (regardless of whether user exists)
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
 *                   example: "Password reset link sent to your email"
 *             examples:
 *               sent:
 *                 value:
 *                   success: true
 *                   message: "Password reset link sent to your email"
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
 */

module.exports = sendResetPasswordLinkEmailRoute.post("/forgot-password",authSlowDown, authRateLimiter, sendResetPasswordLinkEmail);