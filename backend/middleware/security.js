// middleware/security.js (refactored for centralized error handling)
const jwt = require("jsonwebtoken");
const UTILS = require("../utils/utils"); // has catchAsync + httpError
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const express = require("express");
const { ROLES } = require("../constants/roles");

const IS_PROD = process.env.NODE_ENV === "production";

require("dotenv").config();


console.log("Server URL: ", process.env.SERVER_URL);

const makeLocalOrigin = (port) => (port ? `http://localhost:${port}` : null);
const makeLocalOrigin127 = (port) => (port ? `http://127.0.0.1:${port}` : null);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_FRONTEND_URL,
  process.env.SERVER_URL, // if your frontend is served from here in some env

  makeLocalOrigin(process.env.FRONTEND_PORT),
  makeLocalOrigin(process.env.ADMIN_FRONTEND_PORT),
  makeLocalOrigin(process.env.SERVER_PORT),

  makeLocalOrigin127(process.env.FRONTEND_PORT),
  makeLocalOrigin127(process.env.ADMIN_FRONTEND_PORT),
  makeLocalOrigin127(process.env.SERVER_PORT),
].filter(Boolean); // removes nulls


const corsOptions = {
  origin(origin, callback) {
    // Allow Postman/curl/server-to-server (no Origin header)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {

      return callback(null, true);
    }

    // Optional: helpful log while developing
    console.warn(`❌ CORS blocked for origin: ${origin}`);

    // Proper error for your global error handler
    return callback(UTILS.httpError(403, "Not allowed by CORS"));
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-XSRF-TOKEN",
    "x-xsrf-token",
    "x-csrf-token",
    "x-csrf_token"
  ],
};



// Small noop middleware for dev
const noop = (req, res, next) => next();

/*-----------------------  CSRF Double-Submit Middleware ---------------------*/
const csrfGuard = UTILS.catchAsync(async (req, res, next) => {

  if(!IS_PROD) return next();

  const method = String(req.method || "").toUpperCase();

  // Exempt endpoints (regex aware)
  const exemptEndpoints = [
    /^\/api\/v1\/auth\/register$/,
    /^\/api\/v1\/auth\/refresh-token$/,
    /^\/api\/v1\/auth\/logout$/,
    /^\/api\/v1\/auth\/login$/,
    /^\/api\/v1\/auth\/forgot-password$/,
    /^\/api\/v1\/auth\/verify-email(?:\/[^\/\s]+)?$/,
    /^\/api\/v1\/auth\/reset-password(?:\/[^\/\s]+)?$/,
    /^\/api\/v1\/auth\/send-verification-email(?:\/[^\/\s]+)?$/,
  ];

  const isExempt = exemptEndpoints.some((re) => re.test(req.path));
  if (isExempt) return next();

  // Only protect unsafe methods
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return next();

  const cookieToken = req.cookies?.["XSRF-TOKEN"];
  const headerToken =
    req.headers["x-xsrf-token"] ||
    req.headers["x-csrf-token"] ||
    req.headers["x-csrf_token"] 

  const flag = UTILS.timingSafeCompare(headerToken, cookieToken);

  if (!headerToken || !cookieToken || !flag) {
    throw UTILS.httpError(403, "CSRF token mismatch");
  }

  return next();
});

/*-----------------------  Login Rate Limiter ---------------------*/
// In prod: real limiter; in dev: noop
const authRateLimiter = IS_PROD
  ? rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 10,
      message: "Too many login attempts.",
      standardHeaders: true,
      legacyHeaders: false,
    })
  : noop;

const authSlowDown = IS_PROD
  ? slowDown({
      windowMs: 10 * 60 * 1000, // 10 minutes
      delayAfter: 5,
      delayMs: (hits) => hits * 100,
    })
  : noop;

/*-----------------------  Global Rate Limit (optional) ---------------------*/
// Same pattern: only active in production
const globalRateLimiter = IS_PROD
  ? rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutes
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
      message: "Too many requests!",
    })
  : noop;

/*-----------------------  Security Middleware Bootstrap ---------------------*/
function securityMiddleWare(app) {
  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false,
    }),
  );

  // CORS for SPA
  app.use(
    cors(corsOptions),
  );

  // Prevent HTTP parameter pollution
  app.use(hpp());

  // Parse Cookies
  app.use(cookieParser());

  // Body parser (limit for protection)
  app.use(express.json({ limit: "200kb" }));

  // Global Rate Limit (prod only; noop in dev)
  app.use(globalRateLimiter);

  // CSRF Guard
  app.use(csrfGuard);
}

/*-----------------------  Access Token Verifier ---------------------*/
const verifyAccessToken = UTILS.catchAsync(async (req, res, next) => {
  try {
    const token = req.cookies?.access_token;
    if (!token) throw UTILS.httpError(401, "Not authenticated");

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded; // attach user to request
    return next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw UTILS.httpError(401, "Access token has expired");
    }
    if (err.name === "JsonWebTokenError") {
      throw UTILS.httpError(401, "Invalid access token");
    }
    // Unknown verification error
    throw UTILS.httpError(401, "Invalid Access Token");
  }
});


const verifyAccessTokenOptional = UTILS.catchAsync(
 async (req,_res, next) => {
  try {

    const token = req.cookies?.access_token;


    if (!token) {
      req.user = null;
      return next();
    }

     const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  

    req.user = decoded; // attach user to request
    return next(); // Proceed to the next middleware or route handler

  } catch (error) {
    req.user = null;
    next();
  }
 }
)
 


const requireRole = (...allowedRoles) =>
  UTILS.catchAsync(async (req, res, next) => {
  
    try {
      if (!req.user) {
        throw UTILS.httpError(401, "Not authenticated");
      }

      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        throw UTILS.httpError(403, "Insufficient permissions");
      }

      return next();
    } catch (error) {
      if (error.status) throw error;
      throw UTILS.httpError(403, "Forbidden");
    }
  });

const requireAdmin = requireRole(ROLES.ADMIN);

module.exports = {
  verifyAccessToken,
  verifyAccessTokenOptional,
  securityMiddleWare,
  authRateLimiter,
  authSlowDown,
  globalRateLimiter,
  csrfGuard,
  requireAdmin,
  requireRole,
};
