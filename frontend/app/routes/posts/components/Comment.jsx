// src/menu/posts/components/Comment.jsx

import React, { useMemo } from "react";
import "../../../styles/posts/post-comments.css";
import { formatRelativeTime } from "../utils/postTransformers";

/**
 * @typedef {import("../../../types/comment").Comment} CommentType
 */

const isServer = typeof window === "undefined";

const BACKEND_URL = isServer
  ? import.meta.env.VITE_API_URL_INTERNAL
  : import.meta.env.VITE_API_URL_BROWSER;

const normaliseMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BACKEND_URL}${url}`;
};

// SVG icons
import { ReactComponent as DirectionUpIcon } from "../../../assets/svg/direction-up.svg";
import { ReactComponent as BookmarkIcon } from "../../../assets/svg/bookmark.svg";
import { ReactComponent as ViewIcon } from "../../../assets/svg/view.svg";
import { ReactComponent as MoreHorizontalIcon } from "../../../assets/svg/more-horizontal.svg";
import { ReactComponent as MessageCircleDotsIcon } from "../../../assets/svg/message-circle-dots.svg";
import useRequireAuthAction from "../../../hooks/useRequireAuthAction";

/**
 * @param {{
 *   comment: CommentType;
 *   depth?: number;
 *   postAuthorId?: string | null;
 *   onReply?: (comment: CommentType) => void;
 *   onCancelReply?: () => void;
 *   isReplying?: boolean;
 *   onToggleLikeComment?: (comment: CommentType) => void;
 *   onToggleDislikeComment?: (comment: CommentType) => void;
 *   onToggleBookmarkComment?: (comment: CommentType) => void;
 *   onRegisterCommentView?: (comment: CommentType, source: "thread" | "modal") => void;
 * }} props
 */
function Comment({
  comment,
  depth = 0,
  postAuthorId,
  onReply,
  onCancelReply,
  isReplying = false,
  onToggleLikeComment,
  onToggleDislikeComment,
  onToggleBookmarkComment,
  onRegisterCommentView,
}) {
  const {
    id,
    author,
    content,
    imageUrls = [],
    videoUrls = [],
    createdAt,
    stats,
    currentUserLiked,
    currentUserDisliked,
    currentUserBookmarked,
  } = comment || {};


  console.log(onToggleLikeComment);

  const authorName = author
    ? [author.firstName, author.lastName].filter(Boolean).join(" ") || "Member"
    : "Member";

  const authorInitials = author
    ? ((author.firstName?.[0] || "") + (author.lastName?.[0] || "")).toUpperCase() || "M"
    : "M";

  const relativeTime = createdAt ? formatRelativeTime(createdAt) : null;

  const normalisedAuthorAvatarUrl =
    author?.avatarUrl != null ? normaliseMediaUrl(author.avatarUrl) : null;

  const normalisedImageUrls = Array.isArray(imageUrls)
    ? imageUrls.map((url) => normaliseMediaUrl(url)).filter(Boolean)
    : [];

  const normalisedVideoUrls = Array.isArray(videoUrls)
    ? videoUrls.map((url) => normaliseMediaUrl(url)).filter(Boolean)
    : [];

  const hasImages = normalisedImageUrls.length > 0;
  const hasVideos = normalisedVideoUrls.length > 0;
  const hasMedia = hasImages || hasVideos;

  const isPostAuthor = !!postAuthorId && !!author?.id && author.id === postAuthorId;

  const likeCount = typeof stats?.likesCount === "number" ? stats.likesCount : 0;
  const viewCount = typeof stats?.viewsCount === "number" ? stats.viewsCount : 0;

  const repliesCount = typeof stats?.repliesCount === "number" ? stats.repliesCount : 0;



  const requireAuth = useRequireAuthAction();

  const handleReplyClick = (e) => {
    e.stopPropagation();
    onReply?.(comment);
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    onToggleLikeComment?.(comment);
  };

  const handleDislikeClick = (e) => {
    e.stopPropagation();
    onToggleDislikeComment?.(comment);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    onToggleBookmarkComment?.(comment);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

  const handleRegisterView = (e) => {
    e?.stopPropagation?.();
    onRegisterCommentView?.(comment, "thread");
  };

  const likeBtnClass =
    "post-comment__actionBtn post-comment__actionBtn--vote" +
    (currentUserLiked ? " post-comment__actionBtn--likeActive" : "");

  const dislikeBtnClass =
    "post-comment__actionBtn post-comment__actionBtn--vote" +
    (currentUserDisliked ? " post-comment__actionBtn--dislikeActive" : "");

  const bookmarkBtnClass =
    "post-comment__actionBtn" +
    (currentUserBookmarked ? " post-comment__actionBtn--bookmarkActive" : "");

  return (
    <article
      className={[
        "post-comment",
        depth > 0 ? "post-comment--reply" : "",
        isReplying ? "post-comment--replying" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-comment-id={id}
      onMouseEnter={handleRegisterView}
    >
      {/* Avatar */}
      <div className="post-comment__avatar" aria-hidden="true">
        {normalisedAuthorAvatarUrl ? (
          <img
            src={normalisedAuthorAvatarUrl}
            alt={authorName}
            className="post-comment__avatarImg"
          />
        ) : (
          <span className="post-comment__avatarFallback">{authorInitials}</span>
        )}
      </div>

      {/* Body */}
      <div className="post-comment__body">
        {/* Header */}
        <header className="post-comment__header">
          <div className="post-comment__headerMain">
            <span className="post-comment__authorName">{authorName}</span>

            {isPostAuthor ? <span className="post-comment__badge">Author</span> : null}

            {relativeTime ? (
              <>
                <span className="post-comment__dot">•</span>
                <time className="post-comment__time">{relativeTime}</time>
              </>
            ) : null}
          </div>

          <button
            type="button"
            className="post-comment__menuBtn"
            onClick={handleMenuClick}
            aria-label="Comment options"
          >
            <MoreHorizontalIcon className="icon-svg icon-svg--sm" />
          </button>
        </header>

        {/* Content */}
        {content ? (
          <div className="post-comment__content">
            <p>{content}</p>
          </div>
        ) : null}

        {/* Media */}
        {hasMedia ? (
          <div className="post-comment__media">
            {hasImages
              ? normalisedImageUrls.map((url) => (
                  <div
                    key={url}
                    className="post-comment__mediaItem"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img src={url} alt="Comment media" />
                  </div>
                ))
              : null}

            {hasVideos
              ? normalisedVideoUrls.map((url) => (
                  <div
                    key={url}
                    className="post-comment__mediaItem"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <video src={url} controls preload="metadata" />
                  </div>
                ))
              : null}
          </div>
        ) : null}

        {/* Actions (Reddit-like) */}
        <div className="post-comment__actions">
          <div className="post-comment__voteGroup">
            <button
              type="button"
              className={likeBtnClass}
              onClick={requireAuth(
                () => {
                  console.log("Inside action")
                  onToggleLikeComment?.(comment);
                }

                
              )}
              aria-label="Like comment"
              title={currentUserLiked ? "Liked" : "Like"}
            >
              <DirectionUpIcon className="icon-svg icon-svg--sm" />
            </button>

            <span className="post-comment__voteCount" aria-label="Score">
              {likeCount}
            </span>

            <button
              type="button"
              className={dislikeBtnClass}
              onClick={handleDislikeClick}
              aria-label="Dislike comment"
              title={currentUserDisliked ? "Disliked" : "Dislike"}
            >
              <DirectionUpIcon className="icon-svg icon-svg--sm icon-svg--dislike" />
            </button>
          </div>

          <button
            type="button"
            className="post-comment__actionBtn"
            onClick={handleReplyClick}
            aria-label="Reply"
            title="Reply"
          >
            <MessageCircleDotsIcon className="icon-svg icon-svg--sm" />
            <span className="post-comment__actionLabel">
              {repliesCount > 0 ? repliesCount : "Reply"}
            </span>
          </button>

          <button
            type="button"
            className={bookmarkBtnClass}
            onClick={handleBookmarkClick}
            aria-label="Save"
            title={currentUserBookmarked ? "Saved" : "Save"}
          >
            <BookmarkIcon className="icon-svg icon-svg--sm" />
          </button>

          {isReplying ? (
            <button
              type="button"
              className="post-comment__actionBtn post-comment__actionBtn--cancel"
              onClick={(e) => {
                e.stopPropagation();
                onCancelReply?.();
              }}
              aria-label="Cancel reply"
              title="Cancel"
            >
              Cancel
            </button>
          ) : null}

          <span className="post-comment__views" title="Views" aria-label="Views">
            <ViewIcon className="icon-svg icon-svg--sm" />
            <span>{viewCount}</span>
          </span>
        </div>

        <div className="post-comment__threadSlot" />
      </div>
    </article>
  );
}

export default Comment;
