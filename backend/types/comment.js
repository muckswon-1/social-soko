/**
 * @typedef {import("./common").UUID} UUID
 * @typedef {import("./common").NullableString} NullableString
 * @typedef {import("./common").Timestamp} Timestamp
 * @typedef {import("./common").NullableNumber} NullableNumber
 */

 /**
  * Lightweight comment author (backend snake_case)
  *
  * @typedef {Object} CommentAuthor
  * @property {UUID} id
  * @property {NullableString} first_name
  * @property {NullableString} last_name
  * @property {NullableString} avatar_url
  */

 /**
  * Main Comment object (backend snake_case)
  *
  * @typedef {Object} Comment
  * @property {UUID} id
  * @property {UUID} post_id
  * @property {CommentAuthor|null} author
  * @property {NullableString} content
  * @property {NullableString[]} [image_urls]
  * @property {NullableString[]} [video_urls]
  * @property {Timestamp} created_at
  * @property {Timestamp} updated_at
  * @property {NullableNumber} [likes_count]
  * @property {NullableNumber} [replies_count]
  */

 /**
  * Shape for creating a comment (backend snake_case)
  *
  * @typedef {Object} CreateCommentForm
  * @property {UUID} post_id
  * @property {NullableString} content
  * @property {NullableString[]} [image_urls]
  * @property {NullableString[]} [video_urls]
  */

export {};
