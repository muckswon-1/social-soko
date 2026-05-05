const express = require("express");
const getMyMembershipsRoute = require("./getMyMembershipsRoute");

const businessMembersRoutes = express.Router();

businessMembersRoutes.use(getMyMembershipsRoute);


module.exports = businessMembersRoutes;