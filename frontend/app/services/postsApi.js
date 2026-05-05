// src/services/postsApi.js

import {
  normaliseCommentFeedResponse,
  normaliseCreateCommentResponse,
  normaliseFeedResponse,
  normalisePostActionResponse,
  normalisePostDetailResponse,
  normaliseRepliesResponse,
  normaliseUploadMediaResponse,
  normalisedCreatePostResponse,
} from "../routes/posts/utils/postTransformers";

import { apiSlice } from "./apiSlice";
import { normaliseErrorResponse } from "./servicesTransformers";

/**
 * @typedef {import("../types/comment").CreateCommentForm} CreateCommentForm
 * @typedef {import("../types/comment").Comment} Comment
 * @typedef {import("../types/post").CreatePostForm} CreatePostForm
 * @typedef {import("../types/post").PostOverview} PostOverview
 * @typedef {import("../types/post").PostDetail} PostDetail
 * @typedef {import("../types/post").FeedResponse} FeedResponse
 * @typedef {import("../types/common").UUID} UUID
 * @typedef {import("@reduxjs/toolkit/dist/query").FetchArgs} FetchArgs
 */

/**
 * @typedef {{
 *  postId: UUID;
 *  page?: number;
 *  limit?: number;
 * }} FetchCommentsArgs
 */

/**
 * @typedef {{
 *  postId: UUID;
 *  viewSource: "feed" | "modal" | "video";
 *  sessionId: string;
 *  clientEventId: string;
 * }} CreatePostViewPayload
 */

/**
 * RTK Query API for Posts domain.
 *
 * Responsibilities:
 * - Feed fetching
 * - Post creation
 * - Comment creation
 * - Comment fetching
 * - Upload post/comment media
 * - Post actions (like/dislike/bookmark/view)
 *
 * Notes:
 * - All successful responses are normalized before reaching UI.
 * - All errors are normalized via normaliseErrorResponse().
 */
export const postsApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    /**
     * Fetch the main posts feed.
     *
     * GET /api/v1/posts/feed
     *
     * @returns {{ posts: PostDetail[], meta: import("../types/post").FeedMeta }}
     */
    getPosts: builder.query({
      /**
       * @returns {FetchArgs}
       */
      query: () => ({
        url: `/posts/feed`,
        method: "GET",
      }),

      /**
       * @param {any} response
       * @returns {{ posts: PostDetail[], meta: import("../types/post").FeedMeta }}
       */
      transformResponse: (response) => normaliseFeedResponse(response),

      /**
       * @param {any} response
       */
      transformErrorResponse: (response) => normaliseErrorResponse(response),

      /**
       * @param {{ posts: PostDetail[] } | undefined} result
       */
      providesTags: (result) => {
        if (!result) return [{ type: "Posts", id: "LIST" }];

        return [
          { type: "Posts", id: "LIST" },
          ...result.posts.map((post) => ({ type: "Posts", id: post.id })),
        ];
      },
    }),

    getPostById: builder.query({
      /**
       * @param {string} postId
       * @returns {FetchArgs}
       */
      query: (postId) => {
      
      
        return {
          url: `/posts/${postId}`,
          method: "GET"
        }
        
      
    },
      transformResponse: (response) => {
        return normalisePostDetailResponse(response);
      },

      transformErrorResponse: (response) => normaliseErrorResponse(response),

      providesTags: (result, error, postId) => [{type: "Posts", id: postId}]

    }),




    /**
     * Create a new post.
     *
     * POST /api/v1/posts/create
     *
     * @param {CreatePostForm} payload
     * @returns {{ post: PostOverview }}
     */
    createPost: builder.mutation({
      /**
       * @param {CreatePostForm} payload
       * @returns {FetchArgs}
       */
      query: (payload) => ({
        url: `/posts/create`,
        method: "POST",
        body: payload,
      }),

      /**
       * @param {any} response
       * @returns {{ post: PostOverview }}
       */
      transformResponse: (response) => normalisedCreatePostResponse(response),

      /**
       * @param {any} response
       */
      transformErrorResponse: (response) => normaliseErrorResponse(response),

      /**
       * @param {{ post?: PostOverview } | undefined} result
       */
      invalidatesTags: (result) => {
        if (!result?.post) return [{ type: "Posts", id: "LIST" }];

        return [
          { type: "Posts", id: "LIST" },
          { type: "Posts", id: result.post.id },
        ];
      },
    }),

    /**
     * Create a new comment for a post.
     *
     * POST /api/v1/posts/create-comment/:postId
     *
     * @param {CreateCommentForm} payload
     * @returns {{ success: boolean; message: string; comment: Comment }}
     */
    createComment: builder.mutation({
      /**
       * @param {CreateCommentForm} payload
       * @returns {FetchArgs}
       */
      query: (payload) => {
        const postId = payload.post_id;

        return {
          url: `/posts/create-comment/${postId}`,
          method: "POST",
          body: payload,
        };
      },

      /**
       * @param {any} response
       * @returns {{ success: boolean; message: string; comment: Comment }}
       */
      transformResponse: (response) => {
        const normalised = normaliseCreateCommentResponse(response);

        console.log("normalised", normalised);

        return normalised;
      },

      /**
       * @param {any} response
       */
      transformErrorResponse: (response) => normaliseErrorResponse(response),

      /**
       * Invalidate the comments list for this post + the feed list.
       *
       * @param {{ comment?: Comment } | undefined} result
       */
      invalidatesTags: (result) => {
        const postId = result?.comment?.postId;
        if (!postId) return [{ type: "Posts", id: "LIST" }];

        return [
          { type: "Comments", id: postId },
          { type: "Posts", id: postId },
          { type: "Posts", id: "LIST" },
        ];
      },
    }),

  /** 
  * @typedef {{
 *   postId: string;
 *   page?: number;
 *   limit?: number;
 * }} FetchCommentsArgs
 *
 * @typedef {{
 *   success: boolean;
 *   message?: string;
 *   meta: {
 *     page: number;
 *     limit: number;
 *     totalItems: number;
 *     totalPages: number;
 *   };
 *   comments: Comment[];
 * }} CommentsFeedResponse
 */

