import { toQueryString } from "../utils/toQueryString";
import { adminApiSlice } from "./adminApiSlice";

export const emailJobApi = adminApiSlice.injectEndpoints({
overrideExisting:true,
  endpoints: (builder) => ({
    listEmailJobs: builder.query({
      query: (params = {}) => {
        const queryString = toQueryString(params);

        return {
          url: `/admin/fetch-email-jobs?${queryString ? queryString : ""}`,
          method: "GET",
        };
      },
      transformResponse: (response, meta, args) => {
       
        const status = meta?.response?.status;

        return {
          items: Array.isArray(response?.emailJobs) ? response.emailJobs : [],
          meta: {
            ...(response.meta ?? {}),
            status,
          },
        };
      },
      providesTags: (result) => {
         
        if (!result) {
          return [{ type: "EmailJob", id: "LIST" }];
        }

        const jobs = Array.isArray(result.items) ? result.items : [];

        return [
          ...jobs.map((job) => ({ type: "EmailJob", id: job.id })),
          { type: "EmailJob", id: "LIST" },
        ];
      },
      invalidatesTags: (result, error, id) => [
        { type: "EmailJob", id },
        { type: "EmailJob", id: "LIST" },
      ],
    }),
    getEmailJob: builder.query({
      query: (id) =>({
        url: `/admin/email-jobs/${id}`,
        method: "GET",
      }),
      transformResponse: (response, meta, args) => {

        return response.job;

      },
      providesTags: (result, error, id) => result ? [{type: "EmailJob", id}] : [{type: "EmailJob", id}, {type: "EmailJob", id: "LIST"}]

    }),
    retryEmailJob: builder.mutation({
      query: ({id, data}) => ({
        url: `/admin/email-jobs/retry/${id}`,
        method: "POST",
        body: {
          ...(data?.payload !== undefined ? {payload: data.payload} : {}),
          ...(data?.template !== undefined ? {template: data.template} : {}),
          ...(data?.to !== undefined ? {to: data.to} : {}),
        }
      }),
      invalidatesTags: (result, error, arg) => {
      return  [ { type: "EmailJob", id: arg.id },
        { type: "EmailJob", id: "LIST" },
      ]
    }
    })
  }),
});

export const { useListEmailJobsQuery, useGetEmailJobQuery, useRetryEmailJobMutation } = emailJobApi;
