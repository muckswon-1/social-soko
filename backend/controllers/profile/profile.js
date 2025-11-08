
const { User } = require("../../models");
const UTILS = require("../../utils/utils"); // provides catchAsync + httpError

// Update Profile Information
const updateUser = UTILS.catchAsync(async (req, res) => {
  const { userId } = req.params || {};
  if (!userId) throw UTILS.httpError(400, "userId is required");

  const user = await User.findByPk(userId);
  if (!user) throw UTILS.httpError(404, "User not found");

  const patch = req.body?.patch || {};

 
  
  const { first_name, last_name, phone } = patch;

  // Ensure at least one field to update
  const hasUpdates =
    first_name !== undefined || last_name !== undefined || phone !== undefined;
  if (!hasUpdates) throw UTILS.httpError(400, "No fields provided to update");

  await user.update({
    ...(first_name !== undefined && { first_name }),
    ...(last_name !== undefined && { last_name }),
    ...(phone !== undefined && { phone }),
  });

  const data = UTILS.normalizedUserProfileData(user);

  return res.status(200).json({
    success: true,
    message: "User information updated successfully",
    data,
  });
});

// Fetch Profile Information
const fetchProfile = UTILS.catchAsync(async (req, res) => {
  const { userId } = req.params || {};
  if (!userId) throw UTILS.httpError(400, "userId is required");

  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw UTILS.httpError(404, "User not found");

  const data = UTILS.normalizedUserProfileData(user);

  return res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data,
  });
});

module.exports = {
  updateUser,
  fetchProfile,
};
