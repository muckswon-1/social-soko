const express = require("express");
const commentImageUpload = require("../../middleware/upload/commentImageUpload");
const { verifyAccessToken } = require("../../middleware/security");
const uploadCommentImage = require("../../controllers/posts/uploadCommentImage");

const uploadCommentImageRoute = express.Router();

/**
 * @swagger
 * /api/v1/posts/upload-comment-image/{commentId}:
 *   post:
 *     summary: Upload an image for a comment
 *     description: >
 *       Allows a user to upload an image associated with an existing comment.  
 *       The file is uploaded via multipart/form-data, validated, stored, and the
 *       public URL is returned.  
 *       This does **not** automatically modify the comment record — the backend
 *       expects the client to attach the returned URL in a follow-up update request.
 *
 *     tags:
 *       - Comments
 *
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the comment that the image belongs to.
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
 *                   The image file to upload.  
 *                   Accepted: PNG, JPG, JPEG, WEBP.  
 *                   Max size: 5–15MB depending on backend config.
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
 *                   example: "https://yourdomain.com/uploads/comments/comment-12345.webp"
 *
 *       400:
 *         description: Invalid file or missing upload.
 *       401:
 *         description: Not authenticated.
 *       403:
 *         description: User does not own this comment.
 *       404:
 *         description: Comment not found.
 *       429:
 *         description: Too many upload attempts (rate limit).
 */

uploadCommentImageRoute.post("/upload-comment-image/:commentId",verifyAccessToken,(req,res,next) => {
    commentImageUpload(req,res,(error) => {
        if(error) return next(error);
        return next();
    })
},
uploadCommentImage
);

module.exports = uploadCommentImageRoute;
 