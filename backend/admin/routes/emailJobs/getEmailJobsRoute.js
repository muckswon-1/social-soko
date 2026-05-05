const express = require("express");
const { verifyAccessToken, requireAdmin } = require("../../../middleware/security");
const getEmailJobs = require("../../controllers/emailJobs/getEmailJobs");
const getEmailJobsRoute = express.Router();

/**
 * @swagger
 * /api/v1/admin/fetch-email-jobs:
 *   get:
 *     summary: Fetch email job logs (admin only)
 *     description: >
 *       Retrieves a paginated list of email jobs for debugging, monitoring and audit purposes.  
 *       
 *       Supports:
 *       - Pagination (`page`, `limit`)  
 *       - Status filtering (`status=pending|processing|sent|failed|all`)  
 *       - Sorted by latest created first  
 *       
 *       Requires admin privileges.
 *     tags:
 *       - Admin - Email Jobs
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         description: >
 *           Filter email jobs by status.  
 *           Use `"all"` to return all statuses.  
 *           Available statuses: `pending`, `processing`, `sent`, `failed`.
 *         schema:
 *           type: string
 *           example: "pending"
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
 *     responses:
 *       200:
 *         description: List of email jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 emailJobs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 17
 *                       user_id:
 *                         type: string
 *                         format: uuid
 *                         example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *                       to:
 *                         type: string
 *                         example: "john@example.com"
 *                       template:
 *                         type: string
 *                         example: "verifyEmail"
 *                       payload:
 *                         type: object
 *                         example:
 *                           email: "john@example.com"
 *                           token: "7912be18..."
 *                           expiresInMinutes: 60
 *                       status:
 *                         type: string
 *                         example: "pending"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 50
 *                     totalItems:
 *                       type: integer
 *                       example: 123
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                     statusFilter:
 *                       type: string
 *                       example: "pending"
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *       403:
 *         description: Forbidden — user is not an admin
 */
module.exports = getEmailJobsRoute.get("/fetch-email-jobs",verifyAccessToken,requireAdmin,getEmailJobs);