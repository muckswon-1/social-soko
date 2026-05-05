const express = require("express");
const { authRateLimiter, authSlowDown, verifyAccessToken } = require("../../middleware/security");
const { uploadProfilePicture } = require("../../controllers/profile/profile");
const profilePictureUpload = require("../../middleware/upload/profilePictureUpload");

const uploadProfileRoute = express.Router();



uploadProfileRoute.post("/upload-profile-picture/:profileId", 
    authRateLimiter, authSlowDown, 
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