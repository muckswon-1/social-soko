const express = require("express");
const createPost = require("../../controllers/posts/createPost");
const { verifyAccessToken } = require("../../middleware/security");
const requireBusinessRoleMW = require("../../middleware/requireBusinessRole");

const createPostRoute = express.Router();

/**
 * @swagger
 * /api/v1/posts/create:
 *   post:
 *     summary: Create a new social post
 *     description: |
 *       Creates a new post for a business.  
 *       The post must contain at least one of: text, images, or videos.
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
 *             required: ["business_id"]
 *             properties:
 *               business_id:
 *                 type: string
 *                 format: uuid
 *                 description: The business creating the post.
 *                 example: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *
 *               content:
 *                 type: string
 *                 nullable: true
 *                 description: Text content of the post.
 *                 example: "We just launched a new product line!"
 *
 *               image_urls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 description: Image URLs attached to the post.
 *                 example:
 *                   - "https://cdn.example.com/posts/img1.png"
 *
 *               video_urls:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 description: Video URLs attached to the post.
 *                 example: []
 *
 *               visibility:
 *                 type: string
 *                 description: Who can see this post.
 *                 enum: ["public", "private", "friends", "groups", "custom"]
 *                 example: "public"
 *
 *     responses:
 *       201:
 *         description: Post created successfully
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
 *                   example: "Post created successfully"
 *                 data:
 *                   $ref: "#/components/schemas/Post"
 *
 *       400:
 *         description: Bad request — Missing required fields or no post content
 *
 *       401:
 *         description: Unauthorized — Access token required
 *
 *       403:
 *         description: Forbidden — User cannot post for the selected business
 *
 *       500:
 *         description: Internal server error
 */
createPostRoute.post("/create",verifyAccessToken, 
    requireBusinessRoleMW("member", {businessIdParam: "business_id"}),
createPost

);

module.exports = createPostRoute;


