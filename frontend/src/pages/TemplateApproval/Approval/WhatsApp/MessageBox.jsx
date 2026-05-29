import React, { useCallback, useState } from "react";
import { Textarea, Button, Input } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import { useWhatsappTemplateStore } from "../../../../store/templateApprovalStore";
import { extractVariables } from "./FileUpload/utils";
import { TimeOfferInput } from "./ActionButtons/InputFilelds/MediaType";

export default function MessageBox({ cardId }) {
  // State to track the message content and character count
  const [charCount, setCharCount] = useState(0);
  const [charCountFooter, setCharCountFooter] = useState(0);
  const maxCharsFooter = 60;

  const {
    textMessageContent,
    setTextMessageContent,
    addVariable,
    selectedTemplateType,
    singleImageContent,
    documentContent,
    location,
    carouselItems,
    videoContent,
    setSingleImageContent,
    setCarouselItems,
    setVideoContent,
    setDocumentContent,
    setLocation,
    setLTO,
    LtoContent,
  } = useWhatsappTemplateStore();
  const maxChars = selectedTemplateType === "carousel" ? 160 : 1024;
  // Get current content based on the selected template type
  const getCurrentContent = () => {
    switch (selectedTemplateType) {
      case "text":
        return textMessageContent;
      case "image":
        return singleImageContent;
      case "video":
        return videoContent;
      case "location":
        return location;
      case "document":
        return documentContent;
      case "WithExpiration":
      case "WithoutExpiration":
        return LtoContent;
      case "carousel":
        return (
          carouselItems.find((item) => item.id === cardId) || {
            textMessage: "",
            FooterText: "",
            variables: [],
          }
        );
      default:
        return { textMessage: "", FooterText: "", variables: [] };
    }
  };

  const currentText = getCurrentContent();
  // console.log("carouselItems",carouselItems)
  // Handle text input changes
  const handleMessageChange = (e) => {
    const newMessage = e.target.value;
    // console.log("newSMS",e.target.value)
    const variablesInMessage = extractVariables(newMessage);

    // Update the state based on the selected template type
    switch (selectedTemplateType) {
      case "text":
        setTextMessageContent({
          ...currentText,
          textMessage: newMessage,
          variables: variablesInMessage,
        });
        break;
      case "image":
        setSingleImageContent({
          ...currentText,
          textMessage: newMessage,
          variables: variablesInMessage,
          // FooterText: singleImageContent.FooterText,
        });
        break;
      case "video":
        setVideoContent({
          ...currentText,
          textMessage: newMessage,
          variables: variablesInMessage,
          // FooterText: videoContent.FooterText,
        });
        break;
      case "location":
        setLocation({
          ...currentText,
          textMessage: newMessage,
          variables: variablesInMessage,
          // FooterText: location.FooterText,
        });
        break;
      case "document":
        setDocumentContent({
          ...currentText,
          textMessage: newMessage,
          variables: variablesInMessage,
          // FooterText: documentContent.FooterText,
        });
        break;
      case "WithExpiration":
      case "WithoutExpiration":
        setLTO({
          ...currentText,
          textMessage: newMessage,
          variables: variablesInMessage,
        });
        break;
      case "carousel":
        setCarouselItems({
          ...currentText,
          id: cardId,
          textMessage: newMessage,
          variables: variablesInMessage,
          // FooterText: carouselItems.FooterText,
        });

        break;
      default:
        return;
    }

    // Update character count for the message
    setCharCount(newMessage.length);
  };

  // Handle footer text changes
  const handleFooterTextChange = (e) => {
    const newFooterText = e.target.value;

    // Update the state based on the selected template type
    switch (selectedTemplateType) {
      case "text":
        setTextMessageContent({
          ...textMessageContent,
          FooterText: newFooterText,
        });
        break;
      case "image":
        setSingleImageContent({
          ...singleImageContent,
          FooterText: newFooterText,
        });
        break;
      case "video":
        setVideoContent({
          ...videoContent,
          FooterText: newFooterText,
        });
        break;
      case "location":
        setLocation({
          ...location,
          FooterText: newFooterText,
        });
        break;
      case "document":
        setDocumentContent({
          ...documentContent,
          FooterText: newFooterText,
        });
        break;

      case "WithExpiration":
      case "WithoutExpiration":
        setLTO({
          ...LtoContent,
          FooterText: newFooterText,
        });
      case "carousel":
        setCarouselItems({
          id: cardId,
          FooterText: newFooterText,
        });
      //   break;
      default:
        return;
    }
    console.log(
      selectedTemplateType,
      textMessageContent,
      singleImageContent,
      videoContent,
      location,
      documentContent,
      carouselItems
    );
    // Update character count for footer
    setCharCountFooter(newFooterText.length);
  };

  const addVariableCount = () => {
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
    setCharCount((pre) => pre + 5);
    addVariable(contentType, cardId);
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        {/* Message Input */}
        <Textarea
          isRequired
          label="Message"
          placeholder=""
          className="w-full"
          size="md"
          radius="sm"
          isInvalid={currentText?.textMessage?.length > maxChars}
          color={
            currentText?.textMessage?.length > maxChars ? "danger" : "default"
          }
          errorMessage={`Footer Text can only contain ${maxChars} characters.`}
          minRows={selectedTemplateType === "carousel" ? 3 : 6}
          maxRows={12}
          maxLength={selectedTemplateType === "carousel" ? 161 : 1025}
          value={currentText?.textMessage}
          onChange={handleMessageChange}
        />

        {/* Add Var Link & Char Count */}
        <div className="flex justify-end">
          <div className="flex gap-2 items-center justify-center">
            <button onClick={addVariableCount}>
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

      {/* Time Offer part start here */}

      {["WithExpiration", "WithoutExpiration"].includes(
        selectedTemplateType
      ) ? (
        <TimeOfferInput />
      ) : null}
      {/* Footer part start here */}

      {["WithExpiration", "WithoutExpiration", "carousel"].includes(
        selectedTemplateType
      ) ? null : (
        <div className="flex flex-col gap-2">
          <Input
            value={currentText?.FooterText}
            type="text"
            radius="sm"
            label={"Footer Text (Optional)"}
            variant="flat"
            isInvalid={currentText?.FooterText?.length > maxCharsFooter}
            color={
              currentText?.FooterText?.length > maxCharsFooter
                ? "danger"
                : "default"
            }
            errorMessage={`Footer Text can only contain ${maxCharsFooter} characters.`}
            className=""
            maxLength={61}
            onChange={handleFooterTextChange}
          />
          {/* Add Var Link & Char Count */}
          <div className="flex justify-end">
            <div className="flex gap-2 items-center justify-center">
              <p className="text-xs text-gray-500">
                Characters used: {charCountFooter}/{maxCharsFooter}
              </p>
            </div>
          </div>{" "}
        </div>
      )}
    </>
  );
}
