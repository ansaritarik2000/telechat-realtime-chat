import React from "react";
import { Image } from "@heroui/react";
import ActionButton from "./ActionButton";
import { useWhatsappTemplateStore } from "../../store/templateApprovalStore";
import { Icon } from "@iconify-icon/react";
const WhatsappImagePreview = ({ template_contents, type }) => {
  const { singleImageContent } = useWhatsappTemplateStore();
  return (
    <>
      {/* {(singleImageContent.imageUrl ) && (
                <img
                    src={selectedTemplateType === "image" ? singleImageContent.imageUrl : ""}
                    alt="rich-card"
                    className="w-full object-cover border rounded"
                    style={{ height: "100px" }}
                />
            )} */}
      {/* <div>
                {" "}

                <p className="text-default-400  text-xs my-2">
                    {singleImageContent.name}
                </p>

            </div> */}
      <div className="grid place-items-center w-full h-full bg-content2 rounded-lg mt-1 py-3">
        <Image
          src="./Placeholders/pngfile.png"
          alt="image"
          width="80"
          height="80"
        />
      </div>
      <div>
        <p className="text-semibold text-sm break-all">
          {singleImageContent.textMessage}
        </p>
        <p className="text-default-400  text-xs break-all">
          {singleImageContent.FooterText}
        </p>
      </div>
      {singleImageContent.buttons &&
        singleImageContent?.buttons?.map((action_button, index) => {
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
              icon={icon}
              suggestion_text={action_button?.displayText}
            />
          );
        })}

    </>
  );
};

export default WhatsappImagePreview;
