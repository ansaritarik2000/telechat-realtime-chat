import React from "react";
import { Input, Textarea } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { extractVariables } from "../../FileUpload/utils";
import { useWhatsappTemplateStore } from "../../../../../../store/templateApprovalStore";

export default function CarouselBody() {
  const maxChars = 1024;

  // Access store state and functions
  const {
    carouselBodyContent,
    setcarouselBodyContent,
    addcarouselBodyVariables,
  } = useWhatsappTemplateStore();

  // Handle text input changes
  const handleHeaderTextChange = (e) => {
    const newMessage = e.target.value;
    const variablesInMessage = extractVariables(newMessage);

    // Update the store with the new message and variables
    setcarouselBodyContent({
      textMessage: newMessage,
      variables: variablesInMessage,
    });
  };

  // Handle adding a variable
  const handleAddVariable = () => {
    addcarouselBodyVariables();
  };

  // Calculate character count
  const charCount = carouselBodyContent?.textMessage?.length || 0;

  return (
    <div className="flex flex-col gap-1">
      <Textarea
        isRequired
        label="Message"
        placeholder=""
        className="w-full"
        size="md"
        radius="sm"
        isInvalid={charCount > maxChars}
        color={charCount > maxChars ? "danger" : "default"}
        errorMessage={`Header Text can only contain ${maxChars} characters.`}
        maxLength={1025}
        minRows={5}
        maxRows={12}
        value={carouselBodyContent?.textMessage || ""}
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
