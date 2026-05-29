import React, { useState } from "react";
import { Input } from "@heroui/react";
import SuggestionFields from "./Suggestions/SuggestionFields";
import { useWhatsappTemplateStore } from "../../../../../store/templateApprovalStore";
import { useTranslation } from "react-i18next";

const maxChars = 12;

export default function Dialer({ section, id,cardId }) {
    const [textCharCount, setTextCharCount] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState(section.displayTextValue ?? "");
    const { t } = useTranslation();

    // zustand state
 const { updateButtonField, selectedTemplateType } = useWhatsappTemplateStore();

   const [textIsValid, setTextIsValid] = useState(true);
 
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
     setPhoneNumber(value);
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
                    type="number"
                    isInvalid={!textIsValid}
                    value={phoneNumber}
                    radius="sm"
                    label={t("Phone Number")}
                    name="phone_number"
                    variant="flat"
                    className=""
                    onChange={handleTextInput}
                    startContent={""}
                />

                <div className="flex mt-1 pl-1 justify-start text-xs text-gray-400">
                    <p>
                        Characters used: {textCharCount}/{maxChars}{" "}
                        {t("Country code required")}(e.g +91)
                    </p>
                </div>
            </div>
        </div>
    );
}
