const express = require("express");
const { authRateLimiter, authSlowDown, verifyAccessToken, requireRole } = require("../../middleware/security");
const { ROLES } = require("../../constants/roles");
const fetchBusiness = require("../../controllers/business/fetchBusiness");

const fetchBusinessRoute = express.Router();

/**
 * @swagger
 * /api/v1/business/fetch-business/{userId}:
 *   get:
 *     summary: Fetch a business by user ID
 *     description: >
 *       Retrieves the Business profile associated with a specific user.  
 *       
 *       This route requires authentication and the caller must have either:
 *       - `business` role, or  
 *       - `admin` role  
 *       
 *       Returns the first Business record matching `user_id`.
 *     tags:
 *       - Business
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The user ID whose business you want to fetch.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *     responses:
 *       200:
 *         description: Business found
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
 *                   example: "Business found"
 *                 business:
 *                   $ref: "#/components/schemas/Business"
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Business found"
 *                   business:
 *                     id: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *                     user_id: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *                     name: "ETAC Service and Supply Inc"
 *                     city: "Winnipeg"
 *                     country: "Canada"
 *                     verification_status: "pending"
 *       400:
 *         description: Missing or invalid userId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingUserId:
 *                 value:
 *                   success: false
 *                   error: "Business ID is required"
 *                   code: "BAD_REQUEST"
 *       404:
 *         description: Business not found (if you choose to handle this)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               notFound:
 *                 value:
 *                   success: false
 *                   error: "Business not found"
 *                   code: "NOT_FOUND"
 *       401:
 *         description: Unauthorized (no token or invalid token)
 *       403:
 *         description: Forbidden (user lacks BUSINESS or ADMIN role)
 */
 fetchBusinessRoute.get("/fetch-business/:userId", verifyAccessToken, requireRole(ROLES.BUSINESS, ROLES.ADMIN), fetchBusiness);

 module.exports = fetchBusinessRoute;