const express = require("express");
const { verifyAccessToken } = require("../../middleware/security");
const uploadCommentVideo = require("../../controllers/posts/uploadCommentVideo");
const commentVideoUpload = require("../../middleware/upload/commentVideoUpload");

const uploadCommentVideoRoute = express.Router();
/**
 * @swagger
 * /api/v1/posts/upload-comment-video/{commentId}:
 *   post:
 *     summary: Upload a video file for a comment
 *     description: >
 *       Uploads a video associated with an existing comment.  
 *       The backend validates the video file, stores it, and returns a public URL.  
 *       This endpoint does **not** automatically update the comment record —  
 *       the client must attach the returned URL in a follow-up update request.
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
 *         description: The ID of the comment that the uploaded video belongs to.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - video
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: >
 *                   The video file to upload (MP4, WEBM, OGG, etc.).  
 *                   Recommended maximum size: 20–100MB depending on backend config.
 *
 *     responses:
 *       200:
 *         description: Video uploaded successfully.
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
 *                   example: Video uploaded successfully
 *                 video_url:
 *                   type: string
 *                   example: "https://yourdomain.com/uploads/comment-videos/comment-abc-clip.mp4"
 *
 *       400:
 *         description: Invalid file or missing video upload.
 *       401:
 *         description: Authentication required.
 *       403:
 *         description: Forbidden — user does not own the comment.
 *       404:
 *         description: Comment not found.
 *       429:
 *         description: Too many requests (rate limited).
 */
uploadCommentVideoRoute.post("/upload-comment-video/:commentId",verifyAccessToken,(req,res,next) => {
    commentVideoUpload(req,res,(err) =>{
        if(err) return next(err)
        return next();
    });
}, uploadCommentVideo);

module.exports = uploadCommentVideoRoute;
    