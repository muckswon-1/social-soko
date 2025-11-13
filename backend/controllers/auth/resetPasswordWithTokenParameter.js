const UTILS = require("../../utils/utils");
const bcrypt = require("bcrypt");
const verifyTokenService = require("../../services/verificationTokenService");
const { sendTemplatedEmail } = require("../../services/email/emailService");


module.exports = UTILS.catchAsync(async (req, res) => {
  const { token } = req.params || {};
  const { password } = req.body || {};

  // Validate input
  if (!token) throw UTILS.httpError(400, "Reset token is required");
  if (!password) throw UTILS.httpError(400, "password is required");
  if (String(password).length < 8) {
    throw UTILS.httpError(400, "Password must be at least 8 characters");
  }
  // TODO: Add stronger password validation  (e.g., complexity rules)
  //TODO: Check if the new password is equal to any of the last five passwords

  // Verify token & get user
  const { valid, user, reason } = await verifyTokenService(
    token,
    "reset_password",
    { inputFormat: "sha256" },
  );

  if (!valid || !user) throw UTILS.httpError(400, reason);

  if (user.password === password)
    throw UTILS.httpError(
      400,
      "New password must be different from the current password",
    );

  // Hash and update password
  const hashedPassword = await bcrypt.hash(password, 10);
  await user.update({ password: hashedPassword }, { where: { id: user.id }, individualHooks: true });

  // Notify user
  await sendTemplatedEmail({
    to: user.email,
    template: "passwordResetSuccess",
    props: { email: user.email },
  });

  return res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});
