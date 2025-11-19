const express = require("express");
const { verifyAccessToken, requireAdmin } = require("../../../middleware/security");
const fetchUsers = require("../../controllers/users/fetchUsers");
const fetchUsersRoute = express.Router();

/**
 * @swagger
 * /api/v1/admin/fetch-users:
 *   get:
 *     summary: List users (admin only)
 *     description: >
 *       Returns a paginated list of users, optionally filtered by a search term.  
 *       
 *       This endpoint:
 *       - Requires authentication  
 *       - Requires admin privileges  
 *       - Supports pagination via `page` and `limit` query parameters  
 *       - Supports text search via the `search` query parameter across `email`, `first_name`, and `last_name`.
 *     tags:
 *       - Admin - Users
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
 *           Optional search term to filter users by email, first name, or last name (case-insensitive).
 *         schema:
 *           type: string
 *           example: "alex"
 *     responses:
 *       200:
 *         description: Paginated list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rows:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       email:
 *                         type: string
 *                         format: email
 *                       first_name:
 *                         type: string
 *                       last_name:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                       email_verified:
 *                         type: boolean
 *                       role:
 *                         type: string
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
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – user is not an admin
 */
module.exports = fetchUsersRoute.get("/fetch-users",verifyAccessToken, requireAdmin,fetchUsers)