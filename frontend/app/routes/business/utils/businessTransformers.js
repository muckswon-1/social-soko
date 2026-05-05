/**
 * @typedef {import("../../../types/business").Business} Business
 * @typedef {import("../../../types/business").BusinessMembershipListItem} BusinessMembershipListItem
 * @typedef {import("../../../types/business").NormalisedFetchMyBusinessesResponse} NormalisedFetchMyBusinessesResponse
 * @typedef {import("../.././../types/business").BusinessForm} BusinessForm
 * * @typedef {import("axios").AxiosResponse<any>} AxiosResponse
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

    if(!response) throw new Error("normalisedBusinessResponse: Response is required");
   

    const {success, business, message} = response;

    const normalisedBusiness = mapAPiBusinessToUiBusiness(business);


    return {success, business: normalisedBusiness, message}
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



