import { adminApiSlice } from "./adminApiSlice";

export const adminVerifyBusinessApi = adminApiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        adminVerifyBusiness: builder.mutation({
            query: ({id}) => ({
                url: `/admin/verify-business/${id}`,
                method: "POST",
                body: {}
            }),
            transformResponse: (response, meta, args) => {

                console.log('In transform response',response);

                return response.business;
            },
            transformErrorResponse: (response, meta, args) => {
              
                const {status, data} = response;

                const base = {
                    status: status || 500,
                    message: data?.message || data?.error?.message || "Failed to veriy business"
                }

                if(status === 422 && data) {
                    return {
                        ...base,
                        reasons: Array.isArray(data.reasons) ? data.reasons : [],
                        business: data?.business || null,
                        
                    }
                }

                return base;
               
            },
        




            
            providesTags: (result) => {
                const business = result ?? {};

                if(!business) {
                    return [{type: "AdminVerifyBusiness", id: "LIST"}]
                }
                return [{type: "AdminVerifyBusiness", id: business.id}]
            }
        })
    })
})

export const {useAdminVerifyBusinessMutation} = adminVerifyBusinessApi;