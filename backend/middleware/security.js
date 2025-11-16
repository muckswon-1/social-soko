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

require("dotenv").config();

const FRONTEND_URL = process.env.FRONTEND_URL;
const ADMIN_FRONTEND_URL = process.env.ADMIN_FRONTEND_URL;


console.log(FRONTEND_URL);
console.log(ADMIN_FRONTEND_URL);
/*-----------------------  CSRF Double-Submit Middleware ---------------------*/
const csrfGuard = UTILS.catchAsync(async (req, res, next) => {
  const method = String(req.method || "").toUpperCase();

  // Exempt endpoints (regex aware)
  const exemptEndpoints = [
    /^\/api\/v1\/auth\/register$/,
    /^\/api\/v1\/auth\/refresh-token$/,
    /^\/api\/v1\/auth\/logout$/,
    /^\/api\/v1\/auth\/login$/,
    /^\/api\/v1\/auth\/forgot-password$/,
    // match /api/v1/auth/verify-email and /api/v1/auth/verify-email/<token>
    /^\/api\/v1\/auth\/verify-email(?:\/[^\/\s]+)?$/,
    /^\/api\/v1\/auth\/reset-password(?:\/[^\/\s]+)?$/,
    /^\/api\/v1\/auth\/send-verification-email(?:\/[^\/\s]+)?$/,


     /^\/api\/v1\/admin\/generate-parameter-verify-email-token(?:\/[^\/\s]+)?$/,
      /^\/api\/v1\/admin\/email-jobs\/retry(?:\/[^\/\s]+)?$/,
      /^\/api\/v1\/admin\/verify-business(?:\/[^\/\s]+)?$/,
     
     


  ];

  const isExempt = exemptEndpoints.some((re) => re.test(req.path));
  if (isExempt) return next();

  // Only protect unsafe methods
  if (["GET", "HEAD", "OPTIONS"].includes(method)) return next();

  const cookieToken = req.cookies?.["XSRF-TOKEN"];
  const headerToken =
    req.headers["x-xsrf-token"] ||
    req.headers["x-csrf-token"] ||
    req.headers["x-csrf_token"];

  const flag = UTILS.timingSafeCompare(headerToken, cookieToken);

  if (!headerToken || !cookieToken || !flag) {
    throw UTILS.httpError(403, "CSRF token mismatch");
  }

  return next();
});

/*-----------------------  Login Rate Limiter ---------------------*/
// NOTE: express-rate-limit uses `windowMs` (camelCase), not `windowMS`.
const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: "Too many login attempts.",
  standardHeaders: true,
  legacyHeaders: false,
});

const authSlowDown = slowDown({
  windowMs: 10 * 60 * 1000, // 10 minutes
  delayAfter: 5,
  delayMs: (hits) => hits * 100,
});

/*-----------------------  Global Rate Limit (optional) ---------------------*/
const globalRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests!",
});

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
    cors({
      origin: [FRONTEND_URL, ADMIN_FRONTEND_URL],
      credentials: true,
    }),
  );

  // Prevent HTTP parameter pollution
  app.use(hpp());

  // Parse Cookies
  app.use(cookieParser());

  // Global Rate Limit (uncomment if you want it globally)
  // app.use(globalRateLimiter);

  // CSRF Guard
  app.use(csrfGuard);

  // Small body parser limit for protection
  app.use(express.json({ limit: "200kb" }));
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

module.exports = {
  verifyAccessToken,
  securityMiddleWare,
  authRateLimiter,
  authSlowDown,
  globalRateLimiter,
  csrfGuard,
};
