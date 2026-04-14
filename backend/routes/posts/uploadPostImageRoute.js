const express = require("express");
const { verifyAccessToken } = require("../../middleware/security");
const postImageUpload = require("../../middleware/upload/postImageUpload");
const uploadPostImage = require("../../controllers/posts/uploadPostImage");

const uploadPostImageRoute = express.Router();
/**
 * @swagger
 * /api/v1/posts/upload-post-image/{postId}:
 *   post:
 *     summary: Upload an image for an existing post
 *     description: >
 *       Allows an authenticated user to upload a new image attached to a post.  
 *       The file is processed via multipart/form-data, validated, stored, and
 *       the final public URL is returned for frontend usage.  
 *       This does **not** update the post record automatically — the client
 *       must attach the returned URL when updating or creating the post.
 *
 *     tags:
 *       - Posts
 *
 *     security:
 *       - AccessToken: []   # JWT cookie/session authentication
 *
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: >
 *           The ID of the post to associate the uploaded image with.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: >
 *                   The uploaded image file (PNG, JPG, JPEG, WEBP).  
 *                   Recommended max size: 5–15MB depending on backend limits.
 *
 *     responses:
 *       200:
 *         description: Image uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Image uploaded successfully
 *                 image_url:
 *                   type: string
 *                   example: "https://yourdomain.com/uploads/posts/post-12345.webp"
 *
 *       400:
 *         description: Invalid file uploaded or missing image.
 *
 *       401:
 *         description: User is not authenticated.
 *
 *       403:
 *         description: User does not have permission to upload for this post.
 *
 *       404:
 *         description: Post not found.
 *
 *       429:
 *         description: Too many requests (rate limit).
 */

uploadPostImageRoute.post("/upload-post-image/:postId", verifyAccessToken,
    
    (req,res,next) => {
    postImageUpload(req,res,(error) => {
        if(error) {
          return next(error)
        }
        return next();
    })

},
uploadPostImage

)

module.exports = uploadPostImageRoute;
