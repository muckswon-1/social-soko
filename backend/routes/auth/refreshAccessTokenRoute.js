const express = require('express');
const { authRateLimiter, authSlowDown } = require('../../middleware/security');
const refreshExpiredAccessToken = require('../../controllers/auth/refreshExpiredAccessToken');
const refreshAccessTokenRoute = express.Router();

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh expired or invalid access token
 *     description: >
 *       Issues a new **access token**, **refresh token**, and **CSRF token** using
 *       the HttpOnly `refresh_token` cookie.  
 *       
 *       This endpoint:
 *       - Requires a valid refresh token cookie  
 *       - Rotates both access and refresh tokens  
 *       - Issues a new `XSRF-TOKEN` cookie  
 *       
 *       Clients must include the new CSRF token in the `X-CSRF-Token` header for
 *       subsequent unsafe requests (POST, PUT, PATCH, DELETE).
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: false
 *       description: >
 *         No request body required.  
 *         The refresh token must be sent via cookie.
 *     responses:
 *       200:
 *         description: Tokens refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             description: >
 *               New cookies set:
 *                 - **access_token** (HttpOnly)
 *                 - **refresh_token** (HttpOnly)
 *                 - **XSRF-TOKEN** (Readable CSRF cookie)
 *             schema:
 *               type: string
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
 *                   example: "Token refreshed successfully"
 *       401:
 *         description: Missing refresh token cookie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingCookie:
 *                 value:
 *                   success: false
 *                   error: "Refresh token is required"
 *                   code: "UNAUTHORIZED"
 *       403:
 *         description: Invalid or expired refresh token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               invalidToken:
 *                 value:
 *                   success: false
 *                   error: "Invalid or expired refresh token"
 *                   code: "FORBIDDEN"
 */
module.exports = refreshAccessTokenRoute.post("/refresh-token",authRateLimiter,authSlowDown,refreshExpiredAccessToken)
