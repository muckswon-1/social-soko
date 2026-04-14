const express = require("express");
const postVideoUpload = require("../../middleware/upload/postVideoUpload");
const { verifyAccessToken } = require("../../middleware/security");
const uploadPostVideo = require("../../controllers/posts/uploadPostVideo");

const  uploadPostVideoRoute = express.Router();

/**
 * @swagger
 * /api/v1/posts/upload-post-video/{postId}:
 *   post:
 *     summary: Upload a video for a post
 *     description: >
 *       Uploads a video file associated with a specific post.  
 *       The file is processed via multipart/form-data, validated,
 *       saved to storage, and the public video URL is returned.  
 *       This does **not** automatically attach the video to the post record —  
 *       clients must update the post separately using the returned URL.
 *
 *     tags:
 *       - Posts
 *
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post the video belongs to.
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
 *                   The video file to upload.  
 *                   Accepted MIME types: `video/mp4`, `video/webm`, `video/ogg`, etc.  
 *                   Recommended max size: 20–100MB depending on configuration.
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
 *                   example: "https://yourdomain.com/uploads/post-videos/post-12345-clip.mp4"
 *
 *       400:
 *         description: Invalid file type or missing video upload.
 *       401:
 *         description: Not authenticated (add verifyAccessToken if needed).
 *       403:
 *         description: User does not own the post.
 *       404:
 *         description: Post not found.
 *       429:
 *         description: Too many upload attempts (rate limit).
 */

uploadPostVideoRoute.post("/upload-post-video/:postId",verifyAccessToken,(req,res,next) => {
    postVideoUpload(req,res,(err) =>{
        if(err) return next(err)
        return next();
    })
}, uploadPostVideo);

module.exports = uploadPostVideoRoute