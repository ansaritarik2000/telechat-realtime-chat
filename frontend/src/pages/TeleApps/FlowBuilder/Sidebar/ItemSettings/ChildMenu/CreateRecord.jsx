import React, { useState } from "react";
import { Select, SelectItem, Input, Form, Button } from "@heroui/react";
import { Icon } from "@iconify-icon/react";

const optionList = [
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

// People Fields Component
const PeopleFields = () => {
  const timezoneOptions = [
    { label: "UTC", value: "utc" },
    { label: "EST", value: "est" },
    { label: "PST", value: "pst" },
    { label: "IST", value: "ist" },
  ];

  const serviceOptions = [
    { label: "SMS", value: "sms" },
    { label: "RCS", value: "rcs" },
    { label: "WhatsApp", value: "whatsapp" },
    { label: "Email", value: "email" },
  ];

  const ownerOptions = [
    { label: "john.doe@example.com", value: "john.doe@example.com" },
    { label: "jane.smith@example.com", value: "jane.smith@example.com" },
    { label: "alex.johnson@example.com", value: "alex.johnson@example.com" },
  ];

  const shareOptions = [
    { label: "john.doe@example.com", value: "john.doe@example.com" },
    { label: "jane.smith@example.com", value: "jane.smith@example.com" },
    { label: "alex.johnson@example.com", value: "alex.johnson@example.com" },
    { label: "team@example.com", value: "team@example.com" },
  ];

  return (
    <div className="flex-column gap-4 mt-4 w-full">
      <InputComponent label="Name" placeholder="Enter full name" />
      <InputComponent label="First Name" />
      <InputComponent label="Last Name" />
      <InputComponent label="Emails" type="email" />
      <InputComponent label="Phone Number" type="tel" />
      <InputComponent label="Company" />
      <InputComponent label="Job Title" />
      <InputComponent label="Description" />
      <InputComponent label="Address" />
      <InputComponent label="Email Validation" type="email" />
      <InputComponent label="Facebook" />
      <InputComponent label="Instagram" />
      <InputComponent label="LinkedIn" />
      <InputComponent label="Twitter" />
      <InputComponent label="Last Interaction" type="date" />
      <SelectComponent label="Timezone" options={timezoneOptions} />
      <SelectComponent
        label="Opt Out"
        options={serviceOptions}
        placeholder="Select service"
      />
      <InputComponent label="Source" />
      <SelectComponent label="Owner" options={ownerOptions} />
      <SelectComponent label="Share" options={shareOptions} />
    </div>
  );
};

// Company Fields Component
const CompanyFields = () => {
  // Sample options for select fields
  const employeeRangeOptions = [
    { label: "Self-employed", value: "self-employed" },
    { label: "5-10", value: "5-10" },
    { label: "10-50", value: "10-50" },
    { label: "50-100", value: "50-100" },
    { label: "100+", value: "100+" },
  ];

  const emailValidationOptions = [
    { label: "Deliverable", value: "deliverable" },
    { label: "Invalid", value: "invalid" },
    { label: "Risky", value: "risky" },
  ];

  const sourceOptions = [
    { label: "YouTube", value: "youtube" },
    { label: "Facebook", value: "facebook" },
    { label: "Instagram", value: "instagram" },
    { label: "LinkedIn", value: "linkedin" },
    { label: "Twitter", value: "twitter" },
    { label: "Referral", value: "referral" },
    { label: "Website", value: "website" },
  ];

  const ownerOptions = [
    { label: "john.doe@example.com", value: "john.doe@example.com" },
    { label: "jane.smith@example.com", value: "jane.smith@example.com" },
    { label: "alex.johnson@example.com", value: "alex.johnson@example.com" },
  ];

  const shareOptions = [
    { label: "john.doe@example.com", value: "john.doe@example.com" },
    { label: "jane.smith@example.com", value: "jane.smith@example.com" },
    { label: "alex.johnson@example.com", value: "alex.johnson@example.com" },
    { label: "team@example.com", value: "team@example.com" },
  ];

  return (
    <div className="flex-column gap-4 mt-4 w-full">
      <InputComponent label="Company Name" placeholder="Enter company name" />
      <InputComponent label="Domain" placeholder="example.com" />
      <InputComponent
        label="Emails"
        type="email"
        placeholder="contact@example.com"
      />
      <InputComponent
        label="Phone No"
        type="tel"
        placeholder="+1 (123) 456-7890"
      />
      <InputComponent label="Address" placeholder="Company address" />
      <InputComponent
        label="Description"
        placeholder="Brief description of the company"
      />
      <SelectComponent
        label="Employee Range"
        options={employeeRangeOptions}
        placeholder="Select employee range"
      />
      <SelectComponent
        label="Email Validation"
        options={emailValidationOptions}
        placeholder="Select validation status"
      />
      <InputComponent label="Facebook" placeholder="Facebook profile URL" />
      <InputComponent label="Instagram" placeholder="Instagram profile URL" />
      <InputComponent label="Twitter" placeholder="Twitter profile URL" />
      <InputComponent label="LinkedIn" placeholder="LinkedIn profile URL" />
      <InputComponent label="Teams" placeholder="Team names or IDs" />
      <InputComponent label="Last Interaction" type="date" />
      <SelectComponent
        label="Source"
        options={sourceOptions}
        placeholder="Select source"
      />
      <SelectComponent
        label="Owner"
        options={ownerOptions}
        placeholder="Select owner"
      />
      <SelectComponent
        label="Share"
        options={shareOptions}
        placeholder="Select contacts to share with"
        isMulti
      />
    </div>
  );
};

// Deals Fields Component
const DealsFields = () => {
  // Sample options for select fields
  const dealStageOptions = [
    { label: "Prospecting", value: "prospecting" },
    { label: "Qualification", value: "qualification" },
    { label: "Meeting", value: "meeting" },
    { label: "Proposal", value: "proposal" },
    { label: "Negotiation", value: "negotiation" },
    { label: "Won", value: "won" },
    { label: "Lost", value: "lost" },
  ];

  const sourceOptions = [
    { label: "Website", value: "website" },
    { label: "Referral", value: "referral" },
    { label: "Cold Call", value: "cold_call" },
    { label: "LinkedIn", value: "linkedin" },
    { label: "Conference", value: "conference" },
    { label: "Partner", value: "partner" },
  ];

  const confidenceOptions = [
    { label: "★", value: "1" },
    { label: "★★", value: "2" },
    { label: "★★★", value: "3" },
    { label: "★★★★", value: "4" },
    { label: "★★★★★", value: "5" },
  ];

  const ownerOptions = [
    { label: "john.doe@example.com", value: "john.doe@example.com" },
    { label: "jane.smith@example.com", value: "jane.smith@example.com" },
    { label: "alex.johnson@example.com", value: "alex.johnson@example.com" },
  ];

  const shareOptions = [
    { label: "john.doe@example.com", value: "john.doe@example.com" },
    { label: "jane.smith@example.com", value: "jane.smith@example.com" },
    { label: "alex.johnson@example.com", value: "alex.johnson@example.com" },
    { label: "team@example.com", value: "team@example.com" },
  ];

  const peopleOptions = [
    { label: "John Doe", value: "john_doe" },
    { label: "Jane Smith", value: "jane_smith" },
    { label: "Alex Johnson", value: "alex_johnson" },
  ];

  const companyOptions = [
    { label: "Acme Inc", value: "acme_inc" },
    { label: "TechCorp", value: "techcorp" },
    { label: "Global Solutions", value: "global_solutions" },
  ];

  return (
    <div className="flex-column gap-4 mt-4 w-full">
      <InputComponent label="Deal Name" placeholder="Enter deal name" />
      <SelectComponent
        label="Deal Stage"
        options={dealStageOptions}
        placeholder="Select deal stage"
      />
      <InputComponent
        label="Deal Value"
        type="number"
        placeholder="Enter deal value"
        startContent={
          <div className="pointer-events-none flex items-center">$</div>
        }
      />
      <SelectComponent
        label="Associated People"
        options={peopleOptions}
        placeholder="Select associated people"
        isMulti
      />
      <SelectComponent
        label="Associated Company"
        options={companyOptions}
        placeholder="Select associated company"
      />
      <SelectComponent
        label="Source"
        options={sourceOptions}
        placeholder="Select source"
      />
      <SelectComponent
        label="Confidence"
        options={confidenceOptions}
        placeholder="Select confidence level"
      />
      <InputComponent label="Expected Close Date" type="date" />
      <SelectComponent
        label="Owner"
        options={ownerOptions}
        placeholder="Select owner"
      />
      <SelectComponent
        label="Share"
        options={shareOptions}
        placeholder="Select contacts to share with"
        isMulti
      />
    </div>
  );
};

// Create Record Componnet
export const CreateRecord = function () {
  const [selectedCollection, setSelectedCollection] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    console.log("Form data:", data);

    // Validation logic can be added here
    // For example:
    if (!data.name && selectedCollection === "people") {
      setErrors({ name: "Name is required" });
      return;
    }
  };

  return (
    <Form
      validationErrors={errors}
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <SelectComponent
        label="Collection"
        options={optionList}
        selectedValue={selectedCollection}
        setSelectedValue={setSelectedCollection}
        isParent={true}
      />

      {selectedCollection === "people" && <PeopleFields />}
      {selectedCollection === "company" && <CompanyFields />}
      {selectedCollection === "deals" && <DealsFields />}

      {selectedCollection && (
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
      )}
    </Form>
  );
};
