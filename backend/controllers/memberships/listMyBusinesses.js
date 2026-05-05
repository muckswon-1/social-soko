  /**
 * 
 * @typedef {import("../../types/models").Models} Models
 * @typedef {import("../../types/common").AuthedRequest} AuthedRequest
 * @typedef {import("express").Response} ExpressResponse
 
 */






const UTILS = require("../../utils/utils");

module.exports  = UTILS.catchAsync(
  /**
 * List businesses the current user can act in:
 * - Owner (Business.user_id === user.id)
 * - Member/Admin (BusinessMembership.user_id === user.id)
 *
 * Returns: [{ id, name, role, slug?, logo_url?, verification_status? }]
 *
 * @param {AuthedRequest} req
 * @param {ExpressResponse} res
 * 
 */
async (req, res) => {

    /**@type {Models} */
    const models = req.app.get("models");
    const {Business, BusinessMembership} = models;

    const userId = req.user?.id;
    if(!userId) throw UTILS.httpError(401, "Unauthorized");

    // 1) Owned businesses
    const ownedBusiness = await Business.findAll({
        where: {user_id: userId},
        attributes: ["id", "name", "slug", "logo_url", "verification_status"],
        order: [["created_at", "DESC"]]
    })

    // 2) Membership-based businesses
    const membershipBusiness = await BusinessMembership.findAll({
        where: {user_id: userId},
        attributes: ["id", "business_id", "role"],
        include: [
            {
                model: Business,
                as: "business",
                attributes: ["id", "name", "slug", "logo_url", "verification_status"]
            },
        ],
        order: [["created_at", "DESC"]]

    });


    //normalise to a single list with roles
    // owner always wins if duplicates exists
    const map = new Map();

    for ( const business of ownedBusiness) {
        map.set(business.id, {
            id: business.id,
            name: business.name,
            slug: business.slug,
            logo_url: business.logo_url,
            verification_status: business.verification_status,
            role: "owner"
        });
    }

    for (const membership of membershipBusiness) {
        const b = membership?.business;
        if(!b?.id) continue;

        //if already owner keep it
        if(map.has(b.id) && map.get(b.id)?.role === "owner") continue;

        map.set(b.id, {
            id: b.id,
            name: b.name,
            slug: b.slug,
            logo_url: b.logo_url,
            verification_status: b.verification_status,
            role: membership.role || "member"
        })
    }

    const businesses = Array.from(map.values());

    res.status(200).json({
        success: true,
        message: "Businesses fetched successfully",
        data: businesses
    })

}

)