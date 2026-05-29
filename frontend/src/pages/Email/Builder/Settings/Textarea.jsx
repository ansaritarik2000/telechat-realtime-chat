import React, { useState } from "react";
import { Textarea } from "@heroui/react";

export default function TextareaComponent({
  label,
  value,
  onhandleInputChange,
  type,
}) {
  return (
    <Textarea
      isResizable
      minRows={label === "HTML Code" ? 20 : 3}
      color="default"
      className="max-w-xs"
      label={label}
      placeholder=""
      value={value}
      onChange={(e) => onhandleInputChange(e.target.value)}
    />
  );
}
