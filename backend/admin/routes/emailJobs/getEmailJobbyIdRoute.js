const express = require("express");
const { verifyAccessToken, requireAdmin } = require("../../../middleware/security");
const getEmailJobById = require("../../controllers/emailJobs/getEmailJobById");

const getEmailJobByIdRoute = express.Router();

/**
 * @swagger
 * /api/v1/admin/email-jobs/{id}:
 *   get:
 *     summary: Fetch a single email job by ID (admin only)
 *     description: >
 *       Retrieves the full details of an email job by its ID.  
 *       Only accessible to admin users.  
 *       
 *       This endpoint is useful for debugging email dispatch issues,
 *       checking payloads, and reviewing job metadata.
 *     tags:
 *       - Admin - Email Jobs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the email job to retrieve.
 *         schema:
 *           type: integer
 *           example: 42
 *     responses:
 *       200:
 *         description: Email job retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 42
 *                     user_id:
 *                       type: string
 *                       format: uuid
 *                       example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *                     to:
 *                       type: string
 *                       example: "john@example.com"
 *                     template:
 *                       type: string
 *                       example: "verifyEmail"
 *                     payload:
 *                       type: object
 *                       example:
 *                         email: "john@example.com"
 *                         token: "0c7ad94f51fd..."
 *                         expiresInMinutes: 60
 *                     status:
 *                       type: string
 *                       example: "pending"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Missing job ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingJobId:
 *                 value:
 *                   success: false
 *                   error: "Job id is required"
 *                   code: "BAD_REQUEST"
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               jobNotFound:
 *                 value:
 *                   success: false
 *                   error: "Job not found"
 *                   code: "NOT_FOUND"
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *       403:
 *         description: Forbidden — user is not an admin
 */
module.exports = getEmailJobByIdRoute.get("/email-jobs/:id",verifyAccessToken, requireAdmin,getEmailJobById);