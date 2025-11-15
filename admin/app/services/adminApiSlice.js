import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BACKEND_URL = import.meta.env.VITE_SERVER_URL;

const adminBaseQuery = fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/api/v1`,
    credentials: "omit",
    prepareHeaders: (headers) =>{}

});


export const adminApiSlice = createApi({
    reducerPath: "adminApi",
    baseQuery: adminBaseQuery,
    tagTypes: ["EmailJob","User","AdminVerifyToken","Business"],
    endpoints:() => ({})
})