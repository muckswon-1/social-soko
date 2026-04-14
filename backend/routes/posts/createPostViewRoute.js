const express = require('express');
const { verifyAccessToken } = require('../../middleware/security');
const createPostView = require('../../controllers/posts/createPostView');

const createPostViewRoute = express.Router();

createPostViewRoute.post('/view/:postId', verifyAccessToken, createPostView);

module.exports = createPostViewRoute;