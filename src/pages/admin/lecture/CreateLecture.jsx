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
  useGetSectionsByCourseIdQuery,
  useReorderSectionsMutation,
} from "@/features/api/sectionApi";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import CreateSectionDialog from "./CreateSectionDialog";
import { closestCenter, DndContext } from "@dnd-kit/core";

const CreateLecture = () => {
  const { courseId } = useParams();
  const [reorderSections] = useReorderSectionsMutation();
  const { data, isLoading, isError } = useGetSectionsByCourseIdQuery(courseId);

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

  console.log(data);

  const { data: courseData } = useGetCourseByIdQuery(courseId);
  console.log(courseData);

  const [
    togglePublishUnpublishCourse,
    { data: publishData, isSuccess: publishSuccess, error: publishError },
  ] = useTogglePublishCourseMutation();

  const publishCourseHandler = async (action) => {
    try {
      await togglePublishUnpublishCourse({
        courseId,
        query: action,
      });
    } catch {
      toast.error("Failed to update course status");
    }
  };

  useEffect(() => {
    if (publishSuccess) {
      toast.success(publishData?.message || "Course status updated.");
    }
    if (publishError) {
      toast.error(
        publishError.data?.message || "Failed to update course status",
      );
    }
  }, [publishSuccess, publishError, publishData]);

  const isPublishDisabled =
    !data?.sections?.length ||
    data.sections.some((section) => section.lectures.length === 0);

  const tooltipMessage = !data?.sections?.length
    ? "Add at least one section before publishing."
    : "Each section must contain at least one lecture.";

  return (
    <div>
      <div className="mb-4 mt-20">
        <h1 className="font-bold text-xl">
          Let's organize your course curriculum
        </h1>
      </div>

      <div className="flex items-center gap-2 my-5">
        <Link to={`/admin/course/${courseId}`}>
          <Button className="cursor-pointer" variant="outline">Back to course</Button>
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
                  key={section._id}
                  section={section}
                  courseId={courseId}
                />
              ))}
            </SortableContext>
          </DndContext>
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
                  disabled={isPublishDisabled}
                  className="cursor-pointer"
                >
                  {courseData?.course.isPublished ? "Unpublish" : "Publish"}
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
