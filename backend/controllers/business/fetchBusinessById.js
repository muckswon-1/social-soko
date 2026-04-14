const {Business} = require("../../models");
const UTILS = require("../../utils/utils");


module.exports = UTILS.catchAsync(async (req,res) => {
    const {id} = req.params;

    if(!id) throw UTILS.httpError(400, "Business ID is required");

    const business = await Business.findByPk(id);



    if(!business) throw UTILS.httpError(404, "Business not found");

    return res.status(200).json({
        success: true,
        message: "Business fetched successfully",
        business
    })
})