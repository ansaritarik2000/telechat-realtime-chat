import React from "react";
import { Icon } from "@iconify/react";
const Header = ({ contactName, theme }) => {
    const isDarkMode = theme === "dark";
    return (
        <div
            className={`flex justify-between items-center p-2 shadow-md ${
                isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
        >
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
                    }`}
                >
                    {contactName}
                </span>
            </div>

            <div className="flex  text-gray-600 items-center">
                {/* Shield */}

                <Icon
                    icon="ion:call-outline"
                    width={21}
                    className="ml-0 mr-1 text-primary"
                />

                {/* Three Dots */}
                <Icon
                    icon="charm:menu-kebab"
                    width={20}
                    className="text-primary"
                />
            </div>
        </div>
    );
};

export default Header;
