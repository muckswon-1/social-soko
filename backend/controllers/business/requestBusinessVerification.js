const {Business, EmailJob, User} = require("../../models");
const UTILS = require("../../utils/utils");

module.exports = UTILS.catchAsync(async (req, res) => {
    const {id, userId} = req.params;

    if(!id || !userId) {
        throw UTILS.httpError(400, "Business id or user id is required");
    }

    const user = User.findByPk(userId);

    if(!user) {
       throw UTILS.httpError(404, "User not found");
    }

    const business = await Business.findByPk(id);

    if(!business) {
        throw UTILS.httpError(404, "Business not found");
    }

  

    business.verification_status = "requested"
    business.verification_requested_at = new Date();
    await business.save();

    try {
        await EmailJob.create({
            to: business.email,
            template: "businessVerificationRequested",
            payload: {
                email: business.email
            }
        })
    } catch (error) {
        console.log("[Emailjob]: Could not create email job for business verification request");

    }

    res.json({
        success: true,
        message: "Business verification requested",
        business
    })

} )
  
