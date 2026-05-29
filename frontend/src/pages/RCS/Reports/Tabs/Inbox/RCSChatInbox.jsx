import React, { useState, createContext } from "react";
import SidebarIndex from "./RCSChat/SidebarIndex";
import { Image } from "@heroui/react";

// This components will visible if no contact selected to chat
const defaultView = (
    <div className="flex-1 bg-white/60 dark:bg-primary-50/60 backdrop-blur-xl p-2 h-full rounded-2xl flex justify-center items-center flex-col ">
        <Image src="/rcs-inbox-chat-logo" width={170} />
        <p className=" mt-6 text-md  ">You haven't selected any chat</p>
        <p className="text-tiny text-default-600">
            Please select a chat from sidebar to get started
        </p>
    </div>
);

export const RCSChatContext = createContext(null);

export default function RCSChatInbox() {
    const [chatView, setChatView] = useState(defaultView);
    const [rightBar, setRightBar] = useState(null);
    const [isRightBarVisible, setRightBarVisible] = useState(false);
    return (
        <RCSChatContext.Provider
            value={{
                setChatView,
                setRightBar,
                isRightBarVisible,
                setRightBarVisible,
            }}
        >
            <div className="flex h-[85vh] gap-2 bg-primary-400 p-2 rounded-2xl">
                <div className="w-[300px]">
                    <SidebarIndex />
                </div>

                {chatView}

                {rightBar}
            </div>
        </RCSChatContext.Provider>
    );
}
