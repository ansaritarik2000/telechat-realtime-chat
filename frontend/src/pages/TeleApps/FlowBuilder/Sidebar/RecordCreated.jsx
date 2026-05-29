import React, { useState } from "react";
import {
  Select,
  SelectItem,
  Checkbox,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@heroui/react";
import {
  FilterIcon,
  PlusIcon,
  TrashIcon,
} from "../../../../utils/ReusableIcons";

// Collection options
const collectionOptions = [
  { key: "people", label: "People" },
  { key: "company", label: "Company" },
  { key: "deals", label: "Deals" },
];

// Field options for the filter conditions
const fieldOptions = [
  { key: "name", label: "Name" },
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "emails", label: "Emails" },
  { key: "phone_numbers", label: "Phone Numbers" },
  { key: "company", label: "Company" },
  { key: "job_title", label: "Job Title" },
  { key: "description", label: "Description" },
  { key: "address", label: "Address" },
  { key: "email_validation", label: "Email Validation" },
  { key: "facebook", label: "Facebook" },
  { key: "instagram", label: "Instagram" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "twitter", label: "Twitter" },
  { key: "last_interaction", label: "Last Interaction" },
  { key: "timezone", label: "Timezone" },
  { key: "opt_out", label: "Opt Out" },
  { key: "opt_out_reason", label: "Opt Out Reason" },
  { key: "source", label: "Source" },
  { key: "owner", label: "Owner" },
  { key: "share", label: "Share" },
  { key: "created_at", label: "Created At" },
];

// Condition options

const conditionOptions = [
  { key: "contains", label: "contains" },
  { key: "not_contains", label: "not contains" },
  { key: "starts_with", label: "starts with" },
  { key: "ends_with", label: "ends with" },
  { key: "is", label: "is" },
  { key: "is_not", label: "is not" },
  { key: "empty", label: "empty" },
  { key: "not_empty", label: "not empty" },
];

// Logical operator options
const logicalOperatorOptions = [
  { key: "and", label: "AND" },
  { key: "or", label: "OR" },
];

