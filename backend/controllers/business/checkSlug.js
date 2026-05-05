const {Business} = require("../../models");
const { buildSlugFromStr } = require("../../utils/generateUniqueSlug");
const UTILS = require("../../utils/utils");
const validateSlug = require("../../utils/validateSlug");


module.exports = UTILS.catchAsync(async ( req, res) => {
    const {slug} = req.params;

   
    if(!slug) {
        throw UTILS.httpError(400, "Business slug is required")
    }


    const normalizedSlug = buildSlugFromStr(slug);

    console.log(normalizedSlug);

    const slugCheckResult = validateSlug(normalizedSlug);

    if(!slugCheckResult.valid){
        throw UTILS.httpError(400, slugCheckResult.reason)
    }
    
    const existing = await Business.findOne({
        where: {slug: normalizedSlug},
        attribute: ["id"]
    });


    if(existing){
        throw UTILS.httpError(400,"This slug is already taken")
    }


    res.status(200).json({
        success: true,
        message: "Slug is available"

    })

});