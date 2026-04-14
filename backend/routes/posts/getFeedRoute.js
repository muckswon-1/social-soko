const express = require("express");
const getFeed = require("../../controllers/posts/getFeed");
const { verifyAccessToken, verifyAccessTokenOptional } = require("../../middleware/security");
const getFeedRoute = express.Router();


/**
 * @swagger
 * /api/v1/posts/feed:
 *   get:
 *     summary: Get the global social feed
 *     description: |
 *       Returns a paginated list of public posts.  
 *       This is the main feed visible to all authenticated users.
 *     tags:
 *       - Feed
 *
 *     security:
 *       - AccessToken: []
 *
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: "Page number for pagination (default: 1)"
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         required: false
 *         description: "Number of posts per page (default: 20)"
 *
 *     responses:
 *       200:
 *         description: Successfully retrieved the feed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, data, meta]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   description: List of public posts
 *                   items:
 *                     $ref: "#/components/schemas/Post"
 *                 meta:
 *                   type: object
 *                   description: Pagination metadata
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     totalItems:
 *                       type: integer
 *                       example: 128
 *                     totalPages:
 *                       type: integer
 *                       example: 7
 */

getFeedRoute.get("/feed", verifyAccessTokenOptional,getFeed);

module.exports = getFeedRoute;

