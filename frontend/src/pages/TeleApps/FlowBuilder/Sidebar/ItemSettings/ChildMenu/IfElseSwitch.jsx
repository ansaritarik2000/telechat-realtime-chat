import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
  Input,
} from "@heroui/react";
import {
  FilterIcon,
  PlusIcon,
  TrashIcon,
} from "../../../../../../utils/ReusableIcons";

// Filter field options
const fieldOptions = [
  { key: "received_message", label: "Received Message" },
  { key: "received_on", label: "Received on (ID)" },
  { key: "record", label: "Record" },
  { key: "triggered_at", label: "Triggered at" },
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

export default function IfElseSwitch() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [filters, setFilters] = useState([
    { id: 1, logicalOperator: null, field: "", condition: "", value: "" },
  ]);

  // Add a new filter
  const addFilter = () => {
    const newFilter = {
      id: filters.length + 1,
      logicalOperator: "and", // Default to AND
      field: "",
      condition: "",
      value: "",
    };
    setFilters([...filters, newFilter]);
  };

  // Delete a filter
  const deleteFilter = (id) => {
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
    <>
      <Button
        size="md"
        radius="sm"
        color="primary"
        variant="bordered"
        onPress={onOpen}
        startContent={<FilterIcon customClass="text-primary" />}
      >
        Manage Filters {filters.length > 1 && `(${filters.length})`}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-1">
                <FilterIcon customClass="text-default-700" /> <p>Filters</p>
              </ModalHeader>
              <ModalBody>
                {/* Add Filter Button */}
                <Button
                  size="sm"
                  radius="sm"
                  variant="flat"
                  color="primary"
                  onPress={addFilter}
                  startContent={<PlusIcon customClass="text-primary" />}
                  className="w-fit mb-4 self-end"
                >
                  Add Filter
                </Button>

                {/* Filters */}
                <div className="flex flex-col  gap-4">
                  {filters.map((filter, index) => (
                    <div key={filter.id} className="flex items-center gap-2">
                      {/* Logical operator (AND/OR) for rows after the first one */}
                      {index === 0 ? (
                        <span className="border border-default text-xs rounded-lg p-2 bg-content1">
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
                        className="min-w-[130px]"
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
                        className="min-w-[100px]"
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
                            className="min-w-[180px]"
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
                        onPress={() => deleteFilter(filter.id)}
                      >
                        <TrashIcon customClass="text-danger" size="1.5em" />
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
    </>
  );
}
