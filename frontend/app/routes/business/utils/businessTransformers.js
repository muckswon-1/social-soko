/**
 * @typedef {import("../../../types/business").Business} Business
 * @typedef {import("../../../types/business").BusinessMembershipListItem} BusinessMembershipListItem
 * @typedef {import("../../../types/business").NormalisedFetchMyBusinessesResponse} NormalisedFetchMyBusinessesResponse
 * @typedef {import("../.././../types/business").BusinessForm} BusinessForm
 * @typedef {import("axios").AxiosResponse<any>} AxiosResponse
 * @typedef {import("../../../types/business").BusinessMembershipListItem} BusinessMembershipListItem
 * 
 */

import BUSINESS_UTILS from "./utils";



/**
 * 
 * @param {any} business 
 * @returns {Business}
 */
export function mapAPiBusinessToUiBusiness(business) {

    return {
        id: business.id,
        userId: business.user_id,
        username: business.username,
        name: business.name,
        description: business.description,
        website: business.website,
        email: business.email,
        phoneNumber: business.phone,
        address: business.address,
        city: business.city,
        state: business.state,
        postalCode: business.postal_code,
        country: business.country,
        slug: business.slug,
        logoUrl: business.logo_url,
        verificationStatus: business.verification_status,
        verificationRequestedAt: business.verification_requested_at,
        verificationRejectedAt: business.verification_rejected_at,
        verificationRejectedReason: business.verification_rejected_reason,
        verifiedAt: business.verified_at,
        createdAt: business.createdAt ?? business.created_at ?? null,
        updatedAt: business.updatedAt ?? business.updated_at ?? null,

    }
}

/**
 * 
 * @param {Business} business 
 * @returns {BusinessForm}
 */
export function mapUiBusinessToApiBusiness(business) {
    const initialValues = BUSINESS_UTILS.getEmptyForm();
    initialValues.username = business?.username || ""
    initialValues.user_id = business?.userId || "";
    initialValues.address = business?.address || "";
    initialValues.city = business?.city || "";
    initialValues.country = business?.country || "";
    initialValues.description = business?.description || "";
    initialValues.email = business?.email || "";
    initialValues.name = business?.name || "";
    initialValues.phone = business?.phoneNumber || "";
    initialValues.postal_code = business?.postalCode || "";
    initialValues.state = business?.state || "";
    initialValues.website = business?.website || "";
    initialValues.logo_url = business?.logoUrl || "";
    initialValues.slug = business?.slug || "";
    initialValues.verification_status = business?.verificationStatus || "";
    initialValues.verification_requested_at = business?.verificationRequestedAt || "";
    initialValues.verification_rejected_at = business?.verificationRejectedAt || "";
    initialValues.verification_rejected_reason = business?.verificationRejectedReason || "";
    initialValues.verified_at = business?.verifiedAt || "";
    initialValues.created_at =  business?.createdAt || null;
    initialValues.updated_at = business?.updatedAt || null;

    return initialValues

}


/**
 * 
 * @param {AxiosResponse} response 
 * @returns {{success: boolean, business: Business, message: string}}
 */
export function normalisedBusinessResponse(response) {

    //TODO:  update return type in JSDoc

    if(!response) throw new Error("normalisedBusinessResponse: Response is required");

    
   

    const {success, business, membership, membershipRole, membershipStatus, permissions, message} = response;

    const normalisedBusiness = mapAPiBusinessToUiBusiness(business);


    return {success, business: normalisedBusiness, membership, membershipRole, membershipStatus, permissions, message }
}


/**
 * Normalises one membership/business row returned from:
 * GET /business/me/businesses
 *
 * Raw shape:
 * {
 *   business: {...},
 *   membershipRole: "owner" | "admin" | "member",
 *   membershipStatus: "active" | "banned"
 * }
 *
 * @param {any} row
 * @returns {BusinessMembershipListItem}
 */
export function mapApiBusinessMembershipRowToUiRow(row){
    return {
        business: mapAPiBusinessToUiBusiness(row?.business || {}),
        membershipRole: row?.membershipRole || null,
        membershipStatus: row?.membershipStatus || null
    };
}

/**
 * Normalises one membership/business row returned from:
 * GET /business/me/businesses
 *
 * Raw shape:
 * {
 *   business: {...},
 *   membershipRole: "owner" | "admin" | "member",
 *   membershipStatus: "active" | "banned"
 * }
 *
 * @param {any} row
 * @returns {BusinessMembershipListItem}
 */
