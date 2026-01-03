import { userLoggedIn } from "../authSlice";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const USER_API = "http://localhost:8080/api/v1/user";

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: "include", // cors
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedIn({ user: null }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserProfileQuery,
  useRegisterUserMutation,
} = authApi;

// api fetch = builder.query
// api post = builder.mutation
