const express = require("express");
const checkUsername = require("../../controllers/business/checkUsername");

const checkUsernameRoute = express.Router();

 checkUsernameRoute.get("/check-username/:username", checkUsername);

 module.exports = checkUsernameRoute;