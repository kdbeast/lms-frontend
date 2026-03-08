import React from "react";
import Course from "./Course";
import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap } from "lucide-react";
import { useGetEnrolledCoursesQuery } from "@/features/api/authApi";

const MyLearning = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();

  // Using the specialized query to ensure we have the latest enrollment data
  const { data, isLoading } = useGetEnrolledCoursesQuery(undefined, {
    skip: !isSignedIn,
  });

  const myLearning = data?.enrolledCourses || [];

  return (
    <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 md:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            My Learning
          </h1>
          <p className="text-muted-foreground mt-1">
            Pick up right where you left off and continue your journey.
          </p>
        </div>

        {myLearning.length > 0 && (
          <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl border border-blue-100 dark:border-blue-800">
            <GraduationCap className="text-blue-600 h-5 w-5" />
            <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
              {myLearning.length} Enrolled Courses
            </span>
          </div>
        )}
      </div>

      <div className="min-h-[400px]">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearning.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50 dark:bg-gray-900/30 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-full shadow-sm mb-6">
              <BookOpen className="h-12 w-12 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold mb-2">No courses found</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-xs">
              You haven't enrolled in any courses yet. Start learning today!
            </p>
            <Button
              onClick={() => navigate("/course/search")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-xl font-bold transition-all hover:-translate-y-1 cursor-pointer"
            >
              Explore Catalog
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {myLearning.map((course) => (
              <div
                key={course._id}
                className="transition-transform hover:-translate-y-1 duration-300"
              >
                <Course course={course} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Skeleton to match the new grid and spacing
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="space-y-4">
        <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-48 animate-pulse w-full"></div>
        <div className="space-y-2">
          <div className="bg-gray-200 dark:bg-gray-800 h-6 w-3/4 rounded-md animate-pulse"></div>
          <div className="bg-gray-200 dark:bg-gray-800 h-4 w-1/2 rounded-md animate-pulse"></div>
        </div>
      </div>
    ))}
  </div>
);

export default MyLearning;
