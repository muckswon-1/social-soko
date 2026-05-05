const express = require("express");
const { authRateLimiter, authSlowDown, verifyAccessToken } = require("../../middleware/security");
const { uploadProfilePicture } = require("../../controllers/profile/profile");
const profilePictureUpload = require("../../middleware/upload/profilePictureUpload");

const uploadProfileRoute = express.Router();



/**
 * @swagger
 * /api/v1/profile/upload-profile-picture/{profileId}:
 *   post:
 *     summary: Upload or replace the user's profile picture
 *     description: >
 *       Allows an authenticated user to upload a new profile picture.
 *       The image is processed via multipart/form-data, validated,
 *       stored on the server, and the resulting public URL is saved
 *       to the user's profile record.
 *
 *     tags:
 *       - Profile
 *
 *     security:
 *       - AccessToken: []   # JWT cookie/session-based auth
 *
 *     parameters:
 *       - in: path
 *         name: profileId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the profile whose avatar is being updated.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - picture
 *             properties:
 *               picture:
 *                 type: string
 *                 format: binary
 *                 description: >
 *                   Profile picture file (PNG, JPG, JPEG, WEBP).  
 *                   Recommended max size: 2–5MB.
 *
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully.
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
 *                   example: Profile picture uploaded successfully
 *                 avatar_url:
 *                   type: string
 *                   example: "https://yourdomain.com/uploads/profiles/user-123.webp"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "2d6f6b0d-ad91-46f8-b559-1169f061cd20"
 *                     first_name:
 *                       type: string
 *                       example: "Alex"
 *                     last_name:
 *                       type: string
 *                       example: "Asselin"
 *                     avatar_url:
 *                       type: string
 *                       example: "https://yourdomain.com/uploads/profiles/user-123.webp"
 *
 *       400:
 *         description: Missing file or invalid upload (wrong type, size too large, etc.)
 *
 *       401:
 *         description: Not authenticated.
 *
 *       403:
 *         description: Forbidden — User cannot modify this profile.
 *
 *       404:
 *         description: Profile not found.
 *
 *       429:
 *         description: Too many requests (rate limit).
 */
uploadProfileRoute.post("/upload-profile-picture/:profileId", 
    
    verifyAccessToken, 
    (req,res, next) => {
        profilePictureUpload(req,res,(err) => {

            if(err)  return next(err);
            next();
        })
    },

    uploadProfilePicture
)


module.exports = uploadProfileRoute;