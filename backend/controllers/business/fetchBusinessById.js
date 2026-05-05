const UTILS = require("../../utils/utils");
module.exports = UTILS.catchAsync(async (req,res) => {

     /**@type {Models} */
     const models = req.app.get("models");
     const {Business, BusinessMembership} = models;

    const {id} = req.params;
    const userId = req.user?.id;

    if(!id) throw UTILS.httpError(400, "Business ID is required");

    if(!userId) throw UTILS.httpError(401,'Unauthorized')

    const business = await Business.findByPk(id);

    if(!business) throw UTILS.httpError(404, "Business not found");

    const membership = await BusinessMembership.findOne({
        where: {
            business_id: id,
            user_id: userId,
           
        }
    });


    const membershipRole = membership?.role || null;
    const membershipStatus = membership?.status || null;

    const canManage = membershipRole === "admin" || membershipRole === "owner";

    const canEdit = canManage;

    const canManageMembers = canManage;





    return res.status(200).json({
        success: true,
        message: "Business fetched successfully",
        business,
        membership: membership ? {
            id: membership.id,
            role: membership.role,
            status: membership.status,
            created_at: membership.created_at || membership.createdAt || null,
            updated_at: membership.updated_at || membership.updatedAt || null
        } : null,
        membershipRole,
        membershipStatus,
        permissions: {
            canManage,
            canEdit,
            canManageMembers,
            canViewPrivateDetails: canManage
        }
    })
})