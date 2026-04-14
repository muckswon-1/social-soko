// backend/routes/businessMemberships/listMyBusinesses.route.js
"use strict";

const express = require("express");
const { verifyAccessToken } = require("../../middleware/security");
const listMyBusinesses = require("../../controllers/memberships/listMyBusinesses");

const listMyBusinessesRoute = express.Router();

/**
 * @swagger
 * /api/v1/business-membership/my-businesses:
 *   get:
 *     summary: List businesses for the authenticated user
 *     description: >
 *       Returns all businesses the authenticated user is associated with.
 *
 *       Behavior:
 *       - Requires authentication (cookieAuth)
 *       - Includes businesses where the user is:
 *         - Owner
 *         - Admin
 *         - Member
 *       - Deduplicates businesses (owner role takes precedence)
 *       - Returns normalized role per business
 *
 *     tags:
 *       - Business Memberships
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Businesses fetched successfully
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
 *                   example: Businesses fetched
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       slug:
 *                         type: string
 *                         nullable: true
 *                       logo_url:
 *                         type: string
 *                         nullable: true
 *                       verification_status:
 *                         type: string
 *                         nullable: true
 *                       role:
 *                         type: string
 *                         example: owner
 *       401:
 *         description: Unauthorized (not authenticated)
 */
listMyBusinessesRoute.get(
  "/my-businesses",
  verifyAccessToken,
  listMyBusinesses
);

module.exports = listMyBusinessesRoute;