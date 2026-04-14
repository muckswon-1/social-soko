

import React from "react";
import { useSelector } from "react-redux";

import { selectAuthUser } from "../../features/auth/authSlice";

import PostComposer from "./components/PostComposer";
import PostCard from "./components/PostCard";
import PostDetailModal from "./components/PostModalDetail";

import "../../styles/posts/posts-layout.css";

import { useCurrentBusiness } from "../../hooks/business/useCurrentBusiness";
import { usePostFeed } from "../../hooks/posts/usePostsFeed";
import {
  selectedPostDetailSelectedPost,
  selectPostComposerOpen,
} from "../../features/posts/postsUISlice";

/** @typedef {import("../../types/post").PostDetail} PostDetail */

export default function UserPosts() {
  const user = useSelector(selectAuthUser);

  const canPostAsBusiness = user?.role === "business" || user?.role === "admin";
  const userId = user?.id || null;

  const {
    businessId,
    isLoading: isBusinessLoading,
    isError: isBusinessError,
  } = useCurrentBusiness();


  const {
    posts,
    isLoading: isFeedLoading,
    isError: isGetPostsError,
    error: getPostsError,
    refetch: refetchGetPosts,

    // post actions
    closeDetail,
    openDetail,
    openComposer,
    closeComposer,
    toggleLikePost,
    toggleDislikePost,
    toggleBookmarkPost,
    handleUpdatePostView,
    getVideoHandlers,
  } = usePostFeed({ feedType: "business", businessId });

  const composerOpen = useSelector(selectPostComposerOpen);

  /** @type {PostDetail|null} */
  const selectedPost = useSelector(selectedPostDetailSelectedPost);

  return (
    <div className="stack-md">
      {/* HEADER ACTIONS ROW */}
      <div className="section-header-actions-row">
        {businessId && !isBusinessLoading && !isBusinessError ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openComposer()}
          >
            Share an update
          </button>
        ) : null}
      </div>

      {/* Composer */}
      {businessId && canPostAsBusiness ? (
        <PostComposer
          businessId={businessId}
          open={composerOpen}
          onOpenChange={() => closeComposer()}
          refetch={refetchGetPosts}
        />
      ) : (
        <div className="card card--cozy">
          <div className="layout-empty">
            <div className="layout-empty__inner">
              {userId ? (
                <div className="form-hint">
                  Create a business to start sharing updates.
                </div>
              ) : (
                <div className="form-hint">
                  Log in to view your posts and create a business to start
                  posting.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FEED */}
      <section className="stack-md">
        {/* Loading */}
        {isFeedLoading && (
          <div className="card card--cozy">
            <div className="form-hint">Loading your posts…</div>
          </div>
        )}

        {/* Error */}
        {isGetPostsError && !isFeedLoading && (
          <div className="card card--cozy">
            <div className="form-error" style={{ marginBottom: "0.5rem" }}>
              Failed to load your posts.
            </div>
            <button
              type="button"
              className="link-btn"
              onClick={() => refetchGetPosts()}
            >
              Try again
            </button>

            {getPostsError?.data?.message && (
              <div className="form-hint" style={{ marginTop: "0.25rem" }}>
                {getPostsError.data.message}
              </div>
            )}
          </div>
        )}

        {/* Empty */}
        {!isFeedLoading && !isGetPostsError && posts.length === 0 && (
          <div className="card card--cozy">
            <div className="form-hint">
              You have not posted anything yet.
            </div>
          </div>
        )}

        {/* List */}
        {posts.length > 0 && !isFeedLoading && !isGetPostsError && (
          <div className="post-grid">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleLikePost={toggleLikePost}
                onToggleDislikePost={toggleDislikePost}
                onToggleBookmarkPost={toggleBookmarkPost}
                onOpenDetails={openDetail}
                onUpdatePostView={handleUpdatePostView}
                onGetVideoHandlers={getVideoHandlers}
              />
            ))}
          </div>
        )}
      </section>

      {/* DETAIL MODAL */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => closeDetail()}
          refetchGetPosts={refetchGetPosts}
          onToggleLikePost={toggleLikePost}
          onToggleDislikePost={toggleDislikePost}
          onToggleBookmarkPost={toggleBookmarkPost}
           onGetVideoHandlers={getVideoHandlers}
        />
      )}
    </div>
  );
}
