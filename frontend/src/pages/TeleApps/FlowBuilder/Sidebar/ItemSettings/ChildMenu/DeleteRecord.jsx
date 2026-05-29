import React, { useState } from "react";
import { Select, SelectItem, Input, Form, Button } from "@heroui/react";

const collectionOptions = [
  { label: "People", value: "people" },
  { label: "Company", value: "company" },
  { label: "Deals", value: "deals" },
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
        variant="flat"
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

export const DeleteRecord = function () {
  const [selectedCollection, setSelectedCollection] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Form data:", data);

    // Validation logic
    if (!selectedCollection) {
      setErrors({ collection: "Collection is required" });
      return;
    } 

    // Process form submission
    console.log(`Deleting record ${data.collection_record} from ${selectedCollection} collection`);
    // Reset form or show success message
  };

  return (
    <Form
      validationErrors={errors}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <SelectComponent
        label="Collection"
        options={collectionOptions}
        selectedValue={selectedCollection}
        setSelectedValue={setSelectedCollection}
      />

      <InputComponent
        label="Collection Record"
        placeholder="Enter variable name"
        name="collection_record"
        description="Accepts only variable references"
      />

      <Button
        size="sm"
        radius="sm"
        variant="solid"
        color="danger"
        className="self-end"
        type="submit"
      >
        Delete Record
      </Button>
    </Form>
  );
};
