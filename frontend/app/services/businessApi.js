import { current } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

export const businessApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getBusiness: builder.query({
      query: (userId) => ({
        url: `/business/fetch-business/${userId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [{ type: "Business", id: "CURRENT" }]
          : [{ type: "Business", userId: "EMPTY" }],
    }),
    createBusiness: builder.mutation({
      query: ({ userId, businessData }) => ({
        url: `/business/create-business/${userId}`,
        method: "POST",
        body: { businessData },
      }),

      invalidatesTags: [{type: "Business", id: "CURRENT"}],
    }),
    updateBusiness: builder.mutation({
      query: ({ id, userId, businessData }) => ({
        url: `/business/update-business/${id}/${userId}`,
        method: "POST",
        body: { businessData },
      }),

    async onQueryStarted({id,userId, businessData}, {dispatch, queryFulfilled}){
      const patchResult = dispatch(
        apiSlice.util.updateQueryData("getBusiness", userId, (draft) => {
         
          if(!draft){
            console.log("NO DRAFT")
            return;
          };

          const targetBusiness = draft?.business;

          Object.entries(businessData).forEach(([key, value]) => {
            if(value !== undefined && targetBusiness[key] !== undefined) {
              targetBusiness[key] = value
            }
          });
        })

      );

      try {
        const {data: response} = await queryFulfilled;
        

        const businessProfile = response?.business;

        if(businessProfile){
          dispatch(

            apiSlice.util.updateQueryData("getBusiness", userId, (draft) => {

              if(!draft){
                return

              };

              draft.business = {
                ...draft.business,
                ...businessProfile
              }

            })

          )
        }


      } catch (error) {
        patchResult.undo();
      }
    },
    

     invalidatesTags:[{ type: "Business", id: "CURRENT" }],
    }),
  }),
});

export const {
  useGetBusinessQuery,
  useCreateBusinessMutation,
  useUpdateBusinessMutation,
} = businessApi;
