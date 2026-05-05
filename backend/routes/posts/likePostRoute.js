const express = require("express");
const likePost = require("../../controllers/posts/likePost");
const { verifyAccessToken } = require("../../middleware/security");

const likePostRoute = express.Router();


/**
 * @swagger
 * /api/v1/like/{postId}:
 *   post:
 *     summary: Like a post
 *     description: Adds a like from the authenticated user to the specified post.
 *     tags:
 *       - Posts
 *
 *     security:
 *       - AccessToken: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["post_id"]
 *             properties:
 *               post_id:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the post to like.
 *                 example: "a1c8d454-937d-4f87-ab1b-8c03241d72df"
 *
 *     responses:
 *       200:
 *         description: Post successfully liked
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
 *                   example: "Post liked"
 *
 *       400:
 *         description: Bad request — Missing post_id
 *
 *       401:
 *         description: Unauthorized — Access token missing or invalid
 *
 *       404:
 *         description: Post not found
 *
 *       500:
 *         description: Internal server error
 */
likePostRoute.post("/like/:postId",  verifyAccessToken, likePost);

module.exports = likePostRoute