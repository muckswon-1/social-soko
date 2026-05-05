/**
 * @typedef {import("../../types/post").PostDetail} PostDetail
 * @typedef {import("../../types/post").PostStats} PostStats
 */

/**
 * Result shape returned by optimistic helpers.
 *
 * @typedef {{
 *   ignored?: true;
 *   success?: true;
 *   error?: any;
 *   nextBookmarked?: boolean;
 * }} OptimisticResult
 */

/**
 * Generic optimistic "like" action reusable across UI contexts.
 *
 * Behavior:
 * - Ignores if already liked (or shouldIgnore returns true)
 * - Applies optimistic UI update immediately
 * - Reconciles likesCount with server response
 * - Rolls back on failure
 *
 * @param {{
 *   post: PostDetail;
 *   likeRequest: (postId: string) => Promise<{ postStats?: { likesCount?: number } }>;
 *   shouldIgnore?: (post: PostDetail) => boolean;
 *   buildOptimistic?: (post: PostDetail) => PostDetail;
 *   apply: (nextPost: PostDetail) => void;
 * }} params
 *
 * @returns {Promise<
 *   | { ignored: true }
 *   | { success: true }
 *   | { success: false; error: any }
 * >}
 */
export async function optimisticLikePost({
  post,
  likeRequest,
  shouldIgnore,
  buildOptimistic,
  apply,
}) {
  const originalPost = post;
  const currentlyLiked = !!originalPost?.currentUserLiked;

  if ((shouldIgnore && shouldIgnore(originalPost)) || currentlyLiked) {
    return { ignored: true };
  }

  const optimisticPost =
    buildOptimistic?.(originalPost) || {
      ...originalPost,
      currentUserLiked: true,
      currentUserDisliked: false,
      stats: {
        ...originalPost.stats,
        likesCount: (originalPost.stats?.likesCount ?? 0) + 1,
      },
    };

  apply(optimisticPost);

  try {
    const res = await likeRequest(originalPost.id);

    const finalPost = {
      ...optimisticPost,
      currentUserLiked: true,
      currentUserDisliked: false,
      stats: {
        ...optimisticPost.stats,
        likesCount:
          typeof res?.postStats?.likesCount === "number"
            ? res.postStats.likesCount
            : optimisticPost.stats?.likesCount,
      },
    };

    apply(finalPost);
    return { success: true };
  } catch (error) {
    console.error("Error liking post:", error);
    apply(originalPost);
    return { success: false, error };
  }
}

/**
 * Optimistically applies a "dislike" action to a post.
 *
 * Behavior:
 * - Ignores if already disliked (or shouldIgnore returns true)
 * - Clears like state and decrements likesCount optimistically (never below 0)
 * - Reconciles likesCount with server response
 * - Rolls back on failure
 *
 * NOTE:
 * - Don't block dislikes when likesCount is 0; user can still dislike even if
 *   nobody liked yet. (If you want to block "dislike unless previously liked",
 *   do that server-side as a rule.)
 *
 * @param {{
 *   post: PostDetail;
 *   dislikeRequest: (postId: string) => Promise<{ postStats?: { likesCount?: number } }>;
 *   shouldIgnore?: (post: PostDetail) => boolean;
 *   buildOptimistic?: (post: PostDetail) => PostDetail;
 *   apply: (nextPost: PostDetail) => void;
 * }} params
 *
 * @returns {Promise<
 *   | { ignored: true }
 *   | { success: true }
 *   | { success: false; error: any }
 * >}
 */
export async function optimisticDisLikePost({
  post,
  dislikeRequest,
  shouldIgnore,
  buildOptimistic,
  apply,
}) {
  const originalPost = post;
  const currentlyDisliked = !!originalPost?.currentUserDisliked;

  if ((shouldIgnore && shouldIgnore(originalPost)) || currentlyDisliked) {
    return { ignored: true };
  }

  const optimisticPost =
    buildOptimistic?.(originalPost) || {
      ...originalPost,
      currentUserDisliked: true,
      currentUserLiked: false,
      stats: {
        ...originalPost.stats,
        likesCount: Math.max(0, (originalPost.stats?.likesCount ?? 0) - 1),
      },
    };

  apply(optimisticPost);

  try {

 
    const res = await dislikeRequest(originalPost?.id);

    const finalPost = {
      ...optimisticPost,
      currentUserDisliked: true,
      currentUserLiked: false,
      stats: {
        ...optimisticPost.stats,
        likesCount:
          typeof res?.postStats?.likesCount === "number"
            ? res.postStats.likesCount
            : optimisticPost.stats?.likesCount,
      },
    };

    apply(finalPost);
    return { success: true };
  } catch (error) {
    console.error("Error disliking post:", error);
    apply(originalPost);
    return { success: false, error };
  }
}

