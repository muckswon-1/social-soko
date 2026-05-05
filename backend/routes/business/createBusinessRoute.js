const express = require("express");
const { verifyAccessToken, authRateLimiter, authSlowDown } = require("../../middleware/security");
const createBusiness = require("../../controllers/business/createBusiness");
const createBusinessRoute = express.Router();


/**
 * @swagger
 * /api/v1/business/create-business/{userId}:
 *   post:
 *     summary: Create a business profile for a user
 *     description: >
 *       Creates a new Business entity associated with a specific user.  
 *       
 *       Behavior:
 *       - Requires a valid authenticated session (access token)  
 *       - Validates that the `userId` exists  
 *       - Creates a Business record linked to that user  
 *       - Updates the user's role to `"business"`  
 *       - Enqueues a `businessCreated` email notification to the user  
 *       
 *       The request body must include a `businessData` object with at least a `name`.
 *     tags:
 *       - Business
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user that owns this business
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
 *                 required:
 *                   - name
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "ETAC Service and Supply Inc"
 *                   description:
 *                     type: string
 *                     example: "We sell large organization transformers."
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
 *       201:
 *         description: Business created successfully
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
 *                   example: "Business created successfully"
 *                 business:
 *                   $ref: "#/components/schemas/Business"
 *             examples:
 *               created:
 *                 value:
 *                   success: true
 *                   message: "Business created successfully"
 *                   business:
 *                     id: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *                     user_id: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *                     name: "ETAC Service and Supply Inc"
 *                     description: "We sell large organization transformers."
 *                     address: "123 Industrial Park Road"
 *                     city: "Winnipeg"
 *                     state: "Manitoba"
 *                     country: "Canada"
 *                     postal_code: "R2J 4G7"
 *                     phone: "18197002211"
 *                     email: "sales@etac-supply.com"
 *                     website: "https://etac-supply.com"
 *                     slug: "etac-service-and-supply-inc"
 *                     logo_url: "https://cdn.example.com/logos/etac.png"
 *                     verification_status: "pending"
 *       400:
 *         description: Validation error (missing userId or businessData.name)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingUserId:
 *                 value:
 *                   success: false
 *                   error: "User ID is required"
 *                   code: "BAD_REQUEST"
 *               missingPayload:
 *                 value:
 *                   success: false
 *                   error: "Missing businessData payload or name"
 *                   code: "BAD_REQUEST"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               userNotFound:
 *                 value:
 *                   success: false
 *                   error: "User not found"
 *                   code: "NOT_FOUND"
 */

createBusinessRoute.post("/create-business/:userId", verifyAccessToken,createBusiness);

module.exports = createBusinessRoute;