export default function RecordCreatedConfig() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedCollection, setSelectedCollection] = useState("");
  const [useConditions, setUseConditions] = useState(false);
  const [filters, setFilters] = useState([
    { id: 1, logicalOperator: null, field: "", condition: "", value: "" },
  ]);

  // Handle collection selection
  const handleCollectionChange = (keys) => {
    const collection = Array.from(keys)[0];
    setSelectedCollection(collection);
    if (!collection) {
      setUseConditions(false);
    }
  };

  // Add a new filter condition
  const addCondition = () => {
    const newFilter = {
      id: filters.length + 1,
      logicalOperator: "and", // Default to AND
      field: "",
      condition: "",
      value: "",
    };
    setFilters([...filters, newFilter]);
  };

  // Delete a filter condition
  const deleteCondition = (id) => {
    if (filters.length === 1) {
      // Reset the first filter instead of removing it
      setFilters([
        { id: 1, logicalOperator: null, field: "", condition: "", value: "" },
      ]);
    } else {
      setFilters(filters.filter((filter) => filter.id !== id));
    }
  };

  // Update filter field
  const updateFilterField = (id, field, value) => {
    setFilters(
      filters.map((filter) =>
        filter.id === id ? { ...filter, [field]: value } : filter
      )
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Collection Selector */}
      <Select
        label="Collection"
        labelPlacement="outside"
        placeholder="Select a collection"
        className="w-full"
        radius="sm"
        variant="bordered"
        selectedKeys={
          selectedCollection ? new Set([selectedCollection]) : new Set([])
        }
        onSelectionChange={handleCollectionChange}
      >
        {collectionOptions.map((option) => (
          <SelectItem key={option.key} value={option.key}>
            {option.label}
          </SelectItem>
        ))}
      </Select>

      {/* Conditions Checkbox - enabled only when collection is selected */}
      <div className="flex flex-col justify-center gap-4">
        <Checkbox
          size="sm"
          isDisabled={!selectedCollection}
          isSelected={useConditions}
          onValueChange={setUseConditions}
        >
          Use conditions
        </Checkbox>

        {/* Conditions Button - visible only when checkbox is selected */}
        {useConditions && (
          <Button
            size="sm"
            variant="bordered"
            onPress={onOpen}
            startContent={<FilterIcon />}
          >
            Conditions
          </Button>
        )}
      </div>

      {/* Conditions Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-1">
                <FilterIcon customClass="text-default-800" /> <p>Conditions</p>
              </ModalHeader>
              <ModalBody>
                {/* Add Condition Button */}
                <Button
                  size="sm"
                  radius="sm"
                  variant="bordered"
                  onPress={addCondition}
                  startContent={<PlusIcon />}
                  className="w-fit mb-4"
                >
                  Add Condition
                </Button>

                {/* Filters */}
                <div className="flex flex-col gap-4">
                  {filters.map((filter, index) => (
                    <div
                      key={filter.id}
                      className="flex items-center gap-2 w-full"
                    >
                      {/* Logical operator (AND/OR) for rows after the first one */}
                      {index === 0 ? (
                        <span className="border text-xs rounded-lg p-2">
                          Where
                        </span>
                      ) : (
                        <Select
                          selectedKeys={
                            filter.logicalOperator
                              ? new Set([filter.logicalOperator])
                              : new Set([])
                          }
                          onSelectionChange={(keys) =>
                            updateFilterField(
                              filter.id,
                              "logicalOperator",
                              Array.from(keys)[0]
                            )
                          }
                          className="w-72"
                          size="sm"
                          variant="bordered"
                        >
                          {logicalOperatorOptions.map((op) => (
                            <SelectItem key={op.key}>{op.label}</SelectItem>
                          ))}
                        </Select>
                      )}

                      {/* Field selection */}
                      <Select
                        selectedKeys={
                          filter.field ? new Set([filter.field]) : new Set([])
                        }
                        onSelectionChange={(keys) =>
                          updateFilterField(
                            filter.id,
                            "field",
                            Array.from(keys)[0]
                          )
                        }
                        placeholder="Select field"
                        className="min-w-[180px]"
                        size="sm"
                        variant="bordered"
                      >
                        {fieldOptions.map((field) => (
                          <SelectItem key={field.key}>{field.label}</SelectItem>
                        ))}
                      </Select>

                      {/* Condition selection */}
                      <Select
                        selectedKeys={
                          filter.condition
                            ? new Set([filter.condition])
                            : new Set([])
                        }
                        onSelectionChange={(keys) =>
                          updateFilterField(
                            filter.id,
                            "condition",
                            Array.from(keys)[0]
                          )
                        }
                        placeholder="Select condition"
                        className="min-w-[150px]"
                        size="sm"
                        variant="bordered"
                      >
                        {conditionOptions.map((condition) => (
                          <SelectItem key={condition.key}>
                            {condition.label}
                          </SelectItem>
                        ))}
                      </Select>

                      {/* Value input - only show for conditions that need a value */}
                      {filter.condition &&
                        !["empty", "not_empty"].includes(filter.condition) && (
                          <Input
                            value={filter.value}
                            onChange={(e) =>
                              updateFilterField(
                                filter.id,
                                "value",
                                e.target.value
                              )
                            }
                            placeholder="Enter value"
                            className="min-w-[150px]"
                            size="sm"
                            variant="bordered"
                          />
                        )}

                      {/* Delete button */}
                      <Button
                        isIconOnly
                        size="sm"
                        radius="sm"
                        variant="bordered"
                        // color="danger"
                        onPress={() => deleteCondition(filter.id)}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setFilters([
                      {
                        id: 1,
                        logicalOperator: null,
                        field: "",
                        condition: "",
                        value: "",
                      },
                    ]);
                  }}
                >
                  Reset
                </Button>
                <Button size="sm" color="primary" onPress={onClose}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
