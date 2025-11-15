const { User } = require("../../models");
const UTILS = require("../../utils/utils"); // provides catchAsync + httpError
const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  CSRFTokenCookieOptions,
} = require("./tokens.cookies");
const bcrypt = require("bcrypt");

require("dotenv");

module.exports = UTILS.catchAsync(async (req, res) => {
  const { email, password } = req.body || {};

  // Validate input
  if (!email) throw UTILS.httpError(400, "email is required");
  if (!password) throw UTILS.httpError(400, "password is required");

  // Find user
  const user = await User.scope("withPassword").findOne({where: {email}});
  if (!user) throw UTILS.httpError(400, "Invalid username or password");


  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    throw UTILS.httpError(400, "Invalid username or password");

  await user.update({
    last_login_at: new Date(),
  })

  // Generate tokens + user payload
  const accessToken = UTILS.generateAccessToken(user);
  const refreshToken = UTILS.generateRefreshToken(user);
  const csrfToken = UTILS.generateCSRFToken();
  const data = UTILS.normalizedUserAuthData(user);

  // Set cookies
  res.cookie("access_token", accessToken, accessTokenCookieOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
  res.cookie("XSRF-TOKEN", csrfToken, CSRFTokenCookieOptions);

  // Respond
  return res.status(200).json({
    success: true,
    message: "Login successful",
    data,
  });
});
