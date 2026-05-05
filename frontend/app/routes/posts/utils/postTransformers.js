/**
 * @typedef {import("../../../types/post").PostOverview} PostOverview
 * @typedef {import("../../../types/post").FeedResponse} FeedResponse
 * @typedef {import("../../../types/post").PostBusiness} PostBusiness
 * @typedef {import("../../../types/post").FeedMeta} FeedMeta
 * @typedef {import("axios").AxiosResponse} AxiosResponse
 * @typedef {import("../../../types/post").CreatePostForm} CreatePostForm
 * @typedef {import("../../../types/post").PostAuthor} PostAuthor
 * @typedef {import("../../../types/post").PostType} PostType
 * @typedef {import("../../../types/comment").Comment} Comment
 * @typedef {import("../../../types/comment").CreateCommentForm} CreateCommentForm
 * @typedef {import("../../../types/comment").CommentAuthor} CommentAuthor
 * @typedef {import("../../../types/post").PostDetail} PostDetail
 * @typedef {import("../../../types/post").PostMedia} PostMedia
 * @typedef {import("../../../types/post").PostStats} PostStats
 */


/**
 * returns a human-readable relative time string from an ISO date string.
 * 
 * @param {import("../../../types/common").NullableString} isoString 
 * @returns {string}
 */
export function formatRelativeTime(isoString) {
  if (!isoString) return "";

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  if (Number.isNaN(diffMs)) return "";

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString();
}


/**
 * @returns {CreatePostForm}
 */
export function emptyCreatePostForm() {
    return {
        business_id: "",
        content: "",
        title: "",
        post_type:  "social",
        image_urls: [],
        video_urls: [],
        visibility: "public"
    }

}

/**
 * @returns {CreateCommentForm}
 */
export function emptyCreateCommentForm(){
    return {
        post_id: "",
        content: "",
        image_urls: [],
        video_urls: []
    }
}




/**
 * Humanize post type: "selling" -> "Selling"
 * @param {PostType} postType
 * @returns {string}
 */
export function humanizePostType(postType) {
    if(!postType) {
        return "";
    }
    return postType.charAt(0).toUpperCase() + postType.slice(1);
}



/**
 * 
 * @param {any} raw 
 * @returns {PostBusiness}
 */
export function mapApiPostBusinessToUiPostBusiness(raw) {
    if(!raw) {
        throw new Error("mapApiPostBusinessToUiPostBusiness: raw post business is required");
    }

  

    return {
        id: raw.id,
        name: raw.name,
        username: raw.username,
        logoUrl: raw.logo_url,
        verificationStatus: raw.verification_status,
        isBusinessVerified: raw.verification_status === "verified"
    }
}

/**
 * 
 * @param {any} raw
 * @returns {PostAuthor}
 */
export function mapApiAuthorToUiAuthor(raw){

    if(!raw) {
        throw new Error("mapApiAuthorToUiAuthor: raw author is required");
    }
    return {
        id: raw.id,
        firstName: raw.first_name,
        lastName: raw.last_name,
        avatarUrl: raw.avatar_url,
        accountVerified: raw.account_verified
    }
}


/**
 * @param {any} raw
 * @returns {Comment}
 */
export function mapApiCommentToUiComment(raw) {



    // console.log("mapApiCommentToUiComment: mapped comment replies", mappedCommentReplies);

  
    if(!raw) {
        throw new Error("mapApiCommentToUiComment  : raw comment is required");
    }

    return {
      id: raw.id,
      author: mapApiAuthorToUiAuthor(raw?.author),
      content: raw.content,
      createdAt: raw.created_at || raw.createdAt,
      hasMoreReplies: raw.has_more_replies,
      imageUrls: raw.image_urls,
      videoUrls: raw.video_urls,
      parentId: raw.parent_id,
      postId: raw.post_id,
      replies: raw.replies?.map(mapApiCommentToUiComment) || null,
      updatedAt: raw.updatedAt || raw.updated_at,
      stats: {
         repliesCount: raw.stats?.replies_count,
         likesCount: raw.stats?.likes_count,
         viewsCount: raw.stats?.views_count,
         bookmarksCount: raw.stats?.bookmarks_count
      }
      

    }
}



/**
 * Map a raw API post into our UI PostShape
 * 
 * @param {any} raw
 * @returns {PostDetail}
 * 
 */

