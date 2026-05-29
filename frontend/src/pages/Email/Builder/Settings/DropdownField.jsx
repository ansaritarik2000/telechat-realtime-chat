import React from "react";
import { Select, SelectItem } from "@heroui/react";

export default function DropdownField({
  label,
  value,
  options,
  onhandleStyleChange,
}) {
  // Map the options array to the format expected by the Select component
  const items = options.map((option, index) => ({
    key: index.toString(),
    label: option,
  }));

  // Find the selected key based on the current value
  const selectedKey = items.find((item) => item.label === value)?.key || "";

  return (
    <div>
      <Select
        disallowEmptySelection
        className="max-w-xs"
        size="sm"
        radius="sm"
        variant="bordered"
        label={label}
        selectedKeys={selectedKey ? [selectedKey] : []}
        onChange={(e) => {
          const selectedKey = e.target.value;

          // Map the selected key back to the corresponding option value
          const selectedValue = items[selectedKey].label;

          // Pass the selected value to the parent component
          onhandleStyleChange(selectedValue);
        }}
      >
        {items.map((item) => (
          <SelectItem key={item.key} className="capitalize">
            {item.label}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
}
