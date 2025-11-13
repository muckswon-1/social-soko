const { User, VerificationToken } = require("../../models");
const { sendTemplatedEmail } = require("../../services/email/emailService");
const verificationTokenService = require("../../services/verificationTokenService");
const crypto = require("crypto");
const UTILS = require("../../utils/utils");

module.exports = UTILS.catchAsync(async (req, res) => {
  const { email, digitCodes } = req.body || {};

  // Validate input
  if (!digitCodes) throw UTILS.httpError(400, "digitCodes is required");
  if (!email) throw UTILS.httpError(400, "email is required");

  // Optional: very light email format check
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email));
  if (!looksLikeEmail)
    throw UTILS.httpError(400, "email must be a valid email");

  // Verify code and get user
  const { valid, user, reason } = await verificationTokenService(
    digitCodes,
    "verification_digits",
  );

  if (!valid || !user) throw UTILS.httpError(400, reason);

  // If user is already using this email
  if (user.email === email) throw UTILS.httpError(409, "Email already exists");

  // Ensure the new email isn't used by someone else
  const existingUser = await User.findOne({ where: { email: email } });
  if (existingUser) throw UTILS.httpError(409, "Email already in use");

  const oldEmail = user.email;

  // Update email and mark unverified
  await User.update(
    { email: email, email_verified: false },
    { where: { id: user.id } },
  );

  // Notify both addresses about the change
  await sendTemplatedEmail({
    to: oldEmail,
    template: "emailUpdated",
    props: { email: oldEmail },
  });

  await sendTemplatedEmail({
    to: email,
    template: "emailUpdated",
    props: { email: email },
  });

  // Invalidate any existing email verification tokens for this user
  await VerificationToken.destroy({
    where: { user_id: user.id, token_type: "email_verification" },
  });

  // Generate a fresh verification token for the new email
  const verificationToken = UTILS.generateVerifyToken();
  const tokenHash = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await VerificationToken.create({
    user_id: user.id,
    token: tokenHash,
    expires_at: expiresAt,
    token_type: "email_verification",
  });

  // Send verification email to the NEW email
  await sendTemplatedEmail({
    to: email,
    template: "verifyEmail",
    props: { email: email, token: verificationToken, expiresInMinutes: 60 },
  });

  return res.status(200).json({
    success: true,
    message: "Email updated successfully. Please verify your new email.",
  });
});
