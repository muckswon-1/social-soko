const express = require("express");
const createBusinessRoute = require("./createBusinessRoute");
const fetchBusinessRoute = require("./fetchBusinessRoute");
const requestBusinessVerificationRoute = require("./requestBusinessVerificationRoute");
const checkUsernameRoute = require("./checkUsernameRoute");
const checkSlugRoute = require("./checkSlugRoute");
const uploadLogoRoute = require("./uploadLogoRoute");
const updateBusinessRoute = require("./updateBusinessRoute");
const businessRoutes = express.Router();


businessRoutes.use(createBusinessRoute);
businessRoutes.use(fetchBusinessRoute);
businessRoutes.use(requestBusinessVerificationRoute);
businessRoutes.use(checkUsernameRoute)
businessRoutes.use(checkSlugRoute);
businessRoutes.use(uploadLogoRoute);
businessRoutes.use(updateBusinessRoute);

module.exports = businessRoutes;