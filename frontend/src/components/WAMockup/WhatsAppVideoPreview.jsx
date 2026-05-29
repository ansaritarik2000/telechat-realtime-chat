import React from "react";
import { Image } from "@heroui/react";
import ActionButton from "./ActionButton";
import { useWhatsappTemplateStore } from "../../store/templateApprovalStore";
import { Icon } from "@iconify-icon/react";
const WhatsAppVideoPreview = () => {
  const { videoContent } = useWhatsappTemplateStore();
  return (
    <>
      {/* {videoContent.thumbnailUrl && (
  <div className="relative w-full" style={{ height: "100px" }}>
    <img
      src={selectedTemplateType === "video" ? videoContent.thumbnailUrl : ""}
      alt="rich-card"
      className="w-full h-full object-cover border rounded"
    />

    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-white bg-black bg-opacity-50 rounded-full p-2 cursor-pointer"
        viewBox="0 0 24 24"
        fill="currentColor"
        onClick={() => console.log("Play button clicked")}
      >
        <path
          d="M9.5 7.5v9l7-4.5-7-4.5z"
          fill="currentColor"
        />
      </svg>
    </div>
  </div>
)} */}
      {/* <div>
                {" "}

                <p className="text-default-400  text-xs my-2">
                    {videoContent.name}
                </p>

            </div> */}

      <div className="grid place-items-center w-full h-full bg-content2 rounded-lg mt-1 py-3">
        {/* <Icon icon="et:video" width="200" height="150"   style={{"color": "#6d635d"}}  /> */}
        <Image
          src="./Placeholders/videofile.png"
          alt="video"
          width="80"
          height="80"
        />
      </div>
      <div>
        {" "}
        <p className="text-semibold text-sm break-all">{videoContent.textMessage}</p>
        <p className="text-default-400  text-xs break-all">{videoContent.FooterText}</p>
      </div>
      {videoContent?.buttons &&
        videoContent?.buttons?.map((action_button, index) => {
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
              suggestion_text={action_button?.displayText}
              icon={icon}
            />
          );
        })}
    </>
  );
};

export default WhatsAppVideoPreview;
