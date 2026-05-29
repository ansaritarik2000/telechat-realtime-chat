import React from "react";
import { Input } from "@heroui/react";

export default function InputStyleField({
  label,
  value,
  onHandleStyleChange,
  type = "px",
}) {
  const FormattedValue = (value_) => {
    return Number(value_.toString().replace(type, ""));
  };

  return (
    <div>
      <Input
        type="number"
        className="max-w-xs"
        variant="bordered"
        label={label}
        value={FormattedValue(value)}
        onChange={(e) => onHandleStyleChange(e.target.value + type)}
        endContent={<span className="text-xs">px</span>}
      />
    </div>
  );
}
