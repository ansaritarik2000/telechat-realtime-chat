import React, { useState } from "react";
import {
  Select,
  SelectItem,
  Input,
  Form,
  Button,
  Tabs,
  Tab,
} from "@heroui/react";

// Time unit options
const timeUnitOptions = [
  { label: "Seconds", value: "seconds" },
  { label: "Minutes", value: "minutes" },
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
  { label: "Weeks", value: "weeks" },
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

// Delay Component
const DelayComponent = function () {
  const [selectedUnit, setSelectedUnit] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Form data:", data);

    // Validation logic
    const newErrors = {};
    if (!data.offset_value) {
      newErrors.offset_value = "Offset value is required";
    } else if (parseFloat(data.offset_value) <= 0) {
      newErrors.offset_value = "Offset value must be greater than 0";
    }

    if (!selectedUnit) {
      newErrors.unit = "Time unit is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Process form submission
    console.log(`Setting delay for ${data.offset_value} ${selectedUnit}`);
    // Handle form submission logic
  };

  return (
    <Form
      validationErrors={errors}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <InputComponent
        label="Set Value to Offset"
        type="number"
        placeholder="Enter delay value"
        name="offset_value"
        description="The amount of time to delay"
        min="1"
      />

      <SelectComponent
        label="Unit"
        options={timeUnitOptions}
        selectedValue={selectedUnit}
        setSelectedValue={setSelectedUnit}
        description="Time unit for the delay"
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

// DelayUntil Component
const DelayUntilComponent = function () {
  const [errors, setErrors] = useState({});

  // Set default timestamp to tomorrow at current time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultTimestamp = tomorrow.toISOString().slice(0, 16);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Form data:", data);

    // Validation logic
    const newErrors = {};
    if (!data.timestamp) {
      newErrors.timestamp = "Timestamp is required";
    } else {
      const selectedDate = new Date(data.timestamp);
      const currentDate = new Date();

      if (selectedDate <= currentDate) {
        newErrors.timestamp = "Timestamp must be in the future";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Process form submission
    console.log(`Setting delay until ${data.timestamp}`);
    // Handle form submission logic
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
        description="The exact date and time to resume execution"
        defaultValue={defaultTimestamp}
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

// Parent component with Tabs
export default function DelayWrapper() {
  return (
    <div className="flex w-full flex-col">
      <Tabs fullWidth aria-label="Delay Options">
        <Tab key="delay" title="Delay">
          <DelayComponent />
        </Tab>
        <Tab key="delay-until" title="Delay Until">
          <DelayUntilComponent />
        </Tab>
      </Tabs>
    </div>
  );
}
