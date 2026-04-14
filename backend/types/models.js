/**
 * ============================================================
 * SEQUELIZE MODELS REGISTRY (SOKONI BACKEND)
 * ============================================================
 *
 * Canonical typing for the `models` object injected via:
 *
 *   req.app.get("models")
 *
 * All services, helpers, and permission utilities MUST depend
 * on this registry instead of importing Sequelize models directly.
 *
 * This enables:
 * - correct IntelliSense / autocomplete
 * - strict permission logic
 * - safe refactoring
 */

/**
 * @typedef {import("./common").UUID} UUID
 * @typedef {import("./common").StringType} StringType
 * @typedef {import("./common").NullableString} NullableString
 * @typedef {import("./common").NullableBoolean} NullableBoolean
 * @typedef {import("./common").Timestamp} Timestamp
 */

/**
 * ============================================================
 * ENUMS
 * ============================================================
 */

/**
 * Business verification lifecycle.
 *
 * @typedef {"pending" | "requested" | "verified" | "rejected"} BusinessVerificationStatus
 */

/**
 * Business membership role hierarchy.
 *
 * owner > admin > member
 *
 * @typedef {"member" | "admin" | "owner"} BusinessRole
 */

/**
 * Business membership state.
 *
 * @typedef {"active" | "banned"} BusinessMembershipStatus
 */

/**
 * Membership request workflow.
 *
 * @typedef {"pending" | "approved" | "rejected" | "cancelled"} MembershipRequestStatus
 */

/**
 * Post visibility scope.
 *
 * @typedef {"public" | "members" | "admins_owner" | "owner" | "custom"} PostVisibility
 */

/**
 * Post semantic type.
 *
 * @typedef {"selling" | "buying" | "launching" | "promoting" | "informational" | "social"} PostType
 */

/**
 * User global platform role.
 *
 * @typedef {"admin" | "business" | "customer"} UserRole
 */

/**
 * ============================================================
 * MODEL SHAPES (ROW-LEVEL)
 * ============================================================
 */

/**
 * @typedef {Object} BusinessModel
 * @property {UUID} id
 * @property {StringType} username
 * @property {StringType} name
 * @property {NullableString} description
 * @property {NullableString} website
 * @property {NullableString} slug
 * @property {UUID} user_id
 * @property {NullableString} address
 * @property {NullableString} city
 * @property {NullableString} state
 * @property {NullableString} country
 * @property {NullableString} postal_code
 * @property {NullableString} phone
 * @property {NullableString} email
 * @property {NullableString} logo_url
 * @property {BusinessVerificationStatus} verification_status
 * @property {NullableString} verification_rejected_reason
 * @property {Timestamp} created_at
 * @property {Timestamp} updated_at
 */

/**
 * @typedef {Object} BusinessMembershipModel
 * @property {UUID} id
 * @property {UUID} business_id
 * @property {UUID} user_id
 * @property {BusinessRole} role
 * @property {BusinessMembershipStatus} status
 * @property {Timestamp} created_at
 * @property {Timestamp} updated_at
 */

/**
 * @typedef {Object} BusinessMembershipRequestModel
 * @property {UUID} id
 * @property {UUID} business_id
 * @property {UUID} user_id
 * @property {MembershipRequestStatus} status
 * @property {NullableString} message
 * @property {NullableString} reviewed_by_user_id
 * @property {Timestamp | null} reviewed_at
 * @property {Timestamp} created_at
 * @property {Timestamp} updated_at
 */

/**
 * @typedef {Object} PostModel
 * @property {UUID} id
 * @property {UUID} business_id
 * @property {UUID} user_id
 * @property {UUID | null} group_id
 * @property {NullableString} content
 * @property {string[]} image_urls
 * @property {string[]} video_urls
 * @property {PostVisibility} visibility
 * @property {PostType} post_type
 * @property {StringType} title
 * @property {Timestamp} created_at
 * @property {Timestamp} updated_at
 */

