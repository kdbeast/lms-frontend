"use client";

import { defineStepper } from "@stepperize/react";
import { useStepItemContext } from "@stepperize/react/primitives";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router";

const { Stepper } = defineStepper(
  {
    id: "create-course",
    title: "Create Course",
    description: "Basic setup",
  },
  {
    id: "course-details",
    title: "Course Details",
    description: "Add course information",
  },
  {
    id: "curriculum",
    title: "Curriculum",
    description: "Create & Publish",
  },
);

const StepperTriggerWrapper = () => {
  const item = useStepItemContext();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const stepRoutes = ["create-course", "course-details", "curriculum"];

  let variant = "secondary";

  if (item.status === "active") variant = "default";
  if (item.status === "inactive") variant = "outline";
  let className = "rounded-full transition-all duration-300 border-2";

  if (item.status === "active") {
    variant = "default";
    className += " ring-4 ring-primary/20";
  }

  if (item.status === "success") {
    variant = "default";
    className += " bg-green-500 hover:bg-green-600 border-green-500 text-white";
  }

  if (item.data.id === "create-course") {
    variant = "default";
    className += " bg-green-500 hover:bg-green-600 border-green-500 text-white";
  }

  return (
    <Stepper.Trigger
      render={(domProps) => (
        <Button
          {...domProps}
          onClick={(e) => {
            domProps.onClick?.(e); // keeps stepper logic working
            navigate(`/admin/course/${courseId}/${stepRoutes[item.index]}`);
          }}
          className={className}
          variant={variant}
          size="icon"
          disabled={
            item.status === "success" && item.data.id === "create-course"
          }
        >
          <Stepper.Indicator>
            {item.status === "success" ? <Check size={16} /> : item.index + 1}
          </Stepper.Indicator>
        </Button>
      )}
    />
  );
};

const StepperTitleWrapper = ({ title }) => {
  return (
    <Stepper.Title
      render={(domProps) => (
        <h4
          className="text-sm font-medium group-data-[status=success]:text-green-500"
          {...domProps}
        >
          {title}
        </h4>
      )}
    />
  );
};

const StepperDescriptionWrapper = ({ description }) => {
  if (!description) return null;
  return (
    <Stepper.Description
      render={(domProps) => (
        <p className="text-xs text-muted-foreground" {...domProps}>
          {description}
        </p>
      )}
    />
  );
};

const StepperSeparatorWithLabelOrientation = ({ status, isLast }) => {
  if (isLast) return null;

  return (
    <Stepper.Separator
      orientation="horizontal"
      data-status={status}
      className="
      hidden
      md:block
      absolute
      left-[calc(50%+30px)]
      right-[calc(-50%+20px)]
      top-5
      h-0.5
      bg-muted
      data-[status=success]:bg-green-500
      transition-all
      duration-300
      "
    />
  );
};

export function CourseCreationStepper() {
  const location = useLocation();

  const stepIds = ["create-course", "course-details", "curriculum"];

  const activeStep =
    stepIds.find((step) => location.pathname.includes(step)) || "create-course";
  return (
    <Stepper.Root
      orientation="horizontal"
      className="w-full space-y-4"
      initialStep={activeStep}
    >
      {({ stepper }) => (
        <>
          <Stepper.List className="flex flex-col md:flex-row items-center justify-between gap-4">
            {stepper.state.all.map((stepData, index) => {
              const isLast = index === stepper.state.all.length - 1;
              return (
                <Stepper.Item
                  key={stepData.id}
                  step={stepData.id}
                  className="group peer relative flex w-full flex-col items-center justify-center gap-2"
                >
                  <StepperTriggerWrapper />
                  <StepperSeparatorWithLabelOrientation
                    status={stepData.status}
                    isLast={isLast}
                  />
                  <div className="flex flex-col items-center text-center gap-1">
                    <StepperTitleWrapper title={stepData.title} />
                    <StepperDescriptionWrapper
                      description={stepData.description}
                    />
                  </div>
                </Stepper.Item>
              );
            })}
          </Stepper.List>
        </>
      )}
    </Stepper.Root>
  );
}
