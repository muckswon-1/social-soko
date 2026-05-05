const bookmarkPostRoute = require('./bookmarkPostRoute');
const createCommentRoute = require('./createCommentRoute');
const createPostRoute = require('./createPostRoute');
const createPostViewRoute = require('./createPostViewRoute');
const getCommentRepliesRoute = require('./getCommentRepliesRoute');
const getCommentsRoute = require('./getCommentsRoute');
const getFeedRoute = require('./getFeedRoute');
const getPostByIdRoute = require('./getPostByIdRoute');
const likePostRoute = require('./likePostRoute');
const unlikePostRoute = require('./unlikePostRoute');
const uploadCommentImageRoute = require('./uploadCommentImageRoute');
const uploadCommentVideoRoute = require('./uploadCommentVideoRoute');
const uploadPostImageRoute = require('./uploadPostImageRoute');
const uploadPostVideoRoute = require('./uploadPostVideoRoute');


const postsRoutes = require('express').Router();

postsRoutes.get("/test", (req, res) => {
    res.send("Hello World");
});


postsRoutes.use(getFeedRoute);
postsRoutes.use(createPostRoute);
postsRoutes.use(likePostRoute);
postsRoutes.use(unlikePostRoute);
postsRoutes.use(getCommentsRoute);
postsRoutes.use(createCommentRoute);
postsRoutes.use(uploadPostImageRoute);
postsRoutes.use(uploadPostVideoRoute);
postsRoutes.use(uploadCommentImageRoute);
postsRoutes.use(uploadCommentVideoRoute);
postsRoutes.use(bookmarkPostRoute);
postsRoutes.use(createPostViewRoute);
postsRoutes.use(getCommentRepliesRoute);
postsRoutes.use(getPostByIdRoute);

module.exports = postsRoutes;