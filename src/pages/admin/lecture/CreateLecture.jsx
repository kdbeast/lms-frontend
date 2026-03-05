import Section from "./Section";
import {
  useGetSectionsByCourseIdQuery,
  useReorderSectionsMutation,
} from "@/features/api/sectionApi";
import { Link, useParams } from "react-router";
import { Button } from "@/components/ui/button";
import CreateSectionDialog from "./CreateSectionDialog";
import { arrayMove } from "@dnd-kit/sortable";
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

  return (
    <div>
      <div className="mb-4 mt-20">
        <h1 className="font-bold text-xl">
          Let's organize your course curriculum
        </h1>
      </div>

      <div className="flex items-center gap-2 my-5">
        <Link to={`/admin/course/${courseId}`}>
          <Button variant="outline">Back to course</Button>
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
            {data.sections.map((section, index) => (
              <Section index={index} key={section._id} section={section} />
            ))}
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default CreateLecture;
