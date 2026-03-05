import { EditIcon, GripVertical } from "lucide-react";
import { useNavigate } from "react-router";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

  const goToUpdateLecture = async () => {
    navigate(`/admin/course/${courseId}/lecture/${lecture._id}`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between bg-[#F7F9FA] dark:bg-[#1F1F1F] px-4 py-2 rounded-md my-2"
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

      <EditIcon
        size={18}
        onClick={goToUpdateLecture}
        className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
      />
    </div>
  );
};

export default Lecture;
