"use strict";

const express = require("express");
const { verifyAccessToken } = require("../../middleware/security");
const searchBusinesses = require("../../controllers/business/searchBusinesses");


const searchBusinessesForJoinRoute = express.Router();

/**
 * @swagger
 * /api/v1/business/public/search:
 *   get:
 *     summary: Search businesses for membership request
 *     description: >
 *       Searches businesses that the authenticated user may request to join.
 *
 *       This endpoint is designed for the "Join a Business" flow.
 *       It intentionally returns only public-safe business fields so that
 *       non-members cannot view private business information.
 *
 *       The response includes the current user's relationship to each business,
 *       such as whether they are already a member or already have a pending request.
 *     tags:
 *       - Business
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: Search text used to match business name, username, or slug.
 *         schema:
 *           type: string
 *           example: "prairie"
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination.
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of businesses to return per page.
 *         schema:
 *           type: integer
 *           example: 15
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
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                               name:
 *                                 type: string
 *                               username:
 *                                 type: string
 *                               slug:
 *                                 type: string
 *                               logo_url:
 *                                 type: string
 *                                 nullable: true
 *                               verification_status:
 *                                 type: string
 *                                 example: "verified"
 *                               city:
 *                                 type: string
 *                                 nullable: true
 *                               state:
 *                                 type: string
 *                                 nullable: true
 *                               country:
 *                                 type: string
 *                                 nullable: true
 *                           relationship:
 *                             type: object
 *                             properties:
 *                               type:
 *                                 type: string
 *                                 enum:
 *                                   - member
 *                                   - pending_request
 *                                   - none
 *                                 example: "none"
 *                               role:
 *                                 type: string
 *                                 nullable: true
 *                                 example: null
 *                               status:
 *                                 type: string
 *                                 nullable: true
 *                                 example: null
 *                               requested_at:
 *                                 type: string
 *                                 format: date-time
 *                                 nullable: true
 *                           canRequestMembership:
 *                             type: boolean
 *                             example: true
 *                     count:
 *                       type: integer
 *                       example: 2
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 15
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Businesses fetched"
 *                   data:
 *                     rows:
 *                       - business:
 *                           id: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *                           name: "Prairie Grid Components Ltd"
 *                           username: "prairie_grid"
 *                           slug: "prairie-grid-components"
 *                           logo_url: "https://cdn.example.com/logos/prairie-grid.png"
 *                           verification_status: "verified"
 *                           city: "Winnipeg"
 *                           state: "Manitoba"
 *                           country: "Canada"
 *                         relationship:
 *                           type: "none"
 *                           role: null
 *                           status: null
 *                         canRequestMembership: true
 *                       - business:
 *                           id: "811fc881-9ed0-4756-a32e-84a919b5a140"
 *                           name: "Atlas Logistics Group"
 *                           username: "atlas_logistics"
 *                           slug: "atlas-logistics"
 *                           logo_url: null
 *                           verification_status: "requested"
 *                           city: "Toronto"
 *                           state: "Ontario"
 *                           country: "Canada"
 *                         relationship:
 *                           type: "pending_request"
 *                           role: null
 *                           status: "pending"
 *                           requested_at: "2026-04-24T14:04:55.708Z"
 *                         canRequestMembership: false
 *                     count: 2
 *                     page: 1
 *                     limit: 15
 *               empty:
 *                 value:
 *                   success: true
 *                   message: "No businesses found"
 *                   data:
 *                     rows: []
 *                     count: 0
 *                     page: 1
 *                     limit: 15
 *       400:
 *         description: Missing or invalid search query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               shortQuery:
 *                 value:
 *                   success: false
 *                   error: "Search query must be at least 2 characters"
 *                   code: "BAD_REQUEST"
 *       401:
 *         description: Unauthorized, missing token, or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               unauthorized:
 *                 value:
 *                   success: false
 *                   error: "Not authenticated"
 *                   code: "UNAUTHORIZED"
 */
searchBusinessesForJoinRoute.get(
  "/public/search",
  verifyAccessToken,
  searchBusinesses,
);

module.exports = searchBusinessesForJoinRoute;