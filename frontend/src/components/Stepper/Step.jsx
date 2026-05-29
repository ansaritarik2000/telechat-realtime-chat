import React from "react";

import RowSteps from "./row-steps";

const defaultSteps = [
  {
    title: "Company Details",
  },
  {
    title: "Default User",
  },
  {
    title: "Service Pricing",
  },
  {
    title: "Credit & History",
  },
];

export default function StepperComponent({
  currentStep,
  steps = defaultSteps,
  onStepChange,
}) {
  return (
    <RowSteps
      className="w-full"
      currentStep={currentStep}
      onStepChange={onStepChange}
      steps={steps}
    />
  );
}
