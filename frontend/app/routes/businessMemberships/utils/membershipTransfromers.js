/**
 * @typedef {import("../../../types/business").MyBusinessMembershipType} MyBusinessMembershipType
 */

/**
 * Normalises response from:
 * GET /business-membership/my-businesses
 *
 * Backend shape:
 * {
 *   success: boolean,
 *   message: string,
 *   data: Array<{
 *     id: string,
 *     name: string,
 *     slug?: string,
 *     logo_url?: string,
 *     verification_status?: string,
 *     role: string
 *   }>
 * }
 *
 * Returns:
 * MyBusinessMembershipType[]
 */
export function normaliseMyBusinessesResponse(response) {


  if (!response || typeof response !== "object") {
    return [];
  }

  const { data, success } = response;

  if (!success || !Array.isArray(data)) {
    return [];
  }

  /** @type {MyBusinessMembershipType[]} */
  const normalised = data
    .filter((b) => b && b.id)
    .map((b) => ({
      id: b.id,
      name: b.name || "",
      slug: b.slug || null,
      logoUrl: b.logo_url || null,
      verificationStatus: b.verification_status || null,
      role: b.role || "member",
    }));

  return normalised;
}