const express = require("express");
const morgan = require("morgan");
const UTILS = require("./utils/utils");
const { securityMiddleWare } = require("./middleware/security");
const errorHandler = require("errorhandler");

const swaggerUI = require('swagger-ui-express');

// ROUTE IMPORTS
const adminRouter = require("./admin/routes");
const swaggerSpec = require("./docs/swaggerJsdoc");
const authRoutes = require("./routes/auth");
const businessRoutes = require("./routes/business");
const profileRoutes = require("./routes/profile");


require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT || 2070;


  securityMiddleWare(app);


if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
}

app.use(morgan("combined"));


UTILS.connectToDatabase().then(() => {
  //ROUTES

  /**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Health check point
 *     description: Returns the status of the API server.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uptime:
 *                   type: number
 *                   example: 123.45
 *                 message:
 *                   type: string
 *                   example: "Server is running"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-11-18T14:22:36.123Z"
 *                 time:
 *                   type: string
 *                   example: "2025-11-18T17:10:06.511Z"
 *                 status:
 *                   type: string
 *                   example: "ok"
 */
  app.get("/api/v1/health", (req, res) => {
    // return server info eg uptime, status, is it running et
    res.status(200).json({
      uptime: process.uptime(),
      message: "Server is healthy",
      timestamp: Date.now(),
      time: new Date().toISOString(),
      status: "ok",
  });
  });

  app.use("/api/v1/docs",swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/profile", profileRoutes);
  app.use("/api/v1/business", businessRoutes);


  //Admin routes
  app.use("/api/v1/admin",adminRouter);

  // Fall back error handler for production
  app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    const code =
      err.code ||
      (status === 401
        ? "UNAUTHORIZED"
        : status === 404
          ? "NOT_FOUND"
          : "SERVER_ERROR");

    res.status(status).json({
      success: false,
      error: message,
      code,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    }); 
  });

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
