const {BusinessMember, Business} = require("../../models");
const UTILS = require("../../utils/utils");

module.exports = UTILS.catchAsync(async (req,res) => {
    const userId = req.user?.id;

    if(!userId) throw UTILS.httpError(401, "Unauthorized");

    const memberships = await BusinessMember.findAll({
        where: {user_id: userId},
        include: [
            {
                model: Business,
                attributes: [
                    "id",
                    "name",
                    "username",
                    "name",
                    "city",
                    "country",
                    "verification_status",
                    "logo_url",
                    "slug"
                ],
                order: [["created_at", "DESC"]]
            }
        ]
    });

    return res.status(200).json({
        success: true,
        message: "Memberships fetched successfully",
        memberships
    })
})