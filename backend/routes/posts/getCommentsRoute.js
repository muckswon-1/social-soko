const express = require("express");
const getComments = require("../../controllers/posts/getComments");
const { verifyAccessTokenOptional } = require("../../middleware/security");

const getCommentsRoute = express.Router();

/**
 * @swagger
 * /api/v1/posts/comments/{postId}
 *   get:
 *     summary: Get comments on a post
 *     description: Retrieves a paginated list of comments for a specific post.
 *     tags:
 *       - Comments
 *
 *     security:
 *       - AccessToken: []
 *
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the post to fetch comments for.
 *         example: "a1c8d454-937d-4f87-ab1b-8c03241d72df"
 *
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
 *         description: "Number of comments per page (default: 20)"
 *
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: ["success", "data", "meta"]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   description: List of comments for the post.
 *                   items:
 *                     $ref: "#/components/schemas/Comment"
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     totalItems:
 *                       type: integer
 *                       example: 42
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *
 *       400:
 *         description: Invalid post ID
 *       401:
 *         description: Unauthorized — Access token missing or invalid
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
getCommentsRoute.get("/comments/:postId", verifyAccessTokenOptional,getComments);


module.exports = getCommentsRoute;