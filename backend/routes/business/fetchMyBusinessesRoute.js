// backend/routes/business/fetchMyBusinesses.route.js
"use strict";

const express = require("express");
const { verifyAccessToken } = require("../../middleware/security");
const fetchMyBusinesses = require("../../controllers/business/fetchMyBusinesses");

const fetchMyBusinessesRoute = express.Router();

/**
 * @swagger
 * /api/v1/business/me/businesses:
 *   get:
 *     summary: List my businesses (member/admin/owner)
 *     description: >
 *       Returns the businesses the authenticated user can post in — i.e. businesses
 *       where the user has an ACTIVE membership with role: member, admin, or owner.
 *
 *       Notes:
 *       - Uses cookieAuth (HttpOnly access token)
 *       - Does NOT accept userId as a param (prevents enumerating other users)
 *       - Supports pagination and optional search by business name
 *
 *     tags:
 *       - Business
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         description: Search businesses by name (case-insensitive)
 *         schema:
 *           type: string
 *           example: "ETAC"
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number (1-based)
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Page size
 *         schema:
 *           type: integer
 *           example: 25
 *     responses:
 *       200:
 *         description: Businesses fetched
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
 *                   example: "Businesses fetched"
 *                 data:
 *                   type: object
 *                   properties:
 *                     rows:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           business:
 *                             $ref: "#/components/schemas/Business"
 *                           membershipRole:
 *                             type: string
 *                             enum: [owner, admin, member]
 *                             example: "member"
 *                           membershipStatus:
 *                             type: string
 *                             example: "active"
 *                     count:
 *                       type: integer
 *                       example: 3
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 25
 *       401:
 *         description: Unauthorized (no token or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 */
fetchMyBusinessesRoute.get(
  "/me/businesses",
  verifyAccessToken,
  fetchMyBusinesses
);

module.exports = fetchMyBusinessesRoute;
