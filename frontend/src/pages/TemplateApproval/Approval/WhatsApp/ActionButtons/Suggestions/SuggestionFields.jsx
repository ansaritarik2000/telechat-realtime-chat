import React, { useState } from "react";
import { Input } from "@heroui/react";
import { useWhatsappTemplateStore } from "../../../../../../store/templateApprovalStore";
import { useTranslation } from "react-i18next";

const maxChars = 25;

export default function SuggestionFields({ section, id, cardId }) {
  const [textCharCount, setTextCharCount] = useState(0);
  const [textIsValid, setTextIsValid] = useState(true);
  const [Text, setText] = useState(section?.displayText ?? "");
  const { t } = useTranslation();
  const { updateButtonField, selectedTemplateType } =
    useWhatsappTemplateStore();
  const [code, setCode] = useState(false);
  const handleTextInput = (e) => {
  const value = e.target.value;
    if(section.suggestionType==="copy_code"){
           setText("Copy offer code")
           setCode(true)
    }
    else{
    setCode(false)
    const inputLen = value.length;
    if(inputLen > maxChars ){
        setTextIsValid(false)
        return
    }
    else{
        setTextIsValid(true)
    }
    setText(value);
    setTextCharCount(inputLen);
    }

    // Check if section is defined
    if (!section) {
      console.error("Section is undefined");
      return;
    }

    // Determine contentType based on selectedTemplateType
    let contentType;
    switch (selectedTemplateType) {
      case "text":
        contentType = "textMessageContent";
        break;
      case "image":
        contentType = "singleImageContent";
        break;
      case "video":
        contentType = "videoContent";
        break;
      case "location":
        contentType = "location";
        break;
      case "document":
        contentType = "documentContent";
        break;
      case "WithExpiration":
      case "WithoutExpiration":
        contentType = "LtoContent";
        break;
      case "carousel":
        contentType = "carouselItems";
        break;
      default:
        return;
    }

    // Update the button suggestion type
    updateButtonField(
      contentType,
      cardId,
      section.id,
      "displayText",
      section.suggestionType === "copy_code" ? "Copy offer code" : value
    );
  };

  return (
    <div className="flex gap-3">
      <div className="w-full">
        <Input
          isRequired
          name="displayText"
          type="text"
          isInvalid={!textIsValid}
          radius="sm"
          label={t("Button Text")}
          variant="flat"
          isDisabled={
            (id === 1 && ["carousel"].indexOf(selectedTemplateType) === -1) ||
            code
          }
          onChange={handleTextInput}
          value={
            id === 1 &&
            ["carousel", "WithExpiration", "WithoutExpiration"].indexOf(
              selectedTemplateType
            ) === -1
              ? "Reply"
              : Text
          }
        />

        <div className="flex mt-1 pl-1 justify-start text-xs text-gray-400">
          <p>
            {t("Characters used")}: {textCharCount}/{maxChars}
          </p>
        </div>
      </div>
    </div>
  );
}
