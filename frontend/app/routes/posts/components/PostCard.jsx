import React, { useEffect, useMemo, useRef } from "react";
import { formatRelativeTime, humanizePostType } from "../utils/postTransformers";
import { Link, useNavigate } from "react-router";

// SVG icons
import { ReactComponent as DirectionUpIcon } from "../../../assets/svg/direction-up.svg";
import { ReactComponent as BookmarkIcon } from "../../../assets/svg/bookmark.svg";
import { ReactComponent as ViewIcon } from "../../../assets/svg/view.svg";
import { ReactComponent as MoreHorizontalIcon } from "../../../assets/svg/more-horizontal.svg";
import { ReactComponent as MessageCircleDotsIcon } from "../../../assets/svg/message-circle-dots.svg";
import { ReactComponent as VerifiedIcon } from "../../../assets/svg/verified.svg";
import { ReactComponent as GoToIcon } from "../../../assets/svg/navigate-to.svg";
import useRequireAuthAction from "../../../hooks/useRequireAuthAction";

/**
 * @typedef {import("../../../types/post").PostOverview} PostOverview
 * @typedef {import("../../../types/post").PostDetail} PostDetail
 */

/**
 * @param {{
 *   post: PostOverview,
 *   onOpenDetails?: (post: PostDetail) => void,
 *   onToggleLikePost?: (post: PostDetail) => void
 *   onToggleDislikePost?: (post: PostDetail) => void
 *   onToggleBookmarkPost?: (post: PostDetail) => void
 *   onUpdatePostView?: (post: PostDetail, viewSource: "feed"|"modal"|"video") => void
 *   onGetVideoHandlers?: (post: PostDetail, viewSource: "feed"|"modal"|"video") => { onPlay: (e:any)=>void, onEnded:(e:any)=>void }
 * }} props
 */
