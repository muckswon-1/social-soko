/**
 *   @typedef {import("../../types/post").PostStats} PostStats
 *   @typedef {import("../../types/post").BasePost} BasePost
 *   @typedef {import("../../types/user").User} UserType
 *  
 */


/**
 * @typedef {import("../../types/post").PostLike} PostLikeType
 */


const {Post, PostLike, PostDislike} = require("../../models");
const UTILS = require("../../utils/utils");


module.exports = UTILS.catchAsync(
  
  async (req, res, next) => {
    /** @type {UserType} */
    const user = req.user;

    const userId = user?.id;
    const { postId } = req.params;

    if (!userId) throw UTILS.httpError(401, "Unauthorized");
    if (!postId) throw UTILS.httpError(400, "postId is required");

    /** @type {BasePost|null} */
    const post = await Post.findByPk(postId);
    if (!post) throw UTILS.httpError(404, "Post not found");

  
    await PostDislike.findOrCreate({
      where: { post_id: postId, user_id: userId },
    });
    
     await PostLike.destroy({
      where: { post_id: postId, user_id: userId },
    });

  



    const likesCount = await PostLike.count({ where: { post_id: postId } });

    /** @type {PostStats} */
    const stats = { likes_count: likesCount };

    

  
    return res.status(200).json({
      success: true,
      message: "Like removed",
      postId,
      stats,
    });
  }
);
