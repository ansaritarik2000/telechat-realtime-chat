import React, { useState } from "react";
import { Select, SelectItem, Form, Button } from "@heroui/react";

// Sample nodes for the "Go back to node" dropdown
// In a real application, this would likely be passed as a prop or fetched from an API
const nodeOptions = [
  { label: "Start Node", value: "start_node" },
  { label: "User Input Node", value: "user_input_node" },
  { label: "Decision Node", value: "decision_node" },
  { label: "API Call Node", value: "api_call_node" },
  { label: "Data Processing Node", value: "data_processing_node" },
];

// Max retries options
const retriesOptions = [
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
];

// Common Select Component
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

export const GoBackToNode = function () {
  const [selectedNode, setSelectedNode] = useState("");
  const [selectedRetries, setSelectedRetries] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Form data:", data);

    // Validation logic
    const newErrors = {};
    if (!selectedNode) {
      newErrors.node = "Target node is required";
    }
    if (!selectedRetries) {
      newErrors.retries = "Max retries is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Process form submission
    console.log(
      `Going back to node ${selectedNode} with max ${selectedRetries} retries`
    );
    // Handle form submission logic
  };

  return (
    <Form
      validationErrors={errors}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <SelectComponent
        label="Go back to node"
        options={nodeOptions}
        selectedValue={selectedNode}
        setSelectedValue={setSelectedNode}
        description="Select the node to return to in the workflow"
      />

      <SelectComponent
        label="Max Retries"
        options={retriesOptions}
        selectedValue={selectedRetries}
        setSelectedValue={setSelectedRetries}
        description="Max attempts for the current node, specifying how many times it should run in a single execution before marking the workflow as completed to avoid looping."
      />

      <Button
        size="sm"
        radius="sm"
        variant="solid"
        color="primary"
        className="self-end"
        type="submit"
      >
        Save
      </Button>
    </Form>
  );
};
