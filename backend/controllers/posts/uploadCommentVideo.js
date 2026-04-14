const {Comment} = require("../../models");
const buildFileUrl = require("../../utils/buildFileUrl");
const { UPLOADS_ROOT } = require("../../utils/multerFactory");
const UTILS = require("../../utils/utils");


const uploadCommentVideo = UTILS.catchAsync(async (req, res) => {
    const {commentId} = req.params;

    if(!commentId) throw UTILS.httpError(400, "Comment id is required");

    // Make sure comment exists
    const comment = await Comment.findByPk(commentId);

    if(!comment) throw UTILS.httpError(404, "Comment not found.");

    //File from multer
    const commentVideo = req.file;
    if(!commentVideo) throw UTILS.httpError(400, "No comment video was uploaded");

    // Enforce logged in user owns the comment
    if(comment.user_id !== req.user.id) throw UTILS.httpError(403, "You are not authorized to upload a video for this comment");

    // Build the video URL
    const relativePath = commentVideo.path.replace(UPLOADS_ROOT, "").replace(/\\/g, "/");

    const videoUrl = buildFileUrl(req, relativePath);

    comment.video_urls = [videoUrl];
    await comment.save();

    return res.status(200).json({
        success: true,
        message: "Video(s) uploaded successfully",
        video_urls: comment.video_urls
    });
});

module.exports = uploadCommentVideo;