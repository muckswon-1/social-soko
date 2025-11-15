

const {User, VerificationToken} = require("../../../models");
const UTILS = require("../../../utils/utils");
const crypto = require('crypto');

// Generate verify email token without sending email
const adminGenerateVerifyEmailParamsToken = UTILS.catchAsync(async (req, res) => {

    const {userEmail} = req.body;

    console.log(userEmail);

    if (!userEmail) throw UTILS.httpError(400, "Email is required");

    const user = await User.findOne({where: {email: userEmail}});

    if (!user) throw UTILS.httpError(404, "User not found");

    // Destroy any existing tokens
    await VerificationToken.destroy({
        where: {
            user_id: user.id,
            token_type: "email_verification"
            }
    });


    const expiresInMinutes = 60;
   const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    const rawToken =  UTILS.generateVerifyToken();

    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    //Store the hashed token
    await VerificationToken.create({
        user_id: user.id,
        token: hashedToken,
        token_type: "email_verification",
        expires_at: expiresAt

    });


    res.status(200).json({
        success: true,
        message: "Verification token generated successfully",
        token: rawToken,

    });

});

module.exports = {
    adminGenerateVerifyEmailParamsToken

};
