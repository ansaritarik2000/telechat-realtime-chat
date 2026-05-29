import React, { useState, createContext } from "react";
import SidebarIndex from "./WhatsApp/SidebarIndex";
import { WhatsAppIcon } from "../../../../../utils/ReusableIcons";

const defaultView = (
    <div className="flex-1 bg-success-50 p-2 flex justify-center items-center flex-col rounded-2xl ">
        <WhatsAppIcon size="15rem" />
        <span className="mt-2">You haven't selected any chat</span>
        <p className="text-xs text-default-500">
            Please select a chat from sidebar to get started
        </p>
    </div>
);

export const TeleChatContext = createContext(null);

export default function WhatsAppInbox() {
    const [chatView, setChatView] = useState(defaultView);
    const [rightBar, setRightBar] = useState(null);
    const [isRightBarVisible, setRightBarVisible] = useState(false);
    return (
        <TeleChatContext.Provider
            value={{
                setChatView,
                setRightBar,
                isRightBarVisible,
                setRightBarVisible,
            }}
        >
            <div className="flex h-[85vh] gap-2 bg-[#8be4b1] p-2 rounded-2xl">
                <div className="w-[300px]">
                    <SidebarIndex />
                </div>

                {chatView}

                {rightBar}
            </div>
        </TeleChatContext.Provider>
    );
}
