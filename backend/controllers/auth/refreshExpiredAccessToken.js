const UTILS = require("../../utils/utils"); // provides catchAsync + httpError
const jwt = require("jsonwebtoken");
const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  CSRFTokenCookieOptions,
} = require("./tokens.cookies");

require("dotenv").config();

module.exports = UTILS.catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refresh_token;

  // Validate token existence
  if (!refreshToken) throw UTILS.httpError(401, "Refresh token is required");

  // Verify refresh token
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw UTILS.httpError(403, "Invalid or expired refresh token");
  }

  // TODO: Verify token against DB/jti/blacklist here.

  const userPayload = UTILS.normalizedUserAuthData(decoded);

  // Generate new tokens
  const { accessToken: newAccessToken, expiresIn } = UTILS.generateAccessToken(userPayload);
  const newRefreshToken = UTILS.generateRefreshToken(userPayload);
  const newCSRFToken = UTILS.generateCSRFToken();

  // Set cookies
  res.cookie("access_token", newAccessToken, accessTokenCookieOptions);
  res.cookie("refresh_token", newRefreshToken, refreshTokenCookieOptions);
  res.cookie("XSRF-TOKEN", newCSRFToken, CSRFTokenCookieOptions);

  return res.status(200).json({
    success: true,
    access_token_expires_at: expiresIn,
    message: "Token refreshed successfully",
  });
});
