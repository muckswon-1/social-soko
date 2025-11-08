
const { User, VerificationToken } = require("../../models");
const { sendTemplatedEmail } = require("../../services/email/emailService");
const UTILS = require("../../utils/utils");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

module.exports = UTILS.catchAsync(async (req, res) => {
  const { email, password, role } = req.body || {};

  // Validate input
  if (!email) throw UTILS.httpError(400, "email is required");
  if (!password) throw UTILS.httpError(400, "password is required");
  if (String(password).length < 8) {
    throw UTILS.httpError(400, "Password must be at least 8 characters");
  }
  if (!role) throw UTILS.httpError(400, "role is required");

  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw UTILS.httpError(409, "Email already in use");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
    role,
  });

  // Generate email verification token
  const verificationToken = UTILS.generateVerifyToken();
  const tokenHash = crypto.createHash("sha256").update(verificationToken).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

  // Store verification token
  await VerificationToken.create({
    user_id: user.id,
    token: tokenHash,
    expires_at: expiresAt,
    token_type: "email_verification",
  });

  // Send emails
  await sendTemplatedEmail({
    to: user.email,
    template: " verifyEmail",
    props: { email: user.email, token: verificationToken, expiresInMinutes: 60 },
  });

  await sendTemplatedEmail({
    to: user.email,
    template: "welcome",
    props: { email: user.email },
  });

  return res.status(201).json({
    success: true,
    message: "User created successfully",
    data: { id: user.id },
  });
});
