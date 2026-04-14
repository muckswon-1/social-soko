/**
 * @typedef {import("../../types/post").PostDetail} PostDetail
 * @typedef {import("../../types/post").PostStats} PostStats
 */

import { useCallback, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  closePostComposer,
  closePostDetail,
  openPostComposer,
  openPostDetail,
  setSelectedPost,
} from "../../features/posts/postsUISlice";
import {
  postsApi,
  useBookmarkPostMutation,
  useCreatePostViewMutation,
  useDislikePostMutation,
  useLikePostMutation,
} from "../../services/postsApi";
import {
  createOptimisticPostView,
  optimisticDisLikePost,
  optimisticLikePost,
  optimisticToggleBookmarkPost,
} from "./postActionUtils";
import {
  createClientEventId,
  getSessionId,
  oncePerSession,
} from "../../shared/sessionIdUtils";

/**
 * @typedef {"fromPostCard" | "fromPostDetail"} PostActionContext
 * @typedef {"feed" | "modal" | "video"} ViewSource
 *
 * @typedef {(nextPost: PostDetail) => void} ApplySelectedPost
 * @typedef {(postId: string, updater: (target: PostDetail) => void) => void} ApplyFeedCache
 *
 * @typedef {{
 *   onPlay: (e: any) => void;
 *   onEnded: (e?: any) => void;
 * }} VideoHandlers
 *
 * @typedef {{ ended: boolean; countedAtStart: boolean }} VideoState
 */

/**
 * Centralised post UI + server actions.
 *
 * - Keeps feed cache and selected post in sync
 * - Provides optimistic updates for like/dislike/bookmark
 * - Tracks post views (feed/modal/video) with session gating
 * - Provides per-post video handlers that count replays as new views (TikTok-style)
 *
 * @returns {{
 *   openComposer: () => void;
 *   closeComposer: () => void;
 *   openDetail: (post: PostDetail) => void;
 *   closeDetail: () => void;
 *   toggleLikePost: (post: PostDetail, postLikeContext?: PostActionContext) => Promise<any>;
 *   toggleDislikePost: (post: PostDetail, postLikeContext?: PostActionContext) => Promise<any>;
 *   toggleBookmarkPost: (post: PostDetail, postLikeContext?: PostActionContext) => Promise<any>;
 *   handleDeletePost: (postId: string) => Promise<void>;
 *   handleMutePost: (postId: string) => Promise<void>;
 *   handleReportPost: (postId: string, reason: string) => Promise<void>;
 *   handleUpdatePostView: (post: PostDetail, viewSource: ViewSource, postViewContext?: PostActionContext) => Promise<any>;
 *   getVideoHandlers: (post: PostDetail, postViewContext?: PostActionContext) => VideoHandlers;
 * }}
 */
