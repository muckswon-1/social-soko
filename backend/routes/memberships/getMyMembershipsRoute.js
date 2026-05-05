const express = require("express");
const { verifyAccessToken } = require("../../middleware/security");
const getMyMemberships = require("../../controllers/memberships/getMyMemberships");
const getMyMembershipsRoute = express.Router();

/**
 * @swagger
 * /api/v1/business-members/my-memberships:
 *   get:
 *     summary: Get all business memberships for the authenticated user
 *     description: >
 *       Returns a list of all businesses the authenticated user belongs to,  
 *       including their role (owner, admin, staff) and basic business information.
 *     tags:
 *       - Business Members
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched memberships
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
 *                   example: "Business memberships fetched successfully"
 *                 memberships:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "a1b2c3d4-5678-90ef-1234-abcdef987654"
 *                       user_id:
 *                         type: string
 *                         format: uuid
 *                         example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *                       business_id:
 *                         type: string
 *                         format: uuid
 *                         example: "ab12cd34-ef56-7890-abcd-ef1234567890"
 *                       role:
 *                         type: string
 *                         example: "owner"
 *                       invitation_status:
 *                         type: string
 *                         example: "accepted"
 *                       joined_at:
 *                         type: string
 *                         format: date-time
 *                       Business:
 *                         type: object
 *                         description: Basic business info
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           username:
 *                             type: string
 *                             example: "etac_service"
 *                           name:
 *                             type: string
 *                             example: "ETAC Service and Supply Inc"
 *                           city:
 *                             type: string
 *                             example: "Winnipeg"
 *                           country:
 *                             type: string
 *                             example: "Canada"
 *                           slug:
 *                             type: string
 *                             example: "etac-service-supply"
 *                           verification_status:
 *                             type: string
 *                             example: "pending"
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *       500:
 *         description: Internal server error
 */

module.exports = getMyMembershipsRoute.get("/my-memberships",verifyAccessToken,  getMyMemberships)