const express = require("express");
const { verifyAccessToken } = require("../../middleware/security");
const fetchBusinessById = require("../../controllers/business/fetchBusinessById");

const fetchBusinessByIdRoute = express.Router();

/**
 * @swagger
 * /api/v1/business/{id}:
 *   get:
 *     summary: Fetch a business by ID
 *     description: >
 *       Retrieves a single Business profile by its unique ID.
 *       
 *       This endpoint is intended for internal use (e.g. post details pages, admin tools)
 *       and requires a valid access token. Any authenticated user may call this endpoint;
 *       additional field-level authorization can be enforced inside the controller.
 *     tags:
 *       - Business
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The Business ID you want to fetch.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *     responses:
 *       200:
 *         description: Business found
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
 *                   example: "Business found"
 *                 business:
 *                   $ref: "#/components/schemas/Business"
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Business found"
 *                   business:
 *                     id: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *                     user_id: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *                     name: "ETAC Service and Supply Inc"
 *                     city: "Winnipeg"
 *                     country: "Canada"
 *                     verification_status: "pending"
 *       400:
 *         description: Missing or invalid business ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingOrInvalidId:
 *                 value:
 *                   success: false
 *                   error: "Business ID is required"
 *                   code: "BAD_REQUEST"
 *       404:
 *         description: Business not found
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
 *         description: Unauthorized (no token or invalid token)
 */
fetchBusinessByIdRoute.get("/:id", verifyAccessToken, fetchBusinessById);

module.exports = fetchBusinessByIdRoute;
