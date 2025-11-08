
const UTILS = require("../../utils/utils"); 

module.exports = UTILS.catchAsync(async (req, res) => {
  // Since we're using JWT tokens, we can't invalidate them on the server side.
  // The frontend should clear tokens from localStorage/sessionStorage as well.

  res.clearCookie("access_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/" });
  res.clearCookie("XSRF-TOKEN", { path: "/" });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});
