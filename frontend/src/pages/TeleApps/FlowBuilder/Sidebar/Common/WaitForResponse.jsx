import React, { useState } from "react";
import { Switch, Input, Select, SelectItem } from "@heroui/react";

// Time unit options
const timeUnitOptions = [
  { label: "Minutes", value: "minutes" },
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
];

const WaitForResponseSwitch = ({ onChange }) => {
  const [waitForResponse, setWaitForResponse] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [offsetValue, setOffsetValue] = useState("");

  // Handle switch toggle
  const handleSwitchChange = (isSelected) => {
    setWaitForResponse(isSelected);

    // Call parent onChange with the current state
    if (onChange) {
      onChange({
        enabled: isSelected,
        offsetValue: offsetValue,
        unit: selectedUnit,
      });
    }
  };

  // Handle time unit selection change
  const handleUnitChange = (selectedValue) => {
    const unit = [...selectedValue][0];
    setSelectedUnit(unit);

    // Call parent onChange with the updated state
    if (onChange) {
      onChange({
        enabled: waitForResponse,
        offsetValue: offsetValue,
        unit: unit,
      });
    }
  };

  // Handle offset value change
  const handleOffsetChange = (e) => {
    setOffsetValue(e.target.value);

    // Call parent onChange with the updated state
    if (onChange) {
      onChange({
        enabled: waitForResponse,
        offsetValue: e.target.value,
        unit: selectedUnit,
      });
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Wait for User Response Switch */}
      <div className="flex flex-col gap-2">
        <Switch
          size="sm"
          isSelected={waitForResponse}
          onValueChange={handleSwitchChange}
        >
          <p className="text-sm>"> Wait for User Response</p>
        </Switch>
      </div>

      {/* Conditional Wait Time Settings */}
      {waitForResponse && (
        <div className="flex flex-col gap-4 p-2">
          <Input
            label="Set Value to Offset"
            type="number"
            placeholder="Enter value"
            labelPlacement="outside"
            min="1"
            value={offsetValue}
            onChange={handleOffsetChange}
            className="w-full"
            variant="bordered"
            radius="sm"
            size="md"
          />

          <Select
            aria-label="Select Time Unit"
            label="Unit"
            labelPlacement="outside"
            placeholder=" "
            onSelectionChange={handleUnitChange}
            description="The flow will wait for a response from the user for the specified time. If no reply is received, the next step will execute. If the delay exceeds 24 hours, set the next node with a template only."
            value={selectedUnit}
            className="w-full"
            variant="bordered"
            radius="sm"
            size="md"
          >
            {timeUnitOptions.map((unit) => (
              <SelectItem key={unit.value} value={unit.value}>
                {unit.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};

export default WaitForResponseSwitch;
