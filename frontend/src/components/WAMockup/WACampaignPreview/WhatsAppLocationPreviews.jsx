import React from "react";
import { Image } from "@heroui/react";
import ActionButton from "./ActionButton";
import { Icon } from "@iconify-icon/react";
import { useSendWhatsappStore } from "../../../store/whatsapp/whatsappStore";


const WhatsAppLocationPreviews = () => {
   const {selectedTemplateTypeSend, singleTemplateData } = useSendWhatsappStore();
  const bodyContent = singleTemplateData[0]?.["location"]
  return (
    <>
      <div className="grid place-items-center w-full h-full bg-content2 rounded-lg mt-1 py-3">
        <Image
          src="./Placeholders/location-a.png"
          alt="location"
          width="80"
          height="80"
        />
      </div>
      <div>
        {" "}
        <p className="text-semibold text-sm break-all">{bodyContent?.textMessage}</p>
        <p className="text-default-400  text-xs break-all">{bodyContent?.FooterText}</p>
      </div>
      <div>
 
{bodyContent?.buttons && bodyContent?.buttons?.map((btn,index)=>{
                              let icon;
                               switch (btn.suggestionType) {
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
              return(  <ActionButton key={index} icon={icon} suggestion_text = {btn.displayText} />)
})}
      </div>
    </>
  );
};

export default WhatsAppLocationPreviews;
