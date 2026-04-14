/**
 * @file backend/controllers/posts/getFeed.js
 *
 * Feed controller with visibility filtering.
 *
 * Returns:
 * - Posts visible to current user (or public if unauthenticated)
 * - Business + Author (light fields)
 * - Aggregated counts (likes, dislikes, bookmarks, views, comments)
 * - Current user flags (liked, disliked, bookmarked) and reaction (like|dislike|null)
 *
 * Notes:
 * - For feed performance, we DO NOT fetch comment bodies here.
 * - Comments are fetched via a dedicated comments endpoint.
 */

/**
 * @typedef {import("../../types/common").UUID} UUID
 * @typedef {import("../../types/common").RequestWithUser} RequestWithUser
 * @typedef {import("../../types/common").Response} Response
 * @typedef {import("../../types/post").FeedResponse} FeedResponse
 * @typedef {import("../../types/post").PostDetail} PostDetail
 * @typedef {import("../../types/user").User} UserType
 * @typedef {import("../../types/models").BusinessMembershipModel} BusinessMembershipModel
 * @typedef {import("../../types/models").BusinessRoleBuckets} BusinessRoleBuckets
 * @typedef {import("../../types/models").BusinessRole} BusinessRole
 * @typedef {import("../../types/models").Models} ModelsType;
 * 
 */

const { Op, fn, col } = require("sequelize");
const UTILS = require("../../utils/utils");
const {postVisibilityWhere} = require("../../utils/permissions/postVisibilityWhere");
const { canCreateComment } = require("../../utils/permissions/commentPermissions");




