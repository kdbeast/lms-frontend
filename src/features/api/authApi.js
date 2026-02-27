import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const USER_API = `${import.meta.env.VITE_API_URL}/api/v1/user`;

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
  }),
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (credentials) => ({
        url: "/profile/update",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useUpdateProfileMutation,
} = authApi;

// api fetch = builder.query
// api post = builder.mutation
