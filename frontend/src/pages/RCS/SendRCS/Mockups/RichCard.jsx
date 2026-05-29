import React from "react";
import { useThemeStore } from "../../../../store/themeStore";

const RichCard = ({
    title,
    description,
    imageUrl,
    thumbnailUrl,
    buttons,
    action_buttons,
    card_heading,
    card_subheading,
}) => {
    const { theme } = useThemeStore();

    // dark mode
    const isDarkMode = theme === "dark";
    return (
        <div
            className={`max-w-xl border rounded-lg shadow-md overflow-hidden ${
                isDarkMode ? "bg-gray-800 border-gray-700" : ""
            }`}>
            {(imageUrl || thumbnailUrl) && (
                <img
                    src={imageUrl || thumbnailUrl}
                    alt="rich-card"
                    className="w-full object-cover"
                    // style={{ height: "100px" }}
                />
            )}

            <div className="p-2 pt-1 text-left">
                <h3 className="text-sm font-semibold mb-1">
                    {title || card_heading}
                </h3>
                <p className="text-gray-400 mb-1 text-xs ">
                    {description || card_subheading}
                </p>

                <div className="space-y-2">
                    {(buttons || action_buttons)?.map((button, index) => (
                        <button
                            key={index}
                            className={`block w-full text-sm border-b px-4 py-1 hover:text-gray-500 transition-colors last:border-none ${
                                isDarkMode
                                    ? "bg-transparent border-gray-700 text-blue-300"
                                    : "bg-transparent border-gray-200 text-blue-400"
                            }`}>
                            {button?.displayText || button.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RichCard;
