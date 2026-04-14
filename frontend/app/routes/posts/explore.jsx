// src/menu/posts/Explore.jsx

import React from "react";
import { useSelector } from "react-redux";

import {
  selectAuthUser,
} from "../../features/auth/authSlice";


import PostComposer from "./components/PostComposer";
import PostCard from "./components/PostCard";


import "../../styles/posts/posts-layout.css";
import PostDetailModal from "./components/PostModalDetail";
import { useCurrentBusiness } from "../../hooks/business/useCurrentBusiness";
import { usePostFeed } from "../../hooks/posts/usePostsFeed";
import { selectedPostDetailSelectedPost, selectPostComposerOpen } from "../../features/posts/postsUISlice";

/** @typedef {import("../../types/business").Business} Business */
/** @typedef {import("../../types/post").PostDetail} PostDetail */

export default function Explore() {
  const user = useSelector(selectAuthUser);

  const canPostAsBusiness = user?.role === "business"  || user?.role === "admin" ;

  const userId = user?.id || null;

  const {businessId, isLoading: isBusinessLoading, isError: isBusinessError } = useCurrentBusiness();

  // Feed data
  const {
    posts,
    meta, 
    isLoading: isFeedLoading, 
    isError: isGetPostsError, 
    error: getPostsError,
    refetch: refetchGetPosts,

    //post actions
    closeDetail,
    openDetail,
    openComposer,
    closeComposer,
    toggleLikePost,
    toggleDislikePost,
    toggleBookmarkPost,
    handleUpdatePostView,
    getVideoHandlers
    
    } = usePostFeed({feedType: "explore"});


  // Composer modal state
  const composerOpen = useSelector(selectPostComposerOpen);


  // Post detail modal state
  /** @type {PostDetail|null */
  const selectedPost = useSelector(selectedPostDetailSelectedPost);


  return (
    <div className="stack-md">
      {/* HEADER ACTIONS ROW (under layout header, right-aligned) */}
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

      {/* Composer (desktop: modal controlled by button; mobile: inline form) */}
      {businessId &&  canPostAsBusiness ? (
        <PostComposer
          businessId={businessId}
          open={composerOpen}
          onOpenChange={() => {closeComposer()}}
          refetch={refetchGetPosts}
        />
      ) : (
        <div className="card card--cozy">
          <div className="layout-empty">
            <div className="layout-empty__inner">
              {userId ? (
                <div className="form-hint">
                  Create a business to start sharing updates with the network.
                </div>
              ) : (
                <div className="form-hint">
                  Log in and create a business to start posting updates.
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
            <div className="form-hint">Loading explore feed…</div>
          </div>
        )}

        {/* Error */}
        {isGetPostsError && !isFeedLoading && (
          <div className="card card--cozy">
            <div className="form-error" style={{ marginBottom: "0.5rem" }}>
              Failed to load explore feed.
            </div>
            <button
              type="button"
              className="link-btn"
              onClick={() => refetch()}
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
              No posts yet — once businesses start posting, you'll see
              them here.
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

      {/* DETAIL MODAL (shared across Explore / For you / Following later) */}
      {selectedPost && (
        <PostDetailModal 
        post={selectedPost} 
        onClose={() => {closeDetail()}} 
        refetchGetPosts={() => {}}
        onToggleLikePost={toggleLikePost}
        onToggleDislikePost={toggleDislikePost}
        onToggleBookmarkPost={toggleBookmarkPost}
         onGetVideoHandlers={getVideoHandlers}
         />
      )}
    </div>
  );
}
