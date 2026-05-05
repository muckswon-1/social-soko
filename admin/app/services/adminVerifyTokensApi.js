import { adminApiSlice } from "./adminApiSlice";

export const adminVerifyTokensApi = adminApiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        generateVerifyEmailToken: builder.mutation({
            query: ({userEmail}) => ({
                url: "/admin/generate-parameter-verify-email-token",
                method: "POST",
                body: {userEmail}

            }),
            invalidatesTags: (result, error, arg) => {

               return  [ {type: "AdminVerifyToken", id: arg?.userEmail} ]
        }

        })
    })
    
});

export const {useGenerateVerifyEmailTokenMutation} = adminVerifyTokensApi