const express = require('express');
const getPostById = require('../../controllers/posts/getPostById');
const { verifyAccessTokenOptional } = require('../../middleware/security');

const getPostByIdRoute = express.Router();

/**
 * @swagger
 * /api/v1/posts/{postId}:
 *   get:
 *     summary: Get a single post by ID
 *     description: |
 *       Returns a single post with full details, including:
 *       - author information
 *       - business information (if applicable)
 *       - engagement stats (likes, dislikes, bookmarks, views, comments)
 *       - current user interaction flags (liked, disliked, bookmarked)
 *
 *       If the user is authenticated, the response includes user-specific
 *       interaction states. If not authenticated, these flags default to false.
 *
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
 *         description: The UUID of the post to retrieve
 *
 *     responses:
 *       200:
 *         description: Post fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: [success, message, post]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Post fetched successfully
 *                 post:
 *                   $ref: "#/components/schemas/Post"
 *
 *       400:
 *         description: Missing or invalid postId
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
 *                   example: postId is required
 *
 *       404:
 *         description: Post not found
 *
 *       401:
 *         description: Unauthorized (invalid or missing access token)
 */

getPostByIdRoute.get("/:postId", verifyAccessTokenOptional,getPostById);


module.exports = getPostByIdRoute;