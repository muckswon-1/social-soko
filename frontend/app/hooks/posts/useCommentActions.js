/**
 * @typedef {import("../../types/comment").Comment} Comment
 */


import { useCallback } from "react";
import { useFetchCommentsQuery, useLazyGetCommentRepliesQuery} from "../../services/postsApi";

export default function useCommentActions(){

   function getParentComments(postId){
    const skip = !postId;

    const {data, isLoading, isFetching, isError,
        error,refetch
    } = useFetchCommentsQuery({postId}, {skip});

    return {
        comments: data?.comments ?? [],
        isLoading: isLoading || isFetching,
        isError,
        error,
        refetch
    }

   }



  return {
    getParentComments
    
  }   
}