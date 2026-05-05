const {createUploader} = require("../../utils/multerFactory");


module.exports = createUploader({
    fieldName: "profile_pic",
    folderName: "profile_pics",
    identifier: (req) => req.user.id,
})