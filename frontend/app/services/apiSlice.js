import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { clientGetCookie } from "../lib/csrf.client";

const isServer = typeof window === "undefined";

const BACKEND_URL = isServer ? import.meta.env.VITE_API_URL_INTERNAL : import.meta.env.VITE_API_URL_BROWSER;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${BACKEND_URL}/api/v1`,
  credentials: "include",
  prepareHeaders: (headers) => {
      const csrf = clientGetCookie('XSRF-TOKEN');
      if(csrf) {
          headers.set("X-CSRF_TOKEN", csrf);
      }
      return headers;
  }
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const url =
      typeof args === "string"
        ? args
        : (args && "url" in args && args.url) || "";
    console.log(url);
    if (!url.includes("/auth/refresh-token")) {
      const refreshResult = await rawBaseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // consdier logout
      }
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Profile","Business","BusinessMembership","Posts", "Post", "PostStats", "Comments", "Comment", "CommentReplies"],
  endpoints: () => ({}),
});
