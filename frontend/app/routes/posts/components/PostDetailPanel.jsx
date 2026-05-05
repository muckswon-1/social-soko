// src/menu/posts/PostDetailPanel.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router";

import { selectedPostDetailSelectedPost } from "../../../features/posts/postsUISlice";
import { formatRelativeTime } from "../utils/postTransformers";
import { sortCommentsByDate } from "../../../utils/sortBy";
import CreateCommentForm from "./CreateCommentForm";
import CommentsAndReplies from "./CommentsAndReplies";

// SVG icons
import { ReactComponent as DirectionUpIcon } from "../../../assets/svg/direction-up.svg";
import { ReactComponent as BookmarkIcon } from "../../../assets/svg/bookmark.svg";
import { ReactComponent as ViewIcon } from "../../../assets/svg/view.svg";
import { ReactComponent as MessageCircleDotsIcon } from "../../../assets/svg/message-circle-dots.svg";
import { ReactComponent as VerifiedIcon } from "../../../assets/svg/verified.svg";
import { ReactComponent as LinkIcon } from "../../../assets/svg/navigate-to.svg";
import { ReactComponent as MoreHorizontalIcon } from "../../../assets/svg/more-horizontal.svg";
import { ReactComponent as BackIcon } from "../../../assets/svg/back.svg";
import { ReactComponent as UserIcon } from "../../../assets/svg/user.svg";

import useParentComments from "../../../hooks/posts/useParentComments";
import useRequireAuthAction from "../../../hooks/useRequireAuthAction";

/** @typedef {import("../../../types/post").PostDetail} PostDetail */
/** @typedef {import("../../../types/comment").Comment} Comment */

const safeReplies = (replies) => (Array.isArray(replies) ? replies : []);

const isServer = typeof window === "undefined";
const BACKEND_URL = isServer
  ? import.meta.env.VITE_API_URL_INTERNAL
  : import.meta.env.VITE_API_URL_BROWSER;

