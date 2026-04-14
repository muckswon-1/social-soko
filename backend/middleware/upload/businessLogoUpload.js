const {imageUploader} = require("../../utils/multerFactory");

module.exports = imageUploader({
    folderName: "logos",
    fieldName: "logo",
})