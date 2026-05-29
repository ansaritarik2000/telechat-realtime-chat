import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify-icon/react";
import { Avatar, Chip, Image } from "@heroui/react";
import "./style.css";
import { useThemeStore } from "../../store/themeStore";
import { useSidebarStore } from "../../store/sidebarStore";
import { useTranslation } from "react-i18next";
import AvatarIndex from "../AvatarGen/Index";
import { useProfileStore } from "../../store/profile/profileStore";

// Export Function
const Sidebar = () => {
    const { sidebarActive, setSidebarActive } = useSidebarStore();
    const { theme } = useThemeStore();

    const firstName = localStorage.getItem("first_name");
    const lastName = localStorage.getItem("last_name");
    const role = localStorage.getItem("role");
    const avatarType = localStorage.getItem("avatar_type");
    const avatarValue = localStorage.getItem("avatar_value");
    const { t } = useTranslation();

    const { avatar_type, avatar_value, setAvatarType, setAvatarValue } =
        useProfileStore();

    const handleMenuButtonClick = () => {
        setSidebarActive(!sidebarActive);
    };

    useEffect(() => {
        setAvatarType(avatarType);
        setAvatarValue(avatarValue);
    }, [avatarType, avatarValue]);

    const handleMenuItemClick = (e) => {
        const menuItem = e.currentTarget;

        // collapse sidebar
        setSidebarActive(true);

        // Toggle active class for the clicked menu item
        if (theme === "dark") {
            menuItem.classList.toggle("darkactive");
        } else {
            menuItem.classList.toggle("active");
        }

        // Toggle display of submenu if it exists
        const submenu = menuItem.querySelector("ul");
        if (submenu) {
            submenu.style.display =
                submenu.style.display === "block" ? "none" : "block";
        }

        // Remove active class and hide submenus for siblings
        const siblings = menuItem.parentNode.children;
        for (let sibling of siblings) {
            if (sibling !== menuItem) {
                if (theme === "dark") {
                    sibling.classList.remove("darkactive");
                } else {
                    sibling.classList.remove("active");
                }

                // Hide submenu if it exists
                const siblingSubmenu = sibling.querySelector("ul");
                if (siblingSubmenu) {
                    siblingSubmenu.style.display = "none";
                }
            }
        }
    };

    return (
        <div className="container">
            <div
                className={`sidebar dark:bg-background ${
                    sidebarActive ? "active" : ""
                }  border-[4px] border-[#8be4b1]`}
            >
                {/* Sidebar toggler */}
                <div
                    className="menu-btn dark:bg-background"
                    onClick={handleMenuButtonClick}
                >
                    <Icon
                        icon={`${
                            sidebarActive
                                ? "ph:caret-circle-right-duotone"
                                : "ph:caret-circle-left-duotone"
                        }`}
                        width="1.6em"
                        height="1.6em"
                        className="i text-green-500 dark:bg-background"
                    />
                </div>

                {/* Logo */}
                <div className="logo-img">
                    <div className="logo-img-svg">
                        <a href="/">
                            <img
                                src={
                                    sidebarActive
                                        ? theme === "dark"
                                            ? "only-logo-dark.svg"
                                            : "only-logo-light.svg"
                                        : theme === "dark"
                                        ? "telepie-logo-dark-full.svg"
                                        : "telepie-logo-light-full.svg"
                                }
                                alt="Logo"
                            />
                        </a>
                    </div>
                </div>

                {/* Profile Card */}
                <div
                    className={`${
                        sidebarActive
                            ? " flex justify-center align-center w-full"
                            : " rounded-xl border border-success px-4  flex gap-3 align-center w-full"
                    }`}
                >
                    <AvatarIndex
                        isEditable={false}
                        avatarType={avatar_type}
                        value={avatar_value}
                        size={45}
                    />

                    <div className="user-details flex pb-2">
                        <p className="font-semibold font-xs text-default-600 name">
                            {`${firstName} ${lastName}`}
                        </p>
                        <Chip
                            color="success"
                            variant="flat"
                            size="sm"
                            className="text-xs capitalize"
                        >
                            {role === "superadmin" ? "Super Admin" : role}
                        </Chip>
                    </div>
                </div>

                {/* Navigation */}
                <div className="nav">
                    {/* Main Menu */}
                    <div className="menu">
                        <ul
                            className={
                                theme === "dark" ? "darkUlList" : "lightUlList"
                            }
                        >
                            {/* Home Main */}
                            <li
                                className={
                                    theme === "dark" ? "darkactive" : "active"
                                }
                                onClick={handleMenuItemClick}
                            >
                                <Link
                                    to="/"
                                    className="transition-colors duration-300 "
                                >
                                    <Icon
                                        icon="fluent-color:home-48"
                                        width="1.2em"
                                        height="1.2em"
                                        className="icon "
                                    />
                                    <span className="text">{t("Home")}</span>
                                </Link>
                            </li>
                            {/* SMS */}
                            <li onClick={handleMenuItemClick}>
                                <a href="#">
                                    <Icon
                                        width="1.2em"
                                        height="1.2em"
                                        icon="fluent:chat-12-filled"
                                        className="!text-[#fdc842] icon"
                                    />
                                    <span className="text">{t("SMS")}</span>
                                    <Icon
                                        icon="ph:caret-down"
                                        width="1.2em"
                                        height="1.2em"
                                        className="arrow"
                                    />
                                </a>
                                <ul className="sub-menu bg-white dark:bg-background">
                                    <li>
                                        <Link to="/smsdash">
                                            <Icon
                                                icon="bi:dot"
                                                width="1.8em"
                                                height="1.8em"
                                                style={{ color: "#21c661" }}
                                            />
                                            <span className="text">
                                                {t("Dashboard")}
                                            </span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/sendsms">
                                            <Icon
                                                icon="bi:dot"
                                                width="1.8em"
                                                height="1.8em"
                                                style={{ color: "#21c661" }}
                                            />
                                            <span className="text">
                                                {t("SMS")} {t("Campaign")}
                                            </span>
                                        </Link>
                                    </li>

                                    <li className="">
                                        <Link to="/smsreports">
                                            <Icon
                                                icon="bi:dot"
                                                width="1.8em"
                                                height="1.8em"
                                                style={{ color: "#21c661" }}
                                            />
                                            <span className="text">
                                                {t("Reports & Overview")}
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            {/* RCS */}
                            <li onClick={handleMenuItemClick}>
                                <a href="#">
                                    <Icon
                                        icon="pajamas:image-comment-dark"
                                        className="text-[#699df8] icon"
                                        width="1.2em"
                                        height="1.2em"
                                    />
                                    <span className="text">{t("RCS")}</span>
                                    <Icon
                                        icon="ph:caret-down"
                                        width="1.2em"
                                        height="1.2em"
                                        className="arrow"
                                    />
                                </a>
                                <ul className="sub-menu bg-white dark:bg-background">
                                    <li>
                                        <Link to="/rcsdash">
                                            <Icon
                                                icon="bi:dot"
                                                width="1.8em"
                                                height="1.8em"
                                                style={{ color: "#21c661" }}
                                            />
                                            <span className="text">
                                                {t("Dashboard")}
                                            </span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/sendrcs">
                                            <Icon
                                                icon="bi:dot"
                                                width="1.8em"
                                                height="1.8em"
                                                style={{ color: "#21c661" }}
                                            />
                                            <span className="text">
                                                {t("RCS")} {t("Campaign")}
                                            </span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/rcsreports">
                                            <Icon
                                                icon="bi:dot"
                                                width="1.8em"
                                                height="1.8em"
                                                style={{ color: "#21c661" }}
                                            />
                                            <span className="text">
                                                {t("Reports & Overview")}
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            {/* WhatsApp */}
                            <li onClick={handleMenuItemClick}>
                                <a href="#">
                                    <Icon
                                        icon="logos:whatsapp-icon"
                                        width="1.2em"
                                        height="1.2em"
                                        className="icon"
                                    />
                                    <span className="text">
                                        {t("WhatsApp")}
                                    </span>
                                    <Icon
                                        icon="ph:caret-down"
                                        width="1.2em"
                                        height="1.2em"
                                        className="arrow"
                                    />
                                </a>
                                <ul className="sub-menu bg-white dark:bg-background">
                                    <li>
                                        <Link to="/whatsappdash">
                                            <Icon
                                                icon="bi:dot"
                                                width="1.3em"
                                                height="1.3em"
                                                style={{ color: "#21c661" }}
                                            />
                                            <span className="text">
                                                {t("Dashboard")}
                                            </span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/sendwhatsapp">
                                            <Icon
                                                icon="bi:dot"
                                                width="1.8em"
                                                height="1.8em"
                                                style={{ color: "#21c661" }}
                                            />
                                            <span className="text">
                                                {t("WhatsApp")} {t("Campaign")}
                                            </span>
                                        </Link>
                                    </li>

                                    <li className="">
                                        <Link to="/wareports">
                                            <Icon
                                                icon="bi:dot"
                                                width="1.8em"
                                                height="1.8em"
                                                style={{ color: "#21c661" }}
                                            />
                                            <span className="text">
                                                {t("Reports & Overview")}
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            {/* Email */}
                            <li onClick={handleMenuItemClick}>
                                <a href="#">
                                    <Icon
                                        icon="logos:google-gmail"
                                        width="1.2em"
                                        height="1.2em"
                                        className="icon"
                                    />
                                    <span className="text">{t("Email")}</span>
                                    <Icon
                                        icon="ph:caret-down"
                                        width="1.2em"
                                        height="1.2em"
                                        className="arrow"
                                    />
                                </a>
                                <ul className="sub-menu bg-white dark:bg-background">
                                    <li>
                                        <Link to="/emaildash">
                                            <Icon
                                                icon="bi:dot"
                                                width="1.8em"
                                                height="1.8em"
                                                style={{ color: "#21c661" }}
                                            />
                                            <span className="text">
                                                {t("Dashboard")}
                                            </span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/sendemail">
                                            <Icon
                                                icon="bi:dot"
                                                width="1.8em"
                                                height="1.8em"
                                                style={{ color: "#21c661" }}
                                            />
                                            <span className="text">
                                                {t("Email")} {t("Campaign")}
                                            </span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link to="/emailreports">
                                            <Icon
                                                icon="bi:dot"
                                                width="1.8em"
                                                height="1.8em"
                                                style={{ color: "#21c661" }}
                                            />
                                            <span className="text">
                                                {t("Reports & Overview")}
                                            </span>
                                        </Link>
                                    </li>
                                </ul>
                            </li>

                            {/* Phonebook */}
                            <li onClick={handleMenuItemClick}>
                                <Link to="/phonebook">
                                    <Icon
                                        icon="fxemoji:greenbook"
                                        width="1.2em"
                                        height="1.2em"
                                        className="icon"
                                    />
                                    <span className="text">
                                        {t("Phonebook")}
                                    </span>
                                </Link>
                            </li>

                            {/* Template Approval */}
                            <li onClick={handleMenuItemClick}>
                                <Link to="/tempapproval">
                                    <Icon
                                        icon="fluent-color:document-folder-16"
                                        width="1.3em"
                                        height="1.3em"
                                        className="icon"
                                    />
                                    <span className="text">
                                        {t("Template Approval")}
                                    </span>
                                </Link>
                            </li>

                            {/* TeleApps */}
                            <li onClick={handleMenuItemClick}>
                                <Link to="/teleapps">
                                    <Icon
                                        icon="icon-park-solid:game-ps"
                                        width="1.2em"
                                        height="1.2em"
                                        className="icon text-[#348cff]"
                                    />

                                    <span className="text">
                                        {t("TeleApps")}
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Accounts */}
                <div className="menu">
                    <ul>
                        <li onClick={handleMenuItemClick}>
                            <Link to="/support">
                                <Icon
                                    icon="flat-color-icons:customer-support"
                                    // icon="mdi:face-agent"
                                    width="1.2em"
                                    height="1.2em"
                                    className="icon"
                                />

                                <span className="text">
                                    {t("Support & Ticket")}
                                </span>
                            </Link>
                        </li>
                    </ul>
                    <div className="flex justify-center mt-3">
                        <p className="text-xs text-default-400 watermark">
                            {t("Made with ❤️ by Telepie")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
