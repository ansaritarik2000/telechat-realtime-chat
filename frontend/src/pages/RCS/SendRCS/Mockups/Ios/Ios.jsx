import React from "react";
import { IPhoneMockup } from "react-device-mockup";
import { Image } from "@heroui/react";
import ChatBubble from "../ChatBubble";
import AndroidFooter from "../Android/AndroidFooter";
import IosStatusBar from "./IosStatusBar";
import IosHeader from "./IosHeader";
import IosFooter from "./IosFooter";
import { dateFormatwithoutTime } from "../Android/utils/dateFormat";
import { useThemeStore } from "../../../../../store/themeStore";

export default function Ios({ contactName, messageData }) {
    const { theme } = useThemeStore();
    // dark mode
    const isDarkMode = theme === "dark";

    return (
        <div className="">
            <div className="">
                <IPhoneMockup screenWidth={280} hideStatusBar>
                    <div
                        className={`h-full flex flex-col justify-between ${
                            isDarkMode ? "bg-[#18181B]" : "bg-white"
                        }`}>
                        <div>
                            <IosStatusBar theme={theme} />
                            <IosHeader
                                contactName={contactName}
                                theme={theme}
                            />

                            <div className="p-4 flex flex-col overflow-y-auto h-full space-y-1">
                                <div className="text-center -mt-1 font-medium text-gray-500 text-[11px]  block">
                                    <span className="block ">Today</span>
                                    <span>
                                        {dateFormatwithoutTime(new Date())}
                                    </span>
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
                        <IosFooter />
                    </div>
                </IPhoneMockup>
            </div>
        </div>
    );
}
