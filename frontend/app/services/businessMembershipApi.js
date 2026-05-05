import {
  normaliseApproveBusinessMembershipRequestResponse,
  normaliseBusinessMembershipListResponse,
  normaliseCreateMembershipRequestResponse,
  normaliseListMyBusinessesResponse,
  normaliseMembershipRequestListResponse,
} from "../routes/businessMemberships/utils/membershipTransfromers";
import { apiSlice } from "./apiSlice";
import { normaliseErrorResponse } from "./servicesTransformers";

export const businessMembershipApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchBusinessMemberships: builder.query({
      /**
       * Fetch active memberships for a business
       *
       * @param {{ businessId: string, page?: number, limit?: number }} params
       */
      query: ({ businessId, page = 1, limit = 50 }) => ({
        url: `business-membership/${businessId}/memberships`,
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response) => {
        return normaliseBusinessMembershipListResponse(response);
      },
      transformErrorResponse: (response) => {
        return normaliseErrorResponse(response);
      },
      providesTags: (result, error, { businessId }) => {
        const rows = result?.data?.rows || [];

        return [
          { type: "BusinessMembership", id: `BUSINESS_${businessId}` },
          ...rows.map((row) => ({
            type: "BusinessMembership",
            id: row.id,
          })),
          ...rows.map((row) => ({
            type: "BusinessMembership",
            id: `USER_${row.userId}`,
          })),
        ];
      },
    }),
    listMyBusinesses: builder.query({
      query: () => ({
        url: "business-membership/my-businesses",
        method: "GET",
      }),
      transformResponse: (response) => {
        return normaliseListMyBusinessesResponse(response);
      },
      transformErrorResponse: (response) => {
        return normaliseErrorResponse(response);
      },
      providesTags: (result) => {
        const rows = Array.isArray(result) ? result : [];

        return [
          { type: "BusinessMembership", id: "MY_BUSINESSES" },
          ...rows
            .filter((row) => row?.id)
            .map((row) => ({
              type: "BusinessMembership",
              id: `BUSINESS_${row.id}`,
            })),
        ];
      },
    }),
    listMembershipRequests: builder.query({
      /**
       * Fetch existing memebership requests
       * @param {{businessId: string, page?: number, limit?: number}} params
       *
       */
      query: ({ businessId, page = 1, limit = 10 }) => ({
        url: `business-membership/${businessId}/requests`,
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response) => {
        return normaliseMembershipRequestListResponse(response);
      },
      providesTags: (result, error, { businessId }) => {
        const rows = result?.data?.rows || [];

        return [
          { type: "BusinessMembership", id: `BUSINESS_${businessId}` },
          { type: "BusinessMembership", id: `REQUESTS_${businessId}` },
          ...rows.map((row) => ({
            type: "BusinessMembership",
            id: `REQUEST_${row.id}`,
          })),
          ...rows.map((row) => ({
            type: "BusinessMembership",
            id: `USER_${row.userId}`,
          })),
        ];
      },
      transformErrorResponse: (response) => {
        return normaliseErrorResponse(response);
      },
    }),

    requestBusinessMembership: builder.mutation({
      /**
       * Submit a membership request for the authenticated user.
       *
       * @param {{ businessId: string, message?: string }} params
       */
      query: ({ businessId, message }) => ({
        url: `business-membership/${businessId}/create`,
        method: "POST",
        body: message ? { message } : {},
      }),
      transformResponse: (response) => {
        return normaliseCreateMembershipRequestResponse(response);
      },
      transformErrorResponse: (response) => {
        return normaliseErrorResponse(response);
      },
      invalidatesTags: (result, error, { businessId }) => {
        const requestId = result?.request?.id;
        const userId = result?.request?.userId;

        return [
          { type: "Business", id: "SEARCH" },
          { type: "BusinessMembership", id: `BUSINESS_${businessId}` },
          { type: "BusinessMembership", id: `REQUESTS_${businessId}` },
          ...(requestId
            ? [{ type: "BusinessMembership", id: `REQUEST_${requestId}` }]
            : []),
          ...(userId
            ? [{ type: "BusinessMembership", id: `USER_${userId}` }]
            : []),
        ];
      },
    }),

    approveMembershipRequest: builder.mutation({
      query: ({ businessId, requestId }) => ({
        url: `/business-membership/${businessId}/requests/${requestId}/approve`,
        method: "POST",
      }),
      transformErrorResponse: (response) => {
        return normaliseErrorResponse(response);
      },
      transformResponse: (response) => {
        return normaliseApproveBusinessMembershipRequestResponse(response);
      },

      invalidatesTags: (result, error, { businessId, requestId }) => {
        return [
          { type: "BusinessMembership", id: `BUSINESS_${businessId}` },
          { type: "BusinessMembership", id: `REQUESTS_${businessId}` },
          { type: "BusinessMembership", id: `REQUEST_${requestId}` },
          ...(result?.request?.userId
            ? [
                {
                  type: "BusinessMembership",
                  id: `USER_${result.request.userId}`,
                },
              ]
            : []),
        ];
      },
    }),
  }),
});

export const {
  useFetchBusinessMembershipsQuery,
  useListMyBusinessesQuery,
  useListMembershipRequestsQuery,
  useRequestBusinessMembershipMutation,
  useApproveMembershipRequestMutation,
} = businessMembershipApi;
