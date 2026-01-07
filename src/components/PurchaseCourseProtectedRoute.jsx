import { PacmanLoader } from "react-spinners";
import { Navigate, useParams } from "react-router";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";

const PurchaseCourseProtectedRoute = ({ children }) => {
  const { courseId } = useParams();
  const { data, isLoading } = useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-center font-bold text-lg text-gray-500 dark:text-gray-400 p-4 mx-auto w-full dark:bg-[#0A0A0A] bg-gray-50 shadow-lg rounded-lg h-screen">
        <PacmanLoader color="#000" size={20} />
      </div>
    );
  }

  return data.purchased === true ? (
    children
  ) : (
    <Navigate to={`/course-detail/${courseId}`} />
  );
};

export default PurchaseCourseProtectedRoute;
