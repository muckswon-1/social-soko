const {Comment} = require("../../models");
const buildFileUrl = require("../../utils/buildFileUrl");
const { UPLOADS_ROOT } = require("../../utils/multerFactory");
const UTILS = require("../../utils/utils");


const uploadCommentImage = UTILS.catchAsync(async (req, res) => {
    const {commentId} = req.params;

    if(!commentId) throw UTILS.httpError(400, "Comment id is required");

    //make sure the comment exists
    const comment = await Comment.findByPk(commentId);
    if(!comment) throw UTILS.httpError(404, "Comment not found");

    //File from multer
    /**@type File */
    const commentImage = req.file;
    if(!commentImage) throw UTILS.httpError(400, "No comment image was uploaded");

    // Enforce logged in user owns the comment
    if(comment.user_id !== req.user.id) throw UTILS.httpError(403, "You are not authorized to upload an image to this comment");

    // Update the comment with the image url
    const relativePath = commentImage.path.replace(UPLOADS_ROOT, "").replace(/\\/g, "/");

    const commentImageUrl = buildFileUrl(req, relativePath);

    comment.image_urls = [commentImageUrl];
    await comment.save();

    return res.status(200).json({
        success: true,
        message: "Comment image uploaded successfully",
        image_urls: comment.image_urls
    });
        
});

module.exports = uploadCommentImage;