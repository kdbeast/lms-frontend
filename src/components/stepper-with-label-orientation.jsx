"use client";

import { defineStepper } from "@stepperize/react";
import { useStepItemContext } from "@stepperize/react/primitives";

import { Button } from "@/components/ui/button";

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

  let variant = "secondary";

  if (item.status === "active") {
    variant = "default";
  }

  if (item.status === "inactive") {
    variant = "outline";
  }

  return (
    <Stepper.Trigger
      render={(domProps) => (
        <Button
          disabled={item.status === "inactive" || item.status === "success"}
          className="rounded-full"
          variant={variant}
          size="icon"
          {...domProps}
        >
          <Stepper.Indicator>{item.index + 1}</Stepper.Indicator>
        </Button>
      )}
    />
  );
};

const StepperTitleWrapper = ({ title }) => {
  return (
    <Stepper.Title
      render={(domProps) => (
        <h4 className="text-sm font-medium" {...domProps}>
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
      className="absolute left-[calc(50%+30px)] right-[calc(-50%+20px)] top-5 block shrink-0 bg-muted data-[status=success]:bg-primary data-disabled:opacity-50 transition-all duration-300 ease-in-out h-0.5"
    />
  );
};

export function CourseCreationStepper({ currentStep }) {
  const stepIds = ["create-course", "course-details", "curriculum"];
  return (
    <Stepper.Root
      orientation="horizontal"
      className="w-full space-y-4"
      initialStep={stepIds[currentStep - 1]}
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
