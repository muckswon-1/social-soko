import { apiSlice } from "./apiSlice";

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch User info by ID
    getUserProfile: builder.query({
      // RTK Query will call baseQuery with this description
      query: (userId) => ({
        url: `/profile/fetch-user-profile/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) =>
        result
          ? [{ type: "Profile", id: userId }]
          : [{ type: "Profile", id: "LIST" }],
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
            if (!draft?.data) return;

            if (patch.first_name !== undefined) {
              draft.data.firstName = patch.first_name;
            }

            if (patch.last_name !== undefined) {
              draft.data.lastName = patch.last_name;
            }

            if (patch.phone !== undefined) {
              draft.data.phoneNumber = patch.phone;
            }
          }),
        );

        try {
          // Wait for server to respond
          const { data: response } = await queryFulfilled;

          const serverProfile = response?.data?.data;

          // Sync with server response if it returns updated user

          if (serverProfile) {
            apiSlice.util.updateQueryData("getUserProfile", userId, (draft) => {
              if (!draft) return;

              draft.data = {
                ...draft.data,
                ...serverProfile,
              };
            });
          }
        } catch (error) {
          // Undo optimistic change
          patchResult.undo();
        }
      },

      invalidatesTags: (result, error, { userId }) => [
        { type: "Profile", id: userId },
      ],
    }),
  }),
});

export const { useGetUserProfileQuery, useUpdateUserProfileMutation } =
  profileApi;
