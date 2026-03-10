import CourseTab from "./CourseTab";
import { useParams } from "react-router";
import { CourseCreationStepper } from "@/components/stepper-with-label-orientation";

const EditCourse = () => {
  const params = useParams();
  return (
    <div className="flex-1 mx-10">
      {/* Top bar  */}
      <CourseCreationStepper />
      <div className="flex items-center justify-between mb-5 mt-2">
        <h1 className="font-bold text-xl">
          Add detail information regarding course
        </h1>
      </div>
      <CourseTab courseId={params.courseId} />
    </div>
  );
};

export default EditCourse;
