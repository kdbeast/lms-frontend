/* eslint-disable react-hooks/set-state-in-effect */
import { toast } from "sonner";
import Lecture from "./Lecture";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  useDeleteSectionMutation,
  useUpdateSectionMutation,
} from "@/features/api/sectionApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CreateDialog from "./CreateDialog";
import { GripVertical, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useReorderLecturesMutation } from "@/features/api/courseApi";
import { closestCenter, DndContext } from "@dnd-kit/core";

const Section = ({ section, index }) => {
  const [updateSection] = useUpdateSectionMutation();
  const [deleteSection] = useDeleteSectionMutation();
  const [reorderLectures] = useReorderLecturesMutation();
  const [title, setTitle] = useState(section.sectionTitle);
  const [lectures, setLectures] = useState(section.lectures);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleUpdate = async () => {
    const res = await updateSection({
      sectionId: section._id,
      sectionTitle: title,
    });

    if (res?.data?.success) {
      toast.success(res.data.message);
    } else {
      toast.error(res.error?.data?.message);
    }
  };

  const handleDelete = async () => {
    const res = await deleteSection(section._id);

    if (res?.data?.success) {
      toast.success(res.data.message);
    } else {
      toast.error(res.error?.data?.message);
    }
  };

  const handleLectureDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = lectures.findIndex((l) => l._id === active.id);
    const newIndex = lectures.findIndex((l) => l._id === over.id);

    const newLectures = arrayMove(lectures, oldIndex, newIndex);

    setLectures(newLectures);

    const payload = newLectures.map((lecture, index) => ({
      _id: lecture._id,
      order: index,
    }));

    await reorderLectures(payload);
  };

  useEffect(() => {
    setLectures(section.lectures);
  }, [section.lectures]);

  return (
    <div ref={setNodeRef} style={style}>
      <Accordion type="single" collapsible>
        <AccordionItem
          value={section._id}
          className="border rounded-lg px-4 mb-4 bg-accent"
        >
          {/* Section title */}
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center justify-between w-full cursor-pointer">
              <div className="flex items-center gap-3">
                {/* Drag Handle */}
                <div
                  {...attributes}
                  {...listeners}
                  onClick={(e) => e.stopPropagation()}
                  className="cursor-grab active:cursor-grabbing text-muted-foreground"
                >
                  <GripVertical size={18} />
                </div>

                {/* Section Number */}
                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-400 text-sm font-medium text-black">
                  {index + 1}
                </div>

                {/* Section Title */}
                <span className="font-medium">{section.sectionTitle}</span>
              </div>

              {/* Lecture Count */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {section.lectures?.length || 0} lectures
                </span>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Pencil size={16} />
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Update Section</AlertDialogTitle>
                    </AlertDialogHeader>

                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>

                      <AlertDialogAction onClick={handleUpdate}>
                        Update
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to delete this section?
                      </AlertDialogTitle>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>

                      <AlertDialogAction onClick={handleDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent>
            {/* Add lecture button */}
            <div className="mb-4">
              <CreateDialog sectionId={section._id} />
            </div>

            {/* Lecture list */}
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleLectureDragEnd}
            >
              <SortableContext
                items={lectures.map((l) => l._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {lectures?.length ? (
                    lectures.map((lecture) => (
                      <Lecture key={lecture._id} lecture={lecture} />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No lectures yet
                    </p>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Section;
