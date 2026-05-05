const express = require("express");
const { authRateLimiter, authSlowDown, verifyAccessToken } = require("../../middleware/security");
const { fetchProfile } = require("../../controllers/profile/profile");
const fetchProfileRoute = express.Router();

/**
 * @swagger
 * /api/v1/user/fetch-user-profile/{userId}:
 *   get:
 *     summary: Fetch a user's profile information
 *     description: >
 *       Retrieves a user's profile details using their user ID.  
 *       Requires authentication via access token.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID to retrieve profile for
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *     responses:
 *       200:
 *         description: User profile fetched successfully
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
 *                   example: "User profile fetched successfully"
 *                 user:
 *                   $ref: "#/components/schemas/User"
 *       400:
 *         description: Missing userId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingUserId:
 *                 value:
 *                   success: false
 *                   error: "userId is required"
 *                   code: "BAD_REQUEST"
 *       404:
 *         description: User not found
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
 *         description: Unauthorized — access token missing or invalid
 */

 fetchProfileRoute.get("/fetch-user-profile/:userId",authRateLimiter, authSlowDown, verifyAccessToken,fetchProfile);
 
 module.exports = fetchProfileRoute;