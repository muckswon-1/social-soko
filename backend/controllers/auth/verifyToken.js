const { User } = require("../../models");
const UTILS = require("../../utils/utils");

module.exports = UTILS.catchAsync(async (req, res) => {
  // verifyAccessToken middleware has already validated JWT and set req.user
  const email = req.user?.email;

  if (!email) throw UTILS.httpError(401, "Unauthorized");

  const user = await User.findOne({ where: { email } });
  if (!user) throw UTILS.httpError(404, "User not found");

 

  return res.status(200).json({
    success: true,
    user
  });
});
