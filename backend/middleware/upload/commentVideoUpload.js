const { videoUploader } = require("../../utils/multerFactory");

module.exports = videoUploader({
    folderName: "comments",
    fieldName: "comment_video",

})