const normaliseMediaUrl = (url) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${BACKEND_URL}${url}`;
};

// keep existing order, append only new ids at the end
function mergeAppendById(prev, next) {
  const map = new Map();
  (Array.isArray(prev) ? prev : []).forEach((c) => c?.id && map.set(c.id, c));
  (Array.isArray(next) ? next : []).forEach((c) => {
    if (c?.id && !map.has(c.id)) map.set(c.id, c);
  });
  return Array.from(map.values());
}

// put new item first (if not exists), then keep existing order
function prependUniqueById(item, list) {
  const map = new Map();
  if (item?.id) map.set(item.id, item);
  (Array.isArray(list) ? list : []).forEach((c) => {
    if (c?.id && !map.has(c.id)) map.set(c.id, c);
  });
  return Array.from(map.values());
}

const PREVIEW_REPLY_LIMIT = 3;

// merges and caps the preview array so it stays "controller-like"
function mergeReplyPreview(existingReplies, newReply) {
  const map = new Map();
  if (newReply?.id) map.set(newReply.id, newReply);
  existingReplies.forEach((r) => {
    if (r?.id && !map.has(r.id)) map.set(r.id, r);
  });
  return Array.from(map.values()).slice(0, PREVIEW_REPLY_LIMIT);
}

// recursively insert a reply anywhere in the tree (top-level or nested)
function insertReplyIntoTree(comments, parentId, newReply) {
  if (!Array.isArray(comments) || !parentId || !newReply?.id) return comments;

  let changed = false;

  const next = comments.map((c) => {
    if (!c?.id) return c;

    if (c.id === parentId) {
      changed = true;

      const existingReplies = safeReplies(c.replies);
      const nextPreviewReplies = mergeReplyPreview(existingReplies, newReply);

      const prevRepliesCount = Number(c?.stats?.replies_count ?? 0);
      const nextRepliesCount = prevRepliesCount + 1;

      return {
        ...c,
        replies: nextPreviewReplies,
        stats: {
          ...(c?.stats ?? {}),
          replies_count: nextRepliesCount,
        },
        has_more_replies: nextRepliesCount > nextPreviewReplies.length,
      };
    }

    const childReplies = safeReplies(c.replies);
    if (childReplies.length === 0) return c;

    const nextChildReplies = insertReplyIntoTree(childReplies, parentId, newReply);
    if (nextChildReplies === childReplies) return c;

    changed = true;
    return { ...c, replies: nextChildReplies };
  });

  return changed ? next : comments;
}

// normalize strings for consistent matching
const normalize = (s) =>
  String(s ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .normalize("NFKC");

/**
 * Search comments (keeps thread structure):
 * - If a parent matches, include it (and only include replies that match)
 * - If only some replies match, include parent with matched replies
 * - Safe against missing author fields
 * @param {Comment[]} comments
 * @param {string} searchTerm
 * @returns {Comment[]}
 */
const searchComments = (comments, searchTerm) => {
  if (!Array.isArray(comments)) return [];
  const term = normalize(searchTerm);
  if (!term) return comments;

  return comments
    .map((comment) => {
      if (!comment) return null;

      const contentNorm = normalize(comment?.content);
      const authorFirstNorm = normalize(comment?.author?.firstName);
      const authorLastNorm = normalize(comment?.author?.lastName);

      const matchedReplies = Array.isArray(comment?.replies)
        ? searchComments(comment.replies, term)
        : [];

      const selfMatches =
        contentNorm.includes(term) ||
        authorFirstNorm.includes(term) ||
        authorLastNorm.includes(term);

      if (selfMatches || matchedReplies.length > 0) {
        return {
          ...comment,
          replies: matchedReplies, // keep only matched replies in results
        };
      }

      return null;
    })
    .filter(Boolean);
};

function PostDetailPanel({
  onClose,
  refetchPosts,
  onToggleLikePost,
  onToggleDislikePost,
  onToggleBookmarkPost,
 
  onGetVideoHandlers,
}) {
  /** @type {PostDetail} */
  const post = useSelector(selectedPostDetailSelectedPost);

  const requireAuth = useRequireAuthAction();

  /** @type {[PostDetail|null, React.Dispatch<React.SetStateAction<PostDetail|null>>]} */
  const [localPost, setLocalPost] = useState(post || null);
  const [searchTerm, setSearchTerm] = useState("");

  const panelRef = useRef(null);
  const sentinelRef = useRef(null);

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const isSearching = normalize(searchTerm).length > 0;

  const {
    comments: pageComments,
    hasMore,
    isLoading: isLoadingParentComments,
    loadMore,
    reset: resetParentComments,
    refetch: refetchParentComments,
    meta,
  } = useParentComments(localPost?.id, { initialLimit: 10 });

  /** @type {[Comment[], React.Dispatch<React.SetStateAction<Comment[]>>]} */
  const [allComments, setAllComments] = useState([]);
  const [oldestFirst, setOldestFirst] = useState(false);

  // lock to prevent spam calls
  const loadMoreLockRef = useRef(false);

  // only trigger when user scrolls DOWN
  const lastScrollTopRef = useRef(0);

  // Keep localPost in sync
  useEffect(() => {
    setLocalPost(post || null);
  }, [post]);

  // When switching posts, reset pagination + local accumulated comments
  useEffect(() => {
    if (!localPost?.id) return;
    setAllComments([]);
    resetParentComments?.();
    loadMoreLockRef.current = false;
    lastScrollTopRef.current = 0;
    setSearchTerm(""); // optional: clears search when switching posts (prevents confusing empty results)
  }, [localPost?.id, resetParentComments]);

  // Append newly fetched page comments into allComments (source-of-truth)
  useEffect(() => {
    if (!Array.isArray(pageComments) || pageComments.length === 0) return;
    setAllComments((prev) => mergeAppendById(prev, pageComments));
  }, [pageComments]);

  // Derived list (NEVER mutate allComments during search)
  const displayedComments = useMemo(() => {
    if (!isSearching) return allComments;
    return searchComments(allComments, searchTerm);
  }, [allComments, searchTerm, isSearching]);

  const renderComments = useMemo(() => {
    const order = oldestFirst ? "asc" : "desc";
    return sortCommentsByDate(displayedComments, order);
  }, [displayedComments, oldestFirst]);

  // Always compute video handlers (no conditional hooks)
  const videoHandlers = useMemo(() => {
    if (!localPost) return { onPlay: () => {}, onEnded: () => {} };

    return (
      onGetVideoHandlers?.(localPost, "postDetail") || {
        onPlay: () => {},
        onEnded: () => {},
      }
    );
  }, [localPost, onGetVideoHandlers]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = window.location.href;
      navigator.clipboard?.writeText(url).catch(() => undefined);
    }
  };

  const handleCreatedComment = useCallback(
    (newComment) => {
      if (!newComment?.id) return;

      setAllComments((prev) => prependUniqueById(newComment, prev));

      setLocalPost((prevPost) => {
        if (!prevPost) return prevPost;
        const prevCount = Number(prevPost?.stats?.commentsCount ?? 0);
        return {
          ...prevPost,
          stats: {
            ...(prevPost.stats ?? {}),
            commentsCount: prevCount + 1,
          },
        };
      });

      refetchPosts?.();
    },
    [refetchPosts]
  );

  const handleCreatedReply = useCallback(
    (parentId, newReply) => {
      if (!parentId || !newReply?.id) return;

      setAllComments((prev) => insertReplyIntoTree(prev, parentId, newReply));

      refetchParentComments?.();
      refetchPosts?.();
    },
    [refetchParentComments, refetchPosts]
  );

  /**
   * Infinite scroll:
   * - Works for either element scroll OR window scroll
   * - Only triggers on scroll DOWN
   * - Only triggers near bottom
   * - Disabled while searching (client-side filter)
   */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isSearching) return;

    /** @type {HTMLElement|null} */
    const el = panelRef.current;

    const getDocEl = () =>
      document.scrollingElement || document.documentElement || document.body;

    const isElementScrollable = (node) => {
      if (!node) return false;
      return node.scrollHeight > node.clientHeight + 4;
    };

    const useWindowScroll = !isElementScrollable(el);

    // tight thresholds so you basically reach end of loaded comments
    const BOTTOM_PX = 140;
    const NEAR_BOTTOM_RATIO = 0.93;

    const readScrollMetrics = () => {
      if (!useWindowScroll && el) {
        return {
          scrollTop: el.scrollTop,
          clientHeight: el.clientHeight,
          scrollHeight: el.scrollHeight,
        };
      }

      const docEl = getDocEl();
      const scrollTop = window.scrollY ?? docEl.scrollTop ?? 0;
      const clientHeight = window.innerHeight ?? docEl.clientHeight ?? 0;
      const scrollHeight = docEl.scrollHeight ?? 0;

      return { scrollTop, clientHeight, scrollHeight };
    };

    // baseline
    const initial = readScrollMetrics();
    lastScrollTopRef.current = initial.scrollTop;

    const maybeLoadMore = () => {
      const { scrollTop, clientHeight, scrollHeight } = readScrollMetrics();

      // only down
      const isScrollingDown = scrollTop > lastScrollTopRef.current;
      lastScrollTopRef.current = scrollTop;
      if (!isScrollingDown) return;

      // near bottom
      const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
      const ratio = (scrollTop + clientHeight) / Math.max(1, scrollHeight);
      const isNearBottom = distanceFromBottom <= BOTTOM_PX || ratio >= NEAR_BOTTOM_RATIO;
      if (!isNearBottom) return;

      if (!hasMore || isLoadingParentComments) return;
      if (loadMoreLockRef.current) return;

      loadMoreLockRef.current = true;
      Promise.resolve(loadMore?.()).finally(() => {
        loadMoreLockRef.current = false;
      });
    };

    if (useWindowScroll) {
      window.addEventListener("scroll", maybeLoadMore, { passive: true });
      return () => window.removeEventListener("scroll", maybeLoadMore);
    }

    if (el) {
      el.addEventListener("scroll", maybeLoadMore, { passive: true });
      return () => el.removeEventListener("scroll", maybeLoadMore);
    }
  }, [hasMore, isLoadingParentComments, loadMore, isSearching]);

  // Guard AFTER hooks, BEFORE destructuring
  if (!localPost) return null;

  const {
    id = null,
    title = "",
    content = "",
    imageUrls = [],
    videoUrls = [],
    business = null,
    stats = null,
    author = null,
    createdAt = null,
    updatedAt = null,
    currentUserLiked = false,
    currentUserDisliked = false,
    currentUserBookmarked = false,
  } = localPost;

  const displayBusinessName = business?.name || "Business";
  const businessSlug = business?.slug || "business";
  const businessVerified = business?.isBusinessVerified || false;

  const authorName = author
    ? [author.firstName, author.lastName].filter(Boolean).join(" ") || "Member"
    : "Member";

  const postAuthorId = author?.id || null;

  const relativeTime = formatRelativeTime(createdAt || updatedAt);

  const displayCommentsCount = stats?.commentsCount || 0;
  const displayLikeCount = stats?.likesCount || 0;
  const displayBookmarkCount = stats?.bookmarksCount || 0;
  const displayViews = typeof stats?.viewsCount === "number" ? stats.viewsCount : 0;

  const paragraphs = content ? content.split(/\n{2,}/) : [];

  const normalisedImageUrls = Array.isArray(imageUrls)
    ? imageUrls.map((u) => normaliseMediaUrl(u)).filter(Boolean)
    : [];

  const normalisedVideoUrls = Array.isArray(videoUrls)
    ? videoUrls.map((u) => normaliseMediaUrl(u)).filter(Boolean)
    : [];

  const hasImages = normalisedImageUrls.length > 0;
  const hasVideos = normalisedVideoUrls.length > 0;
  const hasMedia = hasImages || hasVideos;

  // Avatar (use icon if no url)
  const rawAvatarUrl = author?.avatarUrl || author?.photoUrl || author?.profileImageUrl || "";
  const normalisedAvatarUrl = rawAvatarUrl ? normaliseMediaUrl(rawAvatarUrl) : null;
  const showAvatarImage = Boolean(normalisedAvatarUrl);

  return (
    <div ref={panelRef} className="post-detail">
      <div className="post-detail__card">
        {/* TOP BAR */}
        <header className="post-detail-topbar" aria-label="Post detail header">
          <button
            type="button"
            className="post-detail-topbar__back"
            onClick={onClose}
            aria-label="Back"
          >
            <BackIcon className="icon-svg icon-svg--md" />
          </button>

          <div className="post-detail-topbar__titleWrap">
            <div className="post-detail-topbar__title">Post</div>
            {relativeTime ? <time className="post-detail-topbar__time">{relativeTime}</time> : null}
          </div>

          <button
            type="button"
            className="post-detail-topbar__more has-tooltip"
            data-tooltip="More Actions"
            onClick={(e) => e.stopPropagation()}
            aria-label="More Actions"
          >
            <MoreHorizontalIcon className="icon-svg icon-svg--md" />
          </button>
        </header>

        {/* META */}
        <section className="post-detail-meta" aria-label="Post meta">
          <div className="post-detail-meta__left">
            <Link className="post-detail-meta__business" to={`/business/${businessSlug}`}>
              {displayBusinessName}
              {businessVerified ? (
                <span
                  className="post-detail-meta__verified"
                  title="Verified business"
                  aria-label="Verified business"
                >
                  <VerifiedIcon className="icon-svg icon-svg--sm" />
                </span>
              ) : null}
            </Link>

            <div className="post-detail-meta__author">
              <div className="post-detail-meta__avatar" aria-label="Author avatar">
                {showAvatarImage ? (
                  <img
                    src={normalisedAvatarUrl}
                    alt={authorName}
                    loading="lazy"
                    className="post-detail-meta__avatarImg"
                  />
                ) : (
                  <UserIcon className="icon-svg icon-svg--md" />
                )}
              </div>

              <div className="post-detail-meta__authorInfo">
                {postAuthorId ? (
                  <Link className="post-detail-meta__authorName" to={`/users/${postAuthorId}`}>
                    {authorName}
                  </Link>
                ) : (
                  <span className="post-detail-meta__authorName">{authorName}</span>
                )}
              </div>
            </div>

            <div className="post-detail-meta__time">business-slug: {businessSlug}</div>
          </div>
        </section>

        {/* TITLE */}
        {title ? <h1 className="post-detail-title">{title}</h1> : null}

        {/* MEDIA */}
        {hasMedia ? (
          <section className="post-detail-media">
            {normalisedImageUrls.map((url) => (
              <img key={url} src={url} alt={title || "Post image"} loading="lazy" />
            ))}

            {normalisedVideoUrls.map((url) => (
              <video
                key={url}
                src={url}
                controls
                preload="metadata"
                onPlay={(e) => {
                  e.stopPropagation();
                  videoHandlers.onPlay(e);
                }}
                onEnded={(e) => {
                  e.stopPropagation();
                  videoHandlers.onEnded(e);
                }}
              />
            ))}
          </section>
        ) : null}

        {/* BODY */}
        <main className="post-detail-body">
          {paragraphs.length > 0
            ? paragraphs.map((para, idx) => <p key={idx}>{para}</p>)
            : content
            ? <p>{content}</p>
            : null}
        </main>

        {/* ACTIONS */}
        <footer className="post-detail-actions" aria-label="Post actions">
          <div className="post-detail-actions__actionsRow">
            <div className="post-detail-actions__group post-detail-actions__group--vote">
              <button
                type="button"
                className={
                  "post-detail-actions__btn post-detail-actions__btn--vote has-tooltip" +
                  (currentUserLiked ? " post-detail-actions__btn--active" : "")
                }
                data-tooltip={currentUserLiked ? "Liked" : "Like"}
                onClick={requireAuth(
                  () => onToggleLikePost?.(post),
                  { title: "Login to like posts", message: "You need to be logged in to like posts" }
                )}
                aria-label="Like"
              >
                <DirectionUpIcon className="icon-svg icon-svg--sm" />
              </button>

              <span className="post-detail-actions__count" aria-label="Likes">
                {typeof displayLikeCount === "number" ? displayLikeCount : 0}
              </span>

              <button
                type="button"
                className={
                  "post-detail-actions__btn post-detail-actions__btn--vote has-tooltip" +
                  (currentUserDisliked ? " post-detail-actions__btn--active" : "")
                }
                data-tooltip={currentUserDisliked ? "Disliked" : "Dislike"}
                onClick={requireAuth(
                  () => onToggleDislikePost?.(post),
                  {
                    title: "Login to dislike posts",
                    message: "You need to be logged in to dislike posts",
                  }
                )}
                aria-label="Dislike"
              >
                <DirectionUpIcon className="icon-svg icon-svg--sm icon-svg--dislike icon-svg--rotate-180" />
              </button>
            </div>

            <button
              type="button"
              className="post-detail-actions__btn has-tooltip"
              data-tooltip="Comments"
              onClick={() => {}}
              aria-label="Comments"
            >
              <MessageCircleDotsIcon className="icon-svg icon-svg--sm" />
              <span className="post-detail-actions__label">
                {typeof displayCommentsCount === "number" ? displayCommentsCount : 0}
              </span>
            </button>

            <button
              type="button"
              className={
                "post-detail-actions__btn has-tooltip" +
                (currentUserBookmarked ? " post-detail-actions__btn--active" : "")
              }
              data-tooltip={currentUserBookmarked ? "Saved" : "Save"}
              onClick={requireAuth(
                () => onToggleBookmarkPost?.(post),
                { title: "Login to save posts", message: "You need to be logged in to save posts" }
              )}
              aria-label="Save"
            >
              <BookmarkIcon className="icon-svg icon-svg--sm" />
              <span className="post-detail-actions__label">
                {typeof displayBookmarkCount === "number" ? displayBookmarkCount : 0}
              </span>
            </button>

            <button
              type="button"
              className="post-detail-actions__btn has-tooltip"
              data-tooltip="Copy link"
              onClick={handleCopyLink}
              aria-label="Copy link"
            >
              <LinkIcon className="icon-svg icon-svg--sm" />
              <span className="post-detail-actions__label">Copy</span>
            </button>

            <span
              className="post-detail-actions__views has-tooltip"
              data-tooltip="Views"
              aria-label="Views"
            >
              <ViewIcon className="icon-svg icon-svg--sm" />
              <span className="post-detail-actions__viewsLabel">
                {typeof displayViews === "number" ? displayViews : 0}
              </span>
            </span>
          </div>
        </footer>

        {/* COMMENTS */}
        <section className="post-detail-comments">
          <CreateCommentForm postId={id} onSubmit={handleCreatedComment} />

          <div className="post-detail-comments__header">
            <span className="post-detail-comments__count">{displayCommentsCount} comments</span>

            <div className="post-detail-comments__header-actions">
              <div className="post-detail-comments__sort">
                <label htmlFor="sort-comments" className="post-detail-comments__sort-label">
                  Sort by:
                </label>
                <select
                  name="sort-comments"
                  id="sort-comments"
                  className="post-detail-comments__sort-select"
                  value={oldestFirst ? "oldest" : "newest"}
                  onChange={(e) => setOldestFirst(e.target.value === "oldest")}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>

              <div className="post-detail-comments__search">
                <form
                  className="post-detail-comments__search-form"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    type="text"
                    className="post-detail-comments__search-input"
                    placeholder="Search comments"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </form>
              </div>
            </div>
          </div>

          <div>
            {renderComments.length === 0 ? (
              <div className="post-detail-comments__empty">
                <MessageCircleDotsIcon className="icon-svg icon-svg--sm" />
                <span className="post-detail-comments__empty-text">
                  {isSearching
                    ? "No comments match your search."
                    : "Be the first to start the conversation."}
                </span>
              </div>
            ) : (
              <CommentsAndReplies
                comments={renderComments}
                postAuthorId={postAuthorId}
                onReplyCreated={handleCreatedReply}
                postId={id}
              />
            )}

            <div ref={sentinelRef} style={{ height: 1 }} />

            {!isSearching && isLoadingParentComments ? (
              <div className="post-detail-comments__empty">Loading more comments...</div>
            ) : null}

            {!isSearching && !isLoadingParentComments && hasMore ? (
              <button
                type="button"
                className="post-detail-comments__showMoreBtn btn btn-secondary"
                onClick={loadMore}
              >
                Show more comments
              </button>
            ) : null}

            {!isSearching && !hasMore && meta?.totalItems > 0 ? (
              <div className="post-detail-comments__empty">You reached the end.</div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}

export default PostDetailPanel;
