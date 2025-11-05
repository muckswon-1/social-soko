const jwt = require('jsonwebtoken');
const UTILS = require('../utils/utils');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const express = require('express');

require('dotenv').config();

const isProd = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL;

/*-----------------------  CSRF Double-Submit Middleware ---------------------*/
function csrfGuard(req,res,next) {
  const method = req.method.toUpperCase();


  // Exempt endpoints (regex aware)
  const exemptEndpoints = [
     /^\/api\/v1\/auth\/register$/,
    /^\/api\/v1\/auth\/refresh-token$/,
    /^\/api\/v1\/auth\/logout$/,
    /^\/api\/v1\/auth\/login$/,
    // match /api/v1/auth/verify-email and /api/v1/auth/verify-email/<token>
    /^\/api\/v1\/auth\/verify-email(?:\/[^\/\s]+)?$/
  ];

  // Check if the request path matches any of the exempt endpoints
  const isExempt = exemptEndpoints.some(endpoint => endpoint.test(req.path));

  if(isExempt) return next();

  //Only protect unsafe methods
  if(["GET", "HEAD", "OPTIONS"].includes(method)) return next();

  
 
  // req.cookies populated by cookie parser
    const cookieToken = req.cookies?.["XSRF-TOKEN"];
    const headerToken = req.headers["x-xsrf-token"] || req.headers["x-csrf-token"];

    const flag = UTILS.timingSafeCompare(headerToken, cookieToken);

    

  if(!headerToken || !cookieToken || !flag) {
    console.log('CSRF Token Mismatch');
    return res.status(403).json({message: "CSRF token mismatch"});
  }

  next();
}

/* Login Rate Limiter */
const authRateLimiter = rateLimit({
  windowMS: 0.5 * 60 * 1000, // 10 minutes
  max: 10,
  message: "Too Many login attempts.",
  standardHeaders: true,
  legacyHeaders: false
});

const authSlowDown = slowDown({
  windowMS: 10 * 60 * 1000, // 10 minutes
  delayAfter:5,
  delayMs: (hits) => hits * 100,
});


/*-----------------------  Global Rate Limit ---------------------*/

const globalRateLimiter = rateLimit({

  windowMS: 10 * 60 * 1000, // 10 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests!"
});


function securityMiddleWare(app) {

  /* Security Headers */
  app.use(
    helmet({
      crossOriginResourcePolicy:false,
      contentSecurityPolicy: false
    })
  );

  /* CORS FOR SPA */
  app.use(
    cors({
    origin: FRONTEND_URL,
    credentials: true
  })
  )

  /*  Prevent HTTP parameter pollution */
  app.use(hpp());

  /* Parse Cookies */
  app.use(cookieParser());

  /*  Global Rate Limit */
  // app.use(globalRateLimiter)

  /* CSRF Guard */
  app.use(csrfGuard);

  /*  Small body parser limit for protection*/
  app.use(express.json({limit: '200kb'}))
}



const verifyAccessToken = async (req, res, next) => {
  try {
   
    // Get token from cookie
    const token = req.cookies?.access_token;

    if(!token) {
      return res.status(401).json({message: " Not authenticated"})
    }

    //verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    //attach user info to request object
    req.user = decoded;

    next();
  } catch (error) {
     if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: {
          code: 'TOKEN_EXPIRED',
          message: 'Access token has expired',
          details: 'Please login again'
        }
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid access token',
          details: 'Token verification failed'
        }
      });
    }

 // Handle other errors
    return res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Token verification error',
        details: error.message
      }
    });

  }
};










  

module.exports = {
  verifyAccessToken,
  securityMiddleWare,
  authRateLimiter,
  authSlowDown
};  


   