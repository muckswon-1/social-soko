// src/menu/posts/components/CommentThread.jsx

import React, { useCallback, useMemo, useState } from "react";
import Comment from "./Comment";
import CreateCommentForm from "./CreateCommentForm";
import { sortBy } from "../../../utils/sortBy";

/**
 * @typedef {import("../../../types/comment").Comment} CommentType
 */

/**
 * Normalize replies field into an array
 * @param {any} replies
 * @returns {CommentType[]}
 */
const safeReplies = (replies) => (Array.isArray(replies) ? replies : []);

/**
 * Recursive Comment Thread renderer.
 *
 * Works with the server response shape you showed:
 * - comment.replies: Comment[]
 * - each reply can have its own .replies array, etc.
 *
 * @param {{
 *  comments: CommentType[];
 *  postId: string;
 *  postAuthorId?: string | null;
 *  depth?: number;
 *  maxDepth?: number;
 *
 *  onToggleLikeComment?: (comment: CommentType) => void;
 *  onToggleDislikeComment?: (comment: CommentType) => void;
 *  onToggleBookmarkComment?: (comment: CommentType) => void;
 *  onRegisterCommentView?: (comment: CommentType, source: "thread" | "modal") => void;
 *
 *  onReplyCreated?: (parentId: string, newReply: CommentType) => void;
 * }} props
 */
function CommentThread({
  comments,
  postId,
  postAuthorId = null,
  depth = 0,
  maxDepth = 6,

  onToggleLikeComment,
  onToggleDislikeComment,
  onToggleBookmarkComment,
  onRegisterCommentView,

  onReplyCreated,
}) {
  // single "active reply" box (by comment id) for this thread level
  const [activeReplyToId, setActiveReplyToId] = useState(/** @type {string | null} */ (null));

  

  // per-comment collapse state
  const [collapsed, setCollapsed] = useState(/** @type {Record<string, boolean>} */ ({}));

//   const list = useMemo(() => sortBy(comments), [comments]);
const list = comments;

console.log("list in comment thread",list);

  const handleReply = useCallback((comment) => {
    setActiveReplyToId((prev) => (prev === comment.id ? null : comment.id));
  }, []);

  const handleCancelReply = useCallback(() => setActiveReplyToId(null), []);

  const toggleCollapse = useCallback((commentId) => {
    setCollapsed((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  }, []);

  const handleCreatedReply = useCallback(
    (parentId, newReply) => {
      onReplyCreated?.(parentId, newReply);
      setActiveReplyToId(null);
    },
    [onReplyCreated]
  );

  console.log("Before return")

  if (!Array.isArray(list) || list.length === 0) return null;

  console.log("After return");

  return (
    // <div className={depth === 0 ? "comment-thread" : "comment-thread comment-thread--nested"}>
    //   {list.map((comment) => {
    //     const commentId = comment?.id;
    //     if (!commentId) return null;

    //     const replies = safeReplies(comment.replies);
    //     const hasReplies = replies.length > 0;

    //     const isCollapsed = collapsed[commentId] === true;
    //     const isReplying = activeReplyToId === commentId;

    //     const canRenderChildren = depth < maxDepth;

    //     return (
    //       <div key={commentId} className="comment-thread__item">
    //         <Comment
    //           comment={comment}
    //           depth={depth}
    //           postAuthorId={postAuthorId}
    //           onReply={handleReply}
    //           onCancelReply={handleCancelReply}
    //           isReplying={isReplying}
    //           onToggleLikeComment={onToggleLikeComment}
    //           onToggleDislikeComment={onToggleDislikeComment}
    //           onToggleBookmarkComment={onToggleBookmarkComment}
    //           onRegisterCommentView={onRegisterCommentView}
    //         />

    //         {/* Reply box (under the comment) */}
    //         {isReplying && (
    //           <div className="comment-thread__reply-form">
    //             <CreateCommentForm
    //               postId={postId}
    //               parentCommentId={commentId}
    //               autoFocus
    //               submitLabel="Reply"
    //               onCancel={handleCancelReply}
    //               onSubmit={(newReply) => handleCreatedReply(commentId, newReply)}
    //             />
    //           </div>
    //         )}

    //         {/* Replies header row */}
    //         {hasReplies && canRenderChildren && (
    //           <div className="comment-thread__children-header">
    //             <button
    //               type="button"
    //               className="comment-thread__collapse-btn"
    //               onClick={() => toggleCollapse(commentId)}
    //             >
    //               {isCollapsed ? "Show replies" : "Hide replies"} ({replies.length})
    //             </button>
    //           </div>
    //         )}

    //         {/* Recursive children */}
    //         {hasReplies && canRenderChildren && !isCollapsed && (
    //           <div className="comment-thread__children">
    //             <CommentThread
    //               comments={replies}
    //               postId={postId}
    //               postAuthorId={postAuthorId}
    //               depth={depth + 1}
    //               maxDepth={maxDepth}
    //               onToggleLikeComment={onToggleLikeComment}
    //               onToggleDislikeComment={onToggleDislikeComment}
    //               onToggleBookmarkComment={onToggleBookmarkComment}
    //               onRegisterCommentView={onRegisterCommentView}
    //               onReplyCreated={onReplyCreated}
    //             />
    //           </div>
    //         )}

    //         {/* Depth guard */}
    //         {hasReplies && !canRenderChildren && (
    //           <div className="comment-thread__depth-guard">
    //             Replies hidden (max depth reached).
    //           </div>
    //         )}
    //       </div>
    //     );
    //   })}
    // </div>
    <p>Comments here</p>
  );
}

export default CommentThread;
