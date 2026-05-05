const express = require("express");
const { verifyAccessToken, requireAdmin } = require("../../../middleware/security");
const retryEmailJob = require("../../controllers/emailJobs/retryEmailJob");

const retryEmailJobRouter = express.Router();
/**
 * @swagger
 * /api/v1/admin/email-jobs/retry/{id}:
 *   post:
 *     summary: Retry an email job (admin only)
 *     description: >
 *       Allows an admin to retry an email job, optionally modifying its payload,
 *       template or recipient address.  
 *       
 *       Behavior:
 *       - Requires admin privileges  
 *       - If job does not exist → 404  
 *       - If job status is `"sent"` and `forceRetry` is false → 400  
 *       - If payload is provided, it must be a valid JSON object  
 *       - Job is reset to:  
 *         - `status = "pending"`  
 *         - `attempts = 0`  
 *         - `last_error = null`  
 *       - Returns the updated job  
 *     tags:
 *       - Admin - Email Jobs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the email job to retry.
 *         schema:
 *           type: integer
 *           example: 42
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               template:
 *                 type: string
 *                 description: Override the email template to use.
 *                 example: "verifyEmail"
 *               to:
 *                 type: string
 *                 description: Override the recipient address.
 *                 example: "admin@example.com"
 *               payload:
 *                 type: object
 *                 nullable: true
 *                 description: Override the payload data. Must be a JSON object.
 *                 example:
 *                   email: "admin@example.com"
 *                   token: "abc123xyz"
 *                   expiresInMinutes: 60
 *               forceRetry:
 *                 type: boolean
 *                 description: >
 *                   Retry even if job status is "sent".
 *                 example: true
 *     responses:
 *       200:
 *         description: Job has been retried and placed back in pending state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Job has been retried"
 *                 job:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     to:
 *                       type: string
 *                     template:
 *                       type: string
 *                     payload:
 *                       type: object
 *                     status:
 *                       type: string
 *                       example: "pending"
 *                     attempts:
 *                       type: integer
 *                       example: 0
 *                     last_error:
 *                       type: string
 *                       nullable: true
 *             examples:
 *               success:
 *                 value:
 *                   message: "Job has been retried"
 *                   job:
 *                     id: 42
 *                     to: "john@example.com"
 *                     template: "verifyEmail"
 *                     payload:
 *                       email: "john@example.com"
 *                       token: "12345"
 *                     status: "pending"
 *                     attempts: 0
 *                     last_error: null
 *       400:
 *         description: Validation error (missing ID, invalid payload, or email already sent without forceRetry)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingId:
 *                 value:
 *                   success: false
 *                   error: "Job id is required"
 *               alreadySent:
 *                 value:
 *                   message: "Email already sent. Use forceRetry to override."
 *               invalidPayload:
 *                 value:
 *                   success: false
 *                   error: "Payload must be a JSOn object"
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               notFound:
 *                 value:
 *                   success: false
 *                   error: "Job not found"
 *       401:
 *         description: Unauthorized — invalid or missing access token
 *       403:
 *         description: Forbidden — user is not an admin
 */

module.exports = retryEmailJobRouter.post("/email-jobs/retry/:id",verifyAccessToken, requireAdmin, retryEmailJob);