function PostCard({
  post,
  onToggleLikePost,
  onToggleDislikePost,
  onOpenDetails,
  onToggleBookmarkPost,
  onUpdatePostView,
  onGetVideoHandlers,
}) {
  const isServer = typeof window === "undefined";

  const BACKEND_URL = isServer
    ? import.meta.env.VITE_API_URL_INTERNAL
    : import.meta.env.VITE_API_URL_BROWSER;

  const {
    id,
    title,
    content,
    imageUrls = [],
    videoUrls = [],
    createdAt,
    updatedAt,
    author,
    business,
    stats,
    postType,
    category,
    currentUserLiked,
    currentUserDisliked,
    currentUserBookmarked,
  } = post;




  const requireAuth = useRequireAuthAction();

  const likesCount = stats?.likesCount || 0;
  const commentsCount = stats?.commentsCount || 0;
  const viewsCount = stats?.viewsCount || 0;
  const bookmarksCount = stats?.bookmarksCount || 0;

  const displayBusinessName = business?.name || "Business";
  const businessSlug = business?.slug || "business";
  const businessVerified = business?.isBusinessVerified || false;

  const authorName = author
    ? [author.firstName, author.lastName].filter(Boolean).join(" ") || "Member"
    : "Member";

  const authorId = author?.id || null;

  const relativeTime = formatRelativeTime(createdAt || updatedAt);
  const postTypeLabel = useMemo(() => humanizePostType(postType), [postType]);

  const hasText = Boolean(content && String(content).trim().length);
  const hasImages = Array.isArray(imageUrls) && imageUrls.length > 0;
  const hasVideos = Array.isArray(videoUrls) && videoUrls.length > 0;
  const hasMedia = hasVideos || hasImages;

  const mainMedia = useMemo(() => {
    if (hasVideos) return { type: "video", path: videoUrls[0] };
    if (hasImages) return { type: "image", path: imageUrls[0] };
    return null;
  }, [hasVideos, hasImages, videoUrls, imageUrls]);

  const mainMediaUrl =
    mainMedia && mainMedia.path ? `${BACKEND_URL}${mainMedia.path}` : null;

  const cardRef = useRef(null);

  const videoHandlers = useMemo(() => {
    if (!onGetVideoHandlers) return { onPlay: () => {}, onEnded: () => {} };
    return (
      onGetVideoHandlers(post, "feed") || { onPlay: () => {}, onEnded: () => {} }
    );
  }, [onGetVideoHandlers, post]);

  const openDetails = (e) => {
    e?.stopPropagation?.();
    onOpenDetails?.(post);
  };

  const handleCommentsClick = (e) => {
    e.stopPropagation();
    onOpenDetails?.(post);
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    // later: menu
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!cardRef.current) return;
    if (!post?.id) return;

    const node = cardRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries?.[0];
        if (!entry) return;

        if (entry.isIntersecting) {
          onUpdatePostView?.(post, "feed");
          observer.disconnect();
        }
      },
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [post?.id, onUpdatePostView, post]);

  return (
    <article
      ref={cardRef}
      className="post-card"
      data-post-id={id}
      data-has-media={hasMedia ? "true" : "false"}
      data-has-text={hasText ? "true" : "false"}
    >
      {/* CLICKABLE REGION (everything above footer) */}
      <div
        className="post-click"
        role="button"
        tabIndex={0}
        onClick={openDetails}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") openDetails(e);
        }}
        aria-label="Open post details"
      >
        {/* Hover pill (like your screenshot) */}
        <div className="post-click__hoverCta" aria-hidden="true">
          <span className="post-click__hoverCtaPill">
            View More Details <GoToIcon className="icon-svg icon-svg--sm" />
          </span>
        </div>

        {/* META */}
        <header className="post-meta">
          <div className="post-meta__left">
            <div className="post-meta__row post-meta__row--business">
              <Link
                to={`/business/${businessSlug}`}
                className="post-meta__businessNameLink"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Open business ${displayBusinessName}`}
              >
                <span className="post-meta__businessName">
                  {displayBusinessName}
                </span>

                {businessVerified ? (
                  <span
                    className="post-meta__verified has-tooltip"
                    data-tooltip="Verified business"
                    aria-label="Verified business"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <VerifiedIcon className="icon-svg icon-svg--md" />
                  </span>
                ) : null}
              </Link>
            </div>

            <div className="post-meta__row post-meta__row--author">
              {authorId ? (
                <Link
                  to={`/users/${authorId}`}
                  className="post-meta__authorLink"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Open user ${authorName}`}
                >
                  {authorName}
                </Link>
              ) : (
                <span className="post-meta__authorText">{authorName}</span>
              )}
            </div>

            <div className="post-meta__row post-meta__row--time">
              {relativeTime ? (
                <time className="post-meta__time">{relativeTime}</time>
              ) : null}
            </div>
          </div>

          <div className="post-meta__right">
            <button
              type="button"
              className="post-meta__moreBtn has-tooltip"
              data-tooltip="More Actions"
              onClick={handleMoreClick}
              aria-label="More actions"
            >
              <MoreHorizontalIcon className="icon-svg icon-svg--md" />
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <div className="post-content">
          {title ? <h3 className="post-content__title">{title}</h3> : null}

          {hasText ? (
            <div className="post-content__text">
              <p className="post-content__textInner">{content}</p>
            </div>
          ) : null}

          {hasMedia && mainMedia && mainMediaUrl ? (
            <div className="post-media" data-type={mainMedia.type}>
              {mainMedia.type === "video" ? (
                <video
                  className="post-media__el"
                  src={mainMedia}
                  controls
                  preload="metadata"
                  onClick={(e) => e.stopPropagation()}
                  onPlay={(e) => {
                    e.stopPropagation();
                    videoHandlers.onPlay(e);
                  }}
                  onEnded={(e) => {
                    e.stopPropagation();
                    videoHandlers.onEnded(e);
                  }}
                />
              ) : (
                <img
                  src={mainMediaUrl}
                  alt={title || "Post media"}
                  className="post-media__el"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* ACTIONS (NOT CLICKABLE FOR DETAILS) */}
      <footer className="post-actions" aria-label="Post actions">
        <div className="post-actions__group post-actions__group--vote">
          <button
            type="button"
            className={
              "post-actions__btn post-actions__btn--vote has-tooltip" +
              (currentUserLiked ? " post-actions__btn--active" : "")
            }
            data-tooltip={currentUserLiked ? "Liked" : "Like"}
            onClick={requireAuth(() => {onToggleLikePost?.(post)}, {title: "Login to like posts", message: "You need to be logged in to like posts"})}
            aria-label="Like"
          >
            <DirectionUpIcon className="icon-svg icon-svg--sm" />
          </button>

          <span className="post-actions__count" aria-label="Likes">
            {typeof likesCount === "number" ? likesCount : 0}
          </span>

          <button
            type="button"
            className={
              "post-actions__btn post-actions__btn--vote has-tooltip" +
              (currentUserDisliked ? " post-actions__btn--active" : "")
            }
            data-tooltip={currentUserDisliked ? "Disliked" : "Dislike"}
            onClick={requireAuth(() => {onToggleDislikePost?.(post)},{title: "Login to dislike posts", message: "You need to be logged in to dislike posts"})}
            aria-label="Dislike"
          >
            <DirectionUpIcon className="icon-svg icon-svg--sm icon-svg--dislike icon-svg--rotate-180" />
          </button>
        </div>

        <button
          type="button"
          className="post-actions__btn has-tooltip"
          data-tooltip="Comments"
          onClick={handleCommentsClick}
        >
          <MessageCircleDotsIcon className="icon-svg icon-svg--sm" />
          <span className="post-actions__label">
            {typeof commentsCount === "number" ? commentsCount : 0}
          </span>
        </button>

        <button
          type="button"
          className={
            "post-actions__btn has-tooltip" +
            (currentUserBookmarked ? " post-actions__btn--active" : "")
          }
          data-tooltip={currentUserBookmarked ? "Saved" : "Save"}
          onClick={requireAuth(() => {onToggleBookmarkPost?.(post)}, {title: "Login to save posts", message: "You need to be logged in to save posts"})}
        >
          <BookmarkIcon className="icon-svg icon-svg--sm" />
          <span className="post-actions__label">
            {typeof bookmarksCount === "number" ? bookmarksCount : 0}
          </span>
        </button>

        <span
          className="post-actions__views has-tooltip"
          data-tooltip="Views"
          aria-label="Views"
        >
          <ViewIcon className="icon-svg icon-svg--sm" />
          <span className="post-actions__viewsLabel">
            {typeof viewsCount === "number" ? viewsCount : 0}
          </span>
        </span>
      </footer>
    </article>
  );
}

export default PostCard;
