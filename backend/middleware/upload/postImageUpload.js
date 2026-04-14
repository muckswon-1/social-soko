const { imageUploader } = require("../../utils/multerFactory");

module.exports = imageUploader({
    folderName: "posts",
    fieldName: "post_image",
   
})