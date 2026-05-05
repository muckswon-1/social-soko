const path = require('node:path');
const fs = require('node:fs');
const multer = require('multer');
const UTILS = require('./utils');
const {v4: uuidv4} = require('uuid');

const ACCEPTED_MIME_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

 const UPLOADS_ROOT = path.join(__dirname,"..","..","uploads");

/** 
  * @typedef {import("express").Request} ExpressRequest
 * @typedef {import("multer").Multer} MulterInstance
 * @typedef {import("multer").FileFilterCallback} FileFilterCallback
 * @typedef {import("multer").StorageEngine} StorageEngine
 * */



/**
 * Creates a configured multer uploader for handling **single image uploads**.
 *
 * Automatically:
 *  - Ensures target upload folders exist
 *  - Validates MIME types (PNG, JPG, JPEG, WEBP)
 *  - Generates safe filenames containing folderName + identifier
 *  - Uses multer's `.single(fieldName)` upload handler
 * @param {{
 *   folderName: string,
 *   fieldName?: string,
 * }} args
 *
 * @returns {MulterInstance['single']}  
 * A multer middleware function equivalent to `multer().single(fieldName)`
 */
function imageUploader({ folderName, fieldName = "image" }) {
  
  const TARGET_DIR = path.join(UPLOADS_ROOT, folderName);

  // Ensure folder structure exists
  if (!fs.existsSync(UPLOADS_ROOT)) fs.mkdirSync(UPLOADS_ROOT);
  if (!fs.existsSync(TARGET_DIR)) fs.mkdirSync(TARGET_DIR);

  /**
   * Multer local disk storage configuration
   * @type {StorageEngine}
   */
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, TARGET_DIR),
    filename: (req, file, cb) => {
      const id = uuidv4();
      const ext = path.extname(file.originalname) || ".png";
      const filename = `${folderName}-${id}-${Date.now()}${ext}`;
      cb(null, filename);
    }
  });

  /**
   * File filter for images only.
   *
   * @param {ExpressRequest} req
   * @param {Express.Multer.File} file
   * @param {FileFilterCallback} cb
   * 
   */
  const fileFilter = (req, file, cb) => {
    if (!ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
      return cb(
        UTILS.httpError(
          400,
          "Invalid file type. Only PNG, JPG, JPEG, and WEBP are allowed"
        ),
        false
      );
    }
    cb(null, true);
  };

  /**
   * Final multer instance (.single handler).
   *
   * @type {ReturnType<MulterInstance['single']>}
   */
  const uploader = multer({
    storage,
    fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 } // 15MB
  }).single(fieldName);

  return uploader;
}





/**
 * Creates a configured multer uploader for handling **single video uploads**.
 *
 * - Ensures the target upload folder exists
 * - Accepts only `video/*` MIME types
 * - Generates unique filenames using a UUID + timestamp
 * - Returns a standard Express middleware from `multer().single(fieldName)`
 *
 * @param {{
 *   folderName: string;
 *   fieldName?: string;
 * }} args
 *
 * @returns {ReturnType<MulterInstance['single']>}
 *   A multer middleware function equivalent to `multer().single(fieldName)`
 */
function videoUploader({ folderName, fieldName = "video" }) {
  const TARGET_DIR = path.join(UPLOADS_ROOT, folderName);

  // Ensure folder structure exists
  if (!fs.existsSync(UPLOADS_ROOT)) {
    fs.mkdirSync(UPLOADS_ROOT, { recursive: true });
  }
  if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
  }

  /**
   * Multer local disk storage configuration.
   *
   * @type {StorageEngine}
   */
  const videoStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, TARGET_DIR);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext);
      const timestamp = Date.now();
      const id = uuidv4();

      const filename = `${folderName}-${id}-${timestamp}-${base}${ext}`;
      cb(null, filename);
    }
  });

  /**
   * File filter for videos only.
   *
   * @param {ExpressRequest} req
   * @param {Express.Multer.File} file
   * @param {FileFilterCallback} cb
   */
  const videoFilter = (req, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed"), false);
    }
    cb(null, true);
  };

  /**
   * Final multer instance (.single handler).
   *
   * @type {ReturnType<MulterInstance['single']>}
   */
  const uploader = multer({
    storage: videoStorage,
    fileFilter: videoFilter,
    limits: {
      fileSize: 1024 * 1024 * 100 // 100MB
    }
  }).single(fieldName);

  return uploader;
}






module.exports = {imageUploader, videoUploader, UPLOADS_ROOT};