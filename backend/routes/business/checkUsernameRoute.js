const express = require("express");
const checkUsername = require("../../controllers/business/checkUsername");

const checkUsernameRoute = express.Router();

/**
 * @swagger
 * /api/v1/business/check-username/{username}:
 *   get:
 *     summary: Check if a business username is available
 *     description: Validates a proposed business username and checks whether it is already taken.
 *     tags:
 *       - Business
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username to validate and check for availability
 *     responses:
 *       200:
 *         description: Username is valid and available
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 username:
 *                   type: string
 *                   example: "my-business"
 *
 *       400:
 *         description: Invalid username or username already taken
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Username already taken"
 *
 *       500:
 *         description: Server error
 */


 checkUsernameRoute.get("/check-username/:username", checkUsername);

 module.exports = checkUsernameRoute;