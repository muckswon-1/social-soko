const { User, VerificationToken, EmailJob } = require("../../models");
const UTILS = require("../../utils/utils");
const crypto = require("crypto");

require("dotenv").config();

module.exports = UTILS.catchAsync(async (req, res) => {
  const { email } = req.body || {};

  // Validate input
  if (!email) throw UTILS.httpError(400, "email is required");

  // Find user by email
  const user = await User.findOne({ where: { email } });

  // For privacy, always return success even if the user doesn't exist
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "Email verification link sent",
    });
  }

  // Delete any existing email_verification tokens for this user
  await VerificationToken.destroy({
    where: { user_id: user.id, token_type: "email_verification" },
  });

  // Prepare new verification token
  const expiresInMinutes = 60;
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  const rawToken = UTILS.generateVerifyToken();
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // Store hashed token
  await VerificationToken.create({
    user_id: user.id,
    token: hashedToken,
    expires_at: expiresAt,
    token_type: "email_verification",
  });

  // Send verification email with the raw token

  try {
    await EmailJob.create({
      to: user.email,
      template: "verifyEmail",
      payload: {email: user.email, token: rawToken, expiresInMinutes}
    })
  } catch (error) {
    console.log("[EmailJob] Could not create email job")
  }

  return res.status(200).json({
    success: true,
    message: "Email verification link sent",
  });
});
