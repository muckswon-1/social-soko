/**
 * @typedef {import("../../types/common").UUID} UUID
 * @typedef {import("../../types/models").BusinessMembershipModel} BusinessMembershipModel
 */

/**
 * Can the current user approve membership requests for this business?
 *
 * Rules:
 * - Must be authenticated
 * - Must have an ACTIVE membership
 * - Must be admin or owner
 *
 * @param {Object} params
 * @param {UUID | null} params.userId
 * @param {BusinessMembershipModel | null} params.membership
 * @returns {boolean}
 */
function canApproveMembershipRequest({ userId, membership }) {

  if (!userId || !membership) {
    return false;
  }
  if (membership.status !== "active") return false

  return membership.role === "admin" || membership.role === "owner"

}

module.exports = {canApproveMembershipRequest}
