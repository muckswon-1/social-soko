const express = require('express');
const { authRateLimiter, authSlowDown } = require('../../middleware/security');
const login = require('../../controllers/auth/login');
const loginRoute = express.Router();



/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login with email and password
 *     description: >
 *       Authenticates a user using email and password.  
 *       On successful login:
 *         - Access token is issued via `access_token` HttpOnly cookie  
 *         - Refresh token is issued via `refresh_token` HttpOnly cookie  
 *         - CSRF token is returned via `XSRF-TOKEN` cookie  
 *         - Normalized user object is returned in the response body  
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "superStrongPassword123"
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: >
 *               Multiple cookies are set:
 *                 - **access_token** (HttpOnly, short-lived)  
 *                 - **refresh_token** (HttpOnly, long-lived)  
 *                 - **XSRF-TOKEN** (non-HttpOnly, used by clients for CSRF header)  
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthSuccessResponse"
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Login successful"
 *                   data:
 *                     user:
 *                       id: "47086655-4ca2-4f2e-a350-4d4b6dc2d312"
 *                       email: "admin@example.com"
 *                       first_name: "Admin"
 *                       last_name: "User"
 *                       role: "admin"
 *                       phone: null
 *                       phone_verified: true
 *                       email_verified: true
 *                       account_verified: true
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               missingEmail:
 *                 value:
 *                   success: false
 *                   error: "email is required"
 *                   code: "BAD_REQUEST"
 *               missingPassword:
 *                 value:
 *                   success: false
 *                   error: "password is required"
 *                   code: "BAD_REQUEST"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthErrorResponse"
 *             examples:
 *               invalidCredentials:
 *                 value:
 *                   success: false
 *                   error: "Invalid username or password"
 *                   code: "UNAUTHORIZED"
 */

module.exports = loginRoute.post("/login",login);