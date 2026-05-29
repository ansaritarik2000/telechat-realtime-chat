import React from "react";
import { Image } from "@heroui/react";
import ActionButton from "./ActionButton";
import { Icon } from "@iconify-icon/react";
const LtoPreview = ({template_contents,type,mediaType}) => {
  return (
    <>
      {mediaType==="video" ? (<div className="grid place-items-center w-full h-full bg-content2 rounded-lg mt-1 py-3"><Image
                          src="./Placeholders/videofile.png"
                          alt="video"
                          width="80"
                          height="80"
                        /> </div>): mediaType==="image"  ? (<div className="grid place-items-center w-full h-full bg-content2 rounded-lg mt-1 py-3"><Image
                  src="./Placeholders/pngfile.png"
                  alt="carousel"
                  width="80"
                  height="80"
                /> </div>):null}
      
      <div>
        {" "}
        <p className="text-semibold text-sm break-all">{template_contents?.textMessage}</p>
      </div>
      <div>
        {template_contents?.buttons &&
          template_contents?.buttons?.map((btn, index) => {
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
          return(<ActionButton icon={icon} key={index} suggestion_text={btn.displayText} />)  
          })}

      </div>
    </>
  );
};

export default LtoPreview;
