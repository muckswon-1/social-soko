const express = require('express');
const verifyToken = require('../../controllers/auth/verifyToken');
const { authRateLimiter, authSlowDown, verifyAccessToken } = require('../../middleware/security');

const verifyAccessTokenRoute = express.Router();

/**
 * @swagger
 * /api/v1/auth/verify:
 *   get:
 *     summary: Verify current user session
 *     description: >
 *       Validates the user's session using the **access_token** cookie.
 *       If the token is valid, the user's normalized authentication data is returned.  
 *       
 *       This endpoint is used for:
 *       - Restoring sessions on page refresh  
 *       - Checking whether the user is still logged in  
 *       - Fetching the authenticated user's profile data  
 *       
 *       Requires:
 *       - Valid `access_token` HttpOnly cookie  
 *       - Valid `X-CSRF-Token` header for unsafe requests (not required for GET)
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Session is valid, user returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: "#/components/schemas/User"
 *             examples:
 *               validSession:
 *                 value:
 *                   success: true
 *                   user:
 *                     id: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *                     email: "muckswon@example.com"
 *                     first_name: "Mucks"
 *                     last_name: "Won"
 *                     role: "business"
 *                     phone: "07123455676"
 *                     phone_verified: true
 *                     email_verified: true
 *                     account_verified: true
 *                     created_at: "2025-01-01T12:34:56.000Z"
 *                     updated_at: "2025-01-01T12:34:56.000Z"
 *       401:
 *         description: Missing or invalid access token (unauthenticated)
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
 *       404:
 *         description: User not found (should rarely happen)
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
 */

module.exports = verifyAccessTokenRoute.get("/verify",authRateLimiter,authSlowDown, verifyAccessToken,verifyToken);
