const express = require("express");
const { verifyAccessToken, requireAdmin } = require("../../../middleware/security");
const fetchAllBusiness= require("../../controllers/business/fetchAllBusiness");
const fetchAllBusinessesRoute = express.Router();

/**
 * @swagger
 * /api/v1/admin/business/fetch-all:
 *   get:
 *     summary: List businesses (admin only)
 *     description: >
 *       Returns a paginated list of businesses, optionally filtered by a search term.  
 *       
 *       This endpoint:
 *       - Requires authentication  
 *       - Requires admin privileges  
 *       - Supports pagination via `page` and `limit` query parameters  
 *       - Supports text search via the `search` query parameter across multiple fields
 *         (`name`, `description`, `address`, `city`, `state`, `country`, `postal_code`, `phone`, `email`).
 *     tags:
 *       - Admin - Business
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number for pagination (1-based).
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           example: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of items per page.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 200
 *           default: 50
 *           example: 50
 *       - in: query
 *         name: search
 *         required: false
 *         description: >
 *           Optional search term to filter businesses by name, description, address,
 *           city, state, country, postal code, phone, or email (case-insensitive).
 *         schema:
 *           type: string
 *           example: "Winnipeg"
 *     responses:
 *       200:
 *         description: Paginated list of businesses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Business"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                       example: 123
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     limit:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *             examples:
 *               success:
 *                 value:
 *                   rows:
 *                     - id: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *                       user_id: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *                       name: "ETAC Service and Supply Inc"
 *                       city: "Winnipeg"
 *                       country: "Canada"
 *                       verification_status: "requested"
 *                     - id: "91718ded-da6d-4418-ac45-5a09d0369ac0"
 *                       user_id: "57086655-4ca2-4f2e-a350-4d4b6dc2d400"
 *                       name: "SellPhones Canada Wholesale"
 *                       city: "Ottawa"
 *                       country: "Canada"
 *                       verification_status: "pending"
 *                   meta:
 *                     totalItems: 2
 *                     totalPages: 1
 *                     limit: 50
 *                     page: 1
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – user is not an admin
 */

module.exports = fetchAllBusinessesRoute.get("/business/fetch-all",verifyAccessToken,requireAdmin, fetchAllBusiness);