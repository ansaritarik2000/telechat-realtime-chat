import { Image, Chip, Tooltip, ScrollShadow } from "@heroui/react";

import WhatsappPreviewMessage from "./WhatsappPreviewMessage";
import WhatsappImagePreview from "./WhatsappImagePreview";
import WhatsAppDocumentsPreview from "./WhatsAppDocumentsPreview";
import WhatsAppVideoPreview from "./WhatsAppVideoPreview";
import WhatsAppLocationPreviews from "./WhatsAppLocationPreviews";
import WhatsappCarouselPreview from "./WhatsappCarouselPreview";
import LtoPreview from "./LtoPreview";
import { useSendWhatsappStore } from "../../../store/whatsapp/whatsappStore";
import { useThemeStore } from "../../../store/themeStore";
import { useEffect } from "react";

export default function WACampaignTemplate() {
    const { theme } = useThemeStore();
    const {
        singleTemplateData,
        selectedTemplateTypeSend,
        setSingleTemplateData,
        setSelectedTemplateTypeSend,
    } = useSendWhatsappStore();
    useEffect(() => {
        setSingleTemplateData([]);
        setSelectedTemplateTypeSend("");
    }, []);
    return (
        <div className="w-[19rem]  h-[35em] flex flex-col rounded-xl relative shadow-[10px_10px_40px_rgba(0,0,0,0.2)] overflow-hidden">
            {/* Background Doodle */}
            <div className="object-cover w-full h-full absolute opacity-20 dark:opacity-30 top-0 left-0 ">
                <Image
                    src={
                        theme === "dark"
                            ? "/whatsapp-doodle-dark.png"
                            : "/whatsapp-doodle-light.png"
                    }
                    alt="Background Image"
                    className=" object-cover h-[35em]"
                    loading="eager"
                />
            </div>

            {/* Header Label */}
            <div className="h-30 p-6 bg-green-700 rounded-tr-xl  rounded-tl-xl flex justify-between items-center z-10">
                <p className="font-semibold text-xl text-background dark:text-foreground">
                    Message Preview
                </p>
                <div className="bg-content3 rounded-full">
                    <Tooltip
                        content={singleTemplateData[0]?.selectedCountryLable}
                    >
                        <Chip size="md" variant="bordered" color="default">
                            {singleTemplateData[0]?.selectedCountry}
                        </Chip>
                    </Tooltip>
                </div>
            </div>

            {/* Preview Content / Body */}
            <ScrollShadow hideScrollBar>
                <div className="p-6 flex flex-col gap-4 flex-1 z-10  max-h-400  ">
                    {/* Parent */}
                    <div className="relative border-default rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-none p-4 flex flex-col gap-2 bg-background border ">
                        {/* Div for the arrow */}
                        <div className="absolute top-0 -left-4 w-0 h-0 border-b-[20px] border-l-0 border-r-[20px] border-b-transparent border-r-background "></div>

                        {/* Your main content */}
                        {selectedTemplateTypeSend === "text" ? (
                            <WhatsappPreviewMessage
                                template_contents={
                                    singleTemplateData[0]?.textMessageContent
                                }
                            />
                        ) : selectedTemplateTypeSend === "image" ? (
                            <WhatsappImagePreview
                                template_contents={
                                    singleTemplateData[0]?.singleImageContent
                                }
                                type={
                                    singleTemplateData[0]
                                        ?.selectedTemplateTypeSend
                                }
                            />
                        ) : selectedTemplateTypeSend === "video" ? (
                            <WhatsAppVideoPreview
                                template_contents={
                                    singleTemplateData[0]?.singleImageContent
                                }
                                type={
                                    singleTemplateData[0]
                                        ?.selectedTemplateTypeSend
                                }
                            />
                        ) : selectedTemplateTypeSend === "document" ? (
                            <WhatsAppDocumentsPreview
                                template_contents={
                                    singleTemplateData[0]?.documentContent
                                }
                            />
                        ) : selectedTemplateTypeSend === "location" ? (
                            <WhatsAppLocationPreviews />
                        ) : selectedTemplateTypeSend === "carousel" ? (
                            <WhatsappCarouselPreview />
                        ) : ["WithExpiration", "WithoutExpiration"].includes(
                              selectedTemplateTypeSend
                          ) ? (
                            <LtoPreview />
                        ) : (
                            "Type your message here..."
                        )}
                    </div>
                </div>
            </ScrollShadow>
        </div>
    );
}
