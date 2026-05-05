import React, { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { mockPosts as defaultPosts } from "./mockData";
import useRequireAuthAction from "../../hooks/useRequireAuthAction";
import "../../styles/guest/guest-feed.css";
import PostCard from "../posts/components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthUser } from "../../features/auth/authSlice";
import { usePostFeed } from "../../hooks/posts/usePostsFeed";
import { setSelectedPost } from "../../features/posts/postsUISlice";


export default function GuestFeedPage() {
  const {posts, isLoading, isError, error } = usePostFeed();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  if(isLoading) {
    return (
      <div className="
      gues-feed__inner
      ">Loading...</div>
    )
  }

  if(isError) {
    console.log(error);
  }


  return (
    <section
    className="guest-feed"
    aria-label="Guest Feed"
    >
        <div className="guest-feed__inner">
            {/* Sort */}
            
               {/* <div className="topnav__contextRow" aria-label="Feed Controls">
          <button
            type="button"
            className="topnav__contextBtn"
            aria-label="Sort"
          >
            Trending <span aria-hidden="true">▾</span>
          </button>

          <button
            type="button"
            className="topnav__contextBtn"
            aria-label="Feed layout"
          >
            ☐ <span aria-hidden="true">▾</span>
          </button>
        </div> */}


            <div className="guest-feed__list">
                <>
                 {
                   posts.map((post) => (<PostCard
                     key={post.id} 
                     post={post} 
                     onOpenDetails={() => {
                      navigate(`/posts/${post.id}`);
                    }}
                     
                     />))
                 }
                </>
            </div>
        </div>

    
    </section>
  );
}
