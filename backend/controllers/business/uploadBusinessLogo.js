
const {Business} = require("../../models");
const buildFileUrl = require("../../utils/buildFileUrl");
const { UPLOADS_ROOT } = require("../../utils/multerFactory");
const UTILS = require("../../utils/utils");








module.exports = UTILS.catchAsync(async (req, res) => {
    const businessId = req.params.id;

    if(!businessId) {
        throw UTILS.httpError(400, "Business ID is required")
    }

    
    // From multer
    const file = req.file;



    if(!file) {
        throw UTILS.httpError(400, "No logo was uploaded")
    }

    // Fetch the business
    const business = await Business.findByPk(businessId);

    if(!business) {
        throw UTILS.httpError(404, "Business not found")
    }

    

    // enforce logged in user owns the business
    // req.user is set by verifyAccessToken
    if(business.user_id && req.user && business.user_id !== req.user.id) {

        throw UTILS.httpError(403, "You are not authorized to update this business")

    }

    

//       // file.path is something like: /.../uploads/logos/biz-<id>-timestamp.ext
//   // We want a relative path to serve via /uploads
//   // If upload.js uses UPLOADS_ROOT + "logos", file.path will contain "/uploads/logos/..."

  const relativePath = file.path.replace(UPLOADS_ROOT, "").replace(/\\/g, "/");


    const logoUrl = buildFileUrl(req, relativePath);

    

    business.logo_url = logoUrl;

    await business.save();

    return res.status(200).json({
        success: true,
        message: "Logo uploaded successfully",
        logo_url: logoUrl,
        business
    })
})