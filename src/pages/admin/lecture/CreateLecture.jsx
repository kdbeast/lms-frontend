import Lecture from "./Lecture";
import { useGetLectureByCourseIdQuery } from "../../../features/api/courseApi";
import CreateDialog from "./CreateDialog";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";

const CreateLecture = () => {
  const params = useParams();
  const courseId = params.courseId;

  // Fetch all lectures by course id
  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
  } = useGetLectureByCourseIdQuery(courseId);

  return (
    <div>
      <div className="mb-4 mt-20">
        <h1 className="font-bold text-xl">
          Let's add lectures, add some basic details for your new lecture
        </h1>
        <p className="text-sm">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </p>
      </div>
      <div className="flex items-center gap-2 my-5">
        <Link to={`/admin/course/${courseId}`}>
          <Button variant="outline">Back to course</Button>
        </Link>
          <CreateDialog courseId={courseId} />
      </div>

      {/* Display all lectures here */}
      <div className="mt-10">
        {lectureLoading ? (
          <p>Loading lectures...</p>
        ) : lectureError ? (
          <p>Failed to load lectures.</p>
        ) : !lectureData?.lectures?.length ? (
          <p>No lectures available.</p>
        ) : (
          lectureData.lectures.map((lecture, index) => (
            <Lecture
              index={index}
              lecture={lecture}
              key={lecture._id}
              courseId={courseId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CreateLecture;
