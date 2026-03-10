import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Section from "./Section";
import { toast } from "sonner";
import {
  useGetCourseByIdQuery,
  useTogglePublishCourseMutation,
} from "@/features/api/courseApi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useReorderSectionsMutation,
  useGetSectionsByCourseIdQuery,
} from "@/features/api/sectionApi";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import CreateSectionDialog from "./CreateSectionDialog";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { CourseCreationStepper } from "@/components/stepper-with-label-orientation";

const CreateLecture = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [reorderSections] = useReorderSectionsMutation();
  const { data, isLoading, isError, refetch } =
    useGetSectionsByCourseIdQuery(courseId);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = data.sections.findIndex(
      (section) => section._id === active.id,
    );

    const newIndex = data.sections.findIndex(
      (section) => section._id === over.id,
    );

    const newSections = arrayMove(data.sections, oldIndex, newIndex);

    const payload = newSections.map((section, index) => ({
      _id: section._id,
      order: index,
    }));

    await reorderSections(payload);
  };

  const { data: courseData } = useGetCourseByIdQuery(courseId);

  const [
    togglePublishUnpublishCourse,
    {
      data: publishData,
      isSuccess: publishSuccess,
      error: publishError,
      isLoading: publishLoading,
    },
  ] = useTogglePublishCourseMutation();

  const publishCourseHandler = async (action) => {
    try {
      await togglePublishUnpublishCourse({
        courseId,
        query: action,
      }).unwrap();
    } catch {
      toast.error("Failed to update course status");
    }
  };

  useEffect(() => {
    if (publishSuccess) {
      toast.success(publishData?.message || "Course status updated.");
      navigate(`/admin/course`);
    }
    if (publishError) {
      toast.error(
        publishError.data?.message || "Failed to update course status",
      );
    }
  }, [publishSuccess, publishError, publishData, navigate, courseId]);

  const isPublishDisabled =
    !data?.sections?.length ||
    data.sections.some((section) => section.lectures.length === 0);

  const tooltipMessage = !data?.sections?.length
    ? "Add at least one section before publishing."
    : "Each section must contain at least one lecture.";

  return (
    <div className="flex-1 px-4 md:px-10">
      <CourseCreationStepper />
      <div className="mb-4 mt-5">
        <h1 className="font-bold text-xl">
          Let's organize your course curriculum
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 my-5">
        <Link to={`/admin/course/${courseId}/course-details`}>
          <Button className="cursor-pointer md:w-auto w-full" variant="outline">
            Back to course
          </Button>
        </Link>

        <CreateSectionDialog courseId={courseId} />
      </div>

      <div className="mt-10">
        {isLoading ? (
          <p>Loading sections...</p>
        ) : isError ? (
          <p>Failed to load sections</p>
        ) : !data?.sections?.length ? (
          <p>No sections created yet.</p>
        ) : (
          <Accordion
            type="multiple"
            defaultValue={data.sections.map((s) => s._id)}
          >
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={data.sections.map((s) => s._id)}
                strategy={verticalListSortingStrategy}
              >
                {data.sections.map((section, index) => (
                  <Section
                    index={index}
                    refetch={refetch}
                    key={section._id}
                    section={section}
                    courseId={courseId}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </Accordion>
        )}
      </div>

      <div className="flex justify-end mt-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  variant={
                    courseData?.course.isPublished ? "destructive" : "default"
                  }
                  onClick={() =>
                    publishCourseHandler(
                      courseData?.course.isPublished ? "false" : "true",
                    )
                  }
                  disabled={isPublishDisabled || publishLoading}
                  className="cursor-pointer flex items-center gap-2"
                >
                  {publishLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Please wait
                    </>
                  ) : courseData?.course.isPublished ? (
                    <>
                      <EyeOff size={16} />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye size={16} />
                      Publish
                    </>
                  )}
                </Button>
              </span>
            </TooltipTrigger>

            {isPublishDisabled && (
              <TooltipContent>
                <p>{tooltipMessage}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CreateLecture;
