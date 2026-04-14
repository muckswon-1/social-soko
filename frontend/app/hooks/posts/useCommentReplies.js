// src/hooks/posts/useCommentReplies.js

import { useCallback, useMemo, useState } from "react";
import { useLazyGetCommentRepliesQuery } from "../../services/postsApi";

/**
 * @typedef {Object} UseCommentRepliesArgs
 * @property {string | null | undefined} commentId
 * @property {number=} pageSize
 *
 * @typedef {Object} UseCommentRepliesReturn
 * @property {() => Promise<import("@reduxjs/toolkit").UnwrapResult<any> | null>} loadFirstPage
 * @property {() => Promise<import("@reduxjs/toolkit").UnwrapResult<any> | null>} loadNextPage
 * @property {boolean} isLoading
 * @property {boolean} isFetching
 * @property {boolean} isError
 * @property {any} error
 * @property {number} nextPage
 * @property {boolean} hasMore
 */

export default function useCommentReplies({commentId, pageSize = 10}){
    const skip = !commentId;

    const [trigger, result] = useLazyGetCommentRepliesQuery();

    const [nextPage, setNextPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const canFetch = useMemo(() => !skip && hasMore && !result.isFetching,[skip, hasMore, result.isFetching]);

    const applyMeta = useCallback((meta) => {
        const page = Number(meta?.page || 1);
        const totalPages = Number(meta?.totalPages || page);
        const serverHasMore = typeof meta?.has_more_replies === 'boolean' ? meta.has_more_replies : page < totalPages;

        setNextPage(page + 1);
        setHasMore(serverHasMore);

    },[]);

    const loadFirstPage = useCallback(async () => {
        if(skip) return null;
        try{
            setNextPage(1);
            setHasMore(true);

            const res = await trigger({commentId, page: 1, limit:pageSize}, true).unwrap();

            applyMeta(res?.meta);
            console.log('Result fetching first page: ', res);
            return res;
        } catch(err) {
            return null;
        }
    },[skip, trigger, commentId, pageSize, applyMeta]);


    const loadNextPage = useCallback(async () => {
        if(!canFetch) return null;

        try {
            const pageToLoad = nextPage;

            const res = await trigger({commentId, page: pageToLoad,limit: pageSize}, true).unwrap();

            applyMeta(res?.meta);
            return res
        } catch (error) {
            return null;
        }
    },[canFetch, nextPage, trigger, commentId,pageSize, applyMeta]);


    return {
        loadFirstPage,
        loadNextPage,
        isLoading: result.isLoading,
        isFetching: result.isFetching,
        isError: result.isError,
        error: result.error,
        nextPage,
        hasMore
    }



}

