import React, { useState } from "react";
import { AndroidMockup } from "react-device-mockup";
import { Icon } from "@iconify/react"; // Importing from Iconify
import StatusBar from "./Satusbar";
import Header from "./Header";

import { useRcsBotStore } from "../../../../../../store/templateApprovalStore";
import { useThemeStore } from "../../../../../../store/themeStore";
import { useTranslation } from "react-i18next";

export default function Android() {
    const { theme } = useThemeStore();
    const { t } = useTranslation();
    // dark mode
    const isDarkMode = theme === "dark";

    const [activeTab, setActiveTab] = useState("Info"); // State for switching tabs
    const {
        rcsBrandIcon,
        rcsBrandBanner,
        rcsBrandName,
        rcsShortDescription,
        rcsPhoneInfo,
        rcsCountryCodeInfo,
        rcsWebsiteInfo,
        rcsEmailInfo,
        rcsBrandColor,
    } = useRcsBotStore();

    const { preview: iconPreview } = rcsBrandIcon;
    const { preview: bannerPreview } = rcsBrandBanner;
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    console.log("iconPreivew", iconPreview);

    return (
        <div className="flex justify-center">
            <AndroidMockup screenWidth={280} navBar={"rhb"} hideStatusBar>
                <div
                    className={`h-full flex flex-col w-full ${
                        isDarkMode ? "bg-[#18181B]" : "bg-white"
                    }`}
                >
                    {/* Status Bar */}
                    <div>
                        <StatusBar theme={theme} />
                    </div>
                    {/* Header */}
                    <div>
                        <Header theme={theme} />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col items-center ">
                        {/* Banner and Logo */}
                        <div className="w-full relative border-b-2">
                            {bannerPreview ? (
                                <img
                                    src={bannerPreview} // Replace with banner file path
                                    alt="Banner"
                                    className="w-full h-24 object-cover "
                                />
                            ) : (
                                <div className="h-24"></div>
                            )}
                            {iconPreview ? (
                                <img
                                    src={iconPreview} // Replace with logo file path
                                    alt={"Logo"}
                                    className="w-16 h-16 rounded-full border-2 shadow-sm absolute left-1/2 transform -translate-x-1/2 -bottom-8"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-content2 border-2 absolute left-1/2 transform -translate-x-1/2 -bottom-8 flex items-center justify-center">
                                    <Icon
                                        icon="ion:person-circle"
                                        width="50"
                                        height="50"
                                        className="text-default-300"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Header Section */}
                        <div className="w-full flex flex-col items-center mt-4 p-3">
                            <h1
                                className={`text-normal font-semibold ${
                                    isDarkMode ? "text-white" : "text-black"
                                }`}
                            >
                                {rcsBrandName}
                            </h1>
                            <p
                                className={`text-xs text-center ${
                                    isDarkMode
                                        ? "text-gray-400"
                                        : "text-gray-600"
                                }`}
                            >
                                {rcsShortDescription}
                            </p>
                        </div>

                        {/* Contact Icons */}
                        <div className="flex justify-around w-full my-2 mt-1">
                            <div
                                className="text-center flex items-center flex-col"
                                style={{ color: rcsBrandColor }}
                            >
                                <Icon icon="mdi:phone" className="text-xl" />
                                <p className="text-xs mt-2">{t("Call")}</p>
                            </div>
                            <div
                                className="text-center  flex items-center flex-col"
                                style={{ color: rcsBrandColor }}
                            >
                                <Icon icon="mdi:world" className="text-xl" />
                                <p className="text-xs mt-2">{t("Website")}</p>
                            </div>
                            <div
                                className="text-center  flex items-center flex-col"
                                style={{ color: rcsBrandColor }}
                            >
                                <Icon
                                    icon="mdi:email-outline"
                                    className="text-xl"
                                />
                                <p className="text-xs mt-2">{t("Email")}</p>
                            </div>
                        </div>

                        {/* Info and Options Tabs */}
                        <div className="w-full border-t border-gray-200">
                            <div className="flex justify-around py-2">
                                <button
                                    className={`font-medium text-sm ${
                                        activeTab === "Info"
                                            ? isDarkMode
                                                ? "text-white border-b-2 border-white"
                                                : "text-gray-800 border-b-2 border-gray-500"
                                            : isDarkMode
                                            ? "text-gray-400"
                                            : "text-gray-400"
                                    }`}
                                    onClick={() => handleTabClick("Info")}
                                >
                                    {t("Info")}
                                </button>
                                <button
                                    className={`font-medium text-sm ${
                                        activeTab === "Options"
                                            ? isDarkMode
                                                ? "text-white border-b-2 border-white"
                                                : "text-gray-800 border-b-2 border-gray-500"
                                            : isDarkMode
                                            ? "text-gray-400"
                                            : "text-gray-400"
                                    }`}
                                    onClick={() => handleTabClick("Options")}
                                >
                                    {t("Options")}
                                </button>
                            </div>

                            {/* Tab Content */}
                            {activeTab === "Info" ? (
                                // Info Section
                                <div className="px-4">
                                    <div className="flex items-center my-3">
                                        <Icon
                                            icon="mdi:phone"
                                            className="text-xl"
                                            style={{ color: rcsBrandColor }}
                                        />
                                        <div className="ml-4">
                                            <p className="font-medium text-xs">
                                                {`${rcsCountryCodeInfo} `}
                                                {rcsPhoneInfo.value}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {rcsPhoneInfo.label}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center my-2">
                                        <Icon
                                            icon="mdi:world"
                                            className="text-xl"
                                            style={{ color: rcsBrandColor }}
                                        />
                                        <div className="ml-4">
                                            <p className="font-medium text-xs">
                                                {rcsWebsiteInfo.value}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {rcsWebsiteInfo.label}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center my-2">
                                        <Icon
                                            icon="mdi:email-outline"
                                            className="text-xl"
                                            style={{ color: rcsBrandColor }}
                                        />
                                        <div className="ml-4">
                                            <p className="font-medium text-xs">
                                                {rcsEmailInfo.value}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {rcsEmailInfo.label}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Options Section
                                <div className="px-4">
                                    <div className="my-1">
                                        <p className="font-medium text-sm">
                                            {t("Notifications")}
                                        </p>
                                    </div>
                                    <div className="my-3">
                                        <p className="font-medium text-xs text-gray-500">
                                            {t("Business")}
                                        </p>
                                    </div>
                                    <div className="my-2">
                                        <p className="text-sm border-b pb-1 border-gray-200">
                                            {t("Block & report spam")}
                                        </p>
                                    </div>
                                    <div className="my-2">
                                        <p className="text-sm border-b pb-1 border-gray-200">
                                            {t("View Privacy Policy")}
                                        </p>
                                    </div>
                                    <div className="my-2 border-b pb-1 border-gray-200">
                                        <p className=" text-sm">
                                            {t("View Terms of Service")}
                                        </p>
                                    </div>
                                    <div className="my-2 pb-1">
                                        <p className="text-sm text-blue-500">
                                            {t("Learn more")}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AndroidMockup>
        </div>
    );
}
