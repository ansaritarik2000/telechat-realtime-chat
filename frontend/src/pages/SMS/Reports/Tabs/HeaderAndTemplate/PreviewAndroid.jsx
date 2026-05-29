import React from "react";
import { useThemeStore } from "../../../../../store/themeStore";
import StatusBar from "../../../SendSMS/Mockups/Android/Satusbar";
import Header from "../../../SendSMS/Mockups/Android/Header";
import { dateFormatwithoutTime } from "../../../SendSMS/Mockups/Android/utils/dateFormat";
import ChatBubble from "../../../SendSMS/Mockups/ChatBubble";

const PreviewAndroid = ({ template }) => {
    const { theme } = useThemeStore();
    // dark mode
    const isDarkMode = theme === "dark";

    const contactName = template?.header;
    // sms message Data
    const messageData = [
        {
            type: "text",
            content: template?.message || "Preview your sms message...",
        },
    ];

    return (
        <div
            className={`h-full w-full flex flex-col justify-between ${
                isDarkMode ? "bg-[#18181B]" : "bg-white"
            }`}>
            <StatusBar theme={theme} /> {/** status bar */}
            <Header contactName={contactName} theme={theme} /> {/**Header**/}
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
                    <ChatBubble key={index} message={message} theme={theme} />
                ))}
            </div>
        </div>
    );
};

export default PreviewAndroid;
