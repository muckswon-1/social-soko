/**
 * @typedef {import("../../types/common").UUID} UUID
 * @typedef {import("../../types/models").BusinessMembershipModel} BusinessMembershipModel
 * @typedef {import("../../types/models").PostVisibility} PostVisibility
 * @typedef {import("../../types/models").PostModel} PostModel
 */

/**
 * Determines whether a user is allowed to view a post based on:
 * - post visibility level
 * - authentication state
 * - business membership
 * - business role
 *
 * This helper is the SINGLE source of truth for post visibility and is used by:
 * - post detail endpoint
 * - feed queries (SQL-equivalent logic)
 * - comments fetch endpoints
 *
 * Visibility rules:
 * - public → anyone (including unauthenticated)
 * - members → active business members
 * - admins_owner → admin or owner
 * - owner → owner only
 *
 * Owner override:
 * - An active owner can view ANY post visibility
 *
 * Important:
 * - `membership` must correspond to the post's `business_id`
 *
 * @param {Object} params
 * @param {PostModel} params.post - Post instance
 * @param {UUID | null} params.userId - Current user ID (null if unauthenticated)
 * @param {BusinessMembershipModel | null} params.membership - Active membership (if any)
 *
 * @returns {boolean}
 * True if the post can be viewed, false otherwise.
 *
 * @example
 * if (!canViewPost({ post, userId, membership })) {
 *   throw httpError(403, "You do not have access to this post");
 * }
 */
function canViewPost({ post, userId, membership }) {
  if (!post) return false;

  /** @type {PostVisibility} */
  const visibility = post.visibility || "public";

  // Public is always visible
  if (visibility === "public") return true;

  // All non-public visibility requires authentication
  if (!userId) return false;

  // Must have an active membership for non-public posts
  if (!membership || membership.status !== "active") {
    return false;
  }

  // Owner override — owner can view everything
  if (membership.role === "owner") return true;

  switch (visibility) {
    case "members":
      return true;

    case "admins_owner":
      return membership.role === "admin";

    case "owner":
      return false; // handled by owner override above

    default:
      return false;
  }
}



/**
 * Determines whether a business member can create a post of a given type.
 * Pure check: no DB calls.
 *
 * Rules (recommended default):
 * - member: selling, buying, social
 * - admin/owner: selling, buying, social, informational, launching, promoting
 *
 * @param {Object} params
 * @param {PostType} params.postType
 * @param {BusinessMembershipModel} params.membership - active membership for the business
 * @returns {boolean}
 */
function canCreatePostType({ postType, membership }) {
  if (!postType) return false;
  if (!membership || membership.status !== "active") return false;

  const role = membership.role;

  // Admin/owner can create any post type
  if (role === "admin" || role === "owner") return true;

  // Members are restricted
  if (role === "member") {
    return postType === "selling" || postType === "buying" || postType === "social";
  }

  return false;
}






module.exports = {canViewPost, canCreatePostType}