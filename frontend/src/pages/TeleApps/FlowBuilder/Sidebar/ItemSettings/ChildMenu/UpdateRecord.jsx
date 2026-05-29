import React, { useState } from "react";
import { Select, SelectItem, Input, Form, Button } from "@heroui/react";

const collectionOptions = [
  { label: "People", value: "people" },
  { label: "Company", value: "company" },
  { label: "Deals", value: "deals" },
];

const attributeOptions = [
  { label: "Name", value: "name", type: "text" },
  { label: "First Name", value: "first_name", type: "text" },
  { label: "Last Name", value: "last_name", type: "text" },
  { label: "Emails", value: "emails", type: "email" },
  { label: "Phone Numbers", value: "phone_numbers", type: "tel" },
  { label: "Company", value: "company", type: "text" },
  { label: "Job Title", value: "job_title", type: "text" },
  { label: "Description", value: "description", type: "text" },
  { label: "Address", value: "address", type: "text" },
  { label: "Email Validation", value: "email_validation", type: "select", options: [
    { label: "Deliverable", value: "deliverable" },
    { label: "Invalid", value: "invalid" },
    { label: "Risky", value: "risky" },
  ]},
  { label: "Facebook", value: "facebook", type: "text" },
  { label: "Instagram", value: "instagram", type: "text" },
  { label: "LinkedIn", value: "linkedin", type: "text" },
  { label: "Twitter", value: "twitter", type: "text" },
  { label: "Last Interaction", value: "last_interaction", type: "date" },
  { label: "Timezone", value: "timezone", type: "select", options: [
    { label: "UTC", value: "utc" },
    { label: "EST", value: "est" },
    { label: "PST", value: "pst" },
    { label: "IST", value: "ist" },
  ]},
  { label: "Opt Out", value: "opt_out", type: "select", options: [
    { label: "Yes", value: "yes" },
    { label: "No", value: "no" },
  ]},
  { label: "Opt Out Reason", value: "opt_out_reason", type: "text" },
  { label: "Source", value: "source", type: "text" },
  { label: "Owner", value: "owner", type: "select", options: [
    { label: "John Doe", value: "john_doe" },
    { label: "Jane Smith", value: "jane_smith" },
    { label: "Alex Johnson", value: "alex_johnson" },
  ]},
  { label: "Share", value: "share", type: "select", options: [
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
    { label: "Team Only", value: "team" },
  ]},
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
  isParent,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <Select
        radius="sm"
        size="md"
        variant={isParent ? "flat" : "bordered"}
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

// Dynamic Value Input Component based on attribute type
const ValueInputComponent = ({ attribute }) => {
  if (!attribute) return null;

  if (attribute.type === "select" && attribute.options) {
    return (
      <SelectComponent
        label="New Value"
        options={attribute.options}
        placeholder={`Select new ${attribute.label}`}
      />
    );
  }

  return (
    <InputComponent
      label="New Value"
      type={attribute.type || "text"}
      placeholder={`Enter new ${attribute.label}`}
    />
  );
};

export const UpdateRecord = function () {
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [errors, setErrors] = useState({});

  // Find the selected attribute object
  const selectedAttributeObj = attributeOptions.find(
    attr => attr.value === selectedAttribute
  );

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
    console.log(`Updating ${selectedAttribute} for ${data.collection_record} in ${selectedCollection} collection`);
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
        isParent={true}
      />

      <InputComponent
        label="Collection Record"
        placeholder="Supports only variable"
        name="collection_record"
      />

      <SelectComponent
        label="Attribute"
        options={attributeOptions}
        selectedValue={selectedAttribute}
        setSelectedValue={setSelectedAttribute}
        placeholder="Source"
      />

      {selectedAttributeObj && (
        <ValueInputComponent attribute={selectedAttributeObj} />
      )}

      <Button
        size="sm"
        radius="sm"
        variant="solid"
        color="primary"
        className="self-end"
        type="submit"
      >
        Update Record
      </Button>
    </Form>
  );
};
