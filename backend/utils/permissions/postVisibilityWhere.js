 /**@typedef {import("../../types/models").BusinessRole} BusinessRole} */
 const {Op, literal} = require('sequelize')

/**
 * Builds a SQL WHERE condition that mirrors canViewPost()
 *
 * @param {Object} params
 * @param {string | null} params.userId
 * @param {{
 *  membershipBusinessIds: string[],
 * adminBusinessIds: string[],
 * ownerBusinessIds: string[]
 * }} params.roleBuckets
 *
 * @returns {Object} Sequelize WHERE clause
 */
function postVisibilityWhere({userId, roleBuckets}){
    if(!userId) return {visibility: "public"};


    const safeRoleBuckstets = {
        membershipBusinessIds: Array.isArray(roleBuckets?.membershipBusinessIds) ? roleBuckets.membershipBusinessIds : [],
        adminBusinessIds: Array.isArray(roleBuckets?.adminBusinessIds) ? roleBuckets.adminBusinessIds : [],
        ownerBusinessIds: Array.isArray(roleBuckets?.ownerBusinessIds) ? roleBuckets.ownerBusinessIds : [],

    }

    const {membershipBusinessIds, adminBusinessIds, ownerBusinessIds} = safeRoleBuckstets;



    return {
        [Op.or]: [
            // 1️⃣ Public Posts
            {visibility: "public"},

            // 2️⃣ Members only
            membershipBusinessIds.length > 0 ? 
            {
                visibility: "members",
                business_id: {[Op.in]: membershipBusinessIds},
            } : null,

            // 3️⃣ Admins/Owners only
            adminBusinessIds.length > 0 ?
            {
                visibility: "admins_owner",
                business_id: {[Op.in]: adminBusinessIds},
            }: null,

            // 4️⃣ Owner only
            ownerBusinessIds.length > 0 ?
            {
                visibility: "owner",
                business_id: {[Op.in]: ownerBusinessIds}

            } : null

        ]
    }
}


module.exports = {postVisibilityWhere}