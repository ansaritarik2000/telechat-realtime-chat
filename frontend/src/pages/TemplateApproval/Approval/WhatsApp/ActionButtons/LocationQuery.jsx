import React, { useState } from "react";
import { Input, Button } from "@heroui/react";
import SuggestionFields from "./Suggestions/SuggestionFields";
import { useWhatsappTemplateStore } from "../../../../../store/templateApprovalStore";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify-icon/react";

const maxChars = 15;

export default function LocationQuery({ section, id, cardId }) {
  // zustand state
  const { t } = useTranslation();

  const [textCharCount, setTextCharCount] = useState(0);
  const [locationQuery, setLocationQuery] = useState(
    section.displayTextValue ?? ""
  );

  const [textIsValid, setTextIsValid] = useState(true);
  const [copied, setCopied] = useState(false);

  // handle onchange input
  const { updateButtonField, selectedTemplateType } =
    useWhatsappTemplateStore();

  const handleTextInput = (e) => {
    const value = e.target.value;
    const inputLen = value.length;
    if (inputLen > maxChars) {
      setTextIsValid(false);
      return;
    } else {
      setTextIsValid(true);
    }
    setLocationQuery(value);
    setTextCharCount(inputLen);

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
      case "carousel":
        contentType = "carouselItems";
        break;
      case "WithExpiration":
      case "WithoutExpiration":
        contentType = "LtoContent";
        break;
      default:
        return;
    }

    // Update the button suggestion type
    updateButtonField(
      contentType,
      cardId,
      section.id,
      "displayTextValue",
      value
    );
  };

  return (
    <div className="flex gap-3 flex-col">
      {/* Suggestion Fields */}
      <SuggestionFields section={section} id={id} cardId={cardId} />

      <div className="w-full">
        <Input
          isRequired
          type="text"
          name="locationQuery"
          value={locationQuery}
          isInvalid={!textIsValid}
          radius="sm"
          label={t("Offer Code")}
          variant="flat"
          className=""
          onChange={handleTextInput}
          endContent={
            <Button
              size="sm"
              radius="sm"
              color="default"
              isIconOnly
              variant="bordered"
              onPress={() => {
                navigator.clipboard.writeText(locationQuery);
                setCopied((prev) => !prev);
              }}
            >
              <Icon
                icon={`${copied ? "iconamoon:check" : "akar-icons:copy"}`}
                width="1.5em"
                height="1.5em"
                className="text-default-400 cursor-pointer"
              />
            </Button>
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
