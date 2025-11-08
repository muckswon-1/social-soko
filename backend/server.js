const express = require('express');
const morgan = require('morgan');
const UTILS = require('./utils/utils');
const { securityMiddleWare } = require('./middleware/security');
const errorHandler = require('errorhandler');

// ROUTE IMPORTS
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');


require('dotenv').config();

const app = express();
const PORT = process.env.SERVER_PORT || 2070;



securityMiddleWare(app);

if(process.env.NODE_ENV === "development") {
  app.use(errorHandler());
}

app.use(morgan('dev'));


UTILS.connectToDatabase().then(() => {
  //ROUTES

  app.get("/api/v1/health", (req, res) => {
    res.json({ message: "Social Soko API is running." });
  });


  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/profile",profileRoutes);


// Fall back error handler for production
app.use((err, req,res,next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  const code = err.code || (status === 401 ? 'UNAUTHORIZED' : status === 404 ? 'NOT_FOUND' : 'SERVER_ERROR')

   res.status(status).json({
       success: false,
       error: message,
       code,
       ...(process.env.NODE_ENV === "development" && { stack: err.stack })
      })
}
)


  
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