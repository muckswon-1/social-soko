const db = require("../../models");
const { sendTemplatedEmail } = require("../../services/email/emailService");
const UTILS = require("../../utils/utils");
const { User, VerificationToken } = db;
const crypto = require("crypto");

require("dotenv").config();

module.exports = UTILS.catchAsync(async (req, res) => {
  const { email } = req.body || {};

  // Validate input
  if (!email) throw UTILS.httpError(400, "email is required");

  // Find user
  const user = await User.findOne({ where: { email } });

  // For security reasons, always respond with success message
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  }

  // Delete any existing reset tokens for this user
  await VerificationToken.destroy({
    where: { user_id: user.id, token_type: "reset_password" },
  });

  // Generate secure reset token
  const resetToken = UTILS.generateVerifyToken();
  const tokenHash = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

  // Store hashed token
  await VerificationToken.create({
    user_id: user.id,
    token: tokenHash,
    expires_at: expiresAt,
    token_type: "reset_password",
  });

  // Send password reset email
  await sendTemplatedEmail({
    to: user.email,
    template: "passwordReset",
    props: {
      email: user.email,
      token: resetToken,
      expiresInMinutes: 60,
    },
  });

  return res.status(200).json({
    success: true,
    message: "Password reset link sent to your email",
  });
});
