const express = require('express');
const { verifyAccessToken } = require('../../middleware/security');
const bookmarkPost = require('../../controllers/posts/bookmarkPost');

const bookmarkPostRoute = express.Router();

bookmarkPostRoute.post('/bookmark/:postId', verifyAccessToken,bookmarkPost);

module.exports = bookmarkPostRoute;

