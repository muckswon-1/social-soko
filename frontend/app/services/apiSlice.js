import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const BACKEND_URL = import.meta.env.VITE_SERVER_URL;


const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/api/v1`,
    credentials: "include",
    // prepareHeaders: (headers) => {
    //     const csrf = getCookie('XSRF-TOKEN');
    //     if(csrf) {
    //         headers.set("X-CSRF_TOKEN", csrf);
    //     }
    //     return headers;
    // }
});


const baseQueryWithReauth = async (args, api, extraOptions) => {

    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const url = typeof args === "string" ? args : (args && "url" in args && args.url) || "";
        console.log(url);
        if (!url.includes("/auth/refresh-token")) {
            const refreshResult = await rawBaseQuery({
                url: "/auth/refresh-token",
                method: "POST",
            },
            api,
            extraOptions
        );

        if(refreshResult.data) {

            result = await rawBaseQuery(args, api, extraOptions);
        }else {
            // consdier logout
        }
        }
    }
    return result;
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Profile'],
    endpoints: () => ({})
    
});