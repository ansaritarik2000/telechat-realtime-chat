import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Button, Radio, RadioGroup, Tooltip, cn } from "@heroui/react";
import "./wrapper.css";
import FooterButtons from "../../Buttons/Index";
import Card from "../Card/Card";
import {
  sendTemplateBackend,
  sendTemplatesForApproval,
} from "../../utils/sendTemplatesForApproval";
import { useWhatsappTemplateStore } from "../../../../../../store/templateApprovalStore";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { mediaId } from "../../utils/sendTemplatesForApproval";
import { PlusIcon, TrashIcon } from "../../../../../../utils/ReusableIcons";

export default function WrapperComponents() {
  const [disableCount, setDisableCount] = useState(0);

    const {
        selectedWabaid,
        selectedCategory,
        selectedCountry,
        selectedCountryLable,
        templateName,
        selectedTemplateType,
        textMessageContent,
        singleImageContent,
        documentContent,
        location,
        carouselItems,
        videoContent,
        addCarouselCard,
        removeCarouselCard,
        setCurrentSlide,
        currentSlide,
        headerContent,
        setCarouelType,
        carouelType,
        carouselBodyContent,
        mediaType,
        LtoContent
    } = useWhatsappTemplateStore();

  const generateWhatsAppTemplateJSON = (
    selectedTemplateType,
    mediaId = null
  ) => {
    const components = [];

        //  HEADER (If applicable)
        if (["image", "video", "document"].includes(selectedTemplateType)) {
            components.push({
                type: "HEADER",
                format: selectedTemplateType,
                example: { header_handle: [mediaId] }
            });
        
        } if (["location"].includes(selectedTemplateType)) {
            components.push({
                type: "HEADER",
                format: selectedTemplateType,
            });
        }
        if (["text"].includes(selectedTemplateType) ) {
            components.push({
                type: "HEADER",
                format: selectedTemplateType,
                ...(headerContent?.textMessage!=="" && { text: headerContent?.textMessage} ),
                ...(headerContent?.variables.length > 0 && { example: { header_text: ["header-text"] } })
            });
        }
        if(["WithExpiration", "WithoutExpiration"].includes(selectedTemplateType) && ["image", "video"].includes(mediaType)){
            components.push({
                type: "HEADER",
                format: mediaType,
                example: { header_handle: [mediaId] }
            });
        }
        // For LTO case time offer  
        if(["WithExpiration", "WithoutExpiration"].includes(selectedTemplateType)){
            components.push({
                type: "LIMITED_TIME_OFFER",
                "limited_time_offer":{
                    text:LtoContent?.timeOffertext,
                    has_expiration: (selectedTemplateType==="WithExpiration" ? true:false)
                    }
            });
        }
        //  BODY (Mandatory)
        if (selectedTemplateType === "text") {
            components.push({
                type: "BODY",
                text: textMessageContent.textMessage,
                ...( textMessageContent?.variables?.length > 0  && {example: { body_text: [textMessageContent?.variables] }})
            });
        }
        if (selectedTemplateType === "location") {
            components.push({
                type: "BODY",
                text: location.textMessage,
                ...( location?.variables?.length > 0  && {example: { body_text: [location.variables] }})
            });
        }
      
        if (selectedTemplateType === "image") {
            components.push({
                type: "BODY",
                text: singleImageContent.textMessage,
                ...( singleImageContent.variables.length > 0  && {example: { body_text: [singleImageContent.variables] }})
            });
        }
     
        if (selectedTemplateType === "video") {
            components.push({
                type: "BODY",
                text: videoContent.textMessage,
                ...( videoContent.variables.length > 0  && {example: { body_text: [videoContent.variables] }})
            });
        }
      
        if (selectedTemplateType === "document" && documentContent.variables.length >= 0) {
            components.push({
                type: "BODY",
                text: documentContent.textMessage,
                ...( documentContent.variables.length > 0  && {example: { body_text: [documentContent.variables] }})
            });
        }

        if(["WithExpiration", "WithoutExpiration"].includes(selectedTemplateType)){
            components.push({
                type: "BODY",
                text: LtoContent.textMessage,
                ...( LtoContent.variables.length > 0  && {example: { body_text: [LtoContent.variables] }})
            });
        }
       
        //  FOOTER (Optional)
        if (selectedTemplateType === "text" && textMessageContent.FooterText.length>0) {
            components.push({
                
                ...(textMessageContent?.FooterText?.length>0 && {type: "FOOTER",
                    text: textMessageContent.FooterText})
            });
        }
        if (selectedTemplateType === "image" && singleImageContent.FooterText.length>0) {
            components.push({
                
                ...(singleImageContent?.FooterText.length>0 && {type: "FOOTER",
                    text: singleImageContent.FooterText})
            });
        }
        if (selectedTemplateType === "video" && videoContent.FooterText.length>0 ) {
            components.push({
              
                ...(videoContent?.FooterText.length>0 && {type: "FOOTER",
                    text: videoContent.FooterText})
            });
        }
        if (selectedTemplateType === "document" && documentContent.FooterText.length>0 ) {
            components.push({
               
                ...(documentContent?.FooterText.length>0 && {type: "FOOTER",
                    text: documentContent.FooterText})
            });
        }
        if (selectedTemplateType === "location" && location.FooterText.length>0 ) {
            components.push({
             
                ...(location?.FooterText.length>0 && {type: "FOOTER",
                    text: location.FooterText})
            });
        }

    //  BUTTONS (If present)
    if (selectedTemplateType === "text") {
      components.push({
        type: "BUTTONS",
        buttons: textMessageContent?.buttons?.map((btn) => ({
          type: btn.suggestionType,
          text: btn.displayText,
          ...(btn.suggestionType === "url" && { url: btn.displayTextValue }),
          ...(btn.suggestionType === "phone_number" && {
            phone_number: btn.displayTextValue,
          }),
          ...(btn.suggestionType === "copy_code" && {
            example: [btn.displayTextValue],
          }),
        })),
      });
    }
    if (selectedTemplateType === "image") {
      components.push({
        type: "BUTTONS",
        buttons: singleImageContent?.buttons?.map((btn) => ({
          type: btn.suggestionType,
          text: btn.displayText,
          ...(btn.suggestionType === "url" && { url: btn.displayTextValue }),
          ...(btn.suggestionType === "phone_number" && {
            phone_number: btn.displayTextValue,
          }),
          ...(btn.suggestionType === "copy_code" && {
            example: [btn.displayTextValue],
          }),
        })),
      });
    }
    if (selectedTemplateType === "video") {
      components.push({
        type: "BUTTONS",
        buttons: videoContent?.buttons?.map((btn) => ({
          type: btn.suggestionType,
          text: btn.displayText,
          ...(btn.suggestionType === "url" && { url: btn.displayTextValue }),
          ...(btn.suggestionType === "phone_number" && {
            phone_number: btn.displayTextValue,
          }),
          ...(btn.suggestionType === "copy_code" && {
            example: [btn.displayTextValue],
          }),
        })),
      });
    }
    if (selectedTemplateType === "document") {
      components.push({
        type: "BUTTONS",
        buttons: documentContent?.buttons?.map((btn) => ({
          type: btn.suggestionType,
          text: btn.displayText,
          ...(btn.suggestionType === "url" && { url: btn.displayTextValue }),
          ...(btn.suggestionType === "phone_number" && {
            phone_number: btn.displayTextValue,
          }),
          ...(btn.suggestionType === "copy_code" && {
            example: [btn.displayTextValue],
          }),
        })),
      });
    }
    if (selectedTemplateType === "location") {
      components.push({
        type: "BUTTONS",
        buttons: location?.buttons?.map((btn) => ({
          type: btn.suggestionType,
          text: btn.displayText,
          ...(btn.suggestionType === "url" && { url: btn.displayTextValue }),
          ...(btn.suggestionType === "phone_number" && {
            phone_number: btn.displayTextValue,
          }),
          ...(btn.suggestionType === "copy_code" && {
            example: [btn.displayTextValue],
          }),
        })),
      });
    }
    if (
      ["WithExpiration", "WithoutExpiration"].includes(selectedTemplateType)
    ) {
      components.push({
        type: "BUTTONS",
        buttons: LtoContent?.buttons?.map((btn) => ({
          type: btn.suggestionType,
          text: btn.displayText,
          ...(btn.suggestionType === "url" && { url: btn.displayTextValue }),
          ...(btn.suggestionType === "phone_number" && {
            phone_number: btn.displayTextValue,
          }),
          ...(btn.suggestionType === "copy_code" && {
            example: [btn.displayTextValue],
          }),
        })),
      });
    }
    // CAROUSEL (Special Handling)
    if (selectedTemplateType === "carousel" && carouselItems?.length) {
      components.push(
        {
          type: "body",
          text: carouselBodyContent?.textMessage,
          ...(carouselBodyContent.variables.length > 0 && {
            example: { body_text: [carouselBodyContent.variables] },
          }),
        },
        {
          type: "CAROUSEL",
          cards: carouselItems.map((carousel) => ({
            components: [
              {
                type: "HEADER",
                format: carouelType,
                example: { header_handle: [mediaId] },
              },
              {
                type: "BODY",
                text: carousel.textMessage,
                ...(carousel.variables.length > 0 && {
                  example: { body_text: [carousel.variables] },
                }),
              },
              {
                type: "BUTTONS",
                buttons: carousel?.buttons?.map((btn) => ({
                  type: btn.suggestionType,
                  text: btn.displayText,
                  ...(btn.suggestionType === "url" && {
                    url: btn.displayTextValue,
                  }),
                  ...(btn.suggestionType === "phone_number" && {
                    phone_number: btn.displayTextValue,
                  }),
                  ...(btn.suggestionType === "copy_code" && {
                    example: [btn.displayTextValue],
                  }),
                })),
              },
            ],
          })),
        }
      );
    }

        return {
            name: templateName,
            category: selectedCategory,
            language: selectedCountry,
            allow_category_change: true,
            components
        };
    };
const onSubmitHandller = async () => {
        try {
//  Send template data to the backend step 2
// store the data in backend for the table export template json for template approval
  const templateJson = generateWhatsAppTemplateJSON(selectedTemplateType, null)
  const backendResponse = await sendTemplateBackend({
    selectedWabaid,
    selectedCategory,
    selectedCountry,
    selectedCountryLable,
    templateName,
    selectedTemplateType,
    textMessageContent,
    headerContent,
    singleImageContent,
    documentContent,
    location,
    videoContent,
    carouselItems,
    carouselBodyContent,
    carouelType,
    LtoContent,
    mediaType,
    status:"Pending",
    templateJson
  });
  const localId = backendResponse.data.localId; 
    // console.log("Backend Response1:",localId);
    const sendData = {
        ...generateWhatsAppTemplateJSON(selectedTemplateType, mediaId),
        localId // Add local ID to payload
      };
    // Step 1
    const approvalResponse = await sendTemplatesForApproval(sendData);
    console.log("Template sent for approval successfully2:", approvalResponse);
} catch (error) {
  console.error("An error occurred:", error);
}
 };
    const handleSlideChange = (index) => {
        setCurrentSlide(index);
    };
    
    // ✅ Add a new card
    const addCard = () => {
        setDisableCount((pre) => pre + 1)
        const newCard = {
            id: carouselItems.length + 1, // Use a unique ID
            textMessage: "",
            FooterText: "",
            variables: [],
            imageUrl: "",
            name: "",
            buttons: [
                {
                    id: 1,
                    suggestionType: "quick_reply",
                    displayText: "Stop",
                    displayTextValue: "Stop",
                },
            ],
        };
        addCarouselCard(newCard);
        setCurrentSlide(carouselItems.length); // Set the new card as the active slide
        // console.log("Carousel Items after add:", carouselItems);
    };

    // ✅ Remove a card
    const removeCard = (id) => {
        setDisableCount((pre) => pre - 1)
        removeCarouselCard(id);
        setCurrentSlide(Math.max(0, currentSlide - 1)); // Prevent index errors
        // console.log("Carousel Items after remove:", carouselItems);
    };
    // const [carouelType, setCarouelType] = useState('images')
    const handleChange = (value) => {
        setCarouelType(value)
    }
    return (
        <>
            {selectedTemplateType === "carousel" ? (
                <>
                    <div className="flex">
                        <div>
                            <label className="text-default-600 font-medium text-medium">
                                Media Type:
                            </label>
                            <RadioGroup
                                orientation="horizontal"
                                value={carouelType}
                                onValueChange={handleChange}
                            >
                                {[
                                    { key: "image", label: "Image" },
                                    { key: "video", label: "Video" }
                                ].map((option) => (
                                    <Radio key={option.key} value={option.key}>
                                        {option.label}
                                    </Radio>
                                ))}
                            </RadioGroup>
                        </div>
                        <Button onClick={addCard}
                            size="md"
                            radius="sm"
                            className="text-white bg-green-400 w-10 ml-auto"
                            variant="flat"
                            isDisabled={disableCount === 9}
                        >
                            Add Card
                        </Button>
                    </div>

                    <Carousel
                        // Set the width of the carousel
                        showThumbs={false}
                        showIndicators={true}
                        showArrows={false}
                        infiniteLoop={true}
                        autoPlay={false}
                        selectedItem={currentSlide}
                        showStatus={false}
                        onChange={handleSlideChange}
                        className="custom-carousel" // Add a custom class for styling
                    >
                        {carouselItems?.map((carouselCard, index) => (
                            <div key={carouselCard.id} className="card-wrapper">

                                <Button
                                    className="delete-btn"
                                    onClick={() => removeCard(carouselCard.id)}
                                >
                                    <Icon icon="ic:baseline-delete" width="24" height="24" style={{ "color": "#e70505" }} />
                                </Button>
                                {/* Card Component */}
                                <Card index={index} cardId={carouselItems[currentSlide]?.id} />
                                <div className="h-10"></div>
                            </div>
                        ))}
                    </Carousel>

                </>
            ) : (
                <Card />
            )}
            <FooterButtons  onSubmitHandller={onSubmitHandller} />
        </>
    );
}

// Footer Buttons
// const FooterButtons = () => {
//   return <span>Move footer buttons here</span>;
// };
