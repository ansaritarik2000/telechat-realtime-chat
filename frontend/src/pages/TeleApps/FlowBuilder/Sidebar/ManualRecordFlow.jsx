import React, { useState } from "react";
import { Select, SelectItem } from "@heroui/react";

// Collection options
const collectionOptions = [
  { key: "people", label: "People" },
  { key: "company", label: "Company" },
  { key: "deals", label: "Deals" },
];

export default function ManualRecordFlowConfig() {
  const [selectedCollection, setSelectedCollection] = useState("");

  // Handle collection selection
  const handleCollectionChange = (keys) => {
    const collection = Array.from(keys)[0];
    setSelectedCollection(collection);
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
    </div>
  );
}
