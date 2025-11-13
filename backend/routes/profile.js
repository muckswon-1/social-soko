const express = require("express");
const { verifyAccessToken } = require("../middleware/security");
const { updateUser, fetchProfile } = require("../controllers/profile/profile");

const router = express.Router();

// fetch user information
router.get("/fetch-user-profile/:userId", verifyAccessToken, fetchProfile);
router.post("/update-user-profile/:userId", verifyAccessToken, updateUser);

module.exports = router;
