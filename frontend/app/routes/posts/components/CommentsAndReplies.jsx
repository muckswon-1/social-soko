// src/menu/posts/components/CommentsAndReplies.jsx

import React, { useCallback, useMemo, useState } from "react";
import Comment from "./Comment";
import CreateCommentForm from "./CreateCommentForm";
import { useLazyGetCommentRepliesQuery } from "../../../services/postsApi";
import { sortCommentsByDate } from "../../../utils/sortBy";
import '../../../styles/posts/comments-and-replies.css';

const safeReplies = (replies) => (Array.isArray(replies) ? replies : []);

/**
 * @typedef {import("../../../types/comment").Comment} CommentType
 */

const uniqueById = (arr) => {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    if (!item?.id) continue;
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
};

const toBool = (v) => v === true || v === "true";
const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/**
 * @param {{
 *   comments: CommentType[];
 *   postAuthorId: string | null;
 *   postId: string;
 *   depth?: number;
 *   maxDepth?: number;
 *   onReplyCreated?: (parentId: string, newReply: CommentType) => void;
 *   onToggleLikeComment?: Function;
 *   onToggleDislikeComment?: Function;
 *   onToggleBookmarkComment?: Function;
 *   onRegisterCommentView?: Function;
 * }} props
 */
const CommentsAndReplies = ({
  comments,
  postAuthorId,
  postId,
  depth = 0,
  maxDepth = 7,
  onReplyCreated,
  onToggleLikeComment,
  onToggleDislikeComment,
  onToggleBookmarkComment,
  onRegisterCommentView,
}) => {
  const [triggerGetReplies] = useLazyGetCommentRepliesQuery();



  // ✅ allow multiple comments to be open at once
  const [openById, setOpenById] = useState(/** @type {Record<string, boolean>} */ ({}));

  // One reply composer open at this level (keep this behavior)
  const [activeReplyToId, setActiveReplyToId] = useState(/** @type {string | null} */ (null));

  // Per-comment loading state
  const [loadingMore, setLoadingMore] = useState(/** @type {Record<string, boolean>} */ ({}));

  // Per-comment pagination state
  const [nextPageById, setNextPageById] = useState(/** @type {Record<string, number>} */ ({}));

  // Per-comment hasMore state (server truth after first fetch)
  const [hasMoreById, setHasMoreById] = useState(/** @type {Record<string, boolean>} */ ({}));

  // Per-comment loaded replies from server (beyond preview)
  const [serverRepliesById, setServerRepliesById] = useState(
    /** @type {Record<string, CommentType[]>} */ ({})
  );

  const handleReply = useCallback((comment) => {
    setActiveReplyToId((prev) => (prev === comment.id ? null : comment.id));
  }, []);

  const handleCancelReply = useCallback(() => setActiveReplyToId(null), []);

  const handleCreatedReply = useCallback(
    (parentId, newReply) => {
      onReplyCreated?.(parentId, newReply);

      // Also optimistically add the reply to this component's loaded replies,
      // so user sees it immediately even if it isn't in the 3-reply preview.
      if (parentId && newReply?.id) {
        setServerRepliesById((prev) => {
          const existing = Array.isArray(prev[parentId]) ? prev[parentId] : [];
          return { ...prev, [parentId]: uniqueById([newReply, ...existing]) };
        });

        // Ensure replies are visible right after posting
        setOpenById((prev) => ({ ...prev, [parentId]: true }));
      }

      setActiveReplyToId(null);
    },
    [onReplyCreated]
  );

  const handleToggleReplies = useCallback((commentId) => {
    setOpenById((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  }, []);

  const handleShowMoreReplies = useCallback(
    async (commentId) => {
      if (!commentId) return;

      setLoadingMore((prev) => ({ ...prev, [commentId]: true }));

      try {
        const page = nextPageById[commentId] ?? 1;

        const result = await triggerGetReplies({ commentId, page, limit: 10 });
        const payload = result?.data || {};
        const newReplies = Array.isArray(payload.replies) ? payload.replies : [];
        const meta = payload.meta || {};

        const metaPage = toNumber(meta.page);
        const totalPages = toNumber(meta.totalPages);
        const hasMore = totalPages > metaPage;

        setServerRepliesById((prev) => {
          const existing = Array.isArray(prev[commentId]) ? prev[commentId] : [];
          return {
            ...prev,
            [commentId]: uniqueById([...existing, ...newReplies]),
          };
        });

        setHasMoreById((prev) => ({ ...prev, [commentId]: hasMore }));

        setNextPageById((prev) => ({
          ...prev,
          [commentId]: hasMore ? page + 1 : page,
        }));

        // If user clicks "show more", ensure it stays open
        setOpenById((prev) => ({ ...prev, [commentId]: true }));
      } finally {
        setLoadingMore((prev) => ({ ...prev, [commentId]: false }));
      }
    },
    [nextPageById, triggerGetReplies]
  );

  // small perf: memoize map input
  const list = useMemo(() => (Array.isArray(comments) ? comments : []), [comments]);

  return (
    <div className={depth === 0 ? "comment-thread" : "comment-thread comment-thread--nested"}>
      {list.map((comment) => {
        const commentId = comment?.id;
        if (!commentId) return null;

        const previewReplies = safeReplies(comment.replies); // first 3 from backend
        const loadedReplies = serverRepliesById[commentId] ?? [];

        const combinedReplies = sortCommentsByDate(
          uniqueById([...previewReplies, ...loadedReplies]),
          "desc"
        );

        const previewCount = previewReplies.length;

        // API uses snake_case: has_more_replies
        const serverSaysHasMore =  toBool(comment?.hasMoreReplies);

        const effectiveHasMore =
          typeof hasMoreById[commentId] === "boolean" ? hasMoreById[commentId] : serverSaysHasMore;

        // API uses snake_case in stats too: replies_count
        const repliesCount =
          toNumber(comment?.stats?.repliesCount) ||
          previewCount;

        const canRenderChildren = depth < maxDepth;

        const isOpen = !!openById[commentId];
        const isReplying = activeReplyToId === commentId;
        const isLoadingMore = loadingMore[commentId] === true;

        // Controls:
        // - If no preview and no hasMore => show nothing
        // - If closed => show "Show replies"
        // - If open => show "Hide replies"
        // - If open && hasMore => show "Show more replies" (below children)
        const showAnyReplyControls = canRenderChildren && (previewCount > 0 || serverSaysHasMore);
        const showShowRepliesBtn = showAnyReplyControls && !isOpen;
        const showHideRepliesBtn = showAnyReplyControls && isOpen;
        const showMoreBtn = canRenderChildren && isOpen && effectiveHasMore;

        return (
          <div key={commentId} className="comment-thread__item">
            <Comment
              comment={comment}
              depth={depth}
              postAuthorId={postAuthorId}
              onReply={handleReply}
              onCancelReply={handleCancelReply}
              isReplying={isReplying}
              onToggleLikeComment={onToggleLikeComment}
              onToggleDislikeComment={onToggleDislikeComment}
              onToggleBookmarkComment={onToggleBookmarkComment}
              onRegisterCommentView={onRegisterCommentView}
            />

            {isReplying && (
              <div className="comment-thread__reply-form">
                <CreateCommentForm
                  postId={postId}
                  parentCommentId={commentId}
                  autoFocus
                  submitLabel="Reply"
                  onCancel={handleCancelReply}
                  onSubmit={(newReply) => handleCreatedReply(commentId, newReply)}
                />
              </div>
            )}

            {showAnyReplyControls && (
              <div className="comment-thread__children-header">
                {showShowRepliesBtn && (
                  <button
                    type="button"
                    className="link-btn comment-thread__toggle-btn comment-thread__toggle-btn--show"
                    onClick={() => handleToggleReplies(commentId)}
                  >
                    Show replies ({repliesCount})
                  </button>
                )}

                {showHideRepliesBtn && (
                  <button
                    type="button"
                    className="link-btn comment-thread__toggle-btn comment-thread__toggle-btn--hide"
                    onClick={() => handleToggleReplies(commentId)}
                  >
                    Hide replies ({repliesCount})
                  </button>
                )}
              </div>
            )}

            {canRenderChildren && isOpen && combinedReplies.length > 0 && (
              <div className="comment-thread__children">
                <CommentsAndReplies
                  comments={combinedReplies}
                  postId={postId}
                  postAuthorId={postAuthorId}
                  depth={depth + 1}
                  maxDepth={maxDepth}
                  onToggleLikeComment={onToggleLikeComment}
                  onToggleDislikeComment={onToggleDislikeComment}
                  onToggleBookmarkComment={onToggleBookmarkComment}
                  onRegisterCommentView={onRegisterCommentView}
                  onReplyCreated={onReplyCreated}
                />
              </div>
            )}

            {showMoreBtn && (
              <div className="comment-thread__more-row">
                <button
                  type="button"
                  className="link-btn comment-thread__toggle-btn comment-thread__toggle-btn--show  comment-thread__more-btn"
                  onClick={() => handleShowMoreReplies(commentId)}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? "Loading..." : "Show more replies"}
                </button>
              </div>
            )}

            {!canRenderChildren && (previewCount > 0 || serverSaysHasMore) && (
              <div className="comment-thread__depth-guard">Replies hidden (max depth reached).</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CommentsAndReplies;
