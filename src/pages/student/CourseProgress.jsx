import {
  CheckCircle,
  CheckCircle2,
  CirclePlay,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useParams } from "react-router";
import {
  useGetCourseProgressQuery,
  useUpdateLectureProgressMutation,
  useCompleteCourseMutation,
  useInCompleteCourseMutation,
} from "../../features/api/courseProgressApi";
import { PacmanLoader } from "react-spinners";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const CourseProgress = () => {
  const { courseId } = useParams();
  const [currentLecture, setCurrentLecture] = useState(null);

  const { data, isLoading, isError, refetch } =
    useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse] = useCompleteCourseMutation();
  const [inCompleteCourse] = useInCompleteCourseMutation();

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <PacmanLoader color="#3b82f6" size={20} />
      </div>
    );

  if (isError)
    return <div className="p-10 text-center">Failed to load progress.</div>;

  const { courseDetails, progress, completed } = data.data;
  const lectures = courseDetails.lectures || [];
  const activeLecture = currentLecture || lectures[0];

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const handleLectureEnd = async () => {
    const currentIndex = lectures.findIndex(
      (lec) => lec._id === activeLecture?._id,
    );

    await handleLectureProgress(activeLecture._id);

    const nextLecture = lectures[currentIndex + 1];
    if (nextLecture) {
      setCurrentLecture(nextLecture);
    }
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const handleCompleteCourse = async () => {
    try {
      const res = await completeCourse(courseId).unwrap();
      toast.success(res.message || "Course marked as completed!");
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to complete course");
    }
  };

  const handleInCompleteCourse = async () => {
    try {
      const res = await inCompleteCourse(courseId).unwrap();
      toast.success(res.message || "Course marked as incomplete");
      refetch();
    } catch (err) {
      toast.error(err.message || "Failed to update course");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-[#0A0A0A]">
      {/* TOP NAVIGATION BAR */}
      <div className="h-16 border-b flex items-center justify-between px-4 md:px-8 bg-[#1C1D1F] text-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="hover:bg-gray-700 p-2 rounded-full transition cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-bold text-sm md:text-lg line-clamp-1">
            {courseDetails.courseTitle}
          </h1>
        </div>

        <Button
          variant={completed ? "outline" : "secondary"}
          size="sm"
          className={
            completed
              ? "text-green-500 border-green-500 cursor-pointer"
              : "bg-white text-black hover:bg-gray-200 cursor-pointer"
          }
          onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
        >
          {completed ? (
            <span className="flex items-center gap-2">
              <CheckCircle size={16} /> Completed
            </span>
          ) : (
            "Mark Course as Complete"
          )}
        </Button>
      </div>

      {/* MAIN PLAYER AREA */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* LEFT: Video & Description */}
        <div className="flex-1 overflow-y-auto bg-black lg:bg-transparent">
          <div className="max-w-5xl mx-auto lg:p-6">
            <div className="aspect-video w-full bg-black shadow-2xl relative">
              <video
                controls
                autoPlay
                key={activeLecture?._id}
                className="w-full h-full"
                src={activeLecture?.videoUrl}
                onEnded={handleLectureEnd}
              />
            </div>

            <div className="p-4 md:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">
                  {`Lecture ${lectures.indexOf(activeLecture) + 1}: ${activeLecture?.lectureTitle}`}
                </h2>
                {isLectureCompleted(activeLecture?._id) && (
                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                    Watched
                  </Badge>
                )}
              </div>
              <div className="prose dark:prose-invert max-w-none text-muted-foreground">
                {/* Lecture specific description can go here if available */}
                <p>
                  In this lecture, we cover the core concepts of{" "}
                  {activeLecture?.lectureTitle}. Pay close attention to the
                  implementation details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar Lecture List */}
        <div className="w-full lg:w-[400px] border-t lg:border-t-0 lg:border-l bg-gray-50 dark:bg-[#111] flex flex-col">
          <div className="p-4 border-b bg-white dark:bg-[#111]">
            <h2 className="font-bold text-lg">Course Content</h2>
            <p className="text-xs text-muted-foreground mt-1">
              {progress.filter((p) => p.viewed).length} / {lectures.length}{" "}
              lectures completed
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {lectures.map((lecture, index) => {
                const isActive = activeLecture?._id === lecture._id;
                const isCompleted = isLectureCompleted(lecture._id);

                return (
                  <div
                    key={lecture._id}
                    onClick={() => handleSelectLecture(lecture)}
                    className={`flex items-start gap-3 p-3 rounded-md cursor-pointer transition-colors group ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500/30"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="mt-1">
                      {isCompleted ? (
                        <CheckCircle2 size={18} className="text-green-500" />
                      ) : isActive ? (
                        <CirclePlay size={18} className="text-blue-500" />
                      ) : (
                        <span className="text-xs font-medium text-muted-foreground w-4 block">
                          {index + 1}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${isActive ? "text-blue-600 dark:text-blue-400" : "text-foreground"}`}
                      >
                        {lecture.lectureTitle}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <CirclePlay
                          size={12}
                          className="text-muted-foreground"
                        />
                        <span className="text-[10px] text-muted-foreground uppercase">
                          Video • 3:59
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
