const {User, VerificationToken} = require("../../models");
const { sendTemplatedEmail } = require("../../services/emailService");
const UTILS = require("../../utils/utils");
const bcrypt = require('bcrypt');
const crypto = require('crypto');



module.exports = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
    });

    // Send a Welcome and a verification email
    // Generate a verification token
    const verificationToken  = UTILS.generateVerifyToken();
    const tokenHash = crypto.createHash('sha256').update(verificationToken).digest('hex');
     // Token expiry
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    
    // Store token
    await VerificationToken.create({
      user_id: user.id,
      token:tokenHash,
      expires_at: expiresAt, 
      token_type: "email_verification"
    });


    await sendTemplatedEmail({
      to: user.email,
      template: "sendVerifyEmail",
      props:{email: user.email, token: verificationToken, expiresInMinutes: 60}
    });

    await sendTemplatedEmail({
      to: user.email,
      template: "sendWelcomeEmail",
      props:{email: user.email}
    });

  
    res.status(201).json({
      message: 'User created successfully',
      id: user.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
};

