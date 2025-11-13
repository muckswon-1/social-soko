// controllers/business/createBusiness.js
const createError = require("http-errors");
const { User, Business } = require("../../models");
const { sendTemplatedEmail } = require("../../services/email/emailService");
const UTILS = require("../../utils/utils");

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

  //update user from customer role to user role
   await User.update(

    { role: "business" },
    { where: { id: userId } }
  );




  // Send email (await so failures hit the error middleware)
  await sendTemplatedEmail({
    to: existingUser.email,
    template: "businessCreated",
    props: { email: existingUser.email },
  }).catch((err) => {
    console.error("Failed to send email:", err);
    // Don't throw here, just log the error
    // This is a non-critical failure
    // The business was created, but the email failed to send
    // You may want to log this to a monitoring service
    // or add it to a retry queue
  });

  return res.status(201).json({
    success: true,
    message: "Business created successfully",
    business,
  });
});

