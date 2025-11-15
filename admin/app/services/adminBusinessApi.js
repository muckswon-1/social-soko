import { toQueryString } from "../utils/toQueryString";
import { adminApiSlice } from "./adminApiSlice";

export const adminBusinessApi = adminApiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    listBusinesses: builder.query({

      query: (params = {}) => {
        const queryString = toQueryString(params);

        return {
          url: `/admin/fetch-businesses?${queryString ? queryString : ""}`,
          method: "GET",
        };
      },


      transformResponse: (response, meta, args) => {
        const status = meta?.response?.status;

        return {
          items: Array.isArray(response?.rows) ? response.rows : [],
          meta: {
            ...(response.meta ?? {}),
            status,
          },
        };
      },

      providesTags: (result) => {

        const businesses = result?.items ?? [];
        if (!businesses.length) {
          return [{ type: "Business", id: "LIST" }];
        }

        return [
          ...businesses.map(({ id }) => ({ type: "Business", id })),
          { type: "Business", id: "LIST" },
        ];
    }



    }),
})
});

export const {useListBusinessesQuery} = adminBusinessApi;
