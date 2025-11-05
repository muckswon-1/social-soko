const {User, VerificationToken} = require("../../models");
const { sendTemplatedEmail } = require("../../services/emailService");
const UTILS = require("../../utils/utils");



// Send a six digit code for unsafe operations like reset password
module.exports = async (req, res) => {
    const { email } = req.body;
    try {
        // Check if user exists
           //Find user by email
      const user  = await User.findOne({where: {email}});


     if(!user) {
       // Return success even if user not found for security reasons
      return res.status(200).json({message: "Password reset code sent to your email"});
     }


     // delete any exisiting codes for the user
     await VerificationToken.destroy({
      where: {
        user_id: user.id,
        token_type: 'verification_digits'
      }
    }
     )

       
        const expiresInMinutes = 60; // 1 hour from
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); 
        const code = UTILS.generateDigitsCode(1);
       

       await VerificationToken.create({
      user_id: user.id,
      token: code,
      expires_at: resetTokenExpiry,
      token_type: 'verification_digits'
    });

        // Send code via email
        sendTemplatedEmail({
            to: email,
            template: "sendSixDigitCodeEmail",
            props: {email, code, expiresInMinutes},
        })

  res.json({message: "Verification code sent to your email"});

    }catch(error) {
        console.error(error);
      res.status(500).json({message: "Internal server error"});
    }
}

     