/**
 * Fetch top-level comments for a post (and optional first-page replies if backend includes them).
 *
 * GET /api/v1/posts/comments/:postId?page=&limit=
 *
 * UI shape: { comments, meta, message, success }
 */
fetchComments: builder.query({
  /**
   * @param {FetchCommentsArgs} args
   * @returns {FetchArgs}
   */
  query: ({ postId, page = 1, limit = 10 }) => ({
    url: `/posts/comments/${postId}`,
    method: "GET",
    params: { page, limit },
  }),

  /**
   * Normaliser output shape:
   * { success, message, meta, comments }
   *
   * @param {any} response
   * @returns {CommentsFeedResponse}
   */
  transformResponse: (response) => {
    /** @type {CommentsFeedResponse} */
    const normalised = normaliseCommentFeedResponse(response);
    return normalised;
  },

  /**
   * @param {any} response
   */
  transformErrorResponse: (response) => normaliseErrorResponse(response),

  /**
   * Cache tags strategy:
   * - "Comments" by postId = the list for a post (invalidate this when adding a comment/reply)
   * - "Comment" by id = individual nodes (invalidate when liking/editing one comment)
   *
   * @param {CommentsFeedResponse | undefined} result
   * @param {any} error
   * @param {FetchCommentsArgs} args
   */
  providesTags: (result, error, args) => {
    const { postId } = args;

    // Always provide the list tag so mutations can invalidate it reliably.
    const base = [{ type: "Comments", id: postId }];

    if (!result?.comments?.length) return base;

    return [
      ...base,
      ...result.comments.map((c) => ({ type: "Comment", id: c.id })),
    ];
  },
}),

    /**
     * Upload an image for a post.
     *
     * POST /api/v1/posts/upload-post-image/:postId
     *
     * @param {{ postId: UUID; file: File }} payload
     */
    uploadPostImage: builder.mutation({
      /**
       * @param {{ postId: UUID; file: File }} payload
       * @returns {FetchArgs}
       */
      query: ({ postId, file }) => {
        const formData = new FormData();
        formData.append("post_image", file);

        return {
          url: `/posts/upload-post-image/${postId}`,
          method: "POST",
          body: formData,
        };
      },

      /**
       * @param {any} response
       */
      transformResponse: (response) => normaliseUploadMediaResponse(response),

      /**
       * @param {any} response
       */
      transformErrorResponse: (response) => normaliseErrorResponse(response),

      /**
       * @param {any} result
       * @param {any} error
       * @param {{ postId: UUID }} args
       */
      invalidatesTags: (result, error, { postId }) => {
        if (!result || result.success !== true) return [];

        return [
          { type: "Posts", id: postId },
          { type: "Posts", id: "LIST" },
        ];
      },
    }),

    /**
     * Upload a video for a post.
     *
     * POST /api/v1/posts/upload-post-video/:postId
     *
     * @param {{ postId: UUID; file: File }} payload
     */
    uploadPostVideo: builder.mutation({
      /**
       * @param {{ postId: UUID; file: File }} payload
       * @returns {FetchArgs}
       */
      query: ({ postId, file }) => {
        const formData = new FormData();
        formData.append("post_video", file);

        return {
          url: `/posts/upload-post-video/${postId}`,
          method: "POST",
          body: formData,
        };
      },

      /**
       * @param {any} response
       */
      transformResponse: (response) => normaliseUploadMediaResponse(response),

      /**
       * @param {any} response
       */
      transformErrorResponse: (response) => normaliseErrorResponse(response),

      /**
       * @param {any} result
       * @param {any} error
       * @param {{ postId: UUID }} args
       */
      invalidatesTags: (result, error, { postId }) => {
        if (!result || result.success !== true) return [];

        return [
          { type: "Posts", id: postId },
          { type: "Posts", id: "LIST" },
        ];
      },
    }),

    /**
     * Upload an image for a comment.
     *
     * POST /api/v1/posts/upload-comment-image/:commentId
     *
     * @param {{ commentId: UUID; file: File; postId?: UUID }} payload
     */
    uploadCommentImage: builder.mutation({
      /**
       * @param {{ commentId: UUID; file: File; postId?: UUID }} payload
       * @returns {FetchArgs}
       */
      query: ({ commentId, file }) => {
        const formData = new FormData();
        formData.append("comment_image", file);

        return {
          url: `/posts/upload-comment-image/${commentId}`,
          method: "POST",
          body: formData,
        };
      },

      /**
       * @param {any} response
       */
      transformResponse: (response) => normaliseUploadMediaResponse(response),

      /**
       * @param {any} response
       */
      transformErrorResponse: (response) => normaliseErrorResponse(response),

      /**
       * For now we invalidate LIST and (optional) post if caller supplies postId.
       * Later when we introduce Comment media previews in-place, we should invalidate:
       * - Comment:commentId
       * - Comments:postId
       *
       * @param {any} result
       * @param {any} error
       * @param {{ postId?: UUID; commentId: UUID }} args
       */
      invalidatesTags: (result, error, { postId, commentId }) => {
        if (!result || result.success !== true) return [];

        const tags = [{ type: "Posts", id: "LIST" }, { type: "Comment", id: commentId }];

        if (postId) {
          tags.push({ type: "Posts", id: postId });
          tags.push({ type: "Comments", id: postId });
        }

        return tags;
      },
    }),

    /**
     * Upload a video for a comment.
     *
     * POST /api/v1/posts/upload-comment-video/:commentId
     *
     * @param {{ commentId: UUID; file: File; postId?: UUID }} payload
     */
    uploadCommentVideo: builder.mutation({
      /**
       * @param {{ commentId: UUID; file: File; postId?: UUID }} payload
       * @returns {FetchArgs}
       */
      query: ({ commentId, file }) => {
        const formData = new FormData();
        formData.append("comment_video", file);

        return {
          url: `/posts/upload-comment-video/${commentId}`,
          method: "POST",
          body: formData,
        };
      },

      /**
       * @param {any} response
       */
      transformResponse: (response) => normaliseUploadMediaResponse(response),

      /**
       * @param {any} response
       */
      transformErrorResponse: (response) => normaliseErrorResponse(response),

      /**
       * @param {any} result
       * @param {any} error
       * @param {{ postId?: UUID; commentId: UUID }} args
       */
      invalidatesTags: (result, error, { postId, commentId }) => {
        if (!result || result.success !== true) return [];

        const tags = [{ type: "Posts", id: "LIST" }, { type: "Comment", id: commentId }];

        if (postId) {
          tags.push({ type: "Posts", id: postId });
          tags.push({ type: "Comments", id: postId });
        }

        return tags;
      },
    }),

    /**
     * Like a post.
     *
     * POST /api/v1/posts/like/:postId
     *
     * @param {UUID} postId
     */
    likePost: builder.mutation({
      /**
       * @param {UUID} postId
       * @returns {FetchArgs}
       */
      query: (postId) => ({
        url: `/posts/like/${postId}`,
        method: "POST",
      }),

      /**
       * @param {any} response
       */
      transformResponse: (response) => normalisePostActionResponse(response),

      /**
       * @param {any} response
       */
      transformErrorResponse: (response) => normaliseErrorResponse(response),

      /**
       * @param {any} result
       * @param {any} error
       * @param {UUID} postId
       */
      invalidatesTags: (result, error, postId) => {
        if (!result || result.success !== true) return [];
        return [
          { type: "Posts", id: postId },
          { type: "Posts", id: "LIST" },
        ];
      },
    }),

    /**
     * Dislike a post.
     *
     * POST /api/v1/posts/dislike/:postId
     *
     * @param {UUID} postId
     */
    dislikePost: builder.mutation({
      /**
       * @param {UUID} postId
       * @returns {FetchArgs}
       */
      query: (postId) => ({
        url: `/posts/dislike/${postId}`,
        method: "POST",
      }),

      /**
       * @param {any} response
       */
      transformResponse: (response) => normalisePostActionResponse(response),

      /**
       * @param {any} response
       */
      transformErrorResponse: (response) => normaliseErrorResponse(response),

      /**
       * @param {any} result
       * @param {any} error
       * @param {UUID} postId
       */
      invalidatesTags: (result, error, postId) => {
        if (!result || result.success !== true) return [];
        return [
          { type: "Posts", id: postId },
          { type: "Posts", id: "LIST" },
        ];
      },
    }),

    /**
     * Bookmark a post (toggle).
     *
     * POST /api/v1/posts/bookmark/:postId
     *
     * @param {UUID} postId
     */
    bookmarkPost: builder.mutation({
      /**
       * @param {UUID} postId
       * @returns {FetchArgs}
       */
      query: (postId) => ({
        url: `/posts/bookmark/${postId}`,
        method: "POST",
      }),

      /**
       * @param {any} response
       */
      transformResponse: (response) => normalisePostActionResponse(response, "post_bookmark"),

      /**
       * @param {any} response
       */
      transformErrorResponse: (response) => normaliseErrorResponse(response),

      /**
       * @param {any} result
       * @param {any} error
       * @param {UUID} postId
       */
      invalidatesTags: (result, error, postId) => {
        if (!result || result.success !== true) return [];
        return [
          { type: "Posts", id: postId },
          { type: "Posts", id: "LIST" },
        ];
      },
    }),

    /**
     * Create a post view event.
     *
     * POST /api/v1/posts/view/:postId
     *
     * @param {CreatePostViewPayload} payload
     */
    createPostView: builder.mutation({
      /**
       * @param {CreatePostViewPayload} payload
       * @returns {FetchArgs}
       */
      query: (payload) => {
        const postId = payload.postId;

        return {
          url: `/posts/view/${postId}`,
          method: "POST",
          body: {
            viewSource: payload.viewSource,
            sessionId: payload.sessionId,
            clientEventId: payload.clientEventId,
          },
        };
      },

      /**
       * @param {any} response
       */
      transformResponse: (response) => normalisePostActionResponse(response, "post_view"),

      /**
       * @param {any} response
       */
      transformErrorResponse: (response) => normaliseErrorResponse(response),

      /**
       * @param {any} result
       * @param {any} error
       * @param {CreatePostViewPayload} payload
       */
      invalidatesTags: (result, error, payload) => {
        const postId = payload?.postId;
        if (!result || result.success !== true || !postId) return [];

        return [
          { type: "Posts", id: postId },
          { type: "Posts", id: "LIST" },
        ];
      },
    }),


    getCommentReplies: builder.query({
      query: ({commentId, page = 1, limit = 10}) => ({
        url: `/posts/comments/replies/${commentId}`,
        method: "GET",
        params: {page, limit}
      }),
      transformResponse: (response) => {
        const normalised = normaliseRepliesResponse(response);
       
        return normalised;
      }

      
    })
  }),
});

export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useCreateCommentMutation,
  useFetchCommentsQuery,
  useUploadPostImageMutation,
  useUploadPostVideoMutation,
  useUploadCommentImageMutation,
  useUploadCommentVideoMutation,
  useLikePostMutation,
  useDislikePostMutation,
  useBookmarkPostMutation,
  useCreatePostViewMutation,
  useLazyGetCommentRepliesQuery
} = postsApi;
