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
      providesTags: (result) =>result ? [{ type: "Business", id: "CURRENT" }] : [{ type: "Business", userId: "EMPTY" }],
      transformErrorResponse:(response, meta, args) => {
       
        const {data, status} = response;

        if(status === 403) {
          // if its 403 it means user has not created an account and thier role is customer

          // allow a user to create business
          return { status, message: "You are not authorized to access this resource"}
        }

        return response;
      }
    }),
    createBusiness: builder.mutation({
      query: ({ userId, businessData }) => ({
        url: `/business/create-business/${userId}`,
        method: "POST",
        body: { businessData },
      }),
      transformResponse: (result) => {
        console.log(result);
        const {success, business, message} = result;
        if(success) {
          return {
            success,
            message,
            business
          }
        }
      },
      transformErrorResponse: (response, meta, args) => {
       
        const status = response?.status || 500;
        const data = response?.data || {}

        if(status && status === 400){
          return {
            message: data?.error || "There was a problem creating your business. Try again later"
          }
        }

        if(status && status === 403) {
          return {
            status: 403,
            message: "You are not authorized to access this resource. Contact support."
          }
        }

        return "There was a server error. Contact support"


      },

      invalidatesTags: [{type: "Business", id: "CURRENT"}],
    }),
    checkBusinessUsername: builder.query({
      query: (username) => ({
        url: `/business/check-username/${username}`,
        params: {username}
      }),

      transformResponse: (result, meta, args) => {
         return result.valid
      },

      transformErrorResponse: (response, meta, args) => {
        console.log(response);

        const {status, data} = response;

        if(status === 400) {
          return {
            status:400,
            success:data.success,
            message: data.error
          }
        }else {
          return {
            status: 500,
            success:data.success,
            message: "Could not verify username availbility. You can still try saving"

          }
        }
      }
    }),

    checkBusinessSlug: builder.query({
      query: (slug) => ({
        url: `/business/check-slug/${slug}`,
        params: {slug}
      }),

      transformResponse: (result, meta, args) => {
     
       
        return result.success;
      },

      transformErrorResponse: (response, meta, args) => {
        const {status, data} = response;

        if(status === 400) {

          return {

            status:400,

            success:data.success,

            message: data.error

          }

        }else {

          return {

            status: 500,

            success:data.success,

            message: "Could not verify slug availbility. You can still try saving"

          }
        }
      }
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

    requestBusinessVerification: builder.mutation({
      query: ({id, userId}) => ({
        url: `/business/request-business-verification/${id}/${userId}`,
        method: "POST",
        body: { },
      }),
      invalidatesTags: [{type: "Business", id: "CURRENT"}]

    }),

    uploadBusinessLogo: builder.mutation({
      query: ({businessId, file}) =>{

        const formData = new FormData();
        formData.append("logo", file)
       
        return {
          url: `/business/upload-logo/${businessId}`,
          method: "POST",
          body: formData

        }
      },
   
      transformResponse: (result) => {
        const {success, logo_url, business} = result;

        return {
          success,
          logo_url,
          business
        }
      },

      transformErrorResponse(response, meta, arg) {
        
        const {error} = response.data;
        return error;
        },

         invalidatesTags: (result, error, {businessId}) => result ? [{type: "Business", id: businessId}] : [],
     
      
    })


  }),
});

export const {
  useGetBusinessQuery,
  useCreateBusinessMutation,
  useUpdateBusinessMutation,
  useRequestBusinessVerificationMutation,
  useLazyCheckBusinessSlugQuery,
  useLazyCheckBusinessUsernameQuery,
  useUploadBusinessLogoMutation
} = businessApi;
