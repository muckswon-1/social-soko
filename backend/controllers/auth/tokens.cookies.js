require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";

exports.accessTokenCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "strict" : "lax",
  maxAge: process.env.JWT_TOKEN_EXPIRES_IN,
  path: "/",
};

exports.refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "strict" : "lax",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

exports.CSRFTokenCookieOptions = {
  httpOnly: false,
  secure: isProd,
  sameSite: isProd ? "strict" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
};
