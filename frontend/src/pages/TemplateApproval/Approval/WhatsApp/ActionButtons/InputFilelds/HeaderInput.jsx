import React, { useState } from "react";
import { Input } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { extractVariables } from "../../FileUpload/utils";
import { useWhatsappTemplateStore } from "../../../../../../store/templateApprovalStore";

export default function HeaderInput() {
  const maxChars = 60;

  // Access store state and functions
  const { headerContent, setHeaderText, addHeaderVariables } =
    useWhatsappTemplateStore();

  // Handle text input changes
  const handleHeaderTextChange = (e) => {
    const newMessage = e.target.value;
    const variablesInMessage = extractVariables(newMessage);

    // Update the store with the new message and variables
    setHeaderText({
      textMessage: newMessage,
      variables: variablesInMessage,
    });
  };

  // Handle adding a variable
  const handleAddVariable = () => {
    if (headerContent?.variables?.length <= 0) {
      addHeaderVariables();
    } else {
      return;
    }
  };

  // Calculate character count
  const charCount = headerContent?.textMessage?.length || 0;

  return (
    <div className="flex flex-col gap-1">
      <Input
        isRequired
        value={headerContent?.textMessage || ""}
        type="text"
        radius="sm"
        label={"Header Text"}
        variant="flat"
        isInvalid={charCount > maxChars}
        color={charCount > maxChars ? "danger" : "default"}
        errorMessage={`Header Text can only contain ${maxChars} characters.`}
        className=""
        maxLength={61}
        onChange={handleHeaderTextChange}
      />

      {/* Add Var Link & Char Count */}
      <div className="flex justify-end">
        <div className="flex gap-2 items-center justify-center">
          <button onClick={handleAddVariable}>
            <a
              href="#"
              className="text-xs text-primary cursor-pointer flex items-center"
            >
              <Icon icon="ic:outline-plus" width={13} />
              <span>Add Variable</span>
            </a>
          </button>
          <p className="text-xs text-gray-500">
            Characters used: {charCount}/{maxChars}
          </p>
        </div>
      </div>
    </div>
  );
}
