import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_API = `${import.meta.env.VITE_API_URL}/api/v1/course`;

export const courseApi = createApi({
  reducerPath: "courseApi",
  tagTypes: ["Refetch_Creator_Course", "Refetch_Lecture"],
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_API,
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
    createCourse: builder.mutation({
      query: ({ courseTitle, category }) => ({
        url: "",
        method: "POST",
        body: { courseTitle, category },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    searchCourses: builder.query({
      query: ({ searchQuery, categories, sortByPrice, priceRange }) => {
        let queryString = `/search?keyword=${encodeURIComponent(searchQuery || "")}`;

        const categoryArray = Array.isArray(categories)
          ? categories
          : typeof categories === "string" && categories.length > 0
            ? categories.split(",")
            : [];

        if (categoryArray.length > 0) {
          categoryArray.forEach((cat) => {
            queryString += `&category=${encodeURIComponent(cat)}`;
          });
        }

        // append priceRange
        if (priceRange) {
          queryString += `&priceRange=${encodeURIComponent(priceRange)}`;
        }

        if (sortByPrice) {
          queryString += `&sortByPrice=${encodeURIComponent(sortByPrice)}`;
        }

        return {
          url: queryString,
          method: "GET",
        };
      },
      providesTags: ["Refetch_Creator_Course"],
    }),
    getPublishedCourses: builder.query({
      query: () => ({
        url: "/published-courses",
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),
    getAllAdminCourse: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    editCourse: builder.mutation({
      query: ({ formData, courseId }) => ({
        url: `/${courseId}`,
        method: "PUT",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),
    createLecture: builder.mutation({
      query: ({ lectureTitle, sectionId, isPreviewFree, videoInfo }) => ({
        url: `/${sectionId}/lecture`,
        method: "POST",
        body: { lectureTitle, isPreviewFree, videoInfo, sectionId },
      }),
      invalidatesTags: [
        "Refetch_Lecture",
        "Refetch_Section",
        "Refetch_Creator_Course",
      ],
    }),
    getLectureByCourseId: builder.query({
      query: (courseId) => ({
        url: `/${courseId}/lecture`,
        method: "GET",
      }),
      providesTags: ["Refetch_Lecture"],
    }),
    editLecture: builder.mutation({
      query: ({
        courseId,
        lectureId,
        lectureTitle,
        isPreviewFree,
        videoInfo,
      }) => ({
        url: `/${courseId}/lecture/${lectureId}`,
        method: "POST",
        body: { lectureTitle, isPreviewFree, videoInfo },
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    deleteLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Refetch_Lecture"],
    }),
    getLectureById: builder.query({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "GET",
      }),
      providesTags: ["Refetch_Creator_Course"],
    }),
    togglePublishCourse: builder.mutation({
      query: ({ courseId, query }) => ({
        url: `/${courseId}?publish=${query}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Refetch_Creator_Course"],
    }),
    reorderLectures: builder.mutation({
      query: (lectures) => ({
        url: "/lecture/reorder",
        method: "PATCH",
        body: { lectures },
      }),
      invalidatesTags: ["Refetch_Section"],
    }),
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const {
  useGetCourseByIdQuery,
  useEditCourseMutation,
  useSearchCoursesQuery,
  useGetLectureByIdQuery,
  useEditLectureMutation,
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useCreateLectureMutation,
  useDeleteLectureMutation,
  useGetAllAdminCourseQuery,
  useReorderLecturesMutation,
  useGetPublishedCoursesQuery,
  useGetLectureByCourseIdQuery,
  useTogglePublishCourseMutation,
} = courseApi;

// mutation -> data bhejna
// query -> data lena
