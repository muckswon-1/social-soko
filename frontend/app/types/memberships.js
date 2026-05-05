/**
 * @typedef {Object} MembershipRequestUser
 * @property {string|null} id
 * @property {string|null} email
 * @property {string|null} firstName
 * @property {string|null} lastName
 */

/**
 * @typedef {Object} MembershipRequest
 * @property {string|null} id
 * @property {string|null} businessId
 * @property {string|null} userId
 * @property {"pending"|"approved"|"rejected"|"cancelled"|null} status
 * @property {string|null} message
 * @property {string|null} reviewedByUserId
 * @property {string|null} reviewedAt
 * @property {string|null} createdAt
 * @property {string|null} updatedAt
 * @property {MembershipRequestUser|null} user
 */

/**@typedef {Object} NormaliseMembershipRequestListResponse
 * @property {boolean} success
 * @property {{
 * rows: MembershipRequest[],
 * count: number,
 * page: number,
 * limit: number
 * }} data
 */

/**
 * @typedef {Object} NormalisedCreateMembershipRequestResponse
 * @property {boolean} success
 * @property {string|null} message
 * @property {MembershipRequest|null} request
 */

/**
 * @typedef {Object} ApprovedBusinessMembershipRequest
 * @property {string|null} id
 * @property {string|null} businessId
 * @property {string|null} userId
 * @property {"pending"|"approved"|"rejected"|null} status
 * @property {string|null} message
 * @property {string|null} reviewedByUserId
 * @property {string|null} reviewedAt
 * @property {string|null} createdAt
 * @property {string|null} updatedAt
 */

/**
 * @typedef {Object} NormalisedApproveBusinessMembershipRequestResponse
 * @property {boolean} success
 * @property {string|null} message
 * @property {ApprovedBusinessMembershipRequest|null} request
 */

export {};