export function normaliseFetchMyBusinessesResponse(response){
    if(!response){
        throw new Error("normaliseFetchMyBusinessesResponse: Response is required");
    }

    const rows = Array.isArray(response?.data?.rows) ? response.data.rows.map(mapApiBusinessMembershipRowToUiRow) : [];

    return {
        success: Boolean(response?.success),
        message: response?.message || null,
        data: {
            rows,
            count: Number(response?.data?.count ?? 0),
            page: Number(response?.data?.page ?? 1),
            limit: Number(response?.data?.limit ?? rows.length ?? 0)
        }
    }
}


/**
 * Maps one raw public-safe business object from search route to UI shape.
 *
 * Raw API shape:
 * {
 *   id: string,
 *   name: string,
 *   username: string,
 *   slug: string,
 *   logo_url: string | null,
 *   verification_status: string,
 *   city: string | null,
 *   state: string | null,
 *   country: string | null
 * }
 *
 * @param {any} business
 * @returns {{
 *   id: string | null,
 *   name: string,
 *   username: string,
 *   slug: string,
 *   logoUrl: string | null,
 *   verificationStatus: string | null,
 *   city: string | null,
 *   state: string | null,
 *   country: string | null
 * }}
 */
export function mapApiBusinessSearchBusinessToUiBusiness(business) {
  return {
    id: business?.id || null,
    name: business?.name || "",
    username: business?.username || "",
    slug: business?.slug || "",
    logoUrl: business?.logo_url || null,
    verificationStatus: business?.verification_status || null,
    city: business?.city || null,
    state: business?.state || null,
    country: business?.country || null,
  };
}

/**
 * Maps one raw relationship object from business search route to UI shape.
 *
 * Raw API shape:
 * {
 *   type: "member" | "pending_request" | "none",
 *   role: "owner" | "admin" | "member" | null,
 *   status: "active" | "banned" | "pending" | null,
 *   requested_at?: string | null
 * }
 *
 * @param {any} relationship
 * @returns {{
 *   type: string,
 *   role: string | null,
 *   status: string | null,
 *   requestedAt: string | null
 * }}
 */
export function mapApiBusinessSearchRelationshipToUiRelationship(relationship) {
  return {
    type: relationship?.type || "none",
    role: relationship?.role || null,
    status: relationship?.status || null,
    requestedAt: relationship?.requested_at || null,
  };
}

/**
 * Normalises one business search row returned from:
 * GET /business/search?query=&page=&limit=
 *
 * Raw shape:
 * {
 *   business: {...},
 *   relationship: {
 *     type: "member" | "pending_request" | "none",
 *     role: "owner" | "admin" | "member" | null,
 *     status: string | null,
 *     requested_at?: string | null
 *   },
 *   canRequestMembership: boolean
 * }
 *
 * @param {any} row
 * @returns {BusinessSearchListItem}
 */
export function mapApiBusinessSearchRowToUiRow(row) {
  return {
    business: mapApiBusinessSearchBusinessToUiBusiness(row?.business),
    relationship: mapApiBusinessSearchRelationshipToUiRelationship(
      row?.relationship,
    ),
    canRequestMembership: Boolean(row?.canRequestMembership),
  };
}

/**
 * Normalises business search response returned from:
 * GET /business/search?query=&page=&limit=
 *
 * Raw response shape:
 * {
 *   success: true,
 *   message: "Businesses fetched",
 *   data: {
 *     rows: [
 *       {
 *         business: {...},
 *         relationship: {...},
 *         canRequestMembership: true
 *       }
 *     ],
 *     count: 4,
 *     page: 1,
 *     limit: 20
 *   }
 * }
 *
 * @param {any} response
 * @returns {{
 *   success: boolean,
 *   message: string | null,
 *   data: {
 *     rows: BusinessSearchListItem[],
 *     count: number,
 *     page: number,
 *     limit: number
 *   }
 * }}
 */
export function normaliseSearchBusinessesResponse(response) {
  if (!response) {
    throw new Error("normaliseSearchBusinessesResponse: Response is required");
  }

  const rows = Array.isArray(response?.data?.rows)
    ? response.data.rows.map(mapApiBusinessSearchRowToUiRow)
    : [];

  return {
    success: Boolean(response?.success),
    message: response?.message || null,
    data: {
      rows,
      count: Number(response?.data?.count ?? 0),
      page: Number(response?.data?.page ?? 1),
      limit: Number(response?.data?.limit ?? rows.length ?? 0),
    },
  };
}
