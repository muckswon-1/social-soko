const express = require("express");
const { authRateLimiter, authSlowDown, verifyAccessToken, requireRole } = require("../../middleware/security");
const { ROLES } = require("../../constants/roles");
const requestBusinessVerification = require("../../controllers/business/requestBusinessVerification");
const requestBusinessVerificationRoute = express.Router();

/**
 * @swagger
 * /api/v1/business/request-business-verification/{id}/{userId}:
 *   post:
 *     summary: Request verification for a business
 *     description: >
 *       Requests verification for a business by setting its verification status to `"requested"`  
 *       and recording the timestamp.  
 *       
 *       Requirements:
 *       - Authenticated user  
 *       - Caller must be BUSINESS or ADMIN  
 *       - Business must exist  
 *       - User must exist  
 *       
 *       Once verification is requested, an email notification is queued for the business.
 *     tags:
 *       - Business
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the business requesting verification.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user who owns the business.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *     responses:
 *       200:
 *         description: Verification request created
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
 *                   example: "Business verification requested"
 *                 business:
 *                   $ref: "#/components/schemas/Business"
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Business verification requested"
 *                   business:
 *                     id: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *                     user_id: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *                     name: "ETAC Service and Supply Inc"
 *                     verification_status: "requested"
 *                     verification_requested_at: "2025-02-01T12:00:00.000Z"
 *       400:
 *         description: Missing required parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingIds:
 *                 value:
 *                   success: false
 *                   error: "Business id or user id is required"
 *                   code: "BAD_REQUEST"
 *       404:
 *         description: User or business not found
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
 *               businessNotFound:
 *                 value:
 *                   success: false
 *                   error: "Business not found"
 *                   code: "NOT_FOUND"
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – user does not have BUSINESS or ADMIN role
 */

module.exports = requestBusinessVerificationRoute.post("/request-business-verification/:id/:userId",authRateLimiter,authSlowDown,verifyAccessToken,requireRole(ROLES.ADMIN,ROLES.BUSINESS),requestBusinessVerification);