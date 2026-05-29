import React, { useState } from "react";
import { Input } from "@heroui/react";
import SuggestionFields from "./Suggestions/SuggestionFields";
import { useTemplateStore, useWhatsappTemplateStore } from "../../../../../store/templateApprovalStore";
import { useTranslation } from "react-i18next";

const maxChars = 2048;

export default function UrlActions({ section, id,cardId }) {
    const [textCharCount, setTextCharCount] = useState(0);
    const [url, setUrl] = useState(section.displayTextValue ?? "");
    const [textIsValid, setTextIsValid] = useState(true);
    const { t } = useTranslation();

    // handle onchange input
  const { updateButtonField, selectedTemplateType } = useWhatsappTemplateStore();
 
   const handleTextInput = (e) => {
     const value = e.target.value;
     const inputLen = value.length;
     if(inputLen > maxChars ){
        setTextIsValid(false)
        return
    }
    else{
        setTextIsValid(true)
    }
     setUrl(value);
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
     updateButtonField(contentType, cardId, section.id, "displayTextValue", value);
   };

    return (
        <div className="flex gap-3 flex-col">
            {/* Suggestion Fields */}
            <SuggestionFields section={section} id={id} cardId={cardId} />

            <div className="w-full">
                <Input
                    isRequired
                    name="url"
                    type="text"
                    isInvalid={!textIsValid}
                    radius="sm"
                    label={t("URL")}
                    variant="flat"
                    className=""
                    onChange={handleTextInput}
                    startContent={""}
                    value={url}
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
