import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  useNavigate,
  useNavigation,
  useParams,
  useRouteError,
  isRouteErrorResponse,
} from "react-router";
import { skipToken } from "@reduxjs/toolkit/query";

import { setSelectedPost } from "../../features/posts/postsUISlice";
import PostDetailPanel from "../posts/components/PostDetailPanel";
import { useGetPostByIdQuery } from "../../services/postsApi";
import usePostActions from "../../hooks/posts/usePostActions";

/**
 * @typedef {import("../../types/post").PostDetail} PostDetail
 */

function PostIdRoute() {
  const { postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigation = useNavigation();

  // Use skipToken to keep the hook call stable while avoiding fetch until we have postId
  const queryArg = postId ? postId : skipToken;

  const {
    data,
    isError,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPostByIdQuery(queryArg);

  const {
    toggleBookmarkPost,
    toggleDislikePost,
    toggleLikePost
  } = usePostActions();

  /** @type {PostDetail|null} */
  const post = useMemo(() => data?.post ?? null, [data]);

  // Keep UI slice in sync when we have a post
  useEffect(() => {
    dispatch(setSelectedPost(post));
  }, [dispatch, post]);

  // Clear on unmount
  useEffect(() => {
    return () => dispatch(setSelectedPost(null));
  }, [dispatch]);

  const isRouteNavigating = navigation.state === "loading";
  const showLoading = isLoading || isFetching || isRouteNavigating;

  // Render states (no hooks below this point)
  if (!postId) {
    return (
      <div className="card">
        <p>Missing post id.</p>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="card">
        <div style={{ marginBottom: 8 }}>Failed to load post.</div>

        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="btn btn-primary" onClick={() => refetch()}>
            Retry
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>

        {error ? (
          <pre style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(error, null, 2)}
          </pre>
        ) : null}
      </div>
    );
  }

  if (!post && showLoading) {
    return (
      <div className="card">
        <p>Loading post...</p>
      </div>
    );
  }

  if (!post) {
   

    return (
      <div className="card">
        <p>Post not found.</p>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Go back
        </button>
      </div>
    );
  }


  // Best practice: pass the post down so PostDetailPanel doesn't have to depend on global UI state timing
  return (
    <PostDetailPanel
      post={post}
      isLoading={showLoading}
      onClose={() => navigate(-1)}
      refetchPosts={refetch}
      onToggleLikePost={toggleLikePost}
      onToggleDislikePost={toggleDislikePost}
      onToggleBookmarkPost={toggleBookmarkPost}
      onGetVideoHandlers={() => ({ onPlay: () => {}, onEnded: () => {} })}
    />
    
  );
}

export default PostIdRoute;
