require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";

exports.accessTokenCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "strict" : "lax",
  maxAge: 60 * 1000,
  path: "/",
};

exports.refreshTokenCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

exports.CSRFTokenCookieOptions = {
  httpOnly: false,
  secure: isProd,
  sameSite: isProd ? "strict" : "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
};
