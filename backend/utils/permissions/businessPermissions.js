/**
 * @typedef {import("../../types/common").UUID} UUID
 * @typedef {import("../../types/models").BusinessMembershipModel} BusinessMembershipModel
 * @typedef {import("../../types/models").Models} ModelsType
 */



/**
 * @typedef {Object} GetBusinessMembershipParams
 * @param {UUID} businessId,
 * @param {UUID} userId
 */


/**
 * Fetch an active BusinessMembership for a given user and business.
 *
 * This is the canonical helper used to determine:
 * - whether a user is a member of a business
 * - what role they have within that business
 *
 * Only memberships with status = "active" are considered valid.
 *
 * @param {ModelsType} models - Sequelize models registry
 * @param {{ BusinessMembership: import("sequelize").ModelStatic<BusinessMembershipModel> }} models
 * @param {GetBusinessMembershipParams} params
 * @returns {Promise<BusinessMembershipModel|null>}
 * Resolves with the active BusinessMembership instance if found,
 * otherwise resolves with null.
 */
async function getBusinessMemberShip(models, {businessId, userId}) {
  
    if(!businessId || !userId) return null;
    
    return models?.BusinessMembership.findOne({where: {business_id: businessId, user_id: userId, status: "active"}});
    
}


/**
 * 
 * @param { "member"| "admin" | "owner"}  membershipRole
 * @param {"member"| "admin" | "owner"}  requiredRole
 */
 function isRoleAtleast(membershipRole, requiredRole) {
    const rank = {member: 1, admin: 2, owner: 3};
    return (rank[membershipRole] || 0) >= (rank[requiredRole] || 0)
    
}

async function requireBusinessRole(models, {businessId, userId, minRole}) {
    const membership = await getBusinessMemberShip(models, {businessId, userId});

    if(!membership) return { ok: false, membership: null, reason: "not_member"}

    if(!isRoleAtleast(membership.role, minRole)){
        return {ok: false, membership, reason: "insufficient_role"}
    }

    return {ok: true, membership, reason: null}
}

module.exports = {
    getBusinessMemberShip, isRoleAtleast, requireBusinessRole
}