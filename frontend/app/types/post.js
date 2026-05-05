/**
 * Shared primitives + User
 */
/// <reference path="common.js" />

/**
 * @typedef {import("./common").UUID} UUID
 * @typedef {import("./common").StringType} StringType
 *  @typedef {import("./common").NullableBoolean}NullableBoolean
 * @typedef {import("./common").NullableString} NullableString
 * @typedef {import("./common").Timestamp} Timestamp
 * @typedef {import("./business").Business} Business
 * @typedef {import("./comment").Comment} Comment
 */

/**
 * We don't use full User here, but you can still import it if needed.
 * @typedef {import("./user").User} User
 */

/**
 * ----------------------------------------
 * Core enums / unions
 * ----------------------------------------
 */

/**
 * Who can see the post.
 *
 * @typedef {"public" | "private" | "friends" | "groups" | "custom"} PostVisibility
 */

/**
 * High-level classification of a post in the feed.
 * Can be extended as you add features.
 *
 * @typedef {"selling"| "buying"| "launching"| "promoting"| "informational"| "social"} PostType
 */

/**
 * ----------------------------------------
 * Related mini models
 * ----------------------------------------
 */

/**
 * Lightweight projection of a User attached to a post.
 * This matches what you currently map in `mapApiPostToUiPost`.
 *
 * @typedef {Object} PostAuthor
 * @property {UUID} id
 * @property {NullableString} firstName
 * @property {NullableString} lastName
 * @property {NullableString} avatarUrl
 * @property {boolean | null} accountVerified
 */

/**
 * Lightweight Business info attached to a post.
 * Frontend camelCase view (backend uses snake_case).
 *
 * @typedef {Object} PostBusiness
 * @property {UUID} id
 * @property {StringType} name
 * @property {StringType} username
 * @property {StringType} slug
 * @property {NullableString} logoUrl
 * @property {"none" | "requested" | "pending" | "verified" | "rejected"} [verificationStatus]
 * @property {boolean} isBusinessVerified
 */

/**
 * Media container for a post (URLs only; no blobs).
 *
 * @typedef {Object} PostMedia
 * @property {string[]} imageUrls
 * @property {string[]} videoUrls
 */

/**
 * Engagement & metrics for a post.
 * All fields optional to avoid forcing APIs to send everything.
 *
 * @typedef {Object} PostStats
 * @property {number} [viewsCount]
 * @property {number} [commentsCount]
 * @property {number} [inquiriesCount]
 * @property {number} [likesCount]
 * @property {number} [bookmarksCount]
 */


/**
 * Optional commerce-like fields for B2B/offer posts.
 * These line up with what we used in PostCard (productName, moq, etc.)
 *
 * @typedef {Object} PostDealMeta
 * @property {NullableString} [productName]
 * @property {NullableString} [category]
 * @property {number | null} [availableQty]
 * @property {number | null} [moq]
 * @property {number | null} [pricePerUnit]
 * @property {StringType} [currency]
 * @property {boolean} [priceOnRequest]
 */

/**
 * ----------------------------------------
 * Base post model
 * ----------------------------------------
 */

/**
 * BasePost models the minimal, normalized post data shared by
 * both overview cards and detailed views.
 *
 * This matches the output of your `mapApiPostToUiPost` transformer.
 *
 * Backend → Frontend mapping examples:
 * - business_id  → businessId
 * - image_urls   → imageUrls
 * - video_urls   → videoUrls
 * - createdAt    → createdAt (already camelCase)
 * - updatedAt    → updatedAt (already camelCase)
 *
 * @typedef {Object} BasePost
 *
 * @property {UUID} id
 * @property {Business} business
 * @property {string} content
 *
 * @property {string[]} imageUrls
 * @property {string[]} videoUrls
 *
 * @property {PostVisibility} visibility
 *
 * @property {Timestamp | null} createdAt
 * @property {Timestamp | null} updatedAt
 *
 * @property {UUID} groupId
 * @property {UUID} userId
 *
 * @property {PostType} [postType]
 * @property {string} title
 * @property {string[]} [tags]
 */

/**
 * ----------------------------------------
 * Overview vs Detail shapes
 * ----------------------------------------
 */

/**
 * PostOverview — the shape you use in the FEED grid / cards.
 *
 * This is what `normalizeFeedResponse` should ultimately produce
 * for each item in `posts`.
 *
 * @typedef {BasePost & PostDealMeta & {
 *   author: PostAuthor | null;
 *   business?: PostBusiness | null;
 *   stats?: PostStats;
 *   currentUserLiked: NullableBoolean 
 *   currentUserDisliked: NullableBoolean
 *   currentUserBookmarked: NullableBoolean
 * }} PostOverview
 */


/**
 * PostDetail — the extended shape for when a user opens a post
 * in a full modal / dedicated page.
 *
 * You can add more fields here as the detailed view grows
 * (e.g. full body, related posts, attachments, comments, etc.).
 *
 * @typedef {PostOverview & {
 *   fullContent?: string;
 *   canComment?: boolean;
 *   canRequestQuote?: boolean;
 *   comments?: Comment[];
 * }} PostDetail
 */



/**
 * For convenience, you can treat "Post" in your UI as the overview shape.
 *
 * Anywhere you previously did:
 *   @typedef {Object} Post
 *
 * You can now treat Post as an alias of PostOverview.
 *
 * @typedef {PostOverview} Post
 */

/**
 * ----------------------------------------
 * Feed response types
 * ----------------------------------------
 */

/**
 * @typedef {Object} FeedMeta
 * @property {number} page
 * @property {number} limit
 * @property {number} totalItems
 * @property {number} totalPages
 */

/**
 * Shape returned by `normalizeFeedResponse`
 * (the UI-level feed data, not the raw API).
 *
 * @typedef {Object} FeedResponse
 * @property {PostDetail[]} posts
 * @property {FeedMeta | null} meta
 */


/**
 * Shape of a form used to create a post
 * 
 * @typedef {Object} CreatePostForm
 * @property {UUID} business_id,
 * @property {string} title
 * @property {PostType} post_type
 * @property {NullableString} content,
 * @property {string[]} image_urls,
 * @property {string[]} video_urls,
 * @property {"public"| "private"| "followers" | "custom"} visibility,
 * 
 * 
 */


/**
 * @typedef {Object} MediaItem
 * @property {File} file
 * @property {string} previewUrl
 * @property {"image"|"video"} kind
 */



export {}

