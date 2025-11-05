const {User, VerificationToken} = require("../../models");
const { sendTemplatedEmail } = require("../../services/emailService");
const UTILS = require("../../utils/utils");
const crypto = require('crypto');


require('dotenv').config();

module.exports = async (req,res) => {

try {

      const {email} = req.body;
     //Find user by email
     const user = await User.findOne({where: {email}});
     
    if(!user) {
        throw new Error('User is required.')
    }

    //Delete any exisiting email_verification tokens for this user
    await VerificationToken.destroy({
      where: {
        user_id: user.id,
        token_type: "email_verification"
      }
    })

    // Token expiry
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Generate reset token
    const rawToken = UTILS.generateVerifyToken();
     const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    //Store token
      await VerificationToken.create({
      user_id: user.id,
      token: hashedToken,
      expires_at: expiresAt, 
      token_type: "email_verification"
    }); 

 sendTemplatedEmail({
  to: user.email,
  template:"sendVerifyEmail",
  props: {
    email: user.email,
    token: rawToken
  }
 });

  res.status(200).json({message: "Email verification link sent"})

  
} catch (error) {
   console.error(error);
   res.status(500).json({message: "Internal Server Error"})
}
}
