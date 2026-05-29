import { Button, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import React, { useState } from "react";

const CustomIcon = ({ icon, size = "20", active, onClick, value }) => {
  return (
    <Tooltip content={<p className="capitalize">{value}</p>}>
      <Button
        size="sm"
        fullWidth={true}
        variant="bordered"
        color={active ? "success" : "default"} // Apply color based on active state
        onPress={onClick} // Handle button click
      >
        <Icon icon={icon} width={size} height={size} />
      </Button>
    </Tooltip>
  );
};

export default function ButtonGroupField({
  label,
  value,
  options,
  onHandleStyleChange,
}) {
  // State to track the active alignment
  const [activeAlignment, setActiveAlignment] = useState(value || "");

  // Handle button click to update active alignment
  const handleAlignmentChange = (alignment) => {
    setActiveAlignment(alignment);
    if (onHandleStyleChange) {
      onHandleStyleChange(alignment); // Call the callback to notify the parent component
    }
  };

  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold">{label}</p>
      <div className="w-full flex justify-center items-center gap-2">
        {options.map((option, index) => (
          <CustomIcon
            key={index}
            icon={option.icon}
            value={option.value}
            active={activeAlignment === option.value} // Check if this option is the active one
            onClick={() => handleAlignmentChange(option.value)} // Update active alignment on click
          />
        ))}
      </div>
    </div>
  );
}
