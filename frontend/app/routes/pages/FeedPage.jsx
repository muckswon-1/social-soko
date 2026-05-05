// src/menu/feed/FeedPage.jsx
/** @typedef {import("../../types/post").PostOverview} PostOverview */
import React from "react";
import { useNavigate } from "react-router";

import { usePostFeed } from "../../hooks/posts/usePostsFeed";
import usePostActions from "../../hooks/posts/usePostActions";

import PostCard from "../posts/components/PostCard";
import "../../styles/pages/feed.css";

const FeedPage = () => {
  const { posts, isLoading, isError, error } = usePostFeed();
  const { toggleBookmarkPost, toggleDislikePost, toggleLikePost } =
    usePostActions();
    
  const navigate = useNavigate();

  if (isLoading) {
    
    return (
      <section className="feed" aria-label="Feed">
        <div className="feed__inner">
          <div className="feed__state">Loading...</div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="feed" aria-label="Feed">
        <div className="feed__inner">
          <div className="feed__state feed__state--error">
            Error: {error?.message || "Something went wrong"}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="feed" aria-label="Feed">
      <div className="feed__inner">
        <div className="feed__list">
          {posts.map(
            /** @param {PostOverview} post */
            (post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleBookmarkPost={toggleBookmarkPost}
                onToggleLikePost={toggleLikePost}
                onToggleDislikePost={toggleDislikePost}
                onOpenDetails={() => navigate(`/posts/${post.id}`)}
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default FeedPage;
