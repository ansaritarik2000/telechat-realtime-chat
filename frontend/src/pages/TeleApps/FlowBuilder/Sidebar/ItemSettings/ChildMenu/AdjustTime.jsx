import React, { useState } from "react";
import { Select, SelectItem, Input, Form, Button } from "@heroui/react";

// Time unit options
const timeUnitOptions = [
  { label: "Seconds", value: "seconds" },
  { label: "Minutes", value: "minutes" },
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
  { label: "Months", value: "months" },
  { label: "Years", value: "years" },
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

export const AdjustTime = function () {
  const [selectedUnit, setSelectedUnit] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Form data:", data);

    // Validation logic
    const newErrors = {};
    if (!data.timestamp) {
      newErrors.timestamp = "Timestamp is required";
    }
    if (!data.offset_value) {
      newErrors.offset_value = "Offset value is required";
    }
    if (!selectedUnit) {
      newErrors.unit = "Time unit is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Process form submission
    console.log(`Adjusting time by ${data.offset_value} ${selectedUnit}`);
    // Reset form or show success message
  };

  return (
    <Form
      validationErrors={errors}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <InputComponent
        label="Timestamp"
        type="datetime-local"
        name="timestamp"
        description="The base timestamp to adjust"
      />

      <InputComponent
        label="Set value to Offset"
        type="number"
        placeholder="Enter offset value"
        name="offset_value"
        description="Positive values add time, negative values subtract time"
      />

      <SelectComponent
        label="Unit"
        options={timeUnitOptions}
        selectedValue={selectedUnit}
        setSelectedValue={setSelectedUnit}
        description="Time unit for the offset"
      />

      <Button
        size="sm"
        radius="sm"
        variant="solid"
        color="primary"
        className="self-end"
        type="submit"
      >
        Adjust Time
      </Button>
    </Form>
  );
};