export function mapApiPostToUiPost(raw) {


   
    if(!raw) {
        throw new Error("mapApiPostToUiPost: raw post is required")
    }
    return {
        id: raw.id || "",
        business: mapApiPostBusinessToUiPostBusiness(raw.business),
        content: raw.content || "",
        imageUrls: Array.isArray(raw.image_urls) ? raw.image_urls : [],
        videoUrls: Array.isArray(raw.video_urls) ? raw.video_urls : [],
        visibility: raw.visibility || "public",
        stats: raw.stats,
        currentUserLiked: raw.current_user_liked || false,
        currentUserDisliked: raw.current_user_disliked || false,
        currentUserBookmarked: raw.current_user_bookmarked || false,
        postType: raw.post_type,
        title: raw.title,
        createdAt: raw.created_at || null,
        updatedAt:  raw.updated_at || null,
        author: mapApiAuthorToUiAuthor(raw.author)

    }
}


/**
 * 
 * @param {AxiosResponse} response 
 * @returns {{success: boolean, message: string, post:PostOverview}}
 */
 export function normalisedCreatePostResponse(response){

    if(!response){
        return {success: null, message: null, post: null}

    }

    
    const {success, message, data} = response;

    const post = data ? mapApiPostToUiPost(data) : null;

   
     return {success, message, post}

 }

 
/**
 * 
 * @param {AxiosResponse} response 
 * @returns {{posts: PostDetail[], meta: FeedMeta }} 
 */
 export function normaliseFeedResponse(response) {

    if(!response) throw new Error("normalizeFeedResponse: Response is required");

    const rawPosts = Array.isArray(response.posts) ? response.posts: [];


     const posts = rawPosts.map((rawPost) => {

        const normalised = mapApiPostToUiPost(rawPost);

        return normalised
     });

   


    const meta = !Array.isArray(response) && response.meta ? response.meta : null;

   
    return {posts, meta}
 }

 /**
  * @param {AxiosResponse} response
  * @returns {{success: boolean, message: string, comment: Comment}}
  */
 export function normaliseCreateCommentResponse(response) {
    if(!response) throw new Error("normalizeCreateCommentResponse: Response is required");

 
    const {success, message, data} = response;

    
    const comment = mapApiCommentToUiComment(data);

    return {success, message, comment}

 }

 /**
  * @param {AxiosResponse} response
  * @returns {success: boolean, message: string, imageUrls: string[], videoUrls: string[]}
  */
 export function normaliseUploadMediaResponse(response) {
 
    const {success, message, image_urls, video_urls} = response;
    return {
        success,
        message, 
        imageUrls: image_urls || [],
        videoUrls: video_urls || []
    }
 }


  /**
  * @param {AxiosResponse} response
  * @param {"post_like"|"post_bookmark"|"post_view" } action
  * @returns {{success: boolean, message: string, postId: string, postStats: PostStats}}
  */
 export function normalisePostActionResponse(response, action="post_like") {


    const {message, postId, stats, success} = response;

    if(action ==="post_bookmark" && success) {
        return {
            success,
            message,
            postId,
            postStats: {
                bookmarksCount: stats.bookmarks_count
            }
        }
    }

    if(action === "post_view" && success){
     return {
           success,
        message,
        postId,
        postStats: {
            viewsCount: stats.views_count
        }
     }
      
    }



    return {
        success,
        message,
        postId,
        postStats: {
            likesCount: stats.likes_count,
        } ,
    
    }
 }

 /**
  * 
  * @param {AxiosResponse} response 
  * @returns {{success: boolean, message: string, comments: Comment[], meta: FeedMeta}}
  */
 export function normaliseCommentFeedResponse(response){


    const {comments,message, meta, success} = response;

    const mappedComments = comments.map(comment => {
        return mapApiCommentToUiComment(comment);
    });



    return {
        comments: mappedComments,
        meta,
        message, success
    }

 }


  /**
  * 
  * @param {AxiosResponse} response 
  * @returns {{success: boolean, message: string, replies: Comment[], meta: FeedMeta}}
  */
 export function normaliseRepliesResponse(response) {
  

    const {success, replies, message, meta} = response;

    const mappedReplies = replies.map((reply) => {
        return mapApiCommentToUiComment(reply);
    });



    return {
        replies: mappedReplies,
        meta,
        message,
        success: success
    };
 }

/**
 * 
 * @param {AxiosResponse} response 
 * @returns {{post: PostDetail, success: boolean, message: string }} 
 */

export function normalisePostDetailResponse(response) {
    const {post, success, message} = response;
    const mappedPost = mapApiPostToUiPost(post);

    return {post: mappedPost, success, message}
}