export default function usePostActions() {
  const dispatch = useDispatch();

  /**
   * Update the "selected post" UI state.
   *
   * @type {ApplySelectedPost}
   */
  const applyToSelectedPost = useCallback(
    (nextPost) => {
      dispatch(setSelectedPost(nextPost));
    },
    [dispatch],
  );

  /**
   * Apply an update function to the cached post in the feed query cache.
   * Uses RTK Query `updateQueryData` to mutate cache safely.
   *
   * @type {ApplyFeedCache}
   */
  const applyToFeedCache = useCallback(
    (postId, updater) => {
      dispatch(
        postsApi.util.updateQueryData(
          "getPosts",
          undefined,
          /**
           * @param {{posts: PostDetail[], meta: import('./usePostsFeed').FeedMeta}} draft
           */
          (draft) => {
            if (!draft?.posts) return;

            const target = draft.posts.find((p) => p.id === postId);
            if (!target) return;

            updater(target);
          },
        ),
      );
    },
    [dispatch],
  );

  const [likePost] = useLikePostMutation();
  const [dislikePost] = useDislikePostMutation();
  const [bookmarkPost] = useBookmarkPostMutation();
  const [createPostView] = useCreatePostViewMutation();


  /**
   * Open the post details modal.
   *
   * @param {PostDetail} post
   * @returns {void}
   */
  const openDetail = (post) => {
    dispatch(openPostDetail(post));
  };

  /**
   * Close the post details modal.
   *
   * @returns {void}
   */
  const closeDetail = () => {
    dispatch(closePostDetail());
  };

  /**
   * Open the post composer.
   *
   * @returns {void}
   */
  const openComposer = () => {
    dispatch(openPostComposer());
  };

  /**
   * Close the post composer.
   *
   * @returns {void}
   */
  const closeComposer = () => {
    dispatch(closePostComposer());
  };

  /**
   * Optimistically like a post (switch behavior lives server-side; UI assumes like wins).
   *
   * - Ignores if already liked
   * - Ensures dislike state is cleared optimistically
   *
   * @param {PostDetail} post
   * @param {PostActionContext} [postLikeContext="fromPostCard"]
   * @returns {Promise<any>}
   */
  const toggleLikePost = useCallback(
    async (post, postLikeContext = "fromPostCard") => {
      return optimisticLikePost({
        post,
        likeRequest: (postId) => likePost(postId).unwrap(),
        apply: (nextPost) => {
          applyToFeedCache(nextPost.id, (target) => {
            target.currentUserLiked = nextPost?.currentUserLiked ?? false;
            target.currentUserDisliked = nextPost?.currentUserDisliked ?? false;

            target.stats = target.stats || {};
            target.stats.likesCount =
              nextPost?.stats?.likesCount ?? target.stats.likesCount;
          });

          if (postLikeContext === "fromPostDetail") {
            applyToSelectedPost(nextPost);
          }
        },
        buildOptimistic: (p) => ({
          ...p,
          currentUserLiked: true,
          currentUserDisliked: false,
          stats: {
            ...p?.stats,
            likesCount: (p?.stats?.likesCount ?? 0) + 1,
          },
        }),
        shouldIgnore: (p) => !!p?.currentUserLiked,
      });
    },
    [likePost, applyToFeedCache, applyToSelectedPost],
  );

  /**
   * Optimistically dislike a post.
   *
   * - Ignores if already disliked
   * - Clears like optimistically and decrements likesCount (never below 0)
   *
   * @param {PostDetail} post
   * @param {PostActionContext} [postLikeContext="fromPostCard"]
   * @returns {Promise<any>}
   */
  const toggleDislikePost = useCallback(
    async (post, postLikeContext = "fromPostCard") => {
      return optimisticDisLikePost({
        post,
        dislikeRequest: dislikePost,
        apply: (nextPost) => {
          if(!nextPost) return;

          applyToFeedCache(nextPost.id, (target) => {
            // NOTE: fix: should set currentUserDisliked, not currentUserLiked
            target.currentUserLiked = nextPost?.currentUserLiked ?? false;
            target.currentUserDisliked = nextPost?.currentUserDisliked ?? false;

            target.stats = target.stats || {};
            target.stats.likesCount =
              nextPost?.stats?.likesCount ?? target.stats.likesCount;
          });

          if (postLikeContext === "fromPostDetail") {
            applyToSelectedPost(nextPost);
          }
        },
        buildOptimistic: (p) => ({
          ...p,
          currentUserLiked: false,
          currentUserDisliked: true,
          stats: {
            ...p?.stats,
            likesCount: Math.max(0, (p?.stats?.likesCount ?? 0) - 1),
          },
        }),
        shouldIgnore: (p) => !!p?.currentUserDisliked,
      });
    },
    [dislikePost, applyToFeedCache, applyToSelectedPost],
  );

  /**
   * Optimistically toggle bookmark on a post.
   *
   * @param {PostDetail} post
   * @param {PostActionContext} [postLikeContext="fromPostCard"]
   * @returns {Promise<any>}
   */
  const toggleBookmarkPost = useCallback(
    (post, postLikeContext = "fromPostCard") => {
      return optimisticToggleBookmarkPost({
        post,
        bookmarkRequest: (postId) => bookmarkPost(postId).unwrap(),
        apply: (nextPost) => {
          applyToFeedCache(nextPost.id, (target) => {
            target.currentUserBookmarked =
              nextPost?.currentUserBookmarked ?? false;

            target.stats = target.stats || {};
            target.stats.bookmarksCount =
              nextPost?.stats?.bookmarksCount ?? target.stats.bookmarksCount;
          });

          if (postLikeContext === "fromPostDetail") {
            applyToSelectedPost(nextPost);
          }
        },
        buildOptimistic: (p) => {
          const currently = !!p?.currentUserBookmarked;
          const nextCount = currently
            ? Math.max(0, (p.stats?.bookmarksCount ?? 0) - 1)
            : (p.stats?.bookmarksCount ?? 0) + 1;

          return {
            ...p,
            currentUserBookmarked: !currently,
            stats: {
              ...p?.stats,
              bookmarksCount: nextCount,
            },
          };
        },
        shouldIgnore: () => false,
      });
    },
    [bookmarkPost, applyToFeedCache, applyToSelectedPost],
  );

  /**
   * Placeholder (future): delete a post.
   *
   * @param {string} postId
   * @returns {Promise<void>}
   */
  const handleDeletePost = async (postId) => {
    console.log("Post Deleted", postId);
  };

  /**
   * Placeholder (future): mute a post.
   *
   * @param {string} postId
   * @returns {Promise<void>}
   */
  const handleMutePost = async (postId) => {
    console.log("Post muted", postId);
  };

  /**
   * Placeholder (future): report a post.
   *
   * @param {string} postId
   * @param {string} reason
   * @returns {Promise<void>}
   */
  const handleReportPost = async (postId, reason) => {
    console.log("Post reported", postId, reason);
  };

  /**
   * Track a post view with optimistic UI update.
   *
   * Rules:
   * - feed/modal: once per session per post per source (sessionStorage gate)
   * - video: first play from start counts; replay after ending counts again (TikTok style)
   *
   * @param {PostDetail} post
   * @param {ViewSource} viewSource
   * @param {PostActionContext} [postViewContext="fromPostCard"]
   * @returns {Promise<any>}
   */
  const handleUpdatePostView = useCallback(
    async (post, viewSource, postViewContext = "fromPostCard") => {
      if (!post?.id) return;

      const sessionId = getSessionId();
      if (!sessionId) return;

      if (viewSource === "feed" || viewSource === "modal") {
        const key = `views:${viewSource}:${post.id}`;
        const allowed = oncePerSession(key);
        if (!allowed) return;
      }

      const clientEventId = createClientEventId();
      if (!clientEventId) return;

      return createOptimisticPostView({
        post,
        buildOptimistic: (p) => ({
          ...p,
          stats: {
            ...p.stats,
            viewsCount: (p.stats?.viewsCount ?? 0) + 1,
          },
        }),
        apply: (nextPost) => {
          applyToFeedCache(nextPost.id, (target) => {
            target.stats = target.stats || {};
            target.stats.viewsCount =
              nextPost.stats?.viewsCount ?? target.stats.viewsCount;
          });

          if (postViewContext === "fromPostDetail") {
            applyToSelectedPost(nextPost);
          }
        },
        createPostViewRequest: async (postId) =>
          createPostView({
            postId,
            viewSource,
            sessionId,
            clientEventId,
          }).unwrap(),
        /**
         * Merge server stats back into the optimistic post.
         *
         * @param {any} serverResponse
         * @param {PostDetail} optimisticPost
         * @returns {PostDetail | void}
         */
        reconcile: (serverResponse, optimisticPost) => {
          const { postStats } = serverResponse || {};
          if (!postStats) return;

          return {
            ...optimisticPost,
            stats: {
              ...optimisticPost.stats,
              viewsCount: postStats.viewsCount,
            },
          };
        },
        shouldIgnore: () => false,
      });
    },
    [createPostView, applyToFeedCache, applyToSelectedPost],
  );

  /**
   * Internal per-post video state.
   * - ended: whether video reached end
   * - countedAtStart: whether we already counted the current "play from start"
   *
   * @type {React.MutableRefObject<Map<string, VideoState>>}
   */
  const videoRef = useRef(new Map());

  /**
   * Returns handlers for a post's <video> element.
   *
   * TikTok rules implemented:
   * - First play from the beginning counts once
   * - If the video ended, replaying from the beginning counts again
   *
   * NOTE: Uses `onPlay` + `onEnded`. Works for most browsers.
   *
   * @param {PostDetail} post
   * @param {PostActionContext} [postViewContext="fromPostCard"]
   * @returns {VideoHandlers}
   */
  const getVideoHandlers = useCallback(
    (post, postViewContext = "fromPostCard") => {
      if (!post?.id) {
        return { onPlay: () => {}, onEnded: () => {} };
      }

      if (!videoRef.current.has(post.id)) {
        videoRef.current.set(post.id, { ended: false, countedAtStart: false });
      }

      /** @returns {VideoState | undefined} */
      const getState = () => videoRef.current.get(post.id);

      return {
        onEnded: () => {
          const s = getState();
          if (!s) return;
          s.ended = true;
          s.countedAtStart = false;
        },
        onPlay: (e) => {
          const el = e?.currentTarget;
          const s = getState();
          if (!el || !s) return;

          const t = Number(el.currentTime || 0);
          const startingNearBeginning = t <= 0.75;

          // Replay after ending counts as a new view
          if (s.ended && startingNearBeginning) {
            s.ended = false;
            handleUpdatePostView(post, "video", postViewContext);
            return;
          }

          // First play from beginning counts once
          if (!s.countedAtStart && startingNearBeginning) {
            s.countedAtStart = true;
            handleUpdatePostView(post, "video", postViewContext);
          }
        },
      };
    },
    [handleUpdatePostView],
  );

  return {
    openComposer,
    closeComposer,
    openDetail,
    closeDetail,
    toggleLikePost,
    toggleDislikePost,
    toggleBookmarkPost,
    handleDeletePost,
    handleMutePost,
    handleReportPost,
    handleUpdatePostView,
    getVideoHandlers,
  };
}
