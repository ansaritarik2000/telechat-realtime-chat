
import { axiosServerInstance } from "../../../../../../../../utils/axios/config";
// utils/templateUtils.js
export const getContentType = (templateType) => {
    switch (templateType) {
      case "text":
        return "textMessageContent";
      case "image":
        return "singleImageContent";
      case "video":
        return "videoContent";
      case "location":
        return "location";
      case "document":
        return "documentContent";
      case "WithExpiration":
      case "WithoutExpiration":
        return "LtoContent";
      case "carousel":
        return "carouselItems";
      default:
        return null;
    }
  };
// handle to sheduled date in ISO formate
 export const FormateSheduleDate = (calendarObj)=>{
    // Extract values from the calendar object
    const { year, month, day, hour, minute, second, millisecond, timeZone } = calendarObj;
  
    // Note: JavaScript months are 0-indexed (0-11), so subtract 1 if your month is 1-12
    const jsMonth = month - 1;
  
    // Create a Date object in the specified timezone
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}.${String(millisecond).padStart(3, '0')}`;
    
    // Create date in the specified timezone
    const date = new Date(dateStr);
    
    // Convert to UTC ISO string
    const isoString = date.toISOString();
    
    return isoString;
  }

  // file type validation object
 export const FILE_TYPE_CONFIG = {
    image: {
      extensions: ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'],
      errorMessage: 'Please select an image file (PNG, JPG) for this template.'
    },
    video: {
      extensions: ['mp4', 'MP4'],
      errorMessage: 'Please select a video file (MP4) for this template.'
    },
    document: {
      extensions: ['pdf', 'PDF'],
      errorMessage: 'Please select a document file (PDF) for this template.'
    },
    carousel: {
      extensions: ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG', 'mp4', 'MP4'],
      errorMessage: 'Please select an image (PNG, JPG) or video (MP4) file for carousel.'
    }
  };

  // 

  // Send the test whatsapp campaign 
export const sendTestCampaign = async(data)=>{
    try {
        const response = await axiosServerInstance.post('/whatsapp/template/sendTestCampaign',
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 50000,
            }
        )
        console.log("Success", response.data);
        return {
            data: response.data,
            success: true,
        };
    } catch (error) {
        console.error("❌ API Error:", error.response?.data || error.message);
return {
    success: false,
    message:
        error.response?.data?.message ||
        "Failed to create campaign in backend",
};
    }
} 
// Delete media files 
  export const deleteMedia = async(id)=>{
        try {
            const response = await axiosServerInstance.delete('/whatsapp/template/deleteMedia',
               { params: { id }}
            )
            return response?.data
        } catch (error) {
    console.error("❌ API Error:", error.response?.data || error.message);
    return {
        success: false,
        message:
            error.response?.data?.message ||
            "Failed to delete media",
            };
        }
}
export const uploadMediaSevices = async (file) => {
    try {
        // Create a FormData object
        const formData = new FormData();
        formData.append("sheet", file); // Append the file with the field name "file"

        const response = await axiosServerInstance.post(
            `/whatsapp/template/uploadMedia`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data", // Set the correct Content-Type
                },
                timeout: 50000,
            }
        );

        console.log("✅ Success:", response.data);

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("❌ API Error:", error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to upload file",
        };
    }
};
// Send Media Data in database
export const sendMediaData = async (data) => {
    try {
        const response = await axiosServerInstance.post(
            `/whatsapp/template/uploadMediaURL`,
            data,
            {
                headers: {
                    "Content-Type": "application/json", // Set the correct Content-Type
                },
                timeout: 50000,
            }
        );

        console.log("✅ Success:", response.data);

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("❌ API Error:", error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to upload file",
        };
    }
};
// Get all media which recently uploaded
export const getMediaData = async () => {
    try {
        const data = await axiosServerInstance.get(
            `/whatsapp/template/mediaDetails`
        );
        if (!data) {
            // console.log("Getting data faild");
            return;
        }

        return {
            success: true,
            media: data,
        };
    } catch (error) {
        console.error("❌ API Error:", error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || "Failed to get data",
        };
    }
};
// Send test campaign 
export const testCampaign = async(data)=>{
    try {
        const response = await axiosServerInstance.post(
            `/whatsapp/template/sendTestCampaign`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 50000,
            }
        );
        console.log("Success", response.data);
        return {
            data: response.data,
            success: true,
        };
    } catch (error) {
        console.error("❌ API Error:", error.response?.data || error.message);
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Failed to create campaign in backend",
        };
         }
}
// Send the template message through meta
// Updated sendTemplateMessage function

export const sendTemplateMessage = async (data) => {
    try {
        const response = await axiosServerInstance.post(
            "/whatsapp/template/campaign",
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 50000,
            }
        );

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("❌ API Error:", error?.response?.data || error.message);
        
        // Check if this is a Meta API error
        if (error?.response?.data?.details?.error) {
            return {
                success: false,
                error: {
                    type: 'meta',
                    message: error.response.data.error || "WhatsApp API error",
                    details: error.response.data.details
                }
            };
        }
        
        return {
            success: false,
            error: {
                type: 'backend',
                message: error?.response?.data?.error || "Failed to send template",
                details: error?.response?.data
            }
        };
    }
};
// Send Data in Backend 
export const createCampaignInBackend = async (data) => {
    try {
        const response = await axiosServerInstance.post(
            `/whatsapp/template/campaign_store`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 50000,
            }
        );
        console.log("Success", response.data);
        return {
            data: response.data,
            success: true,
        };
    } catch (error) {
        console.error("❌ API Error:", error.response?.data || error.message);
        return {
            success: false,
            message:
                error.response?.data?.message ||
                "Failed to create campaign in backend",
        };
         }
}

// Manaage Json to send campaign 
export const generateTemplateJSON = (phoneNumber, campaignData, backendData,  csvRow = {}, 
    headerMappings,
    useCsvData = false) => {
    const {
        templateName,
        selectedCountry, // Language code
        selectedTemplateType,
        headerContent,
        textMessageContent,
        singleImageContent,
        videoContent,
        documentContent,
        location,
        carouselItems,
        carouselBodyContent,
        carouelType,
        LtoContent
    } = backendData;
    const {MediaId,mediaUrl,csvFileContent,selectedExpirationDate} = campaignData

    let templateData = {
        to: phoneNumber,
        type: "template",
        messaging_product: "whatsapp",
        template: {
            name: templateName,
            language: {
                code: selectedCountry,
            },
            components: [],
        },
    };

    // Helper function for Body to replace placeholders with CSV row values
    const replacePlaceholders = (variables, csvRow, prefix = 'var') => {
        return variables.map(variable => {
          // If not using CSV data, just return the variable as-is
          if (!useCsvData) {
            return { type: "text", text: variable };
          }
    
          const placeholderIndex = variable.match(/\d+/)?.[0];
          if (placeholderIndex) {
            // Check if we have a mapping for this variable
            const mappedHeader = headerMappings?.[`{{${placeholderIndex}}}`];
            if (mappedHeader && csvRow[mappedHeader]) {
              return {
                type: "text",
                text: csvRow[mappedHeader]
              };
            }
            
            // Fallback to original behavior if no mapping
            const csvKey = `${prefix}${placeholderIndex}`;
            return {
              type: "text",
              text: csvRow[csvKey] || variable // Return original variable if no CSV data
            };
          }
          return { type: "text", text: variable };
        });
      };
// Handle the button dynamically
    const handleButtons = (buttons) => {
        return buttons.map((button, index) => {
            let buttonType = button.suggestionType.toLowerCase();
            let parameters = [];
    
            switch (buttonType) {
                case 'quick_reply':
                    parameters.push({
                        type: "text",
                        text: button.displayTextValue || "reply"
                    });
                    break;
                case 'url':
                    parameters.push({
                        type: "text",
                        text: button.displayTextValue || "telepie"
                    });
                    break;
                case 'copy_code':
                    parameters.push({
                        type: "coupon_code",
                        coupon_code: button.displayTextValue || "telepie"
                    });
                    break;
                case 'phone_number':
                    buttonType = 'VOICE_CALL';
                    parameters.push({
                        type: "PAYLOAD",
                        payload: button.displayTextValue || "telepie"
                    });
                    break;
                default:
                    parameters.push({
                        type: "payload",
                        payload: button.displayTextValue || "telepie"
                    });
                    break;
            }
    
            return {
                type: "button",
                sub_type: buttonType,
                index: `${index}`,
                parameters: parameters
            };
        });
    };

    // Handle Carousel Items campaign Send 
    const handleCarouselTemplate = (carouselItems, csvRow, mediaType = "image", mediaUrl=[]) => {
        return carouselItems.map((item, index) => {
            const cardData = {
                card_index: index,
                components: []
            };
    
            // Add Header (if imageUrl is provided)
            if (item.imageUrl==="") {
                cardData.components.push({
                    type: "header",
                    parameters: [
                        {
                            type: mediaType,
                            [mediaType]: { link: mediaUrl[index] || "" }
                        }
                    ]
                });
            }
    
            // Add Body (if textMessage and variables are provided)
            if (item.textMessage && item.variables?.length > 0) {
                cardData.components.push({
                    type: "body",
                    parameters: replacePlaceholders(item.variables, csvRow, `card${index + 1}var`)
                });
            }
    
            // Add Buttons (if buttons are provided)
            if (item.buttons?.length > 0) {
                cardData.components.push(...handleButtons(item.buttons));
            }
    
            return cardData;
        });
    };

    switch (selectedTemplateType) {
        case "text":
            // **Handle Header**
            if (headerContent && headerContent.variables?.length > 0) {
                templateData.template.components.push({
                    type: "HEADER",
                    parameters:replacePlaceholders( headerContent?.variables, csvRow,'header')
                });
            }

            // **Handle Body**  
            if (textMessageContent && textMessageContent.variables?.length > 0) {
                templateData.template.components.push({
                    type: "BODY",
                    parameters: replacePlaceholders(textMessageContent?.variables,csvRow)
                });
            }

            // **Handle Buttons**
            if (textMessageContent?.buttons?.length) {
                templateData.template.components.push(...handleButtons(textMessageContent.buttons));
            }
            break;

        case "image":
            if (singleImageContent) {
                templateData.template.components.push({
                    type: "HEADER",
                    parameters: [{ type: "image", image: { link: Array.isArray(mediaUrl) ? mediaUrl[0] || "" : mediaUrl || "" } }]
                });
            }
              // **Handle Body**  
              if (singleImageContent && singleImageContent.variables?.length > 0) {
                templateData.template.components.push({
                    type: "BODY",
                    parameters: replacePlaceholders(singleImageContent?.variables,csvRow)
                });
            }

            // **Handle Buttons**
            if (singleImageContent?.buttons?.length) {
                templateData.template.components.push(...handleButtons(singleImageContent.buttons));
            }
            break;

        case "video":
            if (videoContent) {
                templateData.template.components.push({
                    type: "HEADER",
                    parameters: [{ type: "video", video: { link: Array.isArray(mediaUrl) ? mediaUrl[0] || "" : mediaUrl || ""} }]
                });
            }
              // **Handle Body**  
              if (videoContent && videoContent.variables?.length > 0) {
                templateData.template.components.push({
                    type: "BODY",
                    parameters: replacePlaceholders(videoContent?.variables,csvRow)
                });
            }

            // **Handle Buttons**
            if (videoContent?.buttons?.length) {
                templateData.template.components.push(...handleButtons(videoContent.buttons))
            }
            break;

        case "document":
            if (documentContent) {
                templateData.template.components.push({
                    type: "HEADER",
                    parameters: [{ type: "document", document: { link: Array.isArray(mediaUrl) ? mediaUrl[0] || "" : mediaUrl || "" } }]
                });
            }

            if (documentContent && documentContent.variables?.length > 0) {
                templateData.template.components.push({
                    type: "BODY",
                    parameters: replacePlaceholders(documentContent?.variables,csvRow)
                });
            }

            // **Handle Buttons**
            if (documentContent?.buttons?.length) {
                templateData.template.components.push(...handleButtons(documentContent.buttons));
            }
            break;

        case "location":
            if (location) {
                templateData.template.components.push({
                    type: "HEADER",
                    parameters: [
                        {
                            type: "location",
                            location: {
                                latitude: csvRow.latitude || location.latitude,
                                longitude: csvRow.longitude || location.longitude,
                                name: csvRow.locationname || location.locationname,
                                address: csvRow.locationaddress || location.locationaddress

                            }
                        }
                    ]
                });
                if (location && location.variables?.length > 0) {
                    templateData.template.components.push({
                        type: "BODY",
                        parameters: replacePlaceholders(location?.variables,csvRow)
                    });
                }
    
                // **Handle Buttons**
                if (location?.buttons?.length) {
                    templateData.template.components.push(...handleButtons(location?.buttons));
                }
            }
            break;

        case "carousel":
            if (carouselBodyContent && carouselBodyContent.variables?.length > 0) {
                templateData.template.components.push({
                    type: "BODY",
                    parameters: replacePlaceholders(carouselBodyContent?.variables,csvRow,'var')
                });
            }
            if (carouselItems?.length) {
                templateData.template.components.push({
                    type: "carousel",
                    cards: handleCarouselTemplate(carouselItems, csvRow, carouelType, Array.isArray(mediaUrl) ? mediaUrl : [mediaUrl])
                });
            }
            break;

            case "WithExpiration":
                // if (LtoContent) {
                //     templateData.template.components.push({
                //         type: "HEADER",
                //         parameters: [{ type: "image", image: { id: MediaId } }]
                //     });
                // }
                if (LtoContent && LtoContent.variables?.length > 0) {
                    templateData.template.components.push({
                        type: "BODY",
                        parameters: replacePlaceholders(LtoContent?.variables,csvRow)
                    });
                }
                // Handle time offer 
                if (selectedExpirationDate!=="") {
                    templateData.template.components.push({
                        type: "BODY",
                        parameters: [
                            {
                              type: "limited_time_offer",
                              limited_time_offer: {
                                "expiration_time_ms": selectedExpirationDate
                              }
                            }
                          ]
                    });
                }
                // **Handle Buttons**
                if (LtoContent?.buttons?.length) {
                    templateData.template.components.push(...handleButtons(LtoContent.buttons));
                }
                break;    

                case "WithoutExpiration":
    
                    if (LtoContent && LtoContent.variables?.length > 0) {
                        templateData.template.components.push({
                            type: "BODY",
                            parameters: replacePlaceholders(LtoContent?.variables,csvRow)
                        });
                    }
                    // // Handle time offer 
                    // if (LtoContent && LtoContent.variables?.length > 0) {
                    //     templateData.template.components.push({
                    //         type: "BODY",
                    //         parameters: [
                    //             {
                    //               type: "limited_time_offer",
                    //               limited_time_offer: {
                    //                 "expiration_time_ms": selectedExpirationDate
                    //               }
                    //             }
                    //           ]
                    //     });
                    // }
                    // **Handle Buttons**
                    if (LtoContent?.buttons?.length) {
                        templateData.template.components.push(...handleButtons(LtoContent.buttons));
                    }
                    break;    
    
        default:
            break;
    }

    return templateData;
};
// Procces the data to send the campaign 
export const processAndSendCampaign = async (
    phoneNumbers, 
    campaignData, 
    backendData,
    batchSize , 
    interval ,
    variableMappings
  ) => {
    const { csvFileContent } = campaignData;
    const responses = [];
    let hasMetaError = false;
    let firstMetaError = null;
    // Determine if we're using CSV data
    const useCsvData = csvFileContent?.allData?.length > 0;
    
    try {
      // Process in batches if batchSize > 1
      if (batchSize > 1) {
        for (let i = 0; i < phoneNumbers.length; i += batchSize) {
          const batch = phoneNumbers.slice(i, i + batchSize);
          
          const batchResponses = await Promise.all(batch.map(async (phoneNumber, index) => {
            // Use empty object if no CSV data
            const csvRow = useCsvData ? csvFileContent.allData[i + index] || {} : {};
            const jsonData = generateTemplateJSON(
              phoneNumber, 
              campaignData, 
              backendData, 
              csvRow,
              variableMappings,
              useCsvData // Pass whether we're using CSV data
            );
            const response = await sendTemplateMessage(jsonData);
                    
            if (!response.success && response.error?.type === 'meta') {
                hasMetaError = true;
                if (!firstMetaError) firstMetaError = response.error;
            }
            
            return response;
          }));
          
          responses.push(...batchResponses);
          if (hasMetaError) break; // Stop if we got a Meta error

          if (i + batchSize < phoneNumbers.length && interval > 0) {
            await new Promise(resolve => setTimeout(resolve, interval));
          }
        }
      } else {
        // Single message mode
        for (let i = 0; i < phoneNumbers.length; i++) {
          // Use empty object if no CSV data
          const csvRow = useCsvData ? csvFileContent?.allData[i] || {} : {};
          const jsonData = generateTemplateJSON(
            phoneNumbers[i], 
            campaignData, 
            backendData, 
            csvRow,
            variableMappings,
            useCsvData // Pass whether we're using CSV data
          );
          const response = await sendTemplateMessage(jsonData);
          responses.push(response);
          if (!response.success && response.error?.type === 'meta') {
            hasMetaError = true;
            if (!firstMetaError) firstMetaError = response.error;
            break;
        }
          if (i < phoneNumbers.length - 1 && interval > 0) {
            await new Promise(resolve => setTimeout(resolve, interval));
          }
        }
      }
      if (hasMetaError) {
        return {
            success: false,
            error: firstMetaError
        };
    }
    //   console.log("responses",responses)
      return { success: true, responses };
    } catch (error) {
      console.error("Error in processAndSendCampaign:", error);
      return { 
        success: false, 
        error: {
            type: 'unknown',
            message: error.message,
            details: error
        }
    }
  };
}


