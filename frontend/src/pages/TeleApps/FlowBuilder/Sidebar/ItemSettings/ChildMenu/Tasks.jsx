import React, { useState } from "react";
import { Select, SelectItem, Input, Form, Button } from "@heroui/react";

// Sample assignee options
const assigneeOptions = [
  { label: "john.doe@example.com", value: "john.doe@example.com" },
  { label: "jane.smith@example.com", value: "jane.smith@example.com" },
  { label: "alex.wilson@example.com", value: "alex.wilson@example.com" },
];

// Common Input Component (reused from your example)
const InputComponent = function ({
  label,
  type = "text",
  placeholder,
  name,
  ...props
}) {
  return (
    <Input
      radius="sm"
      size="md"
      variant="bordered"
      label={label}
      labelPlacement="outside"
      placeholder={placeholder || `Enter ${label}`}
      name={name || label.toLowerCase().replace(/\s+/g, "_")}
      type={type}
      {...props}
    />
  );
};

// Common Select Component (reused from your example)
const SelectComponent = function ({
  label,
  options,
  selectedValue,
  setSelectedValue,
  name,
  placeholder,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <Select
        radius="sm"
        size="md"
        variant="bordered"
        label={label}
        labelPlacement="outside"
        placeholder={placeholder || `Select ${label}`}
        value={selectedValue}
        name={name || label.toLowerCase().replace(/\s+/g, "_")}
        onChange={(e) => setSelectedValue && setSelectedValue(e.target.value)}
        {...props}
      >
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export const CreateTask = function () {
  const [selectedAssignee, setSelectedAssignee] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Form data:", data);

    // Validation logic
    const newErrors = {};
    if (!data.activity_title) {
      newErrors.activity_title = "Activity Title is required";
    }
    if (!data.due_date_time) {
      newErrors.due_date_time = "Due Date & Time is required";
    }
    if (!selectedAssignee) {
      newErrors.assignee = "Assignee is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Process form submission
    console.log("Creating new task:", data);
  };

  return (
    <Form
      validationErrors={errors}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <InputComponent
        label="Activity Title"
        placeholder="Enter activity title"
        name="activity_title"
      />

      <InputComponent
        label="Due Date & Time"
        type="datetime-local"
        name="due_date_time"
      />

      <InputComponent
        label="Link Record"
        placeholder="Enter record reference"
        name="link_record"
        description="Link this task to a specific record"
      />

      <SelectComponent
        label="Assignee"
        options={assigneeOptions}
        selectedValue={selectedAssignee}
        setSelectedValue={setSelectedAssignee}
        name="assignee"
      />

      <Button
        size="sm"
        radius="sm"
        variant="solid"
        color="primary"
        className="self-end"
        type="submit"
      >
        Create Task
      </Button>
    </Form>
  );
};

// Complete Task
export const CompleteTask = function () {
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Form data:", data);

    // Validation logic
    const newErrors = {};
    if (!data.activity_title) {
      newErrors.activity_title = "Activity Title is required";
    }
    if (!data.completion_notes && data.mark_complete) {
      newErrors.completion_notes = "Please provide completion notes";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Process form submission
    console.log("Completing task:", data);
  };

  return (
    <Form
      validationErrors={errors}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <InputComponent
        label="Activity Title"
        placeholder="Enter activity title"
        name="activity_title"
        isReadOnly
        description="The title of the task to be completed"
      />

      <Button
        size="sm"
        radius="sm"
        variant="solid"
        color="primary"
        className="self-end"
        type="submit"
        name="mark_complete"
        value="true"
      >
        Mark as Complete
      </Button>
    </Form>
  );
};
