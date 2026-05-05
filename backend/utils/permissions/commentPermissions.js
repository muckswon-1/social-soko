"use strict";

/**
 * @typedef {import("sequelize").Model} SequelizeModel
 * @typedef {import("../../types/common").UUID} UUID
 * @typedef {import("../../types/models").PostModel} PostModel
 * @typedef {import("../../types/models").BusinessMembershipModel} BusinessMembershipModel
 */

/**
 * Determines whether a user is allowed to create a comment on a post.
 *
 * This is a pure permission check (no DB calls). Upstream code should:
 * - load the post
 * - resolve membership (if user is logged in)
 * - call this helper
 *
 * Locked rules:
 * - User must be authenticated to comment (always).
 * - For `post_type="informational"`: only business admin/owner may comment.
 * - For `post_type="social"`: any authenticated user may comment
 *   (non-members should be labeled as external at write time).
 * - For all other post types: only active business members may comment.
 *
 * Note:
 * - Viewing comments is controlled by post visibility (handled elsewhere).
 *
 * @param {Object} params
 * @param {PostModel} params.post - Post instance
 * @param {UUID | null} params.userId - Current user ID (null if unauthenticated)
 * @param {BusinessMembershipModel | null} params.membership - Active membership (if any)
 *
 * @returns {boolean}
 * True if user can create a comment, false otherwise.
 */
function canCreateComment({ post, userId, membership }) {
    if(!post) return false;

    // must be authenticated to comment
    if(!userId) return false;

    const postType = post.post_type;
    

    const isActiveMember = !!membership && membership.status === "active";
    const role = membership?.role || null;

    const isAdminOrOwner = role === "admin" || role === "owner";

    // Informational: admin/owner only
    if(postType === "informational") {
        return isActiveMember && isAdminOrOwner
    }

    //Social: any authenticated user can comment
    if(postType === "social") {
        // TODO: decide social comments only allowed when post is active
        return true;
    }

    

    return isActiveMember;

}

module.exports = {
  canCreateComment,
};
