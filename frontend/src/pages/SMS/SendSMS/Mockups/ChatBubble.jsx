import React from "react";

const ChatBubble = ({ message, theme }) => {
    const isDarkMode = theme === "dark";

    return (
        <div className={message.type === "text" ? "p-1 pr-0" : "p-0"}>
            {message.type === "text" && (
                <>
                    <div
                        className={`relative messageBubble p-2 px-4 shadow-md -mr-2 max-w-xs break-words ${
                            isDarkMode
                                ? "bg-gray-700 text-gray-200"
                                : "bg-[#e3eafc] text-black"
                        } rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm`}>
                        <p className="text-sm break-all">{message.content}</p>
                    </div>
                </>
            )}
        </div>
    );
};

export default ChatBubble;
