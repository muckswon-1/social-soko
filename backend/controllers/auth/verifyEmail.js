const {User} = require("../../models");
const { sendTemplatedEmail } = require("../../services/emailService");
const verificationTokenService = require("../../services/verificationTokenService");
const UTILS = require("../../utils/utils");
const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = async (req, res) => {
    try {
        const {token} = req.params;


        if(!token) {
            return res.status(400).json({message: "Invalid or expired token"});
        }

        //Hash the incoming token the same way we stored it
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');


        //Find user with valid verify token
       const {user} = await verificationTokenService(tokenHash,'email_verification');
       


        if(!user) {
            return res.status(400).json({message: "Invalid or expired token"});
        }

        //Check if user is already verified
        if(user.email_verified) {

            return res.status(400).json({message: "Email already verified"});

        }

    //     // Update user email verification status
        await User.update(
            {
                email_verified_at: new Date(),
                email_verified: true

            }, 
            
            {where: {id: user.id}}
        );

    //     //send email verification success
    sendTemplatedEmail({
        to: user.email,
        template: "sendEmailVerificationSuccessful",
        props: {
            email: user.email
        }
    });

     res.status(200).json({message: "Email verified successfully"});


    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"});
    }
} 