import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clientGetCookie } from "../lib/csrf.client";
const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

const adminBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/api/v1`,
    credentials: "include",
    prepareHeaders: (headers) => {
        const csrf = clientGetCookie('XSRF-TOKEN');

        if (csrf) headers.set("X-CSRF-TOKEN", csrf);
    
        
        return headers;

    }
     

});

export const adminApiSlice = createApi({
    reducerPath: "adminApi",
    baseQuery: adminBaseQuery,
    tagTypes: ["EmailJob","User","AdminVerifyToken","Business","AdminVerifyBusiness"],
    endpoints:() => ({})
})