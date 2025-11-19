const express = require("express");
const { authRateLimiter, authSlowDown, verifyAccessToken, requireRole } = require("../../middleware/security");
const { ROLES } = require("../../constants/roles");

const updateBusinessRoute = express.Router();

/**
 * @swagger
 * /api/v1/business/update-business/{id}/{userId}:
 *   post:
 *     summary: Update an existing business
 *     description: >
 *       Updates an existing Business owned by a specific user.  
 *       
 *       Requirements:
 *       - Authenticated request (valid access token)  
 *       - Caller must have `business` or `admin` role  
 *       - `id` (business ID) and `userId` (owner user ID) must both be provided  
 *       - At least one updatable field must be present in `businessData`  
 *       
 *       The request body must include `businessData`, and it must contain at least
 *       the `name` field along with any other fields you want to update.
 *     tags:
 *       - Business
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the business to update
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user who owns this business
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessData
 *             properties:
 *               businessData:
 *                 type: object
 *                 description: Fields to update on the business. At least one field must be provided, and name is required in the payload.
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "ETAC Service and Supply Inc"
 *                   description:
 *                     type: string
 *                     example: "We sell large organizational transformers."
 *                   address:
 *                     type: string
 *                     example: "123 Industrial Park Road"
 *                   city:
 *                     type: string
 *                     example: "Winnipeg"
 *                   state:
 *                     type: string
 *                     example: "Manitoba"
 *                   country:
 *                     type: string
 *                     example: "Canada"
 *                   postal_code:
 *                     type: string
 *                     example: "R2J 4G7"
 *                   phone:
 *                     type: string
 *                     example: "18197002211"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "sales@etac-supply.com"
 *                   website:
 *                     type: string
 *                     example: "https://etac-supply.com"
 *                   slug:
 *                     type: string
 *                     example: "etac-service-and-supply-inc"
 *                   logo_url:
 *                     type: string
 *                     example: "https://cdn.example.com/logos/etac.png"
 *     responses:
 *       200:
 *         description: Business updated successfully
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
 *                   example: "Business updated successfully"
 *                 business:
 *                   $ref: "#/components/schemas/Business"
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Business updated successfully"
 *                   business:
 *                     id: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *                     user_id: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *                     name: "ETAC Service and Supply Inc"
 *                     city: "Winnipeg"
 *                     country: "Canada"
 *                     verification_status: "pending"
 *       400:
 *         description: Validation error (missing params, missing payload, or no fields to update)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingIds:
 *                 value:
 *                   success: false
 *                   error: "User ID and business ID required"
 *                   code: "BAD_REQUEST"
 *               noFields:
 *                 value:
 *                   success: false
 *                   error: "No fields to update"
 *                   code: "BAD_REQUEST"
 *               missingPayload:
 *                 value:
 *                   success: false
 *                   error: "Missing businessData payload or name"
 *                   code: "BAD_REQUEST"
 *       404:
 *         description: Business not found for given id + userId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               notFound:
 *                 value:
 *                   success: false
 *                   error: "Business not found"
 *                   code: "NOT_FOUND"
 *       401:
 *         description: Unauthorized – missing or invalid access token
 *       403:
 *         description: Forbidden – user does not have BUSINESS or ADMIN role
 */

module.exports = updateBusinessRoute.post("/update-business/:id/:userId",authRateLimiter, authSlowDown,verifyAccessToken,requireRole(ROLES.BUSINESS,ROLES.ADMIN))