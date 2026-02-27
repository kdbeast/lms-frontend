import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = `${import.meta.env.VITE_API_URL}/api/v1/purchase`;

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    prepareHeaders: async (headers) => {
      if (window.Clerk?.session) {
        const token = await window.Clerk.session.getToken();

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: `/checkout/create-checkout-session`,
        method: "POST",
        body: courseId,
      }),
    }),
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
    }),
    getAllPurchasedCourse: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllPurchasedCourseQuery,
  useCreateCheckoutSessionMutation,
  useGetCourseDetailWithStatusQuery,
} = purchaseApi;

export default purchaseApi;
