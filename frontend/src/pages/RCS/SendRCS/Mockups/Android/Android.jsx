import React from "react";
import { AndroidMockup } from "react-device-mockup";
import Header from "./Header";
import ChatBubble from "../ChatBubble";
import StatusBar from "./Satusbar";
import AndroidFooter from "./AndroidFooter";
import { dateFormatwithoutTime } from "./utils/dateFormat";
import { useThemeStore } from "../../../../../store/themeStore";
import { useTranslation } from "react-i18next";

export default function Android({ contactName, messageData }) {
    const { theme } = useThemeStore();
    const { t } = useTranslation();

    // dark mode
    const isDarkMode = theme === "dark";

    return (
        <div className="flex justify-center">
            <AndroidMockup screenWidth={280} navBar={"rhb"} hideStatusBar>
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
                                    isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                } text-[11px]`}>
                                <span className="block ">{t("Today")}</span>
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
            </AndroidMockup>
        </div>
    );
}
