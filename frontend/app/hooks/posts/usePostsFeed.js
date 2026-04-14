import { useSelector } from "react-redux"
import { selectAuthUser } from "../../features/auth/authSlice"
import { useGetPostsQuery } from "../../services/postsApi";
import { useMemo } from "react";
import usePostActions from "./usePostActions";

/**
 * @typedef {import("../../types/post").PostDetail} PostDetail
 * @typedef {import("../../types/post").FeedMeta} FeedMeta
 * 
 * */

export function usePostFeed(options = {}){
    const {
        feedType = "explore",
        businessId = null,
        filter,
        skip = false,

    } = options;

    const user = useSelector(selectAuthUser);
    const userId = user?.id || null;

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch

    } = useGetPostsQuery(undefined, {
        skip,
        refetchOnMountOrArgChange: true,
        refetchOnFocus: true,
        refetchOnReconnect: true,
        skipPollingIfUnfocused: true,
    });


    /**@type {PostDetail[]} */
    const allPosts = data?.posts || [];

    /**@type {FeedMeta} */
    const meta = data?.meta || {};

    const posts = useMemo(() => {
        let base = allPosts;

        //custom filter
        if(typeof filter === "function"){
            base = base.filter(filter);
        }else {
            switch(feedType) {
                case "business":
                    base = businessId != null ? base.filter((post) => post?.business?.id === businessId) : [];
                    break;
                case "explore": 
                default:
            
                    break;

            }
        }

        //Global rule: in Explore dont show our own posts
        if(feedType === "explore" && userId){
            base = base.filter((post) => post.author?.id !== userId);
        }

        return base

    },[allPosts, filter, feedType, businessId, userId]);

    const actions = usePostActions();

    return {
        posts,
        meta,
        isLoading: isFetching || isLoading,
        isFetching,
        isError,
        error,
        refetch,
        ...actions
    }
}