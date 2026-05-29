import React from "react";
import { useState } from "react";
import { Textarea, Input, Tooltip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

// Info Icon
const infoIcon = (
  <Icon
    icon="fluent:info-24-regular"
    width="1.2em"
    height="1.2em"
    className="text-primary"
  />
);

export default function CustomInputText({
  label = "Label",
  description = "",
  color = "default",
  charsAllowed = 120,
  info = "true",
  name,
  className,
  value, // Value from parent component
  onChange, // onChange handler from parent component
  isRequired = true,
  inputType = "textArea",
  labelPlacement = "outside",
}) {
  const { t } = useTranslation();

  const [error, setError] = useState(false); // Set initial error to false

  // Function to calculate & limit entered chars
  const handleCalculatedChars = (newValue) => {
    if (newValue.length > charsAllowed) {
      setError(true);
      onChange(newValue.slice(0, charsAllowed)); // Call parent's onChange
    } else {
      setError(false);
      onChange(newValue); // Call parent's onChange
    }
  };

  // Show tooltip if info is true else set to empty string
  const tooltip =
    info === "true" ? <Tooltip content={description}>{infoIcon}</Tooltip> : "";

  return (
    <div className={`w-full ${className}`}>
      {inputType === "textArea" ? (
        <Textarea
          isRequired={isRequired}
          endContent={tooltip}
          //   description={`${value?.length}/${charsAllowed} ${t("chars used")}`}
          label={label}
          labelPlacement={labelPlacement}
          name={name}
          size="sm"
          radius="sm"
          variant="flat"
          value={value}
          onValueChange={handleCalculatedChars} // Handle input changes
          color={error ? "danger" : "default"}
          isInvalid={error}
          errorMessage={error ? `Only ${charsAllowed} chars allowed` : ""}
        />
      ) : (
        <Input
          isRequired={isRequired}
          endContent={tooltip}
          //   description={`${value?.length}/${charsAllowed} ${t("chars used")}`}
          label={label}
          labelPlacement={labelPlacement}
          name={name}
          size="sm"
          radius="sm"
          variant="flat"
          value={value}
          onValueChange={handleCalculatedChars} // Handle input changes
          color={error ? "danger" : "default"}
          isInvalid={error}
          errorMessage={error ? `Only ${charsAllowed} chars allowed` : ""}
        />
      )}
    </div>
  );
}