/**
 * Optimistic toggle bookmark (on/off).
 *
 * Behavior:
 * - Applies optimistic UI update immediately
 * - Reconciles bookmarksCount with server response
 * - Rolls back on failure
 *
 * @param {{
 *   post: PostDetail;
 *   bookmarkRequest: (postId: string) => Promise<{ postStats?: PostStats }>;
 *   buildOptimistic: (post: PostDetail) => PostDetail;
 *   apply: (nextPost: PostDetail) => void;
 *   shouldIgnore?: (post: PostDetail) => boolean;
 *   reconcile?: (serverResponse: any, optimisticPost: PostDetail) => PostDetail | void;
 * }} params
 *
 * @returns {Promise<{ ignored?: true; nextBookmarked?: boolean }>}
 */
export async function optimisticToggleBookmarkPost({
  post,
  bookmarkRequest,
  buildOptimistic,
  apply,
  shouldIgnore,
  reconcile,
}) {
  const originalPost = post;

  if (shouldIgnore && shouldIgnore(originalPost)) {
    return { ignored: true };
  }

  const currentlyBookmarked = !!originalPost?.currentUserBookmarked;
  const nextBookmarked = !currentlyBookmarked;

  const optimisticPost = buildOptimistic(originalPost);
  apply(optimisticPost);

  try {
    const serverResponse = await bookmarkRequest(originalPost.id);

    const postStats = serverResponse?.postStats;

    /** @type {PostDetail} */
    const finalPost =
      typeof reconcile === "function"
        ? reconcile(serverResponse, optimisticPost) || optimisticPost
        : {
            ...optimisticPost,
            stats: {
              ...optimisticPost.stats,
              bookmarksCount:
                typeof postStats?.bookmarksCount === "number"
                  ? postStats.bookmarksCount
                  : optimisticPost.stats?.bookmarksCount,
            },
          };

    apply(finalPost);
    return { nextBookmarked };
  } catch (error) {
    apply(originalPost);
    return { success: false, error };
  }
}

/**
 * Optimistic post view creator.
 *
 * Behavior:
 * - Applies optimistic UI update immediately
 * - Calls server to create a view event
 * - Optionally reconciles with server truth
 * - Rolls back on failure
 *
 * IMPORTANT:
 * If you pass `reconcile`, you should either:
 * - return a new PostDetail, OR
 * - perform side effects in `apply` yourself
 *
 * Recommended: return a PostDetail and this helper will apply it.
 *
 * @param {{
 *   post: PostDetail;
 *   createPostViewRequest: (postId: string) => Promise<any>;
 *   buildOptimistic: (post: PostDetail) => PostDetail;
 *   apply: (nextPost: PostDetail) => void;
 *   shouldIgnore?: (post: PostDetail) => boolean;
 *   reconcile?: (serverResponse: any, optimisticPost: PostDetail) => PostDetail | void;
 * }} params
 *
 * @returns {Promise<{ ignored?: true; success?: true; error?: any }>}
 */
export async function createOptimisticPostView({
  post,
  createPostViewRequest,
  buildOptimistic,
  apply,
  shouldIgnore,
  reconcile,
}) {
  const originalPost = post;

  if (shouldIgnore && shouldIgnore(originalPost)) {
    return { ignored: true };
  }

  const optimisticPost = buildOptimistic(originalPost);
  apply(optimisticPost);

  try {
    const serverResponse = await createPostViewRequest(originalPost.id);

    if (typeof reconcile === "function") {
      const reconciled = reconcile(serverResponse, optimisticPost);
      if (reconciled) {
        apply(reconciled);
      }
    }

    return { success: true };
  } catch (error) {
    apply(originalPost);
    return { success: false, error };
  }
}
