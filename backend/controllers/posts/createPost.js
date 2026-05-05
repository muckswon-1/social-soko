
/**@typedef {import("../../types/models").BusinessMembershipModel} BusinessMembershipModel*/
const {Post, Business, User} = require("../../models");
const { canCreatePostType } = require("../../utils/permissions/postPermissions");
const UTILS = require("../../utils/utils");

module.exports = UTILS.catchAsync(async (req, res) => {
    const userId = req.user?.id;

    if(!userId) {
        throw UTILS.httpError(401, "Unauthorized")
    }

    const {
        business_id,
        content = "",
        title = "",
        post_type = "",
        image_urls = [],
        video_urls = [],
        group_id = null,
        visibility="public"
        } = req.body;
        
        
    if(!business_id) {
        throw UTILS.httpError(400, "Business ID is required")

    }

    /**@type {BusinessMembershipModel} */
    const membership = req.businessMembership;

    if(!canCreatePostType({postType: post_type, membership})) throw UTILS.httpError(403, `You cannot create  "${post_type}" posts for this business`)

   

    const hasText = content && content.trim().length > 0;
    const hasImages = Array.isArray(image_urls) && image_urls.length > 0;
    const hasVideos = Array.isArray(video_urls) && video_urls.length > 0;

    if(!title || !title.length > 0){
        throw UTILS.httpError(400, "Title is required")
    }

    if(!post_type || !post_type.length > 0){
        throw UTILS.httpError(400, "Post type is required")
    }


    const post = await Post.create({
        business_id,
        post_type,
        title,
        user_id: userId,
        content: hasText ? content.trim() : null,
        image_urls: hasImages ? image_urls : [],
        video_urls: hasVideos ? video_urls : [],
        group_id,
        visibility,
    });

  const postOverView = await Post.findByPk(post.id, {
    atrributes: ["id", "content", "image_urls", "video_urls","visibility", "post_type","created_at", "updated_at"],
    include: [
        {
            model: Business,
            as: "business",
            attributes: ["id", "name", "username", "slug","logo_url","verification_status"]
        },
        {
            model: User,
            as: "author",
            attributes: ["id", "first_name", "last_name","account_verified","avatar_url"]
        }
    ]

    
  })


    return res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: postOverView
    })


})