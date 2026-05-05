const express = require("express");
const createBusinessRoute = require("./createBusinessRoute");
const requestBusinessVerificationRoute = require("./requestBusinessVerificationRoute");
const checkUsernameRoute = require("./checkUsernameRoute");
const checkSlugRoute = require("./checkSlugRoute");
const uploadLogoRoute = require("./uploadLogoRoute");
const updateBusinessRoute = require("./updateBusinessRoute");
const fetchBusinessByIdRoute = require("./fetchBusinessByIdRoute");
const fetchMyBusinessesRoute = require("./fetchMyBusinessesRoute");
const searchBusinessesForJoinRoute = require("./searchBusinessesRoute");
const businessRoutes = express.Router();


businessRoutes.use(createBusinessRoute);
businessRoutes.use(fetchMyBusinessesRoute);
businessRoutes.use(requestBusinessVerificationRoute);
businessRoutes.use(checkUsernameRoute)
businessRoutes.use(checkSlugRoute);
businessRoutes.use(uploadLogoRoute);
businessRoutes.use(updateBusinessRoute);
businessRoutes.use(fetchBusinessByIdRoute);
businessRoutes.use(searchBusinessesForJoinRoute)

module.exports = businessRoutes;