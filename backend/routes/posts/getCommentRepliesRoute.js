const  express = require("express");
const { verifyAccessToken, verifyAccessTokenOptional } = require("../../middleware/security");
const getCommentReplies = require("../../controllers/posts/getCommentReplies");

const getCommentRepliesRoute = express.Router();

/**
 * @swagger
 * /api/v1/comments/replies/{commentId}:
 *   get:
 *     summary: Get replies for a comment
 *     description: |
 *       Retrieves a paginated list of replies for a specific parent comment.
 *
 *       - Returns only replies where `parent_id = commentId`
 *       - Replies are ordered oldest first for natural thread reading
 *       - Used when a user clicks "Show more replies" under a comment
 *
 *     tags:
 *       - Comments
 *
 *     security:
 *       - AccessToken: []
 *
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the parent comment to fetch replies for.
 *         example: "4961eedc-cf0a-40dd-adee-2291cf110414"
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
 *         description: "Number of replies per page (default: 10)"
 *
 *     responses:
 *       200:
 *         description: Successfully retrieved comment replies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required: ["success", "replies", "meta"]
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 replies:
 *                   type: array
 *                   description: List of replies for the parent comment.
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
 *                       example: 10
 *                     totalItems:
 *                       type: integer
 *                       example: 7
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     hasMore:
 *                       type: boolean
 *                       example: false
 *
 *       400:
 *         description: Invalid comment ID
 *       401:
 *         description: Unauthorized — Access token missing or invalid
 *       404:
 *         description: Parent comment not found
 *       500:
 *         description: Internal server error
 */
getCommentRepliesRoute.get("/comments/replies/:commentId",verifyAccessTokenOptional,getCommentReplies);

module.exports = getCommentRepliesRoute;