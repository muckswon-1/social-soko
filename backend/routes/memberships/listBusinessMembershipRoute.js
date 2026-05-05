// backend/routes/businessMemberships/listBusinessMemberships.route.js
"use strict";

const express = require("express");
const { verifyAccessToken } = require("../../middleware/security");
const listBusinessMemberships = require("../../controllers/memberships/listBusinessMemberships");

const listBusinessMembershipsRoute = express.Router();

/**
 * @swagger
 * /api/v1/business-membership/{businessId}/memberships:
 *   get:
 *     summary: List memberships for a business (admin/owner only)
 *     description: >
 *       Returns memberships for the given business.
 *
 *       Behavior:
 *       - Requires authentication (cookieAuth)
 *       - Requires requester to be ACTIVE admin/owner (permission-gated)
 *       - Supports pagination (page, limit)
 *       - Supports filtering by membership status and role
 *       - Supports searching by user email or name via `q`
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
 *
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filter memberships by status
 *         schema:
 *           type: string
 *           example: active
 *
 *       - in: query
 *         name: role
 *         required: false
 *         description: Filter memberships by role
 *         schema:
 *           type: string
 *           enum: [owner, admin, member]
 *           example: member
 *
 *       - in: query
 *         name: q
 *         required: false
 *         description: Search memberships by user email or name (first/last)
 *         schema:
 *           type: string
 *           example: gmail
 *
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number (1-indexed)
 *         schema:
 *           type: integer
 *           example: 1
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Page size
 *         schema:
 *           type: integer
 *           example: 25
 *
 *     responses:
 *       200:
 *         description: Memberships list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     rows:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           business_id:
 *                             type: string
 *                             format: uuid
 *                           user_id:
 *                             type: string
 *                             format: uuid
 *                           role:
 *                             type: string
 *                             example: member
 *                           status:
 *                             type: string
 *                             example: active
 *                           created_at:
 *                             type: string
 *                             example: "2026-02-23T12:00:00.000Z"
 *                           user:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                               email:
 *                                 type: string
 *                                 example: user@gmail.com
 *                               first_name:
 *                                 type: string
 *                                 nullable: true
 *                                 example: Alex
 *                               last_name:
 *                                 type: string
 *                                 nullable: true
 *                                 example: Asselin
 *                     count:
 *                       type: integer
 *                       example: 120
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 25
 *       400:
 *         description: Business ID is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not allowed to view memberships)
 *       404:
 *         description: Business not found
 */
listBusinessMembershipsRoute.get(
  "/:businessId/memberships",
  verifyAccessToken,
  listBusinessMemberships
);

module.exports = listBusinessMembershipsRoute;