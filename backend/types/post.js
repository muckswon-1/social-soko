/**
 * Backend Post Types (same typedef names, snake_case fields)
 */

 /**
  * @typedef {import("./common").UUID} UUID
  * @typedef {import("./common").StringType} StringType
  * @typedef {import("./common").NullableString} NullableString
  * @typedef {import("./common").NullableBoolean} NullableBoolean
  * @typedef {import("./common").NullableNumber} NullableNumber
  * @typedef {import("./common").Timestamp} Timestamp
  * @typedef {import("./business").Business} Business
  * @typedef {import("./comment").Comment} Comment
  * @typedef {import("./user").User} User
  */

 /**
  * ----------------------------------------
  * ENUMS
  * ----------------------------------------
  */

 /**
 * ----------------------------------------
 * SOKONI POST VISIBILITY (B2B)
 * ----------------------------------------
 */

/**
 * Controls who can view a post.
 *
 * - public        → anyone (logged in or not)
 * - members       → active business members
 * - admins_owner  → admins and owners
 * - owner         → business owner only
 *
 * @typedef {"public" | "members" | "admins_owner" | "owner"} PostVisibility
 */

 /**
  * @typedef {"selling"| "buying"| "launching"| "promoting"| "informational"| "social"} PostType
  */

 /**
  * ----------------------------------------
  * RELATED MINI MODELS (snake_case)
  * ----------------------------------------
  */

 /**
  * @typedef {Object} PostAuthor
  * @property {UUID} id
  * @property {NullableString} first_name
  * @property {NullableString} last_name
  * @property {NullableString} avatar_url
  * @property {NullableBoolean} account_verified
  */

 /**
  * @typedef {Object} PostBusiness
  * @property {UUID} id
  * @property {StringType} name
  * @property {StringType} username
  * @property {StringType} slug
  * @property {NullableString} logo_url
  * @property {"none" | "requested" | "pending" | "verified" | "rejected"} [verification_status]
  * @property {NullableBoolean} is_business_verified
  */

 /**
  * @typedef {Object} PostMedia
  * @property {NullableString[]} image_urls
  * @property {NullableString[]} video_urls
  */

 /**
  * @typedef {Object} PostStats
  * @property {NullableNumber} [views_count]
  * @property {NullableNumber} [comments_count]
  * @property {NullableNumber} [inquiries_count]
  * @property {NullableNumber} [likes_count]
  * @property {NullableNumber} [dislikes_count]
  * @property {NullableNumber} [bookmarks_count]
  */

 /**
  * @typedef {Object} PostDealMeta
  * @property {NullableString} [product_name]
  * @property {NullableString} [category]
  * @property {NullableNumber} [available_qty]
  * @property {NullableNumber} [moq]
  * @property {NullableNumber} [price_per_unit]
  * @property {StringType} [currency]
  * @property {NullableBoolean} [price_on_request]
  */

 /**
  * ----------------------------------------
  * BASE POST (snake_case)
  * ----------------------------------------
  */

 /**
  * @typedef {Object} BasePost
  *
  * @property {UUID} id
  * @property {UUID} business_id
  * @property {UUID} user_id
  *
  * @property {string} title
  * @property {NullableString} content
  *
  * @property {string[]} image_urls
  * @property {string[]} video_urls
  *
  * @property {PostVisibility} visibility
  * @property {PostType} [post_type]
  * @property {string[] | null} [tags]
  *
  * @property {UUID | null} group_id
  *
  * @property {Timestamp | null} created_at
  * @property {Timestamp | null} updated_at
  */

 /**
  * ----------------------------------------
  * FEED SHAPES (backend, snake_case)
  * ----------------------------------------
  */

 /**
  * @typedef {BasePost & PostDealMeta & {
  *   author: PostAuthor | null;
  *   business?: PostBusiness | null;
  *   stats?: PostStats;
  * }} PostOverview
  */


 /**
  * @typedef {PostOverview & {
  *   full_content?: string;
  *   can_comment?: boolean;
  *   can_request_quote?: boolean;
  *   comments?: Comment[];
  * }} PostDetail
  */


 /**
  * Alias: post as overview
  *
  * @typedef {PostOverview} Post
  */


 /**
  * ----------------------------------------
  * FEED RESPONSE
  * ----------------------------------------
  */

 /**
  * @typedef {Object} FeedMeta
  * @property {number} page
  * @property {number} limit
  * @property {number} total_items
  * @property {number} total_pages
  */

 /**
  * @typedef {Object} FeedResponse
  * @property {PostDetail[]} posts
  * @property {FeedMeta | null} meta
  */


 /**
  * ----------------------------------------
  * CREATE POST FORM (backend snake_case)
  * ----------------------------------------
  */

 /**
  * @typedef {Object} CreatePostForm
  * @property {UUID} business_id
  * @property {string} title
  * @property {PostType} post_type
  * @property {NullableString} content
  * @property {string[]} image_urls
  * @property {string[]} video_urls
  * @property {"public"| "private"| "followers" | "custom"} visibility
  */

 /**
  * ----------------------------------------
  * MEDIA
  * ----------------------------------------
  */

 /**
  * @typedef {Object} MediaItem
  * @property {File} file
  * @property {string} preview_url
  * @property {"image"|"video"} kind
  */


 /**
 * PostLike Model (Backend Shape)
 *
 * Represents a "like" that a user gives to a post.
 *
 * Columns:
 * - id          : UUID primary key
 * - post_id     : FK → posts.id
 * - user_id     : FK → users.id
 * - created_at  : Timestamp
 * - updated_at  : Timestamp
 *
 * @typedef {Object} PostLike
 *
 * @property {UUID} id
 * @property {UUID} post_id
 * @property {UUID} user_id
 * @property {Timestamp} created_at
 * @property {Timestamp} updated_at
 */




 /**
 * ----------------------------------------
 * PERSISTED POST MODEL (backend canonical)
 * ----------------------------------------
 */

/**
 * Canonical backend Post model shape.
 *
 * This represents the persisted Post record as used in:
 * - permission checks
 * - visibility rules
 * - comment authorization
 *
 * It intentionally excludes:
 * - aggregated stats
 * - author/business joins
 * - frontend-only flags
 *
 * @typedef {Object} PostModel
 *
 * @property {UUID} id
 * @property {UUID} business_id
 * @property {UUID} user_id
 *
 * @property {string} title
 * @property {NullableString} content
 *
 * @property {string[]} image_urls
 * @property {string[]} video_urls
 *
 * @property {PostVisibility} visibility
 * @property {PostType} post_type
 *
 * @property {string[] | null} tags
 * @property {UUID | null} group_id
 *
 * @property {Timestamp | null} created_at
 * @property {Timestamp | null} updated_at
 */



export {};
