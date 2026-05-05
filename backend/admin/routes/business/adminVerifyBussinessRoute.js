const express = require("express");
const { verifyAccessToken, requireAdmin } = require("../../../middleware/security");
const adminVerifyBusiness = require("../../controllers/business/adminVerifyBusiness");
const adminVerifyBusinessRoute = express.Router();

/**
 * @swagger
 * /api/v1/admin/verify-business/{id}:
 *   post:
 *     summary: Verify a business (admin only)
 *     description: >
 *       Admin endpoint to verify or reject a business based on eligibility rules.  
 *       
 *       Flow:
 *       - Finds the Business by ID  
 *       - Looks up the owner User (if `business.user_id` is set)  
 *       - Runs eligibility checks via `checkBusinessVerificationEligibility(business, ownerUser)`  
 *       - If NOT eligible:
 *         - Sets `verification_status` to `"rejected"`  
 *         - Saves `verification_rejected_reason` and `verification_rejected_at`  
 *         - Sends a `businessVerificationFailed` email to the owner  
 *         - Returns **422** with reasons and business  
 *       - If eligible:
 *         - Sets `verification_status` to `"verified"`  
 *         - Sets `verified_at`  
 *         - Sends a `businessVerified` email to the owner  
 *         - Returns **200** with the updated business  
 *     tags:
 *       - Admin - Business
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the business to verify
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *     responses:
 *       200:
 *         description: Business verified successfully
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
 *                   example: "Business verified successfully"
 *                 business:
 *                   $ref: "#/components/schemas/Business"
 *             examples:
 *               verified:
 *                 value:
 *                   success: true
 *                   message: "Business verified successfully"
 *                   business:
 *                     id: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *                     user_id: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *                     name: "ETAC Service and Supply Inc"
 *                     verification_status: "verified"
 *                     verified_at: "2025-03-01T09:30:00.000Z"
 *       404:
 *         description: Business not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Business not found"
 *             examples:
 *               notFound:
 *                 value:
 *                   message: "Business not found"
 *       422:
 *         description: Business is not eligible for verification
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "failed"
 *                 message:
 *                   type: string
 *                   example: "Business is not eligible for verification"
 *                 reasons:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "Business address is missing"
 *                     - "Business email is missing"
 *                 business:
 *                   $ref: "#/components/schemas/Business"
 *             examples:
 *               notEligible:
 *                 value:
 *                   status: "failed"
 *                   message: "Business is not eligible for verification"
 *                   reasons:
 *                     - "Business address is missing"
 *                   business:
 *                     id: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *                     verification_status: "rejected"
 *                     verification_rejected_reason: "Business address is missing"
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – user is not an admin
 */

module.exports = adminVerifyBusinessRoute.post("/verify-business/:id",verifyAccessToken, requireAdmin, adminVerifyBusiness)