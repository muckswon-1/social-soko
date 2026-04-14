const express = require("express");
const createMembershipRequestRoute = require("./createMembershipRequestRoute");
const approveMembershipRequestRoute = require("./approveMembershipRequestRoute");
const rejectMembershipRequestRoute = require("./rejectMembershipRequestRoute");
const listBusinessMembershipsRoute = require("./listBusinessMembershipRoute");
const listMembershipRequestsRoute = require("./listMembershipRequestsRoute");
const listMyBusinessesRoute = require("./listMyBusinessesRoute");



const businessMembershipRoutes = express.Router();

businessMembershipRoutes.use(createMembershipRequestRoute);
businessMembershipRoutes.use(approveMembershipRequestRoute);
businessMembershipRoutes.use(rejectMembershipRequestRoute);
businessMembershipRoutes.use(listMembershipRequestsRoute);
businessMembershipRoutes.use(listBusinessMembershipsRoute);
businessMembershipRoutes.use(listMyBusinessesRoute);



module.exports = businessMembershipRoutes