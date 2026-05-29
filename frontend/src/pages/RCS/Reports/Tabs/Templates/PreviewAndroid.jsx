import React from "react";
import StatusBar from "../../../SendRCS/Mockups/Android/Satusbar";
import Header from "../../../SendRCS/Mockups/Android/Header";
import { dateFormatwithoutTime } from "../../../SendRCS/Mockups/Android/utils/dateFormat";
import AndroidFooter from "../../../SendRCS/Mockups/Android/AndroidFooter";
import ChatBubble from "../../../SendRCS/Mockups/ChatBubble";
import { useThemeStore } from "../../../../../store/themeStore";

const PreviewAndroid = ({ template }) => {
    const contactName = template?.bot_name;
    const templateType = template && template?.rcs_template_types?.value;
    const { theme } = useThemeStore();
    // dark mode
    const isDarkMode = theme === "dark";

    const messageData = [
        {
            type: templateType,
            content:
                templateType === "text_message"
                    ? `${
                          (template &&
                              template?.template_contents &&
                              template?.template_contents?.length > 0 &&
                              template?.template_contents[0]?.message) ||
                          "Preview your rcs message..."
                      }`
                    : templateType === "video" || templateType === "singleimg"
                    ? template?.template_contents &&
                      template?.template_contents[0]
                    : {},
            messageActions:
                template?.template_contents &&
                template?.template_contents[0]?.action_buttons,

            carouselItems:
                templateType === "imgcarousel"
                    ? template?.template_contents
                    : [],
        },
    ];
    return (
        <div
            className={`h-full flex flex-col justify-between ${
                isDarkMode ? "bg-[#18181B]" : "bg-white"
            }`}>
            <div>
                <StatusBar theme={theme} /> {/** status bar */}
                <Header contactName={contactName} theme={theme} />{" "}
                {/** header */}
                <div className="p-4 flex flex-col overflow-y-auto h-full space-y-1">
                    <div
                        className={`text-center -mt-1 font-medium ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                        } text-[11px]`}>
                        <span className="block ">Today</span>
                        <span>{dateFormatwithoutTime(new Date())}</span>
                    </div>

                    {/**chats */}
                    {messageData.map((message, index) => (
                        <ChatBubble
                            key={index}
                            message={message}
                            theme={theme}
                        />
                    ))}
                </div>
            </div>
            {/* footer  */}
            <AndroidFooter theme={theme} />
        </div>
    );
};

export default PreviewAndroid;
