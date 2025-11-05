const {User} = require("../../models");
const { sendTemplatedEmail } = require("../../services/emailService");
const verificationTokenService = require("../../services/verificationTokenService");
const bcrypt = require('bcrypt');



// Update password for a user who is already logged in
module.exports = async (req, res) => {
    

    try {
        const {  newPassword, digitCodes } = req.body;

        // TODO  Consider verifying current password
       
         // Find user with valid digit code
         const {user} = await verificationTokenService(digitCodes,"verification_digits");


           if(!user) {
            return res.status(400).json({message: "Invalid or expired token"})
        }

       

        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await User.update({password: hashedPassword}, {where: {id: user.id}});

           await sendTemplatedEmail({
            to: user.email,
            template: "sendPasswordResetSuccessEmail",
            props: {email: user.email}
        });

        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal server error' });

    }
    
}