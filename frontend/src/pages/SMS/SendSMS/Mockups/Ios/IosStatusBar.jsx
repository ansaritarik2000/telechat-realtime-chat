import React from "react";
import { Icon } from "@iconify/react";
import { timeFormat } from "../Android/utils/dateFormat";

const IosStatusBar = ({ theme }) => {
    // dark mode
    const isDarkMode = theme === "dark";
    return (
        <div
            className={`flex justify-between items-center px-4 py-1 h-8 text-sm ${
                isDarkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-200 text-gray-600"
            }`}>
            <span>{timeFormat(new Date())}</span>
            <div className="flex items-center space-x-1">
                <Icon
                    icon="game-icons:network-bars"
                    width={14}
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                />
                <Icon
                    icon="fa-solid:wifi"
                    width={16}
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                />
                <Icon
                    icon="fa-solid:battery-three-quarters"
                    width={20}
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                />
            </div>
        </div>
    );
};

export default IosStatusBar;
