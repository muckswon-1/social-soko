// controllers/business/createBusiness.js
const createError = require("http-errors");
const { User, Business, EmailJob } = require("../../models");
const UTILS = require("../../utils/utils");
const { accessTokenCookieOptions, refreshTokenCookieOptions, CSRFTokenCookieOptions } = require("../auth/tokens.cookies");

module.exports = UTILS.catchAsync(async (req, res) => {
  const { userId } = req.params;
  if (!userId) throw createError(400, "User ID is required");

  const { businessData } = req.body || {};
  if (!businessData || !businessData.name) {
    throw createError(400, "Missing businessData payload or name");
  }


  // Check user exists
  const existingUser = await User.findOne({ where: { id: userId } });
  if (!existingUser) throw createError(404, "User not found");

  // Check if slug exisits
  const existingBusiness = await Business.findOne({
    where: { slug: businessData.slug },
    attributes: ["slug"],

  });

  if(existingBusiness) {
    throw createError(400, "Business slug already exists");
  }

  // Create business
  const business = await Business.create({
    user_id: userId,
    name: businessData.name,
    description: businessData.description || "",
    address: businessData.address || "",
    city: businessData.city || "",
    state: businessData.state || "",
    country: businessData.country || "",
    postal_code: businessData.postal_code || "",
    phone: businessData.phone || "",
    email: businessData.email || "",
    website: businessData.website || "",
    slug: businessData.slug || "",
    logo_url: businessData.logo_url || "",
  });

    console.log("User Before update",existingUser)

  //update user from customer role to user role
  await existingUser.update(

    { role: "business" },
    { where: { id: userId } }
  );

  
  const data = UTILS.normalizedUserAuthData(existingUser);

  // Generate tokens + user payload
  const accessToken = UTILS.generateAccessToken(data);
  const refreshToken = UTILS.generateRefreshToken(data);
  const csrfToken = UTILS.generateCSRFToken();
 
  // Set cookies
  res.cookie("access_token", accessToken, accessTokenCookieOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);
  res.cookie("XSRF-TOKEN", csrfToken, CSRFTokenCookieOptions);

  try {
    await EmailJob.create({
      to: existingUser.email,
      template: "businessCreated",
      payload: { email: existingUser.email },

    })
  } catch (error) {
    console.log("[EmailJob]: Could not create email job")
  }

  return res.status(201).json({
    success: true,
    message: "Business created successfully",
    business,
  });
});

