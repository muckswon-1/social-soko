import { normaliseMyBusinessesResponse } from "../routes/businessMemberships/utils/membershipsTransfromers";
import { apiSlice } from "./apiSlice";
import { normaliseGenericErrorResponse } from "./servicesTransformers";

export const businessMembershipApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      listMyBusinesses: builder.query({
        query: () => (
            {
                url:`/business-membership/my-businesses`,
                method: "GET"
            }
        ),
        providesTags: (result) => {
            const listTag = { type: "BusinessMembership", id: "MY_BUSINESSES" };

            if(!Array.isArray(result) || result.length === 0) {
                return [listTag];
            }


            return [
                listTag,
                ...result
                .filter((b) => b?.id)
                .map((b) => ({
                    type: "BusinessMembership",
                    id: b.id
                }))
            ]

        },

        transformResponse: (response) => {
            const normalised = normaliseMyBusinessesResponse(response);
          
            return normalised;
        },
        transformErrorResponse: (response, meta, args) => {
            const normalised = normaliseGenericErrorResponse(response);

            return normalised;
        }
      }),
      approveMembership: builder.mutation({
        query: (businessId, requestId) => ({
            url: `/business-membership/${businessId}/requests/${requestId}/approve`,
            method: "POST"
        })
      })
    })
})

    
export const {useListMyBusinessesQuery} = businessMembershipApi;