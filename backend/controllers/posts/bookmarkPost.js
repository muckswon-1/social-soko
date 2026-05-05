const {Post,PostBookmark } = require("../../models");
const UTILS = require("../../utils/utils");

/**
 * @typedef {import("../../types/user").User} UserType
 * @typedef {import("../../types/post").BasePost} BasePost
 * @typedef {import("../../types/post").PostStats} PostStats
 */

module.exports = UTILS.catchAsync(
     /**
      * @param {import("express").Request} req
      * @param {import("express").Response} res
      */
    async (req,res) => {
        /**@type {UserType} */
        const user = req.user;
        const userId = user?.id;
        const {postId} = req.params;



    if(!userId) {
        throw UTILS.httpError(401, "Unauthorized");
    };

    if(!postId) {
        throw UTILS.httpError(400,"postId is required");
    }

    /**@type {BasePost} */
    const post = await Post.findByPk(postId);

    if(!post) {
        throw UTILS.httpError(404, "Post not found");
    }

   const existing = await PostBookmark.findOne({
    where: {post_id: postId, user_id: userId}
   });
   

  let isBookmarkRemoved = false;

   if(existing){
    isBookmarkRemoved = true;
    await existing.destroy();

   }else {
    await PostBookmark.create({
    post_id: postId,
    user_id: userId
   });


   }


   const bookmarksCount = await PostBookmark.count({
    where: {post_id: postId}
   })

   /**@type {PostStats} */
   const stats = {
    bookmarks_count: bookmarksCount,
   }

   return res.status(200).json({
       success: true,
       message: !isBookmarkRemoved ? "Post bookmarked successfully" : "Bookmark removed",
       postId,
       stats
   })




    }
)