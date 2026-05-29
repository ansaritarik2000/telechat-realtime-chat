import React, { useState } from "react";
import {
  Select,
  SelectItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@heroui/react";
import { TemplateIcon } from "../../../../utils/ReusableIcons";
import { Icon } from "@iconify/react";

// Template type options
const templateTypeOptions = [
  { key: "promotional", label: "Promotional" },
  { key: "service_explicit", label: "Service Explicit" },
  { key: "transactional", label: "Transactional" },
  { key: "service_implicit", label: "Service Implicit" },
];

export default function EmailConfig() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedTemplateType, setSelectedTemplateType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Handle template type selection
  const handleTemplateTypeChange = (keys) => {
    const templateType = Array.from(keys)[0];
    setSelectedTemplateType(templateType);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Template Type Selector */}
      <Select
        label="Template Type"
        labelPlacement="outside"
        placeholder="Select template type"
        className="w-full"
        radius="sm"
        variant="bordered"
        selectedKeys={
          selectedTemplateType ? new Set([selectedTemplateType]) : new Set([])
        }
        onSelectionChange={handleTemplateTypeChange}
      >
        {templateTypeOptions.map((option) => (
          <SelectItem key={option.key} value={option.key}>
            {option.label}
          </SelectItem>
        ))}
      </Select>

      {/* Select Template Button */}
      <Button
        size="md"
        radius="sm"
        variant="bordered"
        color="warning"
        onPress={onOpen}
        className="w-full flex-center"
      >
        <TemplateIcon customClass="text-warning" />
        Select Template
      </Button>

      {/* Template Selection Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-1">
                <TemplateIcon customClass="text-default-800" />
                <p>Templates</p>
              </ModalHeader>
              <ModalBody>
                {/* Search Input */}
                <Input
                  isClearable
                  radius="sm"
                  size="md"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full mb-4"
                  variant="bordered"
                  startContent={<Icon icon="majesticons:search-line" />}
                />

                {/* Template list would go here */}
                <div className="h-96 overflow-y-auto border rounded-md p-4">
                  <p className="text-center text-default-500">
                    Templates will appear here
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button size="sm" color="primary" onPress={onClose}>
                  Select
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
