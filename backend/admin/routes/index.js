const express = require('express');
const getEmailJobsRoute = require('./emailJobs/getEmailJobsRoute');
const retryEmailJobRoute = require('./emailJobs/retryEmailJobRoute');
const fetchUsersRoute = require('./users/fetchUsersRoute');
const adminGenerateVerifyEmailParamsTokenRoute = require('./verify/adminGenerateVerifyEmailParamsTokenRoute');
const fetchAllBusinessesRoute = require('./business/fetchAllBusinessesRoute');
const adminVerifyBussinessRoute = require('./business/adminVerifyBussinessRoute');

const adminRouter = express.Router();


adminRouter.use(getEmailJobsRoute);
adminRouter.use(getEmailJobsRoute);
adminRouter.use(retryEmailJobRoute);
adminRouter.use(fetchUsersRoute);
adminRouter.use(adminGenerateVerifyEmailParamsTokenRoute);
adminRouter.use(fetchAllBusinessesRoute);
adminRouter.use(adminVerifyBussinessRoute);

module.exports = adminRouter;