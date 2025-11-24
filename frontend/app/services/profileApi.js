import { current } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

export const profileApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Fetch User info by ID
    getUserProfile: builder.query({
      // RTK Query will call baseQuery with this description
      query: (userId) => ({
        url: `/profile/fetch-user-profile/${userId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [{ type: "Profile", id: "CURRENT" }]
          : [{ type: "Profile", id: "EMPTY" }],
    }),
    updateUserProfile: builder.mutation({
      query: ({ userId, patch }) => ({
        url: `/profile/update-user-profile/${userId}`,
        method: "POST",
        body: { patch },
      }),

      async onQueryStarted({ userId, patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getUserProfile", userId, (draft) => {
          if(!draft) return 
           
            const targetProfile = draft?.user;

            Object.entries(patch).forEach(([key, value]) => {
              if(value !== undefined  && targetProfile[key] !== undefined) {
                targetProfile[key] = value;
              }
            });
            
          }),
        );

      

        try {
          // Wait for server to respond
          const { data: response } = await queryFulfilled;

          const serverProfile = response?.user;
         

          // Sync with server response if it returns updated user

          if (serverProfile) {
            dispatch(
                apiSlice.util.updateQueryData("getUserProfile", userId, (draft) => {
              if (!draft) {
               
                return ;
              };
             

              draft.user = {
                ...draft.user,
                ...serverProfile,
              };
            })
            )
          }
        } catch (error) {
          // Undo optimistic change
          patchResult.undo();
         }
       },

      invalidatesTags:  [
        { type: "Profile", id: "CURRENT" },
      ],
    }),

    uploadProfilePicture: builder.mutation({
      query: ({profileId, file}) => {
        const formData = new FormData();
        formData.append("profile_pic", file);

        return {
          url: `/profile/upload-profile-picture/${profileId}`,
          method:"POST",
          body: formData,
        }
      },
      transformResponse: (result) => {
    
         const {success,message, profile_pic_url, user_profile} = result;
        return {
          success,
          profile_pic_url,
          user_profile
        }
      },
      transformErrorResponse: (response) => {
        const {error} = response.data;
        return error;

      },
    })
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation, useUploadProfilePictureMutation } =
  profileApi;
