
const { sendTemplatedEmail } = require("../../services/email/emailService");
const verificationTokenService = require("../../services/verificationTokenService");
const UTILS = require("../../utils/utils");


module.exports = UTILS.catchAsync(async (req, res) => {
  const { token } = req.params || {};

  // Validate input
  if (!token) throw UTILS.httpError(400, "Verification token is required");

  // Find user with valid verification token
  const { valid, user, reason } = await verificationTokenService(
    token,
    "email_verification",
    { inputFormat: "sha256" },
  );

  if (!valid || !user) throw UTILS.httpError(400, reason);

  // Check if already verified
  if (user.email_verified) throw UTILS.httpError(400, "Email already verified");

  // Update user verification status
    await user.update(
    { email_verified_at: new Date(), email_verified: true },
    { where: { id: user.id } },
  );

  await user.save();

 

  // Send confirmation email
  await sendTemplatedEmail({
    to: user.email,
    template: "emailVerificationSuccess",
    props: { email: user.email },
  });

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});
