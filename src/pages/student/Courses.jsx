import { Button } from "@/components/ui/button";
import Course from "./Course";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPublishedCoursesQuery } from "@/features/api/courseApi";
import { useUser } from "@clerk/clerk-react";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router";

const Courses = () => {
  const { data, isLoading, isError } = useGetPublishedCoursesQuery();

  if (isError) {
    return (
      <div className="dark:bg-[#0A0A0A] mt-10 flex items-center justify-center font-bold text-2xl text-red-500 dark:text-red-400  dark:border-red-500 p-4  mx-auto">
        Error fetching courses
      </div>
    );
  }

  return (
    <div className="dark:bg-[#0A0A0A] bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center mb-10">Our Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <CourseSkeleton key={index} />
            ))
          ) : data?.courses?.length === 0 ? (
            <NoCourses />
          ) : (
            data?.courses?.map((course) => (
              <Course key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;

const CourseSkeleton = () => {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg overflow-hidden">
      <Skeleton className="w-full h-36" />
      <div className="px-5 py-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};

const NoCourses = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  const isInstructor = user?.unsafeMetadata?.role === "instructor";

  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <BookOpen size={60} className="text-gray-400 mb-4" />

      <h3 className="text-2xl font-semibold mb-2">No Courses Yet</h3>

      <p className="text-gray-500 mb-6 max-w-md">
        {isInstructor
          ? "You haven’t created any courses yet. Start building your first course now."
          : "There are no published courses available right now. Please check back later."}
      </p>

      {isInstructor && (
        <Button onClick={() => navigate("/admin/dashboard")}>
          Create Course
        </Button>
      )}
    </div>
  );
};
