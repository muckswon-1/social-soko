

/**
 * @typedef {import("./common").UUID} UUID
 * @typedef {import("./common").StringType} StringType
 * @typedef {import("./common").NullableString} NullableString
 * @typedef {import("./common").Timestamp} Timestamp
 * /

/**
 * @typedef {Object} Business
 *
 * @property {UUID} id
 *   Business UUID.
 *
 * @property {UUID} userId
 *   The owner user's UUID.
 *
 * @property {string} username
 *   Public business username.
 *
 * @property {string} name
 *   Official business name.
 *
 * @property {NullableString} description
 *   Short description or bio.
 *
 * @property {NullableString} website
 *   Business website URL.
 *
 * @property {NullableString} email
 *   Public-facing contact email.
 *
 * @property {NullableString} phoneNumber
 *   E.164 formatted phone number.
 *
 * @property {NullableString} address
 *   Street address.
 *
 * @property {NullableString} city
 *   City where the business is located.
 *
 * @property {NullableString} state
 *   State/Region.
 *
 * @property {NullableString} postalCode
 *   Postal/ZIP code.
 *
 * @property {NullableString} country
 *   Country.
 *
 * @property {NullableString} slug
 *   SEO-friendly profile slug.
 *
 * @property {NullableString} logoUrl
 *   URL to the business logo.
 *
 * @property {"requested"|"pending"|"verified"|"rejected"} verificationStatus
 *   Status of business verification.
 *
 * @property {NullableString} verificationRequestedAt
 *   ISO timestamp of verification request.
 *
 * @property {NullableString} verificationRejectedAt
 *   ISO timestamp when verification was rejected.
 *
 * @property {NullableString} verificationRejectedReason
 *   Explanation for rejection.
 *
 * @property {NullableString} verifiedAt
 *   ISO timestamp when verification was approved.
 *
 * @property {Timestamp} createdAt
 *   Creation timestamp.
 *
 * @property {Timestamp} updatedAt
 *   Last update timestamp.
 */


/**
 * @typedef {Object} BusinessForm
 * @property {string} username
 * @property {string} user_id
 * @property {string} address
 * @property {string} city
 * @property {string} country
 * @property {string} description
 * @property {string} email
 * @property {string} name
 * @property {string} phone
 * @property {string} postal_code
 * @property {string} state
 * @property {string} website
 * @property {string} logo_url
 * @property {string} slug
 * @property {"pending"|"requested"|"rejected"|"verified"|""} verification_status
 * @property {string|null} verification_requested_at
 * @property {string|null} verification_rejected_at
 * @property {string|null} verification_rejected_reason
 * @property {string|null} verified_at
 * @property {string|null} created_at
 * @property {string|null} updated_at
 */


/**
 * @typedef {Object} MyBusinessMembershipType
 * @property {string} id
 * @property {string} logo_url
 * @property {string} name
 * @property {string} slug
 * @property {string} role
 * @@property {string} verification_status
 */

/**
 * @typedef {Object} BusinessMembershipListItem
 * @property {Business} business
 * @property {"owner" | "admin" | "member" | null} membershipRole
 * @property {"active" | "banned" | null} membershipStatus
 */



/**
 * @typedef {Object} NormalisedFetchMyBusinessesResponse
 * @property {boolean} success
 * @property {string|null} message
 * @property {{
 *   rows: BusinessMembershipListItem[],
 *   count: number,
 *   page: number,
 *   limit: number
 * }} data
 */



/**
 * @typedef {Object} BusinessMemberUser
 * @property {string|null} id
 * @property {string|null} email
 * @property {string|null} firstName
 * @property {string|null} lastName
 * @property {string|null} fullName
 */

/**
 * @typedef {Object} BusinessMembership
 * @property {string|null} id
 * @property {string|null} businessId
 * @property {string|null} userId
 * @property {"owner"|"admin"|"member"|null} role
 * @property {"active"|"banned"|null} status
 * @property {string|null} createdAt
 * @property {string|null} updatedAt
 * @property {BusinessMemberUser|null} user
 */

/**
 * @typedef {Object} NormalisedBusinessMembershipListResponse
 * @property {boolean} success
 * @property {{
 *   rows: BusinessMembership[],
 *   count: number,
 *   page: number,
 *   limit: number,
 * }} data
 */


/**
 * @typedef {Object} BusinessSearchBusiness
 * @property {string | null} id
 * @property {string} name
 * @property {string} username
 * @property {string} slug
 * @property {string | null} logoUrl
 * @property {string | null} verificationStatus
 * @property {string | null} city
 * @property {string | null} state
 * @property {string | null} country
 */

/**
 * @typedef {Object} BusinessSearchRelationship
 * @property {"member" | "pending_request" | "none" | string} type
 * @property {"owner" | "admin" | "member" | string | null} role
 * @property {string | null} status
 * @property {string | null} requestedAt
 */

/**
 * @typedef {Object} BusinessSearchListItem
 * @property {BusinessSearchBusiness} business
 * @property {BusinessSearchRelationship} relationship
 * @property {boolean} canRequestMembership
 */

export {}