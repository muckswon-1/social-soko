import { toQueryString } from "../utils/toQueryString";
import { adminApiSlice } from "./adminApiSlice";

export const adminUserApi = adminApiSlice.injectEndpoints({
    overrideExisting:true,

    endpoints: (builder) => ({
        listUsers: builder.query({
            query: (params = {}) => {
                const queryString = toQueryString(params)

                    return {
                        url: `/admin/fetch-users?${queryString ? queryString : ""}`,
                        method: 'GET'
                    }
            },
            transformResponse: (response, meta, args) => {

                const status = meta?.response?.status;

                return {

                    items: Array.isArray(response?.rows) ? response.rows : [],
                    meta: {
                        ...(response.meta ?? {}),
                        status,
                    },

                }

            },
            providesTags: (result) => {
                const users = result?.items ?? [];

                if(!users.length) {
                    return [{type: "User", id: "LIST"}]
                }
                return [
                    ...users.map((user) => (
                        { type: "User", id: user.id },
                        {type: "User", id: "LIST"}
                    
                    )),
                ]
            }
        }),
        
    })
})

export const {useListUsersQuery} = adminUserApi
        
    
