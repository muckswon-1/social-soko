/**@typedef {import("../../types/models").Models} ModelType */
/**@typedef {import("../../types/common").UUID} UUID*/

/**
 * Fetch top-level comments for a post (paginated), with optional reply preview + reply counts.
 *
 * - Returns only top-level comments (parent_id = null).
 * - Optionally includes up to 3 replies per top-level comment (LATEST 3 for UX).
 * - Always includes replies_count for each top-level comment.
 * - Adds has_more_replies boolean when includeReplies=true, so UI can show "Show more replies".
 */

const { Op, fn, col } = require("sequelize");

const UTILS = require("../../utils/utils");
const assertCanViewPost = require("../../utils/permissions/assertCanViewPost");

const PREVIEW_LIMIT = 3;

module.exports = UTILS.catchAsync(async (req, res) => {
    /**@type {ModelType} */
  const models = req.app.get("models");
  const { Comment, User} = models;


  /** @type {{ postId: UUID }} */
  const { postId } = req.params;

  /**@type {UUID} */
  const userId = req.user?.id ?? null;

  await assertCanViewPost(models, {postId, userId});


  const { page, limit, offset } = UTILS.pagination(req.query.page, req.query.limit);

  const includeReplies =
    String(req.query.includeReplies ?? "true").toLowerCase() === "true";

  // 1) Count ONLY top-level comments
  const count = await Comment.count({
    where: { post_id: postId, parent_id: null },
  });

  // 2) Fetch ONLY top-level comments
  const comments = await Comment.findAll({
    where: { post_id: postId, parent_id: null },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "first_name", "last_name", "avatar_url", "title"],
      },
    ],
    order: [["created_at", "DESC"]],
    limit,
    offset,
  });

  const topLevelIds = comments.map((c) => c.id);

  // 3) replies_count for each parent in one grouped query
  /** @type {Record<string, number>} */
  let repliesCountByParentId = {};

  if (topLevelIds.length > 0) {
    const rows = await Comment.findAll({
      attributes: ["parent_id", [fn("COUNT", col("id")), "replies_count"]],
      where: {
        post_id: postId,
        parent_id: { [Op.in]: topLevelIds },
      },
      group: ["parent_id"],
      raw: true,
    });

    repliesCountByParentId = rows.reduce((acc, row) => {
      acc[row.parent_id] = Number(row.replies_count) || 0;
      return acc;
    }, {});
  }

  // 4) Attach preview replies (LATEST 3) + stats + has_more_replies
  if (includeReplies && topLevelIds.length > 0) {
    // Fetch preview replies per comment (latest 3, then reverse to show oldest->newest in UI)
    const previews = await Promise.all(
      topLevelIds.map(async (parentId) => {
        const latestReplies = await Comment.findAll({
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

        // UI typically wants chronological within the preview
        return {
          parentId,
          replies: latestReplies.reverse(),
        };
      })
    );

    const previewMap = previews.reduce((acc, p) => {
      acc[p.parentId] = p.replies;
      return acc;
    }, {});
    
    comments.forEach((comment) => {
      const repliesCount = repliesCountByParentId[comment.id] ?? 0;
      const previewReplies = previewMap[comment.id] ?? [];
      const previewCount = previewReplies.length;

      // set preview replies explicitly
      comment.setDataValue("replies", previewReplies);

      // stats
      comment.setDataValue("stats", {
        replies_count: repliesCount,
      });

      // has_more_replies
      comment.setDataValue("has_more_replies", repliesCount > previewCount);
    });
  } else {
    // No preview requested: still include stats + has_more_replies based on count
    comments.forEach((comment) => {
      const repliesCount = repliesCountByParentId[comment.id] ?? 0;

      comment.setDataValue("replies", []); // keep shape consistent
      comment.setDataValue("stats", { replies_count: repliesCount });
      comment.setDataValue("has_more_replies", repliesCount > 0);
    });
  }

  const totalPages = Math.ceil(count / limit);

  return res.status(200).json({
    success: true,
    comments,
    message: "Comments fetched successfully",
    meta: { page, limit, totalItems: count, totalPages },
  });
});
