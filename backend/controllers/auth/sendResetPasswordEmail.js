
const db = require("../../models");
const { sendTemplatedEmail } = require("../../services/emailService");

const UTILS = require('../../utils/utils');
const {User, VerificationToken} = db;

require('dotenv').config();

module.exports  =  async (req,res) => {

    try {

      const {email} = req.body;


      //Find user by email
      const user  = await User.findOne({where: {email}});

     if(!user) {
       // Return success even if user not found for security reasons
      return res.status(200).json({message: "Password reset link sent to your email"});
     }

     //delete any existing tokens for the user
     await VerificationToken.destroy({
      where: {
        user_id: user.id,
        token_type: 'reset_password'

      }
      });
      

     // Generate a reset token
     const resetToken = UTILS.generateVerifyToken();
     const resetTokenExpiry = new Date();
     resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expires in 1 hour


    await VerificationToken.create({
      user_id: user.id,
      token: resetToken,
      expires_at: resetTokenExpiry,
      token_type: 'reset_password'
    });

    //Send reset email
   await sendTemplatedEmail({
    to: user.email,
    template: "sendPasswordResetEmail",
    props: {email: user.email, token: resetToken},

   })

    res.status(200).json({message: "Password reset link sent to your email"});

      
    } catch (error) {
      console.error(error);
      res.status(500).json({message: "Internal server error"});
    }
      
}