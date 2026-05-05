const { User } = require("../../models");
const buildFileUrl = require("../../utils/buildFileUrl");
const { UPLOADS_ROOT } = require("../../utils/multerFactory");
const UTILS = require("../../utils/utils"); // provides catchAsync + httpError

// Update Profile Information
const updateUser = UTILS.catchAsync(async (req, res) => {
  const { userId } = req.params || {};
  if (!userId) throw UTILS.httpError(400, "userId is required");

  const user = await User.findByPk(userId);
  if (!user) throw UTILS.httpError(404, "User not found");

  const patch = req.body?.patch || {};

  

  const { first_name, last_name, phone, title, bio, skills } = patch;

  // Ensure at least one field to update
  const hasUpdates =
    first_name !== undefined || last_name !== undefined || phone !== undefined || title !== undefined || bio !== undefined || skills !== undefined;
  if (!hasUpdates) throw UTILS.httpError(400, "No fields provided to update");



  await user.update({
    ...(first_name !== undefined &&  first_name  &&{ first_name }),
    ...(last_name !== undefined && { last_name }),
    ...(phone !== undefined &&  phone && { phone }),
    ...(title !== undefined && title && { title }),
    ...(bio !== undefined && bio && { bio }),
    ...(skills !== undefined && skills && { skills }),
  });
  
  return res.status(200).json({
    success: true,
    message: "User information updated successfully",
    user,
  });
});

// Fetch Profile Information
const fetchProfile = UTILS.catchAsync(async (req, res) => {
  const { userId } = req.params || {};
  if (!userId) throw UTILS.httpError(400, "userId is required");

  const user = await User.findOne({ where: { id: userId } });
  if (!user) throw UTILS.httpError(404, "User not found");

  

  return res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    user,
  });
});


const uploadProfilePicture = UTILS.catchAsync(async (req,res) => {
  const {profileId} = req.params
  if(!profileId) throw UTILS.httpError(400, "profileId is required");

  //File from multer
  const profilePic = req.file;
  if(!profilePic) throw UTILS.httpError(400, "No profile picture was uploaded");

  // Fetch user
  const userProfile = await User.findByPk(profileId);

  if(!userProfile){
    throw UTILS.httpError(404, "User was not found.")
  }

  // Enforce logged in user owns the profile
  if(userProfile.id && req.user && userProfile.id !== req.user.id){

    throw UTILS.httpError(403, "You are not authorized to update this profile")

  }

  // Update user profile picture
  const relativePath = profilePic.path.replace(UPLOADS_ROOT,"").replace(/\\/g, "/");

  const profilePicUrl = buildFileUrl(req,relativePath);
  userProfile.avatar_url = profilePicUrl;
  await userProfile.save();

  return res.status(200).json({
    success: true,
    message: "Profile picture uploaded successfully",
    profile_pic_url: profilePicUrl,
    userProfile
  })

})

module.exports = {
  updateUser,
  fetchProfile,
  uploadProfilePicture
};
