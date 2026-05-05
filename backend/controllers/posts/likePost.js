/**
 *   @typedef {import("../../types/post").PostStats} PostStats
 *   @typedef {import("../../types/post").BasePost} BasePost
 *   @typedef {import("../../types/user").User} UserType
 */


/**
 * @typedef {import("../../types/post").PostLike} PostLikeType
 */

/**
 * Result returned by Sequelize findOrCreate for PostLike.
 *
 * Tuple:
 * - [0] PostLike instance
 * - [1] created (boolean) — true if a new row was created, false if it already existed
 *
 * @typedef {[PostLikeType, boolean]} PostLikeFindOrCreateResult
 */

const {Post, PostLike, EmailJob, User} = require("../../models");
const UTILS = require("../../utils/utils");


module.exports = UTILS.catchAsync(async (req,res) => {

    /**@type UserType */
    const sessionUser = req?.user;
    const userId = sessionUser?.id || null;

    const {postId} = req.params;


    if(!userId) {
        throw UTILS.httpError(401, "Unauthorized")
    };

    if(!postId) {
        throw UTILS.httpError(400,"postId is required");
    }

    /**@type {BasePost} */
    const post = await Post.findByPk(postId);

    if(!post) {
        throw UTILS.httpError(404, "Post not found");
    }



 
    /**@type {PostLikeFindOrCreateResult} */
    const [likeInstance,created] = await PostLike.findOrCreate({
        where: {
            post_id: postId,
            user_id: userId
        }
    });

    

    const likesCount = await PostLike.count({where: {post_id: postId}});

    /**@type {PostStats} */
    const stats = {
        likes_count: likesCount
    }




     if(post.user_id !== userId){
        try {
            /**@type {UserType} */
            const postOwner = await User.findByPk(post.user_id);
            /**@type {UserType} */
            const likePostOwner = await User.findByPk(likeInstance.user_id);

         if(created){
                await EmailJob.create({
                to: postOwner.email,
                template: "postLiked",
                payload: {
                    email: postOwner.email,
                    recipientName: postOwner.first_name,
                    actorName: likePostOwner.first_name,
                    actorAvatarUrl: likePostOwner.avatar_url,
                    postExcerpt: post.content,
                    totalLikes: likesCount
                }
            });
         }

          
           
        
        } catch (error) {
            
        }
    }




    return res.status(200).json({
        success: true,
        message: created ? "Post liked successfully" : "User already liked post",
        postId,
        stats
    })

})