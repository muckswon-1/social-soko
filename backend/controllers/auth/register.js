const { User, VerificationToken, EmailJob } = require("../../models");
const UTILS = require("../../utils/utils");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

module.exports = UTILS.catchAsync(async (req, res) => {
  const { email, password } = req.body || {};

  

  // Validate input
  if (!email) throw UTILS.httpError(400, "email is required");
  if (!password) throw UTILS.httpError(400, "password is required");
  if (String(password).length < 8) {
    throw UTILS.httpError(400, "Password must be at least 8 characters");
  }


  // Check if user already exists
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) throw UTILS.httpError(409, "Email already in use");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
 
  // Create user
  const user = await User.create({
    email,
    password: hashedPassword,
  
  });

  // Generate email verification token
  const verificationToken = UTILS.generateVerifyToken();
  const tokenHash = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutes

  // Store verification token
  await VerificationToken.create({
    user_id: user.id,
    token: tokenHash,
    expires_at: expiresAt,
    token_type: "email_verification",
  });


  // Schedule jos to send emails
  try {
    await EmailJob.bulkCreate([
      {
        user_id: user.id,
        to: user.email,
        template: "verifyEmail",
        payload: {
          email: user.email,
          token: verificationToken,
          expiresInMinutes: 60
        },
        status: "pending"
      },
       {
        user_id: user.id,
        to: user.email,
        template: "welcome",
        payload: {
          email: user.email,
        },
        status: "pending"
      }
    ])

    
  } catch (error) {
    console.error("[EmailJob] Failed to enqueue sign up emails for user")
  }


  return res.status(201).json({
    success: true,
    message: "User created successfully",
    id: user.id,
  });
});
