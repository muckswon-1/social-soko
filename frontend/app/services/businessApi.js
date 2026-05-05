import { current } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import {
  normalisedBusinessResponse,
  normaliseFetchMyBusinessesResponse,
  normaliseSearchBusinessesResponse,
} from "../routes/business/utils/businessTransformers";
import {
  normaliseErrorResponse,
  normaliseGenericErrorResponse,
} from "./servicesTransformers";

export const businessApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBusiness: builder.query({
      query: (userId) => ({
        url: `/business/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, businessId) =>
        result?.business.id
          ? [{ type: "Business", id: result.business.id }]
          : [{ type: "Business", id: businessId || "EMPTY" }],
      transformResponse: (result) => {
        return normalisedBusinessResponse(result);
      },

      transformErrorResponse: (response, meta, args) => {
        return normaliseGenericErrorResponse(response);
      },
    }),
    createBusiness: builder.mutation({
      query: ({ userId, businessData }) => ({
        url: `/business/create-business/${userId}`,
        method: "POST",
        body: { businessData },
      }),
      transformResponse: (result) => {
        console.log(result);
        const { success, business, message } = result;
        if (success) {
          return {
            success,
            message,
            business,
          };
        }
      },
      transformErrorResponse: (response, meta, args) => {
        const status = response?.status || 500;
        const data = response?.data || {};

        if (status && status === 400) {
          return {
            message:
              data?.error ||
              "There was a problem creating your business. Try again later",
          };
        }

        if (status && status === 403) {
          return {
            status: 403,
            message:
              "You are not authorized to access this resource. Contact support.",
          };
        }

        return "There was a server error. Contact support";
      },

      invalidatesTags: [{ type: "Business", id: "CURRENT" }],
    }),
    checkBusinessUsername: builder.query({
      query: (username) => ({
        url: `/business/check-username/${username}`,
        params: { username },
      }),

      transformResponse: (result, meta, args) => {
        return result.valid;
      },

      transformErrorResponse: (response, meta, args) => {
        console.log(response);

        const { status, data } = response;

        if (status === 400) {
          return {
            status: 400,
            success: data.success,
            message: data.error,
          };
        } else {
          return {
            status: 500,
            success: data.success,
            message:
              "Could not verify username availbility. You can still try saving",
          };
        }
      },
    }),

    checkBusinessSlug: builder.query({
      query: (slug) => ({
        url: `/business/check-slug/${slug}`,
        params: { slug },
      }),

      transformResponse: (result, meta, args) => {
        return result.success;
      },

      transformErrorResponse: (response, meta, args) => {
        const { status, data } = response;

        if (status === 400) {
          return {
            status: 400,

            success: data.success,

            message: data.error,
          };
        } else {
          return {
            status: 500,

            success: data.success,

            message:
              "Could not verify slug availbility. You can still try saving",
          };
        }
      },
    }),

    updateBusiness: builder.mutation({
      query: ({ id, businessData }) => ({
        url: `/business/update-business/${id}`,
        method: "PATCH",

        body: { businessData },
      }),
      transformResponse: (result, meta, args) => {
        const { success, message, business } = result;

        return { success, message, business };
      },
      transformErrorResponse: (response) => {
        return normaliseErrorResponse(response);
      },

      async onQueryStarted(
        { id, userId, businessData },
        { dispatch, queryFulfilled },
      ) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getBusiness", userId, (draft) => {
            if (!draft) {
              console.log("NO DRAFT");
              return;
            }

            const targetBusiness = draft?.business;

            Object.entries(businessData).forEach(([key, value]) => {
              if (value !== undefined && targetBusiness[key] !== undefined) {
                targetBusiness[key] = value;
              }
            });
          }),
        );

        try {
          const { data: response } = await queryFulfilled;

          const businessProfile = response?.business;

          if (businessProfile) {
            dispatch(
              apiSlice.util.updateQueryData("getBusiness", userId, (draft) => {
                if (!draft) {
                  return;
                }

                draft.business = {
                  ...draft.business,
                  ...businessProfile,
                };
              }),
            );
          }
        } catch (error) {
          patchResult.undo();
        }
      },

      invalidatesTags: (result, error, args) => {
        const businessId = result?.business?.id || args?.businessId;

        return [
          { type: "Business", id: businessId },
          { type: "Business", id: "LIST" },
          { type: "Business", id: "MY_BUSINESSES" },
        ];
      },
    }),

    requestBusinessVerification: builder.mutation({
      query: ({ id, userId }) => ({
        url: `/business/request-business-verification/${id}/${userId}`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: [{ type: "Business", id: "CURRENT" }],
    }),

    uploadBusinessLogo: builder.mutation({
      query: ({ businessId, file }) => {
        const formData = new FormData();
        formData.append("logo", file);

        return {
          url: `/business/upload-logo/${businessId}`,
          method: "POST",
          body: formData,
        };
      },

      transformResponse: (result) => {
        const { success, logo_url, business } = result;

        return {
          success,
          logo_url,
          business,
        };
      },

      transformErrorResponse(response, meta, arg) {
        const { error } = response.data;
        return error;
      },

      invalidatesTags: (result, error, { businessId }) =>
        result ? [{ type: "Business", id: businessId }] : [],
    }),

    fetchMyBusinesses: builder.query({
      /**
       * Fetch businesses the authenticated user is a member/admin/owner of
       *
       * @param {{ page?: number, limit?: number, q?: string }} params
       */
      query: (params = {}) => ({
        url: "business/me/businesses",
        method: "GET",
        params,
      }),

      // Normalize response shape for easier consumption
      transformResponse: (response) => {
        // Expected shape:
        // { success, message, data: { rows, count, page, limit } }
        return normaliseFetchMyBusinessesResponse(response);
      },
      transformErrorResponse: (response, meta, arg) => {
        return normaliseErrorResponse(response);
      },

      providesTags: (result) => {
        const rows = result?.data?.rows || [];

        return [
          { type: "Business", id: "MY_LIST" },
          ...rows.map((row) => ({
            type: "Business",
            id: row.business.id,
          })),
        ];
      },
    }),

    searchBusinesses: builder.query({
      query: ({ query, page = 1, limit = 20 }) => ({
        url: `business/public/search`,
        method: "GET",
        params: { query, page, limit },
      }),
      transformResponse: (response) => {
        return normaliseSearchBusinessesResponse(response);
      },
      transformErrorResponse: (response) => {
        return normaliseGenericErrorResponse(response);
      },
      providesTags: (result) => {
        const rows = result?.data?.rows || [];

        return [
          { type: "Business", id: "SEARCH" },
          ...rows
            .filter((row) => row?.business?.id)
            .map((row) => ({
              type: "Business",
              id: row.business.id,
            })),
        ];
      },
    }),
  }),
});

export const {
  useGetBusinessQuery,
  useCreateBusinessMutation,
  useUpdateBusinessMutation,
  useRequestBusinessVerificationMutation,
  useLazyCheckBusinessSlugQuery,
  useLazyCheckBusinessUsernameQuery,
  useUploadBusinessLogoMutation,
  useFetchMyBusinessesQuery,
  useLazySearchBusinessesQuery,
} = businessApi;
