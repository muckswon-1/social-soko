const { videoUploader } = require("../../utils/multerFactory");

module.exports = videoUploader({
    folderName: "posts",
    fieldName: "post_video",
});