// backend/routes/businessMemberships/rejectMembershipRequest.route.js
"use strict";

const express = require("express");
const { verifyAccessToken } = require("../../middleware/security");
const rejectMembershipRequest = require("../../controllers/memberships/rejectMembershipRequest");


const rejectMembershipRequestRoute = express.Router();

/**
 * @swagger
 * /api/v1/business-membership/{businessId}/requests/{requestId}/reject:
 *   post:
 *     summary: Reject a pending membership request (admin/owner)
 *     description: >
 *       Rejects a pending membership request for a business.
 *
 *       Behavior:
 *       - Requires a valid authenticated session (access token)
 *       - Requires the authenticated user to be an ACTIVE admin/owner of the business
 *       - Validates the business and request exist
 *       - Rejects if request is not in "pending" status
 *       - Marks the request as "rejected" (does NOT delete)
 *       - Optionally records reviewer + reviewed_at if those fields exist
 *
 *     tags:
 *       - Business Memberships
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: businessId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 nullable: true
 *                 description: Optional rejection reason (stored if supported)
 *                 example: "We are not accepting new members at this time."
 *     responses:
 *       200:
 *         description: Membership request rejected successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Business or request not found
 *       409:
 *         description: Conflict (request not pending / already processed)
 */
rejectMembershipRequestRoute.post(
  "/:businessId/requests/:requestId/reject",
  verifyAccessToken,
  rejectMembershipRequest
);

module.exports = rejectMembershipRequestRoute;
