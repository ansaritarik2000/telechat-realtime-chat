import React from "react";
import { Icon } from "@iconify/react";
import { Input } from "@heroui/react";
import { useTranslation } from "react-i18next";

const AndroidFooter = ({ theme }) => {
    const isDarkMode = theme === "dark";
    const { t } = useTranslation();
    return (
        <div
            className={`flex items-center p-2 py-1 space-x-2 ${
                isDarkMode ? "bg-[#18181B]" : "bg-white"
            }`}>
            {/* Plus Icon */}
            <Icon
                icon="akar-icons:circle-plus"
                width={23}
                className={isDarkMode ? "text-gray-300" : "text-black"}
            />
            {/* Image upload */}
            <Icon
                icon="mage:image-upload"
                width={24}
                className={isDarkMode ? "text-gray-300" : "text-black"}
            />

            <div className="relative flex-grow">
                <Input
                    type="text"
                    placeholder={t("Rcs message")}
                    radius="full"
                    size="sm"
                    readOnly
                    startContent={
                        <Icon
                            icon="bi:emoji-smile"
                            width={20}
                            className={
                                isDarkMode ? "text-gray-300" : "text-black"
                            }
                        />
                    }
                    className={`-px-2 ${
                        isDarkMode
                            ? "bg-[#18181B] text-gray-300"
                            : "bg-white text-black"
                    }`}
                />
            </div>
        </div>
    );
};

export default AndroidFooter;
