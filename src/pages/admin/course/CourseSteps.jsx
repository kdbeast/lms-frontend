import { defineStepper } from "@stepperize/react";

const stepper = defineStepper(
  { id: "create", label: "Create Course" },
  { id: "details", label: "Course Details" },
  { id: "curriculum", label: "Curriculum" },
  { id: "lecture", label: "Lecture Content" },
  { id: "publish", label: "Publish" },
);

const CourseStepper = ({ step }) => {
  return (
    <div className="flex items-center gap-6 mb-10 flex-wrap">
      {stepper.steps.map((item, index) => {
        const isActive = step === index + 1;
        const isCompleted = step > index + 1;

        return (
          <div key={item.id} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold
              ${
                isCompleted
                  ? "bg-green-600 text-white"
                  : isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-700"
              }`}
            >
              {index + 1}
            </div>

            <span className="text-sm font-medium">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
};

export default CourseStepper;
