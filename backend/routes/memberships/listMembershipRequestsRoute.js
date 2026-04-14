// backend/routes/businessMemberships/listMembershipRequests.route.js
"use strict";

const express = require("express");
const { verifyAccessToken } = require("../../middleware/security");
const listMembershipRequests = require("../../controllers/memberships/listMembershipRequests");
const listMembershipRequestsRoute = express.Router();

/**
 * @swagger
 * /api/v1/business-membership/{businessId}/requests:
 *   get:
 *     summary: List membership requests for a business (admin/owner)
 *     description: >
 *       Returns membership requests for the given business.
 *
 *       Behavior:
 *       - Requires authentication (cookieAuth)
 *       - Requires requester to be ACTIVE admin/owner of the business
 *       - Defaults to listing PENDING requests
 *       - Supports pagination and filtering by status
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
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filter by request status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           example: pending
 *       - in: query
 *         name: q
 *         required: false
 *         description: Search by requester name or email
 *         schema:
 *           type: string
 *           example: gmail
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 25
 *     responses:
 *       200:
 *         description: Membership requests list
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin/owner)
 *       404:
 *         description: Business not found
 */
listMembershipRequestsRoute.get(
  "/:businessId/requests",
  verifyAccessToken,
  listMembershipRequests
);

module.exports = listMembershipRequestsRoute;
