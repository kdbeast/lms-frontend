import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect } from "react";
import LectureTab from "./LectureTab";
import { CSS } from "@dnd-kit/utilities";
import { useNavigate } from "react-router";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { EditIcon, GripVertical, Loader2, Trash2 } from "lucide-react";
import { useDeleteLectureMutation } from "@/features/api/courseApi";

const Lecture = ({ lecture, courseId }) => {
  const navigate = useNavigate();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: lecture._id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
  };

  const renderButtonContent = (loading, text) =>
    loading ? (
      <>
        <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Please wait
      </>
    ) : (
      text
    );

  const handleRemoveLecture = async () => {
    await deleteLecture(lecture._id);
  };

  const [
    deleteLecture,
    { isLoading: deleteLoading, isSuccess: deleteSuccess, data: deleteData },
  ] = useDeleteLectureMutation();

  useEffect(() => {
    if (deleteData && deleteSuccess) {
      toast.success(deleteData.message || "Lecture Removed");
      navigate(`/admin/course/${courseId}/lecture`);
    }
  }, [deleteData, deleteSuccess, navigate, courseId]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between gap-2 flex-wrap bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-2 rounded-md my-2"
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </div>

        <h1 className="font-medium text-gray-800 dark:text-gray-100">
          {lecture.lectureTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <EditIcon size={18} />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Edit Lecture</DialogTitle>
            </DialogHeader>

            <LectureTab courseId={courseId} lectureId={lecture._id} />
          </DialogContent>
        </Dialog>

        <Button
          variant="outline"
          disabled={deleteLoading}
          onClick={handleRemoveLecture}
          className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
        >
          {renderButtonContent(deleteLoading, <Trash2 />)}
        </Button>
      </div>
    </div>
  );
};

export default Lecture;
