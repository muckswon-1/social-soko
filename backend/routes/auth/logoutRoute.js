const express = require("express");
const logoutRoute = express.Router();
const logout = require('../../controllers/auth/logout');

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Log out the current user
 *     description: >
 *       Logs out the user by clearing the authentication cookies:  
 *       - **access_token**  
 *       - **refresh_token**  
 *       - **XSRF-TOKEN**  
 *       
 *       Since JWT tokens are stateless, they cannot be invalidated server-side.
 *       Once cookies are cleared, the user must authenticate again to obtain new tokens.
 *       
 *       This endpoint can be called even if the user is not logged in.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Logout successful
 *         headers:
 *           Set-Cookie:
 *             description: >
 *               All authentication cookies are cleared by setting them with empty values.
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
 *                   example: "Logout successful"
 *             examples:
 *               default:
 *                 value:
 *                   success: true
 *                   message: "Logout successful"
 */

module.exports = logoutRoute.post("/logout",logout);