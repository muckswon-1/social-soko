// backend/routes/businessMemberships/approveMembershipRequest.route.js
"use strict";

const express = require("express");
const { verifyAccessToken } = require("../../middleware/security");
const approveBusinessMembershipRequest = require("../../controllers/memberships/approveBusinessMembershipRequest");


const approveMembershipRequestRoute = express.Router();

/**
 * @swagger
 * /api/v1/business-membership/{businessId}/requests/{requestId}/approve:
 *   post:
 *     summary: Approve a pending membership request (admin/owner)
 *     description: >
 *       Approves a pending membership request for a business.
 *
 *       Behavior:
 *       - Requires a valid authenticated session (access token)
 *       - Requires the authenticated user to be an ACTIVE admin/owner of the business
 *       - Validates the business and request exist
 *       - Rejects if request is not in "pending" status
 *       - Marks the request as "approved"
 *       - Creates (or activates) a BusinessMembership for the requested user
 *
 *     tags:
 *       - Business Memberships
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         description: ID of the business
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *       - in: path
 *         name: requestId
 *         required: true
 *         description: ID of the membership request to approve
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "9a3bdc6d-8d4e-4d54-a9e8-3d2478f0d3c1"
 *     responses:
 *       200:
 *         description: Membership request approved successfully
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
 *                   example: "Membership request approved"
 *                 request:
 *                   $ref: "#/components/schemas/BusinessMembershipRequest"
 *       401:
 *         description: Unauthorized (no valid access token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *       403:
 *         description: Forbidden (not admin/owner, or not allowed)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *       404:
 *         description: Business or request not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *       409:
 *         description: Conflict (request not pending / already processed)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 */
approveMembershipRequestRoute.post(
  "/:businessId/requests/:requestId/approve",
  verifyAccessToken,
  approveBusinessMembershipRequest
);

module.exports = approveMembershipRequestRoute;
