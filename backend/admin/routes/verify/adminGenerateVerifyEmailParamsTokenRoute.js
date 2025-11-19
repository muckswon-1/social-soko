const express = require("express");
const { verifyAccessToken, requireAdmin } = require("../../../middleware/security");
const { adminGenerateVerifyEmailParamsToken } = require("../../controllers/verification");
const adminGenerateVerifyEmailParamsTokenRoute = express.Router();

/**
 * @swagger
 * /api/v1/admin/generate-parameter-verify-email-token:
 *   post:
 *     summary: Generate an email verification token for a user (admin only)
 *     description: >
 *       Admin-only endpoint that generates a raw email verification token for a given user
 *       **without sending an email**.  
 *       
 *       This is useful when an admin wants to:
 *       - Manually construct a verification link  
 *       - Debug email verification flows  
 *       - Trigger verification via another channel (e.g., support ticket, WhatsApp, etc.)  
 *       
 *       Behavior:
 *       - Requires admin authentication  
 *       - Looks up the user by email  
 *       - Deletes any existing `email_verification` tokens for that user  
 *       - Creates a new token (stored as SHA-256 hash in the DB)  
 *       - Returns the **raw token** in the response body  
 *     tags:
 *       - Admin - Tokens
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userEmail
 *             properties:
 *               userEmail:
 *                 type: string
 *                 format: email
 *                 description: Email address of the user to generate the token for.
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Verification token generated successfully
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
 *                   example: "Verification token generated successfully"
 *                 token:
 *                   type: string
 *                   description: Raw verification token (not hashed). Use this to build the verification URL.
 *                   example: "c4a7d5e1f9b84392b7f9fd84bb1f7652"
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Verification token generated successfully"
 *                   token: "c4a7d5e1f9b84392b7f9fd84bb1f7652"
 *       400:
 *         description: Missing or invalid email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingEmail:
 *                 value:
 *                   success: false
 *                   error: "Email is required"
 *                   code: "BAD_REQUEST"
 *       404:
 *         description: User not found for the given email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               userNotFound:
 *                 value:
 *                   success: false
 *                   error: "User not found"
 *                   code: "NOT_FOUND"
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – user is not an admin
 */

module.exports = adminGenerateVerifyEmailParamsTokenRoute.post("generate-parameter-verify-email-token",verifyAccessToken,requireAdmin,adminGenerateVerifyEmailParamsToken)