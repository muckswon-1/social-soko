
const {Post} = require("../../models");
const buildFileUrl = require("../../utils/buildFileUrl");
const { UPLOADS_ROOT } = require("../../utils/multerFactory");
const UTILS = require("../../utils/utils");

const uploadPostVideo = UTILS.catchAsync(async (req, res) => {
    const {postId} = req.params;

      if(!postId) throw UTILS.httpError(400, "Post id is required");

    // Make sure the post exists
    const post = await Post.findByPk(postId);
    if(!post) throw UTILS.httpError(404, "Post not found");

    // file from multer
    const postVideo = req.file;

     if(!postVideo) throw UTILS.httpError(400, "No post image was uploaded");

    //Enforce logged in user owns the post
    if(post.user_id !== req.user.id) throw UTILS.httpError(403, "You are not authorized to upload an image to this post");

     //Update the post with the video url
    const relativePath = postVideo.path.replace(UPLOADS_ROOT, "").replace(/\\/g, "/");

    const postVideoUrl = buildFileUrl(req, relativePath);

    post.video_urls = [postVideoUrl];
    await post.save();

    return res.status(200).json({
        success: true,
        message: "Video(s) uploaded successfully",
        video_urls: post.video_urls
    })

});

module.exports = uploadPostVideo;