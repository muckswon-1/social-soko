const path = require('node:path');
const fs = require('node:fs');
const multer = require('multer');
const UTILS = require('./utils');

const ACCEPTED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

 const UPLOADS_ROOT = path.join(__dirname,"..","..","uploads");




function createUploader({folderName, fieldName = "image", identifier=null}) {


 function resolveIdentifier(req) {
     if( typeof identifier === "string") return identifier;
  if(typeof identifier === "function") return identifier(req)

    return (
        req.params?.id || req.params?.userId || req.user?.id || req.user?.userId || req.params?.businessId || req.params?.profileId || "unknown"
    )
 }
   
    
  const TARGET_DIR = path.join(UPLOADS_ROOT, folderName);

    // // Ensure folder exists
    if(!fs.existsSync(UPLOADS_ROOT)) fs.mkdirSync(UPLOADS_ROOT);
    if(!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR);


    // Configure multer storage
    const storage = multer.diskStorage({
        destination: (req,file, cb) => cb( null, TARGET_DIR),
        filename: (req,file,cb) => {
             const id = resolveIdentifier(req);
            const ext = path.extname(file.originalname) || ".png";
            const base = `${folderName}-${id || "unknown"}-${Date.now()}${ext}`;
            cb(null, base);
        }
    });


    const fileFilter = (req, file, cb) => {

        if(!ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
            return cb(
                UTILS.httpError(400, "Invalid file type. Only PNG, JPG, JPEG, and WEBP are allowed"),
                false
            );
        }
        cb(null, true);
    };

    return multer({
        storage, fileFilter, limits: {fileSize: 15 * 1024 * 1024}
    }).single(fieldName);
}

module.exports = {createUploader, UPLOADS_ROOT};