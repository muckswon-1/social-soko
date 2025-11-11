import { apiSlice } from "./apiSlice";

export const businessApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBusiness: builder.query({
            query: (id) => ({
                url: `/business/fetch-business/${id}`,
                method: "GET"
            }),
            providesTags: (result, error, id) => result ? [{ type: "Business", id }] : [{ type: "Business", id: "LIST" }],
        }),
        createBusiness: builder.mutation({
            query: ({userId,businessData}) => ({
                url: `/business/create-business/${userId}`,
                method: "POST",
                body: {businessData}
            }),

            invalidatesTags: ["Business"]
        
        }),
       updateBusiness: builder.mutation({
        query: ({id,businessData}) => ({
            url: `/business/update-business/${id}`,
            method: "POST",
            body: {businessData}

        }),
        invalidatesTags: ["Business"]
       }) 

    })
    
});


export const {useGetBusinessQuery,useCreateBusinessMutation, useUpdateBusinessMutation} = businessApi;