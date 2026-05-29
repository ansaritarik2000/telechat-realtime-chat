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

// Attribute options
const attributeOptions = [
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

// Request processing options
const requestProcessingOptions = [
  { key: "ignore", label: "Ignore new request & keep existing" },
  { key: "accept", label: "Accept new request and discard existing" },
];

// Condition options for filters
const conditionOptions = [
  { key: "contains", label: "Contains" },
  { key: "not_contains", label: "Not Contains" },
  { key: "starts_with", label: "Starts With" },
  { key: "ends_with", label: "Ends With" },
  { key: "is", label: "Is" },
  { key: "is_not", label: "Is Not" },
  { key: "empty", label: "Empty" },
  { key: "not_empty", label: "Not Empty" },
];

// Logical operator options
const logicalOperatorOptions = [
  { key: "and", label: "AND" },
  { key: "or", label: "OR" },
];

export default function RecordUpdatedConfig() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [useConditions, setUseConditions] = useState(false);
  const [requestProcessing, setRequestProcessing] = useState("ignore");
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

  // Handle attribute selection
  const handleAttributeChange = (keys) => {
    const attribute = Array.from(keys)[0];
    setSelectedAttribute(attribute);
  };

  // Handle request processing selection
  const handleRequestProcessingChange = (keys) => {
    const option = Array.from(keys)[0];
    setRequestProcessing(option);
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

      {/* Attribute Selector (Optional) */}
      <Select
        label="Attribute (Optional)"
        labelPlacement="outside"
        placeholder="Select an attribute"
        className="w-full"
        radius="sm"
        variant="bordered"
        selectedKeys={
          selectedAttribute ? new Set([selectedAttribute]) : new Set([])
        }
        onSelectionChange={handleAttributeChange}
        description="Triggering occurs only when this attribute is updated. Leave blank to trigger this workflow when any attribute on the record changes."
      >
        {attributeOptions.map((option) => (
          <SelectItem key={option.key} value={option.key}>
            {option.label}
          </SelectItem>
        ))}
      </Select>

      {/* Conditions Checkbox - enabled only when collection is selected */}
      <div className="flex items-center gap-4 p-3 border border-default rounded-lg">
        <Checkbox
          size="sm"
          isDisabled={!selectedCollection}
          isSelected={useConditions}
          onValueChange={setUseConditions}
        >
          <span className="text-xs">Use conditions (optional)</span>
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

      {/* Request Processing Selector */}
      <Select
        label="How to Process A New Request?"
        labelPlacement="outside"
        placeholder="Select an option"
        className="w-full"
        radius="sm"
        variant="bordered"
        selectedKeys={
          requestProcessing ? new Set([requestProcessing]) : new Set([])
        }
        onSelectionChange={handleRequestProcessingChange}
        description="Handle repeat user requests in a running flow to avoid conflicts."
      >
        {requestProcessingOptions.map((option) => (
          <SelectItem key={option.key} value={option.key}>
            {option.label}
          </SelectItem>
        ))}
      </Select>

      {/* Footer Note */}
      <div className="text-xs text-default-500 mt-2">
        If a new execution request is received while the current workflow is
        running, the new request will be discarded. The existing execution will
        continue without interruption.
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
                  variant="flat"
                  color="primary"
                  onPress={addCondition}
                  startContent={<PlusIcon customClass="text-primary" />}
                  className="w-fit mb-4 self-end"
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
                          className="w-80"
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
                        className="min-w-[150px]"
                        size="sm"
                        variant="bordered"
                      >
                        {attributeOptions.map((field) => (
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
                        className="min-w-[140px]"
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
                        variant="none"
                        color="danger"
                        onPress={() => deleteCondition(filter.id)}
                      >
                        <TrashIcon customClass="text-danger" />
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
