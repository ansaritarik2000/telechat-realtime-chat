import React, { useState, createContext } from "react";
import SidebarIndex from "./ChatSidebar/SidebarIndex";
import { Image } from "@heroui/react";

const defaultView = (
    <div className="bg-default-100 p-2 flex justify-center items-center flex-col w-full h-full">
        <Image src="/whatsapp-default.svg" width={400} />
        <span className="text-default-500">You haven't selected any chat</span>
    </div>
);

export const TeleChatContext = createContext(null);

export default function ChatBody() {
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
            <div className="flex gap-3 bg-default-100 w-full h-full ">
                {/* Chat Contact List */}
                <div className="w-[300px]">
                    <SidebarIndex />
                </div>

                {/* Chat Middle */}
                <div className="flex-1  flex">{chatView}</div>

                {/* Right Bar */}
                {rightBar}
            </div>
        </TeleChatContext.Provider>
    );
}
