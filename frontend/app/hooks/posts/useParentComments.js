import { useCallback, useState } from "react";
import { useFetchCommentsQuery } from "../../services/postsApi";

export default function useParentComments(postId, options = {}){
    const {
        initialLimit = 10

    } = options;

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(initialLimit);

    const skip = !postId;

    const {data, isLoading, isFetching, isError, error, refetch} = useFetchCommentsQuery({
        postId, page, limit
    },{skip, /*pollingInterval: 1000, refetchOnReconnect: true, refetchOnMountOrArgChange:true, refetchOnFocus: true */});

    const comments = data?.comments ?? [];

     const meta = data?.meta;

     const hasMore = page < meta?.totalPages;

     const loadMore = useCallback(() => {
        if(!hasMore) return null;
        setPage((prev) => prev + 1);
     }, [hasMore]);

     const reset = useCallback(() => {
        setPage(1);
        refetch?.()
     },[refetch])

    


    return {
        comments,
        meta,
        page,
        limit,
        hasMore,
        isLoading: isLoading || isFetching,
        isError,
        error,
        loadMore,
        reset, refetch
    }





}