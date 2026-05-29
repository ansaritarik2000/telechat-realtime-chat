import React, { useState } from "react";
import { Input } from "@heroui/react";

export default function InputField({
  label,
  value,
  onhandleInputChange,
  size = "md",
}) {
  return (
    <Input
      size={size}
      className="max-w-xs"
      variant="bordered"
      label={<span className="uppercase">{label}</span>}
      value={value}
      onChange={(e) => onhandleInputChange(e.target.value)}
    />
  );
}
