const {createUploader} = require("../../utils/multerFactory");

module.exports = createUploader({
    folderName: "logos",
    fieldName: "logo",
    identifier: (req) => req.params.id
})