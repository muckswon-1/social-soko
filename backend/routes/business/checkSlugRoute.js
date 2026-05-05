const express = require("express");
const checkSlug = require("../../controllers/business/checkSlug");

const checkSlugRoute = express.Router();

/**
 * @swagger
 * /api/v1/business/check-slug/{slug}:
 *   get:
 *     summary: Check if a business slug is available
 *     description: Validates a slug/username and checks whether it is already taken by another business.
 *     tags:
 *       - Business
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug (username) to check
 *     responses:
 *       200:
 *         description: Slug is available
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
 *                   example: "Slug is available"
 *
 *       400:
 *         description: Invalid slug format or slug already taken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "This slug is already taken"
 *
 *       500:
 *         description: Server error
 */


checkSlugRoute.get("/check-slug/:slug", checkSlug);

module.exports = checkSlugRoute;