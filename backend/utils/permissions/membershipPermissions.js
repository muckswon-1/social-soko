/**
 * @typedef {import("../../types/common").UUID} UUID
 * @typedef {import("../../types/models").BusinessMembershipModel} BusinessMembershipModel
 */

/**
 * Determines whether a user can create a business membership
 * (either by requesting to join or inviting another user).
 *
 * Rules:
 * - User must be authenticated
 * - Active members cannot create another membership for themselves
 * - Admins / owners can create memberships (invite others)
 * - Non-members can create a membership request
 *
 * This helper is used by:
 * - membership request endpoints
 * - admin invite flows
 *
 * @param {Object} params
 * @param {UUID | null} params.userId - Current user ID (null if unauthenticated)
 * @param {BusinessMembershipModel | null} params.membership
 *   Existing membership for this business (if any)
 *
 * @returns {boolean}
 * True if membership creation is allowed, false otherwise.
 *
 * @example
 * if (!canCreateMembership({ userId, membership })) {
 *   throw httpError(403, "You cannot join this business");
 * }
 */
function canCreateMembership({ userId, membership }) {
  // Must be authenticated
  if (!userId) return false;



  // Admins / owners can always create memberships (invites)
  if (
    membership &&
    (membership.role === "admin" || membership.role === "owner")
  ) {
    return true;
  }


    // Already an active member → no duplicate memberships
  if (membership && membership.status === "active") {
    return false;
  }

  // Non-members can request to join
  if (!membership) {
    return true;
  }

  return false;
}

module.exports = { canCreateMembership };
