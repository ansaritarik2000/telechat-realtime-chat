import React, { useState } from "react";
import { Input, Form, Button } from "@heroui/react";

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

export const RandomNumber = function () {
  const [errors, setErrors] = useState({});
  const [generatedNumber, setGeneratedNumber] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Form data:", data);

    // Validation logic
    const newErrors = {};
    const min = parseFloat(data.minimum);
    const max = parseFloat(data.maximum);

    if (isNaN(min)) {
      newErrors.minimum = "Minimum value is required";
    }
    if (isNaN(max)) {
      newErrors.maximum = "Maximum value is required";
    }
    if (!isNaN(min) && !isNaN(max) && min >= max) {
      newErrors.maximum = "Maximum must be greater than Minimum";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Generate random number
    const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
    setGeneratedNumber(randomValue);
    console.log(`Generated random number: ${randomValue}`);
    // Process form submission or save the generated number
  };

  return (
    <Form
      validationErrors={errors}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <InputComponent
        label="Minimum"
        type="number"
        placeholder="Enter minimum value"
        name="minimum"
        description="The lower bound for random number generation"
      />

      <InputComponent
        label="Maximum"
        type="number"
        placeholder="Enter maximum value"
        name="maximum"
        description="The upper bound for random number generation"
      />

      {generatedNumber !== null && (
        <div className="p-3 bg-gray-100 rounded-md mt-2">
          <p className="font-medium">
            Generated Number:{" "}
            <span className="text-primary">{generatedNumber}</span>
          </p>
        </div>
      )}

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
