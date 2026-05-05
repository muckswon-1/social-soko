const express = require("express");

const fetchBusiness = require("../controllers/business/fetchBusiness");
const updateBusiness = require("../controllers/business/updateBusiness");
const createBusiness = require("../controllers/business/createBusiness");

const router = express.Router();

router.post("/create-business/:userId", createBusiness);
router.get("/fetch-business/:userId", fetchBusiness);
router.post("/update-business/:id/:userId", updateBusiness);

module.exports = router;
