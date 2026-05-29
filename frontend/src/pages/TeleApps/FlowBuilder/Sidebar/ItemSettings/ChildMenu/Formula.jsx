import React, { useState } from "react";
import { Select, SelectItem, Input, Form, Button } from "@heroui/react";

// Operation options
const operationOptions = [
  { label: "Add", value: "add" },
  { label: "Subtract", value: "subtract" },
  { label: "Multiply", value: "multiply" },
  { label: "Divide", value: "divide" },
];

// Common Input Component
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

export const Formula = function () {
  const [selectedOperation, setSelectedOperation] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Form data:", data);

    // Validation logic
    const newErrors = {};
    if (!data.variable_1) {
      newErrors.variable_1 = "Variable 1 is required";
    }
    if (!selectedOperation) {
      newErrors.operation = "Operation is required";
    }
    if (!data.variable_2) {
      newErrors.variable_2 = "Variable 2 is required";
    }

    // Additional validation for division by zero
    if (selectedOperation === "divide" && parseFloat(data.variable_2) === 0) {
      newErrors.variable_2 = "Cannot divide by zero";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Process form submission
    let result;
    const v1 = parseFloat(data.variable_1);
    const v2 = parseFloat(data.variable_2);

    switch (selectedOperation) {
      case "add":
        result = v1 + v2;
        break;
      case "subtract":
        result = v1 - v2;
        break;
      case "multiply":
        result = v1 * v2;
        break;
      case "divide":
        result = v1 / v2;
        break;
      default:
        result = null;
    }

    console.log(`Result of operation: ${result}`);
    // Handle result (store in state, pass to parent, etc.)
  };

  return (
    <Form
      validationErrors={errors}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <InputComponent
        label="Variable 1"
        type="number"
        placeholder="Enter first number"
        name="variable_1"
        description="First operand in the formula"
      />

      <SelectComponent
        label="Operation"
        options={operationOptions}
        selectedValue={selectedOperation}
        setSelectedValue={setSelectedOperation}
        description="Mathematical operation to perform"
      />

      <InputComponent
        label="Variable 2"
        type="number"
        placeholder="Enter second number"
        name="variable_2"
        description="Second operand in the formula"
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
