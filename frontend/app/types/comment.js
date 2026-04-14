/**
 * @typedef {import("./common").UUID} UUID
 */

/**
 * Engagement & metrics for a post.
 * All fields optional to avoid forcing APIs to send everything.
 *
 * @typedef {Object} CommentStats
 * @property {number} [viewsCount]
 * @property {number} [repliesCount]
 * @property {number} [likesCount]
 * @property {number} [bookmarksCount]
 */




/**
 * Lightweight comment shape for UI
 *
 * @typedef {Object} CommentAuthor
 * @property {UUID} id
 * @property {string|null} firstName
 * @property {string|null} lastName
 * @property {string|null} avatarUrl
 */

 /**
  * @typedef {Object} Comment
  * @property {UUID} id
  * @property {string} postId
  * @property {CommentAuthor|null} author
  * @property {string|null} content
  * @property {string[]} [imageUrls]
  * @property {string[]} [videoUrls]
  * @property {string|null} createdAt
  * @property {string|null} updatedAt
  * @property {number} [likesCount]
  * @property {number} [repliesCount]
  * @property {boolean} hasMoreReplies
  * @property {UUID} parentId
  * @property {Comment[]} replies
  * @property {CommentStats} stats
  */

 /**
  * @typedef {Object} CreateCommentForm
  * @property {UUID} post_id
  * @property {string} content
  * @property {string[]} [image_urls]
  * @property {string[]} [video_urls]
  */

 export {}