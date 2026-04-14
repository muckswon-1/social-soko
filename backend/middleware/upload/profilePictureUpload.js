const {imageUploader} = require("../../utils/multerFactory");


module.exports = imageUploader({
    fieldName: "profile_pic",
    folderName: "profile_pics",
})