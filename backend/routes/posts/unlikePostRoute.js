const express = require("express");
const unlikePost = require("../../controllers/posts/unlikePost");
const { verifyAccessToken } = require("../../middleware/security");

const unlikePostRoute = express.Router();

/**
 * @swagger
 * /api/v1/posts/dislike/{postId}:
 *   post:
 *     summary: Unlike a post
 *     description: Removes the authenticated user's like from the specified post.
 *     tags:
 *       - Posts
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
 *         description: ID of the post to unlike
 *         example: "a1c8d454-937d-4f87-ab1b-8c03241d72df"
 *
 *     responses:
 *       200:
 *         description: Post successfully unliked
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: ["success", "message"]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Post unliked"
 *
 *       400:
 *         description: Bad request — Missing or invalid postId
 *
 *       401:
 *         description: Unauthorized — User must be logged in
 *
 *       404:
 *         description: Post not found
 *
 *       500:
 *         description: Internal server error
 */

unlikePostRoute.post("/dislike/:postId", verifyAccessToken,unlikePost);


module.exports = unlikePostRoute