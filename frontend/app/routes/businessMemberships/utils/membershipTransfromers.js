/**
 * @typedef {import("../../../types/business").BusinessMemberUser} BusinessMemberUser
 * @typedef {import("../../../types/business").BusinessMembership} BusinessMembership
 * @typedef {import("../../../types/business").NormalisedBusinessMembershipListResponse} NormalisedBusinessMembershipListResponse
 * @typedef {import("../../../types/memberships").MembershipRequest} MembershipRequest
 *  @typedef {import("../../../types/memberships").MembershipRequestUser} MembershipRequestUser
 *  @typedef {import("../../../types/memberships").NormaliseMembershipRequestListResponse} NormaliseMembershipRequestListResponse
 *  @typedef {import("../../../types/memberships").NormalisedCreateMembershipRequestResponse} NormalisedCreateMembershipRequestResponse
 *  @typedef {import("../../../types/memberships").ApprovedBusinessMembershipRequest} ApprovedBusinessMembershipRequest
 *  @typedef {import("../../../types/memberships").NormalisedApproveBusinessMembershipRequestResponse} NormalisedApproveBusinessMembershipRequestResponse
 */

/**
 * @param {any} user
 * @returns {BusinessMemberUser | null}
 */
export function mapApiMemberUserToUiUser(user) {
  if (!user) return null;

  const firstName = user.first_name || null;
  const lastName = user.last_name || null;

  const fullName =
    [firstName, lastName].filter(Boolean).join(" ").trim() || null;

  return {
    id: user.id || null,
    email: user.email || null,
    firstName,
    lastName,
    fullName,
  };
}

/**
 * @param {any} membership
 * @returns {BusinessMembership}
 */
export function mapApiBusinessMembershipToUiMembership(membership) {
  return {
    id: membership?.id || null,
    businessId: membership?.business_id || null,
    userId: membership?.user_id || null,
    role: membership?.role || null,
    user: mapApiMemberUserToUiUser(membership?.user),
    status: membership?.status || null,
    createdAt: membership?.created_at || null,
    updatedAt: membership?.updated_at || null,
  };
}

/**
 * Expected API shape:
 * {
 *   success: true,
 *   data: {
 *     rows: [...],
 *     count: 2,
 *     page: 1,
 *     limit: 50
 *   }
 * }
 *
 * @param {any} response
 * @returns {NormalisedBusinessMembershipListResponse}
 */
export function normaliseBusinessMembershipListResponse(response) {
  if (!response) {
    throw new Error(
      "normaliseBusinessMembershipListResponse: response is required",
    );
  }

  const rows = Array.isArray(response?.data?.rows)
    ? response.data.rows.map(mapApiBusinessMembershipToUiMembership)
    : [];

  return {
    success: Boolean(response?.success),
    data: {
      rows,
      count: Number(response?.data?.count ?? rows.length ?? 0),
      page: Number(response?.data?.page ?? 1),
      limit: Number(response?.data?.limit ?? 50),
    },
  };
}

/**
 * @param {any} business
 * @returns {{
 *   id: string|null,
 *   name: string,
 *   slug: string|null,
 *   logoUrl: string|null,
 *   verificationStatus: string|null,
 *   role: string|null
 * }}
 */
export function mapApiMyBusinessToUiBusiness(business) {
  return {
    id: business?.id || null,
    name: business?.name || "",
    slug: business?.slug || null,
    logoUrl: business?.logo_url || null,
    verificationStatus: business?.verification_status || null,
    role: business?.role || null,
  };
}

/**
 * Expected API shape:
 * {
 *   success: true,
 *   message: "Businesses fetched successfully",
 *   data: [...]
 * }
 *
 * @param {any} response
 * @returns {Array}
 */
export function normaliseListMyBusinessesResponse(response) {
  if (!response) {
    throw new Error("normaliseListMyBusinessesResponse: response is required");
  }

  return Array.isArray(response?.data)
    ? response.data.map(mapApiMyBusinessToUiBusiness)
    : [];
}

/**
 * @param {any} request
 * @returns {MembershipRequest}
 */
export function mapApiMembershipRequestToUiMembershipRequest(request) {
  return {
    id: request?.id || null,
    businessId: request?.business_id || null,
    userId: request?.user_id || null,
    status: request?.status || "pending",
    message: request?.message || null,
    reviewedByUserId: request?.reviewed_by_user_id || null,
    reviewedAt: request?.reviewed_at || null,
    createdAt: request?.created_at || request?.createdAt || null,
    updatedAt: request?.updated_at || request?.updatedAt || null,
    user: request?.user ? mapApiMemberUserToUiUser(request?.user) : null,
  };
}

/**
 * Expected API shape:
 * {
 *   success: true,
 *   message: "Membership request submitted",
 *   request: {
 *     id,
 *     business_id,
 *     user_id,
 *     status,
 *     message,
 *     reviewed_by_user_id,
 *     reviewed_at,
 *     created_at,
 *     updated_at
 *   }
 * }
 *
 * @param {any} response
 * @returns {NormalisedCreateMembershipRequestResponse}
 */
export function normaliseCreateMembershipRequestResponse(response) {
  if (!response) {
    throw new Error(
      "normaliseCreateMembershipRequestResponse: response is required",
    );
  }

  return {
    success: Boolean(response?.success),
    message: response?.message || null,
    request: response?.request
      ? mapApiMembershipRequestToUiMembershipRequest(response.request)
      : null,
  };
}

/**
 *
 * @param {any} response
 * @returns {NormaliseMembershipRequestListResponse}
 */
export function normaliseMembershipRequestListResponse(response) {
  if (!response) {
    throw new Error(
      "normaliseMembershipRequestListResponse: response is required",
    );
  }

  const rows = Array.isArray(response?.data?.rows)
    ? response.data.rows.map(mapApiMembershipRequestToUiMembershipRequest)
    : [];

  return {
    success: Boolean(response?.success),
    data: {
      rows,
      count: Number(response?.data?.count ?? rows.length ?? 0),
      page: Number(response?.data?.page ?? 1),
      limit: Number(response?.data?.limit ?? 50),
    },
  };
}

/**
 * @param {any} request
 * @returns {ApprovedBusinessMembershipRequest|null}
 */
export function mapApiApprovedMembershipRequestToUiRequest(request) {
  if (!request) {
    return null;
  }

  return {
    id: request?.id || null,
    businessId: request?.business_id || null,
    userId: request?.user_id || null,
    status: request?.status || null,
    message: request?.message || null,
    reviewedByUserId: request.reviewed_by_user_id || null,
    reviewedAt: request?.reviewed_at || null,
    createdAt: request?.createdAt ?? request?.created_at ?? null,
    updatedAt: request?.updatedAt ?? request?.updated_at ?? null,
  };
}

/**
 * Expected API shape:
 * {
 *   success: true,
 *   message: "Membership request approved",
 *   request: {
 *     id,
 *     business_id,
 *     user_id,
 *     status,
 *     message,
 *     reviewed_by_user_id,
 *     reviewed_at,
 *     createdAt,
 *     updatedAt
 *   }
 * }
 *
 * @param {any} response
 * @returns {NormalisedApproveBusinessMembershipRequestResponse}
 */
export function normaliseApproveBusinessMembershipRequestResponse(response) {
  if (!response) {
    throw new Error(
      "normaliseApproveBusinessMembershipRequestResponse: response is required",
    );
  }

  return {
    success: Boolean(response?.success),
    message: response?.message || null,
    request: mapApiApprovedMembershipRequestToUiRequest(response?.request),
  };
}
