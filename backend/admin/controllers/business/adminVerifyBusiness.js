const {Business, User, EmailJob} = require("../../../models");
const UTILS = require("../../../utils/utils");


module.exports = UTILS.catchAsync(async (req, res) => {
    const {id} = req.params;

    const business = await Business.findByPk(id);

    if(!business) {
        return res.status(404).json({
            message: "Business not found"
        })
    }

    let ownerUser = null;
    if(business.user_id) {
        ownerUser = await  User.findByPk(business.user_id);
    }

    const {eligible, reasons} = UTILS.checkBusinessVerificationEligibility(business, ownerUser);

    if(!eligible) {

        // Send email with reasons why business is not eligible for verification
        business.verification_status = "rejected";
        business.verification_rejected_reason = reasons.join(", ");
        business.verification_rejected_at = new Date();
        await business.save();

        try {
            await EmailJob.create({
                to: ownerUser.email,
                template: "businessVerificationFailed",
                payload: {
                    email: ownerUser.email,
                    reasons,
                }
            })
        } catch (error) {
            console.log("[EmailJob]: Could not create email job for business verification")
        }


        return res.status(422).json({
            status: "failed",
            message: "Business is not eligible for verification",
            reasons,
            business

        })

    }

    //TODO If you want to track when/who verified:
  // business.is_verified = true;
   //business.verified_at = new Date();
  // business.verified_by = req.user?.id || null;

   business.verification_status = "verified";
   business.verified_at = new Date();
   await business.save();

   // Send email confirming verification
   try {
    await EmailJob.create({
        to: ownerUser.email,
        template: "businessVerified",
        payload: {
            email: ownerUser.email,
        }
    })
   } catch (error) {
    console.log("[EmailJob]: Could not create email job for business verification")
   }



   return res.status(200).json({
    success: true,
    message: "Business verified successfully",
    business
   })
   
})