import { apiSlice } from "./apiSlice";

export const businessMembersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyMemberships: builder.query({
            query: () => ({
                url: "/business-members/my-memberships",
                method: "GET"
            }) ,
            providesTags: (result) => {
                //TODO: add tags for each membership
                console.log(result);
            }
        })
    })
})

    
export const {useGetMyMembershipsQuery} = businessMembersApi