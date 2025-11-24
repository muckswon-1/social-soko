const express = require("express");
const { verifyAccessToken, requireRole } = require("../../middleware/security");
const uploadBusinessLogo = require("../../controllers/business/uploadBusinessLogo");
const { ROLES } = require("../../constants/roles");
const businessLogoUpload = require("../../middleware/upload/businessLogoUpload");

const uploadLogoRoute = express.Router();

/**
 * @swagger
 * /api/v1/business/upload-logo/{id}:
 *   post:
 *     summary: Upload or replace the business logo
 *     description: >
 *       Allows an authenticated user to upload a logo image for a business they own.
 *       The image is handled via multipart/form-data, validated, processed, stored,
 *       and the final public logo URL is saved to the business record.
 *
 *     tags:
 *       - Business
 *
 *     security:
 *       - AccessToken: []    # Your JWT cookie-based auth
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the business to update.
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - logo
 *             properties:
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: >
 *                   The logo image file (PNG, JPG, or WEBP).  
 *                   Max size: 3MB (frontend) / 5MB (backend recommended).
 *
 *     responses:
 *       200:
 *         description: Logo uploaded successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Logo uploaded successfully
 *                 logo_url:
 *                   type: string
 *                   example: "https://yourdomain.com/uploads/logos/biz-123.webp"
 *                 business:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "61718ded-da6d-4418-ac45-5a09d0369acf"
 *                     name:
 *                       type: string
 *                       example: "ETAC Service and Supply Inc"
 *                     logo_url:
 *                       type: string
 *                       example: "https://yourdomain.com/uploads/logos/biz-123.webp"
 *
 *       400:
 *         description: Missing file or invalid upload.
 *
 *       401:
 *         description: Not authenticated.
 *
 *       403:
 *         description: Forbidden — User does not own this business.
 *
 *       404:
 *         description: Business not found.
 *
 *       429:
 *         description: Too many requests (rate limit).
 */

 uploadLogoRoute.post("/upload-logo/:id", verifyAccessToken, requireRole(ROLES.ADMIN, ROLES.BUSINESS),
    
    (req,res, next) => {
    businessLogoUpload(req,res,(err) => {
        if(err) return next(err);
        next();
    })

    
},

uploadBusinessLogo

);

module.exports = uploadLogoRoute