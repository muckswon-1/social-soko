const express = require("express");

const fetchBusiness = require("../controllers/business/fetchBusiness");
const updateBusiness = require("../controllers/business/updateBusiness");
const createBusiness = require("../controllers/business/createBusiness");
const requestBusinessVerification = require("../controllers/business/requestBusinessVerification");

const router = express.Router();

router.post("/create-business/:userId", createBusiness);
router.get("/fetch-business/:userId", fetchBusiness);
router.post("/update-business/:id/:userId", updateBusiness);
router.post("/request-business-verification/:id/:userId", requestBusinessVerification)

module.exports = router;
