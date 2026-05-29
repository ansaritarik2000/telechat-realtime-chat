import React from "react";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
const Header = ({ contactName = "Info & options", theme }) => {
    const { t } = useTranslation();
    const isDarkMode = theme === "dark";
    return (
        <div
            className={`flex justify-between items-center p-2 shadow-md ${
                isDarkMode ? "bg-gray-800" : "bg-white"
            }`}>
            <div className="flex items-center space-x-2">
                {/* Back Arrow */}
                <Icon
                    icon="flowbite:arrow-left-outline"
                    width={26}
                    className="text-primary font-bold"
                />
                {/* Name */}
                <span
                    className={`font-semibold ${
                        isDarkMode ? "text-white" : "text-black"
                    }`}>
                    {t(contactName)}
                </span>
            </div>
        </div>
    );
};

export default Header;
