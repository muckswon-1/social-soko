const express = require('express');
const morgan = require('morgan');
const UTILS = require('./utils/utils');
const { securityMiddleWare } = require('./middleware/security');

// ROUTE IMPORTS
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');


require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 2070;



securityMiddleWare(app);
app.use(morgan('dev'));


UTILS.connectToDatabase().then(() => {
  //ROUTES

  app.get("/api/v1/health", (req, res) => {
    res.json({ message: "Social Soko API is running." });
  });


  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/profile",profileRoutes);




  
  // Start server
  app.listen(PORT, () => {
    if (process.env.NODE_ENV === "development") {
      console.log("🌎 Application running in development mode.");
      console.log(" ™️ Developed my Won Softwares");
      console.log("\n");
    }

    console.log(` 🗿 Server is running on port ${PORT}`);
    console.log("\n");
  });
});
     







module.exports = app;