/**
 * @typedef {Object} CommentModel
 * @property {UUID} id
 * @property {UUID} post_id
 * @property {UUID} user_id
 * @property {UUID | null} parent_id
 * @property {NullableString} content
 * @property {string[]} image_urls
 * @property {string[]} video_urls
 * @property {Timestamp} created_at
 * @property {Timestamp} updated_at
 */

/**
 * @typedef {Object} PostLikeModel
 * @property {UUID} id
 * @property {UUID} post_id
 * @property {UUID} user_id
 * @property {Timestamp} created_at
 */

/**
 * @typedef {Object} PostDislikeModel
 * @property {UUID} id
 * @property {UUID} post_id
 * @property {UUID} user_id
 * @property {Timestamp} created_at
 */

/**
 * @typedef {Object} PostBookmarkModel
 * @property {UUID} id
 * @property {UUID} post_id
 * @property {UUID} user_id
 * @property {Timestamp} created_at
 */

/**
 * @typedef {Object} PostViewEventModel
 * @property {UUID} id
 * @property {UUID} post_id
 * @property {UUID} user_id
 * @property {UUID} session_id
 * @property {UUID} view_source
 * @property {UUID | null} client_event_id
 * @property {Timestamp} created_at
 */

/**
 * @typedef {Object} CommentLikeModel
 * @property {UUID} id
 * @property {UUID} comment_id
 * @property {UUID} user_id
 * @property {Timestamp} created_at
 */

/**
 * @typedef {Object} EmailJobModel
 * @property {UUID} id
 * @property {UUID | null} user_id
 * @property {StringType} to
 * @property {StringType} template
 * @property {Object} payload
 * @property {StringType} status
 * @property {number} attempts
 * @property {NullableString} last_error
 * @property {Timestamp | null} scheduled_at
 * @property {Timestamp | null} sent_at
 * @property {Timestamp} created_at
 */

/**
 * @typedef {Object} UserModel
 * @property {UUID} id
 * @property {NullableString} first_name
 * @property {NullableString} last_name
 * @property {StringType} email
 * @property {NullableString} phone
 * @property {UserRole} role
 * @property {boolean} email_verified
 * @property {boolean} account_verified
 * @property {NullableString} avatar_url
 * @property {Timestamp} created_at
 * @property {Timestamp} updated_at
 */

/**
 * @typedef {Object} VerificationTokenModel
 * @property {UUID} id
 * @property {UUID} user_id
 * @property {StringType} token
 * @property {StringType} token_type
 * @property {Timestamp} expires_at
 * @property {Timestamp} created_at
 */

/**
 * ============================================================
 * MODELS REGISTRY (DI CONTAINER)
 * ============================================================
 */

/**
 * @typedef {Object} Models
 *
 * @property {import("sequelize").ModelStatic<BusinessModel>} Business
 * @property {import("sequelize").ModelStatic<BusinessMembershipModel>} BusinessMembership
 * @property {import("sequelize").ModelStatic<BusinessMembershipRequestModel>} BusinessMembershipRequest
 *
 * @property {import("sequelize").ModelStatic<PostModel>} Post
 * @property {import("sequelize").ModelStatic<PostLikeModel>} PostLike
 * @property {import("sequelize").ModelStatic<PostDislikeModel>} PostDislike
 * @property {import("sequelize").ModelStatic<PostBookmarkModel>} PostBookmark
 * @property {import("sequelize").ModelStatic<PostViewEventModel>} PostViewEvent
 *
 * @property {import("sequelize").ModelStatic<CommentModel>} Comment
 * @property {import("sequelize").ModelStatic<CommentLikeModel>} CommentLike
 *
 * @property {import("sequelize").ModelStatic<UserModel>} User
 * @property {import("sequelize").ModelStatic<EmailJobModel>} EmailJob
 * @property {import("sequelize").ModelStatic<VerificationTokenModel>} VerificationToken
 */

export {};
