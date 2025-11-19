const express = require("express");
const loginRoute = require("./loginRoute");
const registerRoute = require("./registerRoute");
const refreshAccessTokenRoute = require("./refreshAccessTokenRoute");
const verifyAccessTokenRoute = require("./verifyAccessTokenRoute");
const logoutRoute = require("./logoutRoute");
const sendResetPasswordLinkEmailRoute = require("./sendResetPasswordLinkEmailRoute");
const resetPasswordWithTokenParameterRoute = require("./resetPasswordWithTokenParameterRoute");
const sendVerificationDigitsRoute = require("./sendVerificationDigitsRoute");
const updatePasswordWithDigitCodeRoute = require("./  updatePasswordWithDigitCodeRoute");
const sendVerificationEmailRoute = require("./sendVerificationEmailRoute");
const updateUserEmailRoute = require("./  updateUserEmailRoute");
const verifyEmailRoute = require("./verifyEmailRoute");
const fetchUserRoute = require("./fetchUserRoute");

const authRoutes = express.Router();

authRoutes.use(loginRoute);
authRoutes.use(registerRoute);
authRoutes.use(refreshAccessTokenRoute);
authRoutes.use(verifyAccessTokenRoute);
authRoutes.use(logoutRoute)
authRoutes.use(sendResetPasswordLinkEmailRoute);
authRoutes.use(resetPasswordWithTokenParameterRoute);
authRoutes.use(sendVerificationDigitsRoute);
authRoutes.use(updatePasswordWithDigitCodeRoute);
authRoutes.use(sendVerificationEmailRoute);
authRoutes.use(updateUserEmailRoute);
authRoutes.use(verifyEmailRoute);
authRoutes.use(fetchUserRoute);

module.exports = authRoutes;
