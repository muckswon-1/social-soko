/**@typedef {import("../../types/common").UUID} UUID */
/**@typedef {import("../../types/models").PostModel} PostModel */
/**@typedef {import("../../types/models").Models} ModelsType */
/**@typedef {import("../../types/models").BusinessMembershipModel} BusinessMembershipModel */

const { getBusinessMemberShip } = require("../../utils/permissions/businessPermissions");
const { canCreateComment } = require("../../utils/permissions/commentPermissions");
const UTILS = require("../../utils/utils");

module.exports = UTILS.catchAsync(async (req,res) => {
    /**@type {ModelsType} */
    const models = req.app.get("models");

    const {Post, Comment, User} = models;


    /**@type {UUID} */
    const userId = req.user?.id;
    /**@type {UUID} */
    const {postId} = req.params;


    if(!userId) {
        throw UTILS.httpError(401,"Unauthorized")
    }

    if(!postId) {
        throw UTILS.httpError(400, "postId is required")
    }

    /**@type {PostModel} */
    const post = await Post.findByPk(postId);

    if(!post) {
        throw UTILS.httpError(404, "Post not found")
    }

    /**@type {BusinessMembershipModel} */
    let membership = null;

    if(userId && post.business_id){
        membership = await getBusinessMemberShip(models, {businessId: post.business_id, userId});
    }

    const  canComment = canCreateComment({post, userId, membership});

    if(!canComment) throw UTILS.httpError(403, "You are not allowed to comment on this post");

    
    const {
        content = null,
        image_urls = [],
        video_urls = [],
        parent_id = null,
    } = req.body;


    


    const hasText = content && content.trim().length > 0;
    const hasImages = Array.isArray(image_urls) && image_urls.length > 0;
    const hasVideos = Array.isArray(video_urls) && video_urls.length > 0;


    const comment = await  Comment.create({
        user_id: userId,
        post_id: postId,
        parent_id,
        content: hasText ? content : null,
        image_urls: hasImages ? image_urls : [],
        video_urls: hasVideos ? video_urls : [],
    });

    const commentModel = await Comment.findByPk(comment.id, {
        attributes: ["id","post_id","parent_id","content","image_urls","video_urls","created_at","updated_at"],
        include: [
            {
                model: User,
                attributes: ["id", "first_name", "last_name", "avatar_url"],
                as: "author"
            }

        ]
        
    });


    return res.status(201).json({
        success: true,
        message: "Comment added",
        data: commentModel
    });

});