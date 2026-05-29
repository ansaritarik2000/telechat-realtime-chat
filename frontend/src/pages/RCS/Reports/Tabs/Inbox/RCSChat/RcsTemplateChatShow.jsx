import React, { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { getTemplateWithDetails } from "../../../../../../services/Rcs/rcsTemplateService";
import TextMessageCard from "../../../../SendRCS/Mockups/TextMessageCard";
import { useThemeStore } from "../../../../../../store/themeStore";
import RichCard from "../../../../SendRCS/Mockups/RichCard";
import ImageCarousel from "../../../../SendRCS/Mockups/ImageCarousel";
const RcsTemplateChatShow = ({ chat }) => {
    const templateId = chat?.rcs_templates?.id;
    const [rcsTemplate, setRcsTemplate] = useState();
    const [message, setMessage] = useState({});
    const [templateCardContent, setTemplateCardCotent] = useState();
    const [carouselTemplate, setCarouselTemplate] = useState();

    // this function is used for get rcs template with details
    const getrcsTemplateFunc = async () => {
        try {
            const responseData = await getTemplateWithDetails(templateId);
            if (responseData?.type === "text_message") {
                setMessage({
                    content:
                        responseData.template_contents &&
                        responseData.template_contents.length > 0 &&
                        responseData.template_contents[0].message,

                    messageActions:
                        responseData?.template_contents &&
                        responseData?.template_contents[0]?.action_buttons,
                });
            } else if (
                responseData?.type === "singleimg" ||
                responseData?.type === "video"
            ) {
                setTemplateCardCotent(
                    responseData?.template_contents &&
                        responseData?.template_contents.length > 0 &&
                        responseData?.template_contents[0]
                );
            } else if (responseData?.type === "imgcarousel") {
                setCarouselTemplate(responseData);
            }
            setRcsTemplate(responseData);
        } catch (error) {
            console.error("Error fetching templates:", error);
        }
    };
    useEffect(() => {
        if (templateId) {
            getrcsTemplateFunc();
        }
    }, [templateId]);

    const { theme } = useThemeStore();
    // dark mode
    const isDarkMode = theme === "dark";

    return (
        <div className="px-4 py-[3px] flex justify-end flex-col items-end">
            <div className="flex items-end flex-col">
                <span className="bg-primary-100 items-end px-3 py-2 text-sm rounded-xl w-fit break-words max-w-xs">
                    {rcsTemplate?.type === "text_message" ? (
                        <TextMessageCard
                            isDarkMode={isDarkMode}
                            message={message}
                        />
                    ) : rcsTemplate?.type === "singleimg" ||
                      rcsTemplate?.type === "video" ? (
                        <RichCard
                            title={templateCardContent?.card_heading}
                            description={templateCardContent?.card_subheading}
                            action_buttons={templateCardContent?.action_buttons}
                            imageUrl={templateCardContent?.imageUrl}
                        />
                    ) : rcsTemplate?.type === "imgcarousel" ? (
                        <ImageCarousel
                            items={carouselTemplate?.template_contents}
                        />
                    ) : (
                        ""
                    )}
                </span>
                <div className="text-[10px] py-[1px] text-end text-default-400 dark:text-foreground gap-1 flex justify-end items-center">
                    <span>{chat?.time}</span>
                    <Icon
                        icon="quill:checkmark-double"
                        width="15"
                        height="15"
                        className="text-primary"
                    />
                </div>
            </div>
        </div>
    );
};

export default RcsTemplateChatShow;
