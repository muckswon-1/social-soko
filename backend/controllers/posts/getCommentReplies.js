/**@typedef {import("../../types/models").Models} ModelType */
/**@typedef {import("../../types/common").UUID} UUID */

const { Op, fn, col } = require("sequelize");

const UTILS = require("../../utils/utils");
const assertCanViewPost = require("../../utils/permissions/assertCanViewPost");

const PREVIEW_LIMIT = 3;

module.exports = UTILS.catchAsync(async (req, res) => {
  /**@type {ModelType} */
  const models = req.app.get("models");
  const { Comment, User } = models;

  /** @type {{ commentId: UUID }} */
  const { commentId } = req.params;

  if (!commentId) throw UTILS.httpError(400, "commentId is required");

  const parentComment = await Comment.findByPk(commentId);
  if (!parentComment) throw UTILS.httpError(404, "Comment not found");

  /**@type {UUID} */
  const postId = parentComment.post_id;
  /**@type {UUID} */
  const userId = req.user?.id ?? null;

  await assertCanViewPost(models, {postId, userId});

  const { page, limit, offset } = UTILS.pagination(req.query.page, req.query.limit);

  const includeReplies =
    String(req.query.includeReplies ?? "true").toLowerCase() === "true";

  // 1) Count ONLY replies to this comment
  const totalReplies = await Comment.count({
    where: {
      post_id: postId,
      parent_id: commentId,
    },
  });

  // 2) Fetch replies (paginated)
  const replies = await Comment.findAll({
    where: {
      post_id: postId,
      parent_id: commentId,
    },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "first_name", "last_name", "avatar_url", "title"],
      },
    ],
    order: [["created_at", "ASC"]],
    limit,
    offset,
  });

  const replyIds = replies.map((r) => r.id);

  // 3) Count nested replies for each reply (grouped)
  /** @type {Record<string, number>} */
  let repliesCountByParentId = {};

  if (replyIds.length > 0) {
    const rows = await Comment.findAll({
      attributes: ["parent_id", [fn("COUNT", col("id")), "replies_count"]],
      where: {
        post_id: postId,
        parent_id: { [Op.in]: replyIds },
      },
      group: ["parent_id"],
      raw: true,
    });

    repliesCountByParentId = rows.reduce((acc, row) => {
      acc[row.parent_id] = Number(row.replies_count) || 0;
      return acc;
    }, {});
  }

  // 4) Optional preview (latest 3) for each reply so your UI can render deeper threads immediately
  if (includeReplies && replyIds.length > 0) {
    const previews = await Promise.all(
      replyIds.map(async (parentId) => {
        const latestChildren = await Comment.findAll({
          where: { post_id: postId, parent_id: parentId },
          include: [
            {
              model: User,
              as: "author",
              attributes: ["id", "first_name", "last_name", "avatar_url", "title"],
            },
          ],
          order: [["created_at", "DESC"]],
          limit: PREVIEW_LIMIT,
        });

        return { parentId, replies: latestChildren.reverse() }; // chronological in preview
      })
    );

    const previewMap = previews.reduce((acc, p) => {
      acc[p.parentId] = p.replies;
      return acc;
    }, {});

    replies.forEach((reply) => {
      const nestedCount = repliesCountByParentId[reply.id] ?? 0;
      const preview = previewMap[reply.id] ?? [];
      const previewCount = preview.length;

      reply.setDataValue("replies", preview);
      reply.setDataValue("stats", { replies_count: nestedCount });
      reply.setDataValue("has_more_replies", nestedCount > previewCount);
    });
  } else {
    // still attach stats + has_more_replies (no preview)
    replies.forEach((reply) => {
      const nestedCount = repliesCountByParentId[reply.id] ?? 0;
      reply.setDataValue("replies", []);
      reply.setDataValue("stats", { replies_count: nestedCount });
      reply.setDataValue("has_more_replies", nestedCount > 0);
    });
  }

  const totalPages = Math.ceil(totalReplies / limit);

  return res.status(200).json({
    success: true,
    replies,
    message: "Replies fetched successfully",
    meta: {
      page,
      limit,
      totalItems: totalReplies,
      totalPages,
    },
  });
});
