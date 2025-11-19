const express = require("express");
const createBusinessRoute = require("./createBusinessRoute");
const fetchBusinessRoute = require("./fetchBusinessRoute");
const updateBusinessRoute = require("./updateBusinessRoute");
const requestBusinessVerificationRoute = require("./requestBusinessVerificationRoute");
const businessRoutes = express.Router();


businessRoutes.use(createBusinessRoute);
businessRoutes.use(fetchBusinessRoute);
businessRoutes.use(updateBusinessRoute);
businessRoutes.use(requestBusinessVerificationRoute);

module.exports = businessRoutes;