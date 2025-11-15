
const verificationTokenService = require("../../services/verificationTokenService");
const bcrypt = require("bcrypt");
const UTILS = require("../../utils/utils");
const {EmailJob} = require("../../models");

module.exports = UTILS.catchAsync(async (req, res) => {
  const { password, digitCodes } = req.body || {};

  // Validate input
  if (!digitCodes) throw UTILS.httpError(400, "digitCodes is required");
  if (!password || String(password).length < 8) {
    throw UTILS.httpError(400, "New password must be at least 8 characters");
  }

  // Verify code and get user
  const { valid, user, reason } = await verificationTokenService(
    digitCodes,
    "verification_digits",
  );

 

  if (!valid || !user) throw UTILS.httpError(400, reason);

  // Update password
  const hashedPassword = await bcrypt.hash(password, 10);
  await user.update({ password: hashedPassword }, { where: { id: user.id }, individualHooks: true });

  // Send confirmation email
 
  try {
    await EmailJob.create({
      to: user.email,
      template: "passwordResetSuccess",
      payload: { email: user.email },
    })
  } catch (error) {
    console.error("[EmailJob]: Could not create email job")
  }

  return res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});
