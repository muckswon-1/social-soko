const { imageUploader } = require("../../utils/multerFactory");

module.exports = imageUploader({
    folderName: "comments",
    fieldName: "comment_image",
})
    
