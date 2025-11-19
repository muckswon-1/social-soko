const express = require("express");
const fetchProfileRoute = require("./fetchProfileRoute");
const updateUserRoute = require("./updateUserRoute");

const profileRoutes = express.Router();

profileRoutes.use(fetchProfileRoute);
profileRoutes.use(updateUserRoute);


module.exports = profileRoutes;