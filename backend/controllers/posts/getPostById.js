/**
 * @typedef {(import("../../types/models").PostModel)} PostModel
 * @typedef {(import("../../types/models").Models)} Models
 * @typedef {import("express").Request} ExpressRequest
 * @typedef {import("express").Response} ExpressResponse
 * @typedef {import("../../types/common").UUID} UUID
 * @typedef {import("../../types/models").UserModel} UserType
 * */

const { fn, col } = require("sequelize");
const UTILS = require("../../utils/utils");
const { getBusinessMemberShip } = require("../../utils/permissions/businessPermissions");
const { canViewPost } = require("../../utils/permissions/postPermissions");
const { canCreateComment } = require("../../utils/permissions/commentPermissions");

module.exports = UTILS.catchAsync(
  /**
   *
   * @param {ExpressRequest} req
   * @param {ExpressResponse} res
   */
  async (req, res) => {

    /**@type {Models} */
    const models = req.app.get("models");

    const {
      Post,
      Business,
      User,
      PostLike,
      PostDislike,
      PostBookmark,
      PostViewEvent,
      Comment
    } = models;



    /**@type {{postId: UUID }} args */
    const { postId } = req.params;

    /**@type {UserType} */
    const user  = req.user;


    /**@type {UUID} */
    const userId = user?.id || null;

    if (!postId) throw UTILS.httpError(400, "postId is required");

    /**@type {PostModel} */
    const post = await Post.findByPk(postId, {
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
          attributes: [
            "id",
            "name",
            "username",
            "slug",
            "logo_url",
            "verification_status",
          ],
        },
        {
          model: User,
          as: "author",
          attributes: [
            "id",
            "first_name",
            "last_name",
            "account_verified",
            "avatar_url",
          ],
        },
      ],
    });

    if(!post) throw UTILS.httpError(404, "Post not found");

    let membership = null;

    if(userId && post.business_id){
      membership = await getBusinessMemberShip(models, {
        businessId: post.business_id,
        userId
      })
    }

    const canView = canViewPost({post, userId, membership});

    if(!canView) throw UTILS.httpError(403, "You do not have access to this post.");


    const likesCount = await PostLike.count({ where: { post_id: postId } });
    const bookmarksCount = await PostBookmark.count({
      where: { post_id: postId },
    });
    const viewsCount = await PostViewEvent.count({
      where: { post_id: postId },
    });
    const commentsCount = await Comment.count({ where: { post_id: postId, parent_id: null } });
    const dislikesCount = await PostDislike.count({
      where: { post_id: postId },
    });

    /** @type {Record<boolean>} */
    let likedByCurrentUser = false;
    /** @type {Record<boolean>} */
    let dislikedByCurrentUser = false;
    /** @type {Record<boolean>} */
    let bookmarkedByCurrentUser = false;

    if (userId) {
      const postLike = await PostLike.findOne({
        where: { post_id: postId, user_id: userId },
        attributes: ["post_id"],
        raw: true,
      });

      

      if (postLike) likedByCurrentUser = true;

      const postDislike = await PostDislike.findOne({
        where: { post_id: postId, user_id: userId },
        attributes: ["post_id"],
        raw: true,
      });

      if (postDislike) dislikedByCurrentUser = true;


      if(likedByCurrentUser && dislikedByCurrentUser){
        dislikedByCurrentUser = false;
      }

      const postBookmark = await PostBookmark.findOne({
        where: { post_id: postId, user_id: userId },
        attributes: ["post_id"],
        raw: true,
      });

      if (postBookmark) bookmarkedByCurrentUser = true;
    }

    post.setDataValue("current_user_liked", likedByCurrentUser);
    post.setDataValue("current_user_disliked", dislikedByCurrentUser);
    post.setDataValue("current_user_bookmarked", bookmarkedByCurrentUser);
    post.setDataValue("can_view", true);
    post.setDataValue("can_comment", canCreateComment({post, userId, membership}));
    post.setDataValue("viewer_is_member", !!membership && membership.status === "active");
    post.setDataValue("viewer_membership_role", membership?.role ?? null);

    post.setDataValue("stats", {
      likesCount,
      dislikesCount,
      bookmarksCount,
      viewsCount,
      commentsCount,
    });

    return res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post,
    })
  }
);
