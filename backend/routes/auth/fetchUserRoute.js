const express = require("express");
const { authRateLimiter, authSlowDown, verifyAccessToken } = require("../../middleware/security");
const fetchUser = require("../../controllers/auth/fetchUser");

const fetchUserRoute = express.Router();

/**
 * @swagger
 * /api/v1/auth/refresh-user:
 *   get:
 *     summary: Fetch the authenticated user's updated information
 *     description: >
 *       Returns the latest user information based on the authenticated session.  
 *       
 *       This endpoint:
 *       - Requires a valid `access_token` cookie  
 *       - Reads the authenticated user's email from `req.user`  
 *       - Fetches the user from the database  
 *       - Returns normalized user authentication data  
 *       
 *       Useful for refreshing client state after login, page reload, or profile updates.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: User fetched successfully
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
 *                   example: "User fetched successfully"
 *                 data:
 *                   $ref: "#/components/schemas/User"
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "User fetched successfully"
 *                   data:
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
 *       404:
 *         description: User not found (rare case)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               notFound:
 *                 value:
 *                   success: false
 *                   error: "User not found"
 *                   code: "NOT_FOUND"
 */
module.exports = fetchUserRoute.get("/refresh-user", authRateLimiter, authSlowDown,verifyAccessToken, fetchUser);