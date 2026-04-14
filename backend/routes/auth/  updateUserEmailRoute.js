const express = require("express");
const { authRateLimiter, authSlowDown, verifyAccessToken } = require("../../middleware/security");
const updateUserEmail = require("../../controllers/auth/updateUserEmail");
const updateUserEmailRoute  = express.Router();

/**
 * @swagger
 * /api/v1/auth/email-update-with-digit-code:
 *   post:
 *     summary: Update user email using a 6-digit verification code
 *     description: >
 *       Updates a user's email address using a previously sent six-digit verification code.  
 *       
 *       Flow:
 *       - User receives a 6-digit verification code (e.g., via `/send-verification-digits-code`)  
 *       - User submits the new email + digit code to this endpoint  
 *       - Code is verified using the `verification_digits` token type  
 *       - The user's email is updated and marked as unverified  
 *       - Any existing `email_verification` tokens are invalidated  
 *       - A fresh email verification token is generated and an email is sent  
 *       - Notification emails are sent to both the old and new email addresses  
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
 *               - digitCodes
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: New email address to associate with the user
 *                 example: "new.email@example.com"
 *               digitCodes:
 *                 type: string
 *                 description: The 6-digit verification code sent to the user's email
 *                 example: "482917"
 *     responses:
 *       200:
 *         description: Email updated and verification link sent to the new address
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
 *                   example: "Email updated successfully. Please verify your new email."
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Email updated successfully. Please verify your new email."
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
 *               missingEmail:
 *                 value:
 *                   success: false
 *                   error: "email is required"
 *                   code: "BAD_REQUEST"
 *               invalidEmailFormat:
 *                 value:
 *                   success: false
 *                   error: "email must be a valid email"
 *                   code: "BAD_REQUEST"
 *               invalidOrExpiredCode:
 *                 value:
 *                   success: false
 *                   error: "Invalid or expired verification code"
 *                   code: "BAD_REQUEST"
 *       409:
 *         description: Email conflict (already in use or same as current)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               sameAsCurrent:
 *                 value:
 *                   success: false
 *                   error: "Email already exists"
 *                   code: "CONFLICT"
 *               emailInUse:
 *                 value:
 *                   success: false
 *                   error: "Email already in use"
 *                   code: "CONFLICT"
 */

module.exports = updateUserEmailRoute.post("/email-update-with-digit-code",authRateLimiter, authSlowDown,verifyAccessToken,updateUserEmail);