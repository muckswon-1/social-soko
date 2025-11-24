 const express = require("express");
 const fetchProfileRoute = require("./fetchProfileRoute");
 const updateUserRoute = require("./updateUserRoute");
 const uploadProfileRoute = require("./uploadProfileRoute");
 
 const profileRoutes = express.Router();

 
profileRoutes.use(fetchProfileRoute);
profileRoutes.use(updateUserRoute);
profileRoutes.use(uploadProfileRoute);



 module.exports = profileRoutes;