/**
 * Fetch posts feed with aggregated stats and current-user flags.
 *
 * @param {RequestWithUser} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
module.exports = UTILS.catchAsync(async (req, res) => {
  const { page, limit, offset } = UTILS.pagination(req.query.page, req.query.limit);

  /**@type {ModelsType} */
  const models = req.app.get("models");

  const {Post, User, Comment, PostLike, PostDislike, PostBookmark, PostViewEvent, Business, BusinessMembership} = models;

  /** @type {UserType | undefined} */
  const sessionUser = req.user;
  /** @type {UUID | null} */
  const userId = sessionUser?.id ?? null;

  /** @type {BusinessRoleBuckets} */
  const roleBuckets = {
    memberBusinessIds: [],
    adminBusinessIds: [],
    ownerBusinessIds: [],
  };

  // Build role buckets for visibility filtering
  if (userId) {
    /** @type {BusinessMembershipModel[]} */
    const memberships = await BusinessMembership.findAll({
      where: { user_id: userId, status: "active" },
      attributes: ["business_id", "role"],
      raw: true,
    });

    for (const membership of memberships) {
      const businessId = membership.business_id;

      if (membership.role === "owner") {
        // owner can see member/admin/owner visibilities
        roleBuckets.ownerBusinessIds.push(businessId);
        roleBuckets.adminBusinessIds.push(businessId);
        roleBuckets.memberBusinessIds.push(businessId);
      } else if (membership.role === "admin") {
        // admin can see member/admin visibilities
        roleBuckets.adminBusinessIds.push(businessId);
        roleBuckets.memberBusinessIds.push(businessId);
      } else if (membership.role === "member") {
        // member can see member visibility
        roleBuckets.memberBusinessIds.push(businessId);
      }
    }
  }


  // ✅ Centralized WHERE (mirrors canViewPost() rules)
  const whereClause = postVisibilityWhere({
    userId,
    roleBuckets,
  });

  /**
   * @typedef {{ rows: PostDetail[]; count: number }} FindPostResult
   */

  /** @type {FindPostResult} */
  const { rows: posts, count } = await Post.findAndCountAll({
    where: whereClause,
    attributes: [
      "id",
      "title",
      "content",
      "image_urls",
      "video_urls",
      "visibility",
      "post_type",
      "created_at",
      "updated_at",
    ],
    include: [
      {
        model: Business,
        as: "business",
        attributes: ["id", "name", "username", "slug", "logo_url", "verification_status"],
      },
      {
        model: User,
        as: "author",
        attributes: ["id", "first_name", "last_name", "account_verified", "avatar_url"],
      },
    ],
    order: [["created_at", "DESC"]],
    limit,
    offset,
  });

  /** @type {UUID[]} */
  const postIds = posts.map((p) => p.id);

  /** @type {Record<string, number>} */
  let likesByPostId = {};
  /** @type {Record<string, number>} */
  let dislikesByPostId = {};
  /** @type {Record<string, number>} */
  let bookmarksByPostId = {};
  /** @type {Record<string, number>} */
  let viewsByPostId = {};
  /** @type {Record<string, number>} */
  let commentsByPostId = {};

  if (postIds.length > 0) {
    const likeRows = await PostLike.findAll({
      attributes: ["post_id", [fn("COUNT", col("id")), "likes_count"]],
      where: { post_id: { [Op.in]: postIds } },
      group: ["post_id"],
      raw: true,
    });

    likesByPostId = likeRows.reduce((acc, row) => {
      acc[row.post_id] = Number(row.likes_count) || 0;
      return acc;
    }, {});

    const dislikeRows = await PostDislike.findAll({
      attributes: ["post_id", [fn("COUNT", col("id")), "dislikes_count"]],
      where: { post_id: { [Op.in]: postIds } },
      group: ["post_id"],
      raw: true,
    });

    dislikesByPostId = dislikeRows.reduce((acc, row) => {
      acc[row.post_id] = Number(row.dislikes_count) || 0;
      return acc;
    }, {});

    const bookmarkRows = await PostBookmark.findAll({
      attributes: ["post_id", [fn("COUNT", col("id")), "bookmarks_count"]],
      where: { post_id: { [Op.in]: postIds } },
      group: ["post_id"],
      raw: true,
    });

    bookmarksByPostId = bookmarkRows.reduce((acc, row) => {
      acc[row.post_id] = Number(row.bookmarks_count) || 0;
      return acc;
    }, {});

    const viewRows = await PostViewEvent.findAll({
      attributes: ["post_id", [fn("COUNT", col("id")), "views_count"]],
      where: { post_id: { [Op.in]: postIds } },
      group: ["post_id"],
      raw: true,
    });

    viewsByPostId = viewRows.reduce((acc, row) => {
      acc[row.post_id] = Number(row.views_count) || 0;
      return acc;
    }, {});

    const commentCountRows = await Comment.findAll({
      attributes: ["post_id", [fn("COUNT", col("id")), "comments_count"]],
      where: { post_id: { [Op.in]: postIds }, parent_id: null },
      group: ["post_id"],
      raw: true,
    });

    commentsByPostId = commentCountRows.reduce((acc, row) => {
      acc[row.post_id] = Number(row.comments_count) || 0;
      return acc;
    }, {});
  }

  /** @type {Record<string, boolean>} */
  let likedByCurrentUser = {};
  /** @type {Record<string, boolean>} */
  let dislikedByCurrentUser = {};
  /** @type {Record<string, boolean>} */
  let bookmarkedByCurrentUser = {};

  if (userId && postIds.length > 0) {
    const userLikes = await PostLike.findAll({
      attributes: ["post_id"],
      where: { post_id: { [Op.in]: postIds }, user_id: userId },
      raw: true,
    });

    likedByCurrentUser = userLikes.reduce((acc, row) => {
      acc[row.post_id] = true;
      return acc;
    }, {});

    const userDislikes = await PostDislike.findAll({
      attributes: ["post_id"],
      where: { post_id: { [Op.in]: postIds }, user_id: userId },
      raw: true,
    });

    dislikedByCurrentUser = userDislikes.reduce((acc, row) => {
      acc[row.post_id] = true;
      return acc;
    }, {});

    const userBookmarks = await PostBookmark.findAll({
      attributes: ["post_id"],
      where: { post_id: { [Op.in]: postIds }, user_id: userId },
      raw: true,
    });

    bookmarkedByCurrentUser = userBookmarks.reduce((acc, row) => {
      acc[row.post_id] = true;
      return acc;
    }, {});
  }


  console.log("Member business ids", roleBuckets.memberBusinessIds);

  const memberSet = new Set(roleBuckets.memberBusinessIds);
  console.log("Member set", memberSet);
  const adminSet = new Set(roleBuckets.adminBusinessIds);
 const ownerSet = new Set(roleBuckets.ownerBusinessIds);


  posts.forEach((post) => {
    const likesCount = likesByPostId[post.id] ?? 0;
    const dislikesCount = dislikesByPostId[post.id] ?? 0;
    const bookmarksCount = bookmarksByPostId[post.id] ?? 0;
    const viewsCount = viewsByPostId[post.id] ?? 0;
    const commentsCount = commentsByPostId[post.id] ?? 0;

    let hasLiked = likedByCurrentUser[post.id] ?? false;
    let hasDisliked = dislikedByCurrentUser[post.id] ?? false;

    if (hasLiked && hasDisliked) {
      hasDisliked = false;
    }

    const hasBookmarked = bookmarkedByCurrentUser[post.id] ?? false;

    

      /**@type {BusinessRole} */
    let membershipRole = null;
    console.log("Memberset insided loop: ", memberSet);
    const bizId = post.business_id;
    if(ownerSet.has(bizId)) membershipRole = "owner";
    else if (adminSet.has(bizId)) membershipRole = "admin";
    else if (memberSet.has(bizId)) membershipRole = "member"
   

    const derivedMembership = membershipRole ? {status: "active", role: membershipRole} : null;

    console.log("Member set has business ID: ", memberSet.has(bizId));
 
    console.log("membershipRole", membershipRole);
   
    

    post.setDataValue("current_user_liked", hasLiked);
    post.setDataValue("current_user_disliked", hasDisliked);
    post.setDataValue("current_user_bookmarked", hasBookmarked);
    post.setDataValue("viewer_membership_role", membershipRole);
    post.setDataValue("viewer_is_member", !!membershipRole);
    post.setDataValue("can_comment", canCreateComment({post, userId, membership: derivedMembership}));
  

    post.setDataValue("stats", {
      likesCount,
      dislikesCount,
      bookmarksCount,
      viewsCount,
      commentsCount,
    });
  });

  const totalPages = Math.ceil(count / limit);

  /** @type {FeedResponse} */
  const feedResponse = {
    posts,
    meta: {
      page,
      limit,
      totalItems: count,
      totalPages,
    },
  };

  return res.status(200).json({
    success: true,
    ...feedResponse,
  });
});
