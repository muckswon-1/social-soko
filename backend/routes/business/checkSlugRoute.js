const express = require("express");
const checkSlug = require("../../controllers/business/checkSlug");

const checkSlugRoute = express.Router();

checkSlugRoute.get("/check-slug/:slug", checkSlug);

module.exports = checkSlugRoute;