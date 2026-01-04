import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCaption } from "@/components/ui/table";
import { useGetAllAdminCourseQuery } from "../../../features/api/courseApi";

const CourseTable = () => {
  const navigate = useNavigate();

  const { data, isLoading, isFetching } = useGetAllAdminCourseQuery();

  const courses = data?.courses || [];

  return (
    <div className="flex-1 mx-10 mt-20">
      <Button onClick={() => navigate("create")}>Create New Course</Button>
      <Table className="mt-5">
        <TableCaption>A list of your recent courses.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2">Title</TableHead>
            <TableHead className="w-1/4">Price</TableHead>
            <TableHead className="w-1/4">Status</TableHead>
            <TableHead className="w-1/4 text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        {/* Ensure that TableBody is always a direct child of Table */}
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
                        "bg-green-200 text-green-800 hover:bg-bg-green-200"
                      }
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-1/4 text-right">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigate(`/admin/course/${course._id}`);
                      }}
                    >
                      Edit
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
        <TableRow key={index} className="animate-pulse w-full">
          <TableCell className="w-1/2 h-6 bg-gray-200 rounded"></TableCell>
          <TableCell className="w-1/4 h-6 bg-gray-200 rounded"></TableCell>
          <TableCell className="w-1/4 h-6 bg-gray-200 rounded"></TableCell>
          <TableCell className="w-1/4 text-right">
            <span className="h-6 bg-gray-200 rounded inline-block w-20"></span>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};
