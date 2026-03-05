import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const SECTION_API = `${import.meta.env.VITE_API_URL}/api/v1/section`;

export const sectionApi = createApi({
  reducerPath: "sectionApi",
  tagTypes: ["Refetch_Section"],
  baseQuery: fetchBaseQuery({
    baseUrl: SECTION_API,
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
    createSection: builder.mutation({
      query: ({ sectionTitle, courseId }) => ({
        url: "/create",
        method: "POST",
        body: { sectionTitle, courseId },
      }),
      invalidatesTags: ["Refetch_Section"],
    }),
    getSectionsByCourseId: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Refetch_Section"],
    }),
    deleteSection: builder.mutation({
      query: (sectionId) => ({
        url: `/${sectionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Section"],
    }),
    updateSection: builder.mutation({
      query: ({ sectionId, sectionTitle }) => ({
        url: `/${sectionId}`,
        method: "PATCH",
        body: { sectionTitle },
      }),
      invalidatesTags: ["Refetch_Section"],
    }),
    reorderSections: builder.mutation({
      query: (sections) => ({
        url: "/reorder",
        method: "PATCH",
        body: { sections },
      }),
      invalidatesTags: ["Refetch_Section"],
    }),
  }),
});

export const {
  useDeleteSectionMutation,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useReorderSectionsMutation,
  useGetSectionsByCourseIdQuery,
} = sectionApi;
