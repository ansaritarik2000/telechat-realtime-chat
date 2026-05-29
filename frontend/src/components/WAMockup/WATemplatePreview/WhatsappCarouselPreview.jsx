import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Image } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import ActionButton from "./ActionButton";
import { PhoneNumberIcon,ExternalLinkIcon,CopyIcon, QuickReplyIcon } from "../../../utils/ReusableIcons";

const WhatsappCarouselPreview = ({template_contents,type,carouelType,carouselBodyContent}) => {  
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative">
      {/* Scrollable Carousel */}
      
      <div className="mb-4 text-left ">
              <p className="text-semibold text-sm text-gray-800 break-all">{carouselBodyContent?.textMessage}</p>
              {/* <p className="text-default-400 text-xs text-gray-600">{items?.FooterText}</p> */}
            </div>
      {/* Carousel */}
      <Carousel
        showThumbs={false}
        showIndicators={true} // Disable default indicators
        showArrows={true}
        infiniteLoop={true}
        autoPlay={false}
        showStatus={false}
        selectedItem={currentSlide}
        onChange={handleSlideChange}
        renderIndicator={(onClickHandler, isSelected, index, label) => (
          <li
            key={index}
            onClick={onClickHandler}
            onKeyDown={onClickHandler}
            role="button"
            tabIndex={0}
            aria-label={`Slide ${index + 1}`}
            className={`
              w-2.5 h-2.5 
              rounded-full 
              inline-block 
              mx-1.5 
              cursor-pointer 
              ${isSelected ? "bg-green-500" : "bg-gray-400"} 
            `}
          />
        )}
      >
        {template_contents?.map((items, index) => (
          <div key={index} className="relative  flex flex-col justify-center ">
            <div className="flex justify-center bg-content2 rounded-lg items-center w-full h-full py-4">
              {/* Slide no e.g 1/2 */}
              <div className=" absolute top-1 right-2">
                <p className="text-xs text-default-500 tracking-[0.1px]">
                  {currentSlide + 1} / {template_contents?.length}
                </p>
              </div>

              {carouelType === "video" ? (
                <Image
                  src="./Placeholders/videofile.png"
                  alt="video"
                  className="w-20 h-20"
                />
              ) : (
                <Image
                  src="./Placeholders/pngfile.png"
                  alt="carousel"
                  className="w-20 h-20"
                />
              )}
            </div>

            {/* Text Content */}
            <div className="text-left p-2">
              <p className="text-semibold text-xs break-all">
                {items?.textMessage}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col mb-10">
              {items?.buttons?.map((action_button, index) => {
                // Determine icon based on suggestionType
                let icon;
                switch (action_button.suggestionType) {
                  case "url":
                    icon = <ExternalLinkIcon />;
                    break;
                  case "phone_number":
                    icon = <PhoneNumberIcon />;
                    break;
                  case "quick_reply":
                    icon = <QuickReplyIcon />;
                    break;
                  case "copy_code":
                    icon = <CopyIcon customClass="text-primary-500" />;
                    break;
                  default:
                    icon = null;
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
           </div>
  
            {/* Custom Indicators */}
            {/* <div className="custom-carousel-indicators flex justify-center mt-4">
              {carouselItems?.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full mx-1 transition-colors ${
                    currentSlide === idx ? "bg-green-400" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </div> */}
          </div>
        ))}

      </Carousel>

    </div>
  );
};

export default WhatsappCarouselPreview;
