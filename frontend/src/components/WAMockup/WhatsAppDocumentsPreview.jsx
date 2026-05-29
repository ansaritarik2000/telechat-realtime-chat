import React from "react";
import { Image } from "@heroui/react";
import ActionButton from "./ActionButton";
import { useWhatsappTemplateStore } from "../../store/templateApprovalStore";
import { Icon } from "@iconify-icon/react";
// import {
//   CopyCodeIcon,
//   ExternalLinkIcon,
//   PhoneNumberIcon,
//   QuickReplyIcon,
// } from "../../utils/ReusableIcons";
const WhatsAppDocumentsPreview = () => {
  const { documentContent } = useWhatsappTemplateStore();

  return (
    <>
      <div className="flex justify-between items-center bg-content2 rounded-lg mt-1 p-3">
        <div className="flex items-center gap-2">
          <Image
            src="./Placeholders/pdffile.png"
            alt="pdf"
            width="48"
            height="48"
          />

          <p className="black-500 text-sm">{documentContent.name}</p>
        </div>
        <Icon
          icon="solar:download-minimalistic-line-duotone"
          width="20"
          height="20"
        />
      </div>
      <div>
        {" "}
        <p className="text-semibold text-sm break-all">{documentContent.textMessage}</p>
        <p className="text-default-400  text-xs break-all">
          {documentContent.FooterText}
        </p>
      </div>
      {documentContent.buttons &&
        documentContent?.buttons?.map((action_button, index) => {
          let icon;
                         switch (action_button.suggestionType) {
                           case "url":
                             icon = <Icon icon="tabler:external-link" width="20" height="20"  style={{"color": "#0582e7"}} />
                             break;
                           case "phone_number":
                             icon = <Icon icon="fluent:call-24-regular" width="20" height="20"  style={{"color": "#0582e7"}}/>
                             break;
                             case "quick_reply":
                             icon = <Icon icon="material-symbols-light:reply-rounded" width="20" height="20"  style={{"color": "#0582e7"}} /> 
                             break;
                             case "copy_code":
                             icon = <Icon icon="iconamoon:copy-thin" width="20" height="20"  style={{"color": "#0582e7"}} />
                             break;
                           default:
                             icon = null
                             break; // Default icon
                         }
          return (
            <ActionButton
              key={index}
              suggestion_text={action_button?.displayText} icon={icon}
            />
          );
        })}
    </>
  );
};

export default WhatsAppDocumentsPreview;
