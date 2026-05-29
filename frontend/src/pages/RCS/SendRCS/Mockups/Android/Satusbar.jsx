import React from "react";
import { Icon } from "@iconify/react";
import { timeFormat } from "./utils/dateFormat";
const StatusBar = ({ theme }) => {
    const isDarkMode = theme === "dark";

    return (
        <div
            className={`flex justify-between items-center px-4 py-1 text-sm ${
                isDarkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-200 text-gray-600"
            }`}>
            <span>{timeFormat(new Date())}</span> {/* Time */}
            <div className="flex items-center space-x-1">
                <Icon
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    icon="material-symbols:signal-cellular-alt"
                    width={16}
                />
                <Icon
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    icon="fa-solid:wifi"
                    width={16}
                />
                <Icon
                    className={isDarkMode ? "text-gray-300" : "text-gray-600"}
                    icon="material-symbols:battery-5-bar"
                    width={16}
                />
            </div>
        </div>
    );
};

export default StatusBar;
