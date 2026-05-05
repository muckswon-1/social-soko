const express = require("express");
const createComment = require("../../controllers/posts/createComment");
const { verifyAccessToken } = require("../../middleware/security");

const createCommentRoute = express.Router();
/**
 * @swagger
 * /api/v1/posts/create-comment/{postId}:
 *   post:
 *     summary: Create a new comment on a post
 *     description: Adds a text/image/video comment to a specific post.
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
 *         description: ID of the post to comment on
 *         example: "a1c8d454-937d-4f87-ab1b-8c03241d72df"
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Comment content
 *             properties:
 *               content:
 *                 type: string
 *                 nullable: true
 *                 example: "Great update! Congrats on the launch."
 *
 *               image_urls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 example: ["https://cdn.example.com/comments/img1.png"]
 *
 *               video_urls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 example: []
 *
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: ["success", "message", "data"]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Comment added"
 *                 data:
 *                   $ref: "#/components/schemas/Comment"
 *
 *       400:
 *         description: Bad request — Comment must include text, image, or video
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

createCommentRoute.post("/create-comment/:postId",verifyAccessToken, createComment);



module.exports = createCommentRoute;




