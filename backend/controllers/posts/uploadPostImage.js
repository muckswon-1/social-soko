
const {Post} = require("../../models");
const buildFileUrl = require("../../utils/buildFileUrl");
const { UPLOADS_ROOT } = require("../../utils/multerFactory");
const UTILS = require("../../utils/utils");



const uploadPostImage = UTILS.catchAsync(async (req,res) => {
    const { postId } = req.params;

   
    if(!postId) throw UTILS.httpError(400, "Post id is required");

    // Make sure the post exists
    const post = await Post.findByPk(postId);
    if(!post) throw UTILS.httpError(404, "Post not found");

    // File from multer
    /**@type File */
    const postImage  = req.file;

    if(!postImage) throw UTILS.httpError(400, "No post image was uploaded");

    //Enforce logged in user owns the post
    if(post.user_id !== req.user.id) throw UTILS.httpError(403, "You are not authorized to upload an image to this post");

    //Update the post with the image url
    const relativePath = postImage.path.replace(UPLOADS_ROOT, "").replace(/\\/g, "/");

    const postImageUrl = buildFileUrl(req, relativePath);

    post.image_urls = [postImageUrl];
    await post.save();

    return res.status(200).json({
        success: true,
        message: "Image(s) uploaded successfully",
        image_urls: post.image_urls

    })

});

module.exports = uploadPostImage;