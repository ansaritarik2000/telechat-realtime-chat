import { Button } from "@heroui/react";
import React, { useState } from "react";
import ActionButton from "./ActionButton";
import { useWhatsappTemplateStore } from "../../store/templateApprovalStore";
import { Icon } from "@iconify-icon/react";

const WhatsappPreviewMessage = ({ template_contents }) => {

    const {textMessageContent, headerContent } = useWhatsappTemplateStore()
    return (
        <>
            <div>
                {" "}
                
                <p className="text-sm font-bold text-gray-900 break-all">
                    {headerContent?.textMessage }
               </p>

                <p className="text-semibold text-sm break-all">
                   
                      { template_contents?.textMessage}
                </p>
                <p className="text-default-400  text-xs break-all">
                   {textMessageContent?.FooterText}
                </p>
            </div>
            <div>
            {template_contents?.buttons && template_contents?.buttons?.map((btn,index)=>{
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

export default WhatsappPreviewMessage;
