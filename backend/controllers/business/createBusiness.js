// controllers/business/createBusiness.js
const createError = require("http-errors");
const { User, Business, EmailJob, BusinessMember } = require("../../models");
const UTILS = require("../../utils/utils");
const { accessTokenCookieOptions, refreshTokenCookieOptions, CSRFTokenCookieOptions } = require("../auth/tokens.cookies");
const { generateUniqueUsername } = require("../../utils/generateUniqueUsername.js");
const { default: phone } = require("phone");
const { generateUniqueSlug } = require("../../utils/generateUniqueSlug.js");


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





  // Generate unique username
  const username = await generateUniqueUsername(businessData.username, businessData.name);



  //phone validation if available
let normalizedPhone = businessData.phone || "";
if (normalizedPhone) {
  const {isValid, phoneNumber} = phone(normalizedPhone, {country: null});

  if(!isValid) throw UTILS.httpError(400, "Invalid phone number");
  normalizedPhone = phoneNumber;
}


// Generate unique slug
const slug = await generateUniqueSlug(businessData.slug, businessData.name);


  // Create business
  const business = await Business.create({

    user_id: userId,
    username,
    name: businessData.name,
    description: businessData.description || "",
    address: businessData.address || "",
    city: businessData.city || "",
    state: businessData.state || "",
    country: businessData.country || "",
    postal_code: businessData.postal_code || "",
    phone: normalizedPhone || "",
    email: businessData.email || "",
    website: businessData.website || "",
    slug,
    logo_url: businessData.logo_url || "",
  });

    
  //update user from customer role to user role
 if(existingUser.role !== "business") {
   await existingUser.update( { role: "business" } );

   await BusinessMember.findOrCreate({
    where: { business_id: business.id, user_id: existingUser.id},
    defaults: {
      role: "owner",
      invitation_status: "accepted",
      invited_by: existingUser.id,
      joined_at: new Date()
    }
   })
 }


  
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

