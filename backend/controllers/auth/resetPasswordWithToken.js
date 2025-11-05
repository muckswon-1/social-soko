
const {User} = require('../../models');
const bcrypt = require('bcrypt');

const verifyTokenService = require('../../services/verificationTokenService');
const { sendTemplatedEmail } = require('../../services/emailService');

module.exports = async (req, res) => {
    try {
        const {token} = req.params;
        const { password} = req.body;

        // TODO: Validate password strength

        // Find user with valid reset token


        const {user} = await verifyTokenService(token, 'reset_password');

     
        if(!user) {
            return res.status(400).json({message: "Invalid or expired token"})
        }

        //Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Update user password 
        await User.update({password: hashedPassword},
        {where: {id: user.id}});


        // Send email to user on successful login
        await sendTemplatedEmail({
            to: user.email,
            template: "sendPasswordResetSuccessEmail",
            props: {email: user.email}
        })

      res.status(200).json({message: "Password reset successful."})

    }catch(error) {
        
        res.status(500).json({message: "Internal server error"});
    }
}