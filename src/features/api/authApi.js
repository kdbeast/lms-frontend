import { toast } from "sonner";
import { userLoggedIn, userLoggedOut } from "../authSlice";
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
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn({ user: data.user }));
          toast.success(data.message || "User registered successfully");
        } catch (error) {
          console.log(error);
          toast.error(error.error.data.message || "User registration failed");
        }
      },
    }),
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn({ user: data.user }));
          toast.success(data.message || "User logged in successfully");
        } catch (error) {
          console.log(error);
          toast.error(error.error.data.message || "User login failed");
        }
      },
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userLoggedOut());
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getUserProfile: builder.query({
      query: () => ({
        url: "/profile",
        method: "GET",
        credentials: "include",
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
    updateProfile: builder.mutation({
      query: (credentials) => ({
        url: "/profile/update",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserProfileQuery,
  useRegisterUserMutation,
  useUpdateProfileMutation,
} = authApi;

// api fetch = builder.query
// api post = builder.mutation
