
const { User, VerificationToken } = require("../../models");
const { sendTemplatedEmail } = require("../../services/email/emailService");
const UTILS = require("../../utils/utils"); // provides catchAsync + httpError

// Send a six-digit code for sensitive operations (e.g., reset password)
module.exports = UTILS.catchAsync(async (req, res) => {
  const { email } = req.body || {};

  // Validate input
  if (!email) throw UTILS.httpError(400, "email is required");

  // Find user by email
  const user = await User.findOne({ where: { email } });

  // Always return success to avoid account enumeration
  if (!user) {
    return res.status(200).json({
      success: true,
      message: "Password reset code sent to your email",
    });
  }

  // Remove any existing verification digit codes for this user
  await VerificationToken.destroy({
    where: { user_id: user.id, token_type: "verification_digits" },
  });

  // Generate a new 6-digit code
  const expiresInMinutes = 60;
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
  const code = UTILS.generateDigitsCode(6); // ensure 6 digits

  // Store the code (plaintext if your verification service expects plaintext)
  await VerificationToken.create({
    user_id: user.id,
    token: code,
    expires_at: expiresAt,
    token_type: "verification_digits",
  });

  // Send code via email
  await sendTemplatedEmail({
    to: email,
    template: "sixDigitCode",
    props: { email, code, expiresInMinutes },
  });

  return res.status(200).json({
    success: true,
    message: "Password reset code sent to your email",
  });
});
