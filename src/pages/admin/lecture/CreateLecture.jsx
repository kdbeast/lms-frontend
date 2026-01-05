import { toast } from "sonner";
import Lecture from "./Lecture";
import {
  useCreateLectureMutation,
  useGetLectureByCourseIdQuery,
} from "../../../features/api/courseApi";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
// import { addLecture } from "@/features/courseSlice";

const CreateLecture = () => {
  const params = useParams();
  const courseId = params.courseId;
  //   const navigate = useNavigate();
  //   const dispatch = useDispatch();
  const [lectureTitle, setLectureTitle] = useState("");

  // Fetch all lectures by course id
  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
  } = useGetLectureByCourseIdQuery(courseId);

  // Add lectures
  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();

  const createLectureHandler = async () => {
    await createLecture({ courseId, lectureTitle });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lecture created.");
      // dispatch(addLecture(data.lecture));
    }
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [data, isSuccess, error]);

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
      <div>
        <Label className="mb-2">Title</Label>
        <Input
          type="text"
          value={lectureTitle}
          placeholder="Your Lecture Title Name"
          onChange={(e) => setLectureTitle(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2 my-5">
        <Link to={`/admin/course/${courseId}`}>
          <Button variant="outline">Back to course</Button>
        </Link>
        <Button disabled={isLoading} onClick={createLectureHandler}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Create Lecture"
          )}
        </Button>
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
