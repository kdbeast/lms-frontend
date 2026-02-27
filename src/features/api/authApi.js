import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const USER_API = `${import.meta.env.VITE_API_URL}/api/v1/user`;

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (credentials) => ({
        url: "/profile/update",
        method: "POST",
        body: credentials,
      }),
    }),
    getEnrolledCourses: builder.query({
      query: () => ({
        url: "/enrolled-courses",
        method: "GET",
      }),
    }),
  }),
});

export const { useUpdateProfileMutation, useGetEnrolledCoursesQuery } = authApi;

// api fetch = builder.query
// api post = builder.mutation
