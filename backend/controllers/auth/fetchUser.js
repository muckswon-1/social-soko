const { User } = require("../../models");
const UTILS = require("../../utils/utils");

module.exports = UTILS.catchAsync(async (req, res) => {
  const email = req.user?.email;

  // Validate auth context
  if (!email) throw UTILS.httpError(401, "Unauthorized");

  // Find user
  const user = await User.findOne({ where: { email } });
  if (!user) throw UTILS.httpError(404, "User not found");

;

  return res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user
  });
});
