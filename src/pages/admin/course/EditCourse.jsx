import CourseTab from "./CourseTab";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";

const EditCourse = () => {
  const params = useParams();
  return (
    <div className="flex-1 mx-10">
      {/* Top bar  */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-xl">
          Add detail information regarding course
        </h1>
        <Link to={`/admin/course/${params.courseId}/lecture`}>
          <Button variant="link" className="hover:text-blue-600">
            Go to lectures page
          </Button>
        </Link>
      </div>
      <CourseTab courseId={params.courseId} />
    </div>
  );
};

export default EditCourse;
