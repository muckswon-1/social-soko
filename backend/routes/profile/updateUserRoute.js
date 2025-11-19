const express = require("express");
const { authRateLimiter, authSlowDown, verifyAccessToken } = require("../../middleware/security");
const { updateUser } = require("../../controllers/profile/profile");
const updateUserRoute = express.Router();

/**
 * @swagger
 * /api/v1/user/update-user-profile/{userId}:
 *   post:
 *     summary: Update a user's profile information
 *     description: >
 *       Updates basic profile fields for a user.  
 *       Requires authentication via access token.  
 *       At least one field must be provided in the `patch` object.
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: User ID to update
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: >
 *               The patch object containing fields to update.
 *             properties:
 *               patch:
 *                 type: object
 *                 properties:
 *                   first_name:
 *                     type: string
 *                     example: "Alex"
 *                   last_name:
 *                     type: string
 *                     example: "Asselin"
 *                   phone:
 *                     type: string
 *                     example: "18197002211"
 *     responses:
 *       200:
 *         description: User information updated successfully
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
 *                   example: "User information updated successfully"
 *                 user:
 *                   $ref: "#/components/schemas/User"
 *       400:
 *         description: Missing userId or no fields provided to update
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingUserId:
 *                 value:
 *                   success: false
 *                   error: "userId is required"
 *               noFields:
 *                 value:
 *                   success: false
 *                   error: "No fields provided to update"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *       401:
 *         description: Unauthorized — invalid or missing token
 */

module.exports = updateUserRoute.post("/update-user-profile/:userId",authRateLimiter, authSlowDown, verifyAccessToken, updateUser)