// backend/routes/businessMemberships/createMembershipRequest.route.js
"use strict";

const express = require("express");
const { verifyAccessToken } = require("../../middleware/security");
const createMembershipRequest = require("../../controllers/memberships/createMembershipRequest");


const createMembershipRequestRoute = express.Router();

/**
 * @swagger
 * /api/v1/business-membership/{businessId}/create:
 *   post:
 *     summary: Request to join a business (membership request)
 *     description: >
 *       Creates a new membership request for the authenticated user to join the given business.
 *
 *       Behavior:
 *       - Requires a valid authenticated session (access token)
 *       - Ensures the business exists
 *       - Rejects if the user is already an active member of the business
 *       - Rejects if the user already has a pending membership request
 *       - Creates a BusinessMembershipRequest with status "pending"
 *
 *       Notes:
 *       - This endpoint does NOT create BusinessMembership directly.
 *       - Approvals are handled by admin/owner endpoints.
 *
 *     tags:
 *       - Business Memberships
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         description: ID of the business the user wants to join
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 nullable: true
 *                 description: Optional message sent to the business admin/owner
 *                 example: "Hi, I'm a trusted buyer and would like access to post inquiries."
 *     responses:
 *       201:
 *         description: Membership request created successfully
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
 *                   example: "Membership request submitted"
 *                 request:
 *                   $ref: "#/components/schemas/BusinessMembershipRequest"
 *             examples:
 *               created:
 *                 value:
 *                   success: true
 *                   message: "Membership request submitted"
 *                   request:
 *                     id: "9a3bdc6d-8d4e-4d54-a9e8-3d2478f0d3c1"
 *                     business_id: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *                     user_id: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *                     status: "pending"
 *                     message: "Hi, I'm a trusted buyer and would like access to post inquiries."
 *                     reviewed_by_user_id: null
 *                     reviewed_at: null
 *                     created_at: "2026-01-05T08:15:12.000Z"
 *                     updated_at: "2026-01-05T08:15:12.000Z"
 *       400:
 *         description: Validation error (missing businessId)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingBusinessId:
 *                 value:
 *                   success: false
 *                   error: "businessId is required"
 *                   code: "BAD_REQUEST"
 *       401:
 *         description: Unauthorized (no valid access token)
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
 *         description: Business not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               businessNotFound:
 *                 value:
 *                   success: false
 *                   error: "Business not found"
 *                   code: "NOT_FOUND"
 *       409:
 *         description: Conflict (already pending request)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               pendingAlreadyExists:
 *                 value:
 *                   success: false
 *                   error: "You already have a pending membership request"
 *                   code: "CONFLICT"
 *       403:
 *         description: Forbidden (already an active member or not allowed)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               forbidden:
 *                 value:
 *                   success: false
 *                   error: "You are not allowed to request membership for this business"
 *                   code: "FORBIDDEN"
 */
createMembershipRequestRoute.post(
  "/:businessId/create",
  verifyAccessToken,
  createMembershipRequest
);

module.exports = createMembershipRequestRoute;
