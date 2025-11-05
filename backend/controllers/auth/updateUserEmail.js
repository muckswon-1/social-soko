const {User, VerificationToken} = require("../../models");
const { sendTemplatedEmail } = require("../../services/emailService");
const verificationTokenService = require("../../services/verificationTokenService");
const crypto = require('crypto');
const UTILS = require("../../utils/utils");


module.exports = async (req, res) => {
    try {
        const {newEmail, digitCodes} = req.body;

        //TODO Consider verifying passsword
        const {user} = await verificationTokenService(digitCodes,"verification_digits");

        //

        //check if user alrady updated email
        if(user.email === newEmail) {
            return res.status(400).json({message: "Email already exists"})
        }

        //check if email is already in use
        const existingUser = await User.findOne({where: {email: newEmail}});
        if(existingUser) {
            return res.status(400).json({message: "Email already in use"});
        }


           if(!user) {
            return res.status(400).json({message: "Invalid or expired token"})
        }

        // we will need to verify the email by sending a code to the new email

        const oldEmail = user.email;

        await User.update({email: newEmail, email_verified:false},
            {where: {id: user.id}}
        );

        //send email to old email 
        await sendTemplatedEmail({
            to: oldEmail,
            subject: "Email Updated",
            template: "sendEmailUpdated",
            props: {email: oldEmail}
        });

        //send email to new email
        await sendTemplatedEmail({
            to: newEmail,
            subject: "Email Updated",
            template: "sendEmailUpdated",
            props: {email: newEmail}
        });

       //Generate token to verify new email
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
      to: newEmail,
      template: "sendVerifyEmail",
      props:{email: newEmail, token: verificationToken, expiresInMinutes: 60}
    });

        

     res.status(200).json({message: "Email updated successfully"})


    } catch (error) {
         console.error('Error updating email:', error);
        res.status(500).json({ error: 'Internal server error' });

    }
}