import React from "react";
import { Icon } from "@iconify/react";
import AvatarIndex from "../../../../../components/AvatarGen/Index";

const IosHeader = ({ contactName, theme }) => {
    const isDarkMode = theme === "dark";
    return (
        <div
            className={`flex justify-between bg-gray-200 items-center p-2 px-4 shadow-md ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
            }`}
        >
            <div className="flex items-center space-x-2">
                <button className="text-blue-500">
                    <Icon
                        icon="akar-icons:chevron-left"
                        width={24}
                        className="font-bold"
                    />
                </button>
            </div>
            <div className="flex flex-col items-center py-2">
                <AvatarIndex
                    isEditable={false}
                    avatarType="character"
                    size="50"
                    value="Wired"
                />
                <span
                    className={`font-semibold  text-sm ${
                        isDarkMode ? "text-white" : "text-black"
                    } `}
                >
                    {contactName}
                </span>
            </div>
            <div className="flex space-x-2 text-gray-600">
                <button className="text-blue-500">
                    <Icon icon="ion:videocam-outline" width={24} />
                </button>
            </div>
        </div>
    );
};

export default IosHeader;
