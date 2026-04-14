// src/hooks/businesses/useBusinesses.js
import { useMemo } from "react";
import { useFetchMyBusinessesQuery } from "../../services/businessApi";

/**
 * @typedef {Object} Business
 * @property {string} id
 * @property {string} user_id
 * @property {string} name
 * @property {string} verification_status
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} MyBusinessRow
 * @property {Business|null} business
 * @property {"owner"|"admin"|"member"} membershipRole
 * @property {string} membershipStatus
 */

/**
 * @typedef {Object} UseBusinessesParams
 * @property {number=} page
 * @property {number=} limit
 * @property {string=} q
 * @property {boolean=} skip
 */

/**
 * Reusable hook to fetch businesses the current user belongs to (member/admin/owner).
 * Wraps RTK Query and provides normalized, UI-friendly data.
 *
 * @param {UseBusinessesParams=} params
 */
export const useBusinesses = (params = {}) => {
  const { skip, ...queryParams } = params;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useFetchMyBusinessesQuery(queryParams, {
    skip: !!skip,
  });

  const rows = data?.rows || [];
  const count = data?.count ?? 0;
  const page = data?.page ?? queryParams.page ?? 1;
  const limit = data?.limit ?? queryParams.limit ?? 25;

  // Flat business list (common UI use case)
  const businesses = useMemo(
    () => rows.map((r) => r.business).filter(Boolean),
    [rows]
  );

  // Helpful maps
  const byId = useMemo(() => {
    const map = new Map();
    for (const row of rows) {
      if (!row?.business?.id) continue;
      map.set(row.business.id, row);
    }
    return map;
  }, [rows]);

  const businessOptions = useMemo(
    () =>
      rows
        .filter((r) => r?.business?.id)
        .map((r) => ({
          value: r.business.id,
          label: `${r.business.name}${r.membershipRole ? ` (${r.membershipRole})` : ""}`,
          business: r.business,
          membershipRole: r.membershipRole,
          membershipStatus: r.membershipStatus,
        })),
    [rows]
  );

  return {
    // raw
    data,
    rows,

    // normalized
    businesses,
    businessOptions,
    byId,

    // pagination
    count,
    page,
    limit,

    // status
    isLoading,
    isFetching,
    isError,
    error,

    // actions
    refetch,
  };
};

export default useBusinesses;
