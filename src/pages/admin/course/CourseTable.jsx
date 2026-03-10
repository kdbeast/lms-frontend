import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Edit2, Loader2, Trash2 } from "lucide-react";
import {
  useDeleteCourseMutation,
  useGetAllAdminCourseQuery,
} from "../../../features/api/courseApi";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CourseTable = () => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

  const { data, isLoading, isFetching } = useGetAllAdminCourseQuery();
  const [deleteCourse] = useDeleteCourseMutation();

  const handleDelete = async (id) => {
    setDeletingId(id);
    await deleteCourse(id);
    setDeletingId(null);
  };

  const courses = data?.courses || [];

  return (
    <div className="flex-1 mx-10 mt-20">
      <div className="flex justify-end">
        <Button
          className="cursor-pointer"
          onClick={() => navigate("/admin/course/create")}
        >
          Create New Course
        </Button>
      </div>
      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2">Title</TableHead>
            <TableHead className="w-1/4">Price</TableHead>
            <TableHead className="w-1/4">Status</TableHead>
            <TableHead className="w-1/4 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        {isLoading || isFetching ? (
          <CourseTableSkeleton />
        ) : (
          <TableBody>
            {courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No courses available.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((course) => (
                <TableRow key={course._id}>
                  <TableCell className="w-1/2 font-medium">
                    {course.courseTitle}
                  </TableCell>
                  <TableCell className="w-1/4">
                    {course.coursePrice ? `₹${course.coursePrice}` : "NA"}
                  </TableCell>
                  <TableCell className="w-1/4">
                    <Badge
                      className={
                        course.isPublished &&
                        "bg-green-200 text-green-800 hover:bg-green-200"
                      }
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-1/4 text-right space-x-2">
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/admin/course/${course._id}/course-details`);
                      }}
                    >
                      <Edit2 />
                    </Button>
                    <Button
                      variant="outline"
                      className="cursor-pointer"
                      onClick={() => handleDelete(course._id)}
                    >
                      {deletingId === course._id ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <Trash2 />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default CourseTable;

const CourseTableSkeleton = () => {
  return (
    <TableBody>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index} className="animate-pulse">
          {/* Title */}
          <TableCell>
            <div className="h-6 w-[70%] bg-gray-300 dark:bg-gray-700 rounded"></div>
          </TableCell>

          {/* Price */}
          <TableCell>
            <div className="h-6 w-[40%] bg-gray-300 dark:bg-gray-700 rounded"></div>
          </TableCell>

          {/* Status */}
          <TableCell>
            <div className="h-6 w-[50%] bg-gray-300 dark:bg-gray-700 rounded"></div>
          </TableCell>

          {/* Action */}
          <TableCell className="text-right">
            <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded-md ml-auto"></div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
