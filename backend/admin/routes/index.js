const express = require('express');
const getEmailJobs = require('../controllers/emailJobs/getEmailJobs');
const getEmailJobById = require('../controllers/emailJobs/getEmailJobById');
const retryEmailJob = require('../controllers/emailJobs/retryEmailJob');
const fetchUsers = require('../controllers/users/fetchUsers');
const { adminGenerateVerifyEmailParamsToken } = require('../controllers/verification');
const fetchAllBusiness = require('../controllers/business/fetchAllBusiness');
const adminVerifyBusiness = require('../controllers/business/adminVerifyBusiness');

const adminRouter = express.Router();


// Email Job Routes
adminRouter.get("/fetch-email-jobs", getEmailJobs);
adminRouter.get("/email-jobs/:id",getEmailJobById);
adminRouter.post("/email-jobs/retry/:id", retryEmailJob);

//User routes
adminRouter.get("/fetch-users", fetchUsers);


//verify tokens
adminRouter.post("/generate-parameter-verify-email-token", adminGenerateVerifyEmailParamsToken);

//Business Routes
adminRouter.get("/fetch-businesses", fetchAllBusiness);
adminRouter.post("/verify-business/:id", adminVerifyBusiness);


module.exports = adminRouter;