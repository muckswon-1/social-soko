const express = require('express');
const createBusiness = require('../controllers/business/business');
const fetchBusiness = require('../controllers/business/fetchBusiness');
const updateBusiness = require('../controllers/business/updateBusiness');








const router = express.Router();

router.post("/create-business/:userId",createBusiness);
router.get("/fetch-business/:userId",fetchBusiness);
router.post("/update-business/:id", updateBusiness);


module.exports = router;
