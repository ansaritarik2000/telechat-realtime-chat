import React from "react";

const TextMessageCard = ({ isDarkMode, message }) => {
    return (
        <>
            <div
                className={`relative messageBubble p-2 px-4 shadow-md -mr-2 max-w-xs break-words ${
                    isDarkMode
                        ? "bg-gray-700 text-gray-200"
                        : "bg-[#e3eafc] text-black"
                } rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-sm`}>
                <p className="text-sm break-all">{message?.content}</p>
            </div>
            <div className="space-y-2 mt-4">
                {message?.messageActions?.map((button, index) => (
                    <button
                        key={index}
                        className={`block w-full text-sm  px-4 py-1 hover:text-gray-500 transition-colors  ${
                            isDarkMode
                                ? "bg-transparent  text-blue-300"
                                : "bg-transparent  text-blue-400"
                        }`}>
                        {button?.displayText || button.label}
                    </button>
                ))}
            </div>
        </>
    );
};

export default TextMessageCard;
