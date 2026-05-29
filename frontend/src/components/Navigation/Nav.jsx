import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownSection,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Badge,
  Chip,
  Divider,
} from "@heroui/react";
import i18next from "i18next";
import { t } from "i18next";
import { Icon } from "@iconify/react";

import NotificationsCard from "./notifications-card";
import { useThemeStore } from "../../store/themeStore";
import Presets from "./Presets";
import FontSelector from "./FontSelector";
import AvatarIndex from "../AvatarGen/Index";
import { useProfileStore } from "../../store/profile/profileStore";
import { useWalletStore } from "../../store/wallets/walletStore";
import { getWalletDetailsService } from "../../services/wallet/getWalletService";

const GreyLine = () => (
  <div className="border-default-300 border-b w-full"></div>
);

export default function Navigation() {
  const [selectedKeys, setSelectedKeys] = useState(new Set(["en"]));
  const firstName = localStorage.getItem("first_name");
  const lastName = localStorage.getItem("last_name");
  const role = localStorage.getItem("role");
  const avatarType = localStorage.getItem("avatar_type");
  const avatarValue = localStorage.getItem("avatar_value");
  const navigate = useNavigate();
  const { avatar_type, avatar_value, setAvatarType, setAvatarValue } =
    useProfileStore();
  const token = localStorage.getItem("token");

  const { wallet_balance, setWalletBalance } = useWalletStore();

  useEffect(() => {
    setAvatarType(avatarType);
    setAvatarValue(avatarValue);
  }, [avatarType, avatarValue]);

  // theme state management global level
  const { theme, setTheme } = useThemeStore();

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  // handle language change

  const handleLanguageChange = (key) => {
    i18next.changeLanguage(key); // Change language
    setSelectedKeys(new Set([key])); // Update selected language key
  };

  const element = document.documentElement;

  const handleNavigate = (path) => {
    // Navigate to path
    navigate(path);
  };

  const logoutHandller = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    if (theme === "dark") {
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
      document.body.classList.add("dark");
    } else {
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
      document.body.classList.remove("dark");
    }
  }, [theme]);

  // Get wallet balance
  useEffect(() => {
    const getWalletBalance = async () => {
      try {
        const response = await getWalletDetailsService(
          { user_id: localStorage.getItem("user_id") },
          token
        );
        setWalletBalance(response.data.wallet_balance);
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
      }
    };

    if (token) {
      getWalletBalance();
    }
  }, [token]);

  return (
    <div className="w-full">
      <Navbar
        classNames={{
          base: "py-[0.35em] border-b border-success-300 border-b-2",
          wrapper: "sm:px-4 max-w-full",
          item: "data-[active=true]:text-primary",
        }}
        height="60px"
      >
        <NavbarContent
          className="ml-auto flex h-12 max-w-fit  items-center justify-center gap-2 rounded-full px-8"
          justify="end"
        >
          {/* Wallet Balance */}
          <NavbarItem className="mr-12 flex gap-2 items-center ">
            <div>
              <Tooltip content="Current balance">
                <Chip
                  color="success"
                  variant="flat"
                  size="lg"
                  radius="sm"
                  className="py-5 px-y pl-4 cursor-pointer"
                  startContent={
                    <Icon
                      // icon="lets-icons:wallet-duotone"
                      icon="lets-icons:wallet-duotone-line"
                      width="1.4em"
                      height="1.4em"
                    />
                  }
                  onClick={() => handleNavigate("/telecredits")}
                >
                  <div className="flex gap-1 items-center">
                    <span>{wallet_balance}</span>
                  </div>
                </Chip>
              </Tooltip>
            </div>
          </NavbarItem>

          {/* Theme change */}
          <NavbarItem className="lg:flex">
            <Button
              isIconOnly
              radius="full"
              variant="light"
              onPress={() => setTheme(theme === "light" ? "dark" : "light")}
              className="hidden lg:flex"
            >
              <Icon
                className="text-default-500"
                icon={
                  theme === "light"
                    ? "ic:outline-light-mode"
                    : "solar:moon-linear"
                }
                width={25}
              />
            </Button>
          </NavbarItem>

          {/* Languages */}
          <NavbarItem className="lg:flex">
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button isIconOnly radius="full" variant="light">
                  <Icon
                    className="text-default-500"
                    icon="circle-flags:in"
                    width={24}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedKeys}
                onSelectionChange={(key) => handleLanguageChange(key)}
              >
                <DropdownItem key="en">
                  <div className="flex flex-row space-between items-align">
                    <Icon
                      className="text-default-500"
                      icon="circle-flags:in"
                      width={24}
                    />
                    <p className="ml-3 font-semibold">English</p>
                  </div>
                </DropdownItem>
                <DropdownItem key="hi">
                  <div className="flex flex-row space-between items-align">
                    <Icon
                      className="text-default-500"
                      icon="circle-flags:in"
                      width={24}
                    />
                    <p className="ml-3 font-semibold">हिंदी</p>
                  </div>
                </DropdownItem>
                <DropdownItem key="mr">
                  <div className="flex flex-row space-between items-align">
                    <Icon
                      className="text-default-500"
                      icon="circle-flags:in"
                      width={24}
                    />
                    <p className="ml-3 font-semibold">मराठी</p>
                  </div>
                </DropdownItem>
                <DropdownItem key="te">
                  <div className="flex flex-row space-between items-align">
                    <Icon
                      className="text-default-500"
                      icon="circle-flags:in"
                      width={24}
                    />
                    <p className="ml-3 font-semibold">తెలుగు</p>
                  </div>
                </DropdownItem>
                <DropdownItem key="kn">
                  <div className="flex flex-row space-between items-align">
                    <Icon
                      className="text-default-500"
                      icon="circle-flags:in"
                      width={24}
                    />
                    <p className="ml-3 font-semibold">ಕನ್ನಡ</p>
                  </div>
                </DropdownItem>
                <DropdownItem key="ta">
                  <div className="flex flex-row space-between items-align">
                    <Icon
                      className="text-default-500"
                      icon="circle-flags:in"
                      width={24}
                    />
                    <p className="ml-3 font-semibold">தமிழ்</p>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>

          {/* Gear Icon */}
          <NavbarItem className="lg:flex">
            <Popover placement="bottom-end">
              <PopoverTrigger>
                <Button isIconOnly radius="full" variant="light">
                  <Icon
                    icon="solar:settings-bold-duotone"
                    width={30}
                    className="text-default-500"
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-6 flex flex-col gap-4">
                {/* Presets */}
                <div className=" w-full space-y-2">
                  <div className="text-xs font-bold text-default-500 flex gap-2 items-center">
                    <span>Presets</span>
                    <GreyLine />
                  </div>
                  <Presets />
                </div>

                {/* Fonts */}
                <div className="w-full space-y-2">
                  <div className="text-xs font-bold text-default-500 flex gap-2 items-center">
                    <span>Fonts</span>
                    <GreyLine />
                  </div>
                  <FontSelector />
                </div>
              </PopoverContent>
            </Popover>
          </NavbarItem>

          {/* Notifications */}
          <NavbarItem className="flex">
            <Popover offset={12} placement="bottom-end">
              <PopoverTrigger>
                <Button
                  disableRipple
                  isIconOnly
                  className="overflow-visible"
                  radius="full"
                  variant="light"
                >
                  <Badge
                    color="danger"
                    content="5"
                    showOutline={false}
                    size="md"
                  >
                    <Icon
                      className="text-default-500"
                      icon="solar:bell-linear"
                      width={22}
                    />
                  </Badge>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="max-w-[90vw] p-0 sm:max-w-[380px]">
                <NotificationsCard className="w-full shadow-none" />
              </PopoverContent>
            </Popover>
          </NavbarItem>

          {/* Profile  */}
          <NavbarItem>
            <Popover
              placement="bottom-end"
              closeOnSelect={true}
              size="lg"
              containerPadding="18"
            >
              <PopoverTrigger>
                <button className="transition-transform">
                  <Badge
                    color="success"
                    content=""
                    placement="bottom-right"
                    shape="circle"
                  >
                    <AvatarIndex
                      isEditable={false}
                      avatarType={avatar_type}
                      value={avatar_value}
                      size={38}
                    />
                  </Badge>
                </button>
              </PopoverTrigger>

              <PopoverContent
                aria-label="Profile Actions"
                variant="light"
                size="lg"
                className="p-4 min-w-[220px] "
              >
                <div className="w-full flex flex-col gap-2">
                  {/* Profile Info Section */}
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between text-sm flex-col gap-2">
                      <p className="font-semibold">Signed in as</p>
                      <div className="flex justify-between items-center">
                        <p className="text-default-500 font-semibold">{`${firstName}`}</p>
                        <Chip
                          className="text-xs capitalize"
                          radius="full"
                          size="sm"
                          variant="flat"
                          color="success"
                        >
                          <span className="text-xs">
                            {role === "superadmin" ? "Super Admin" : role}
                          </span>
                        </Chip>
                      </div>
                    </div>
                  </div>

                  <Divider />

                  {/* Profile Settings Section */}
                  <div>
                    {/* Settings */}
                    <div
                      key="settings"
                      className="flex items-center space-x-2 cursor-pointer hover:bg-content2 p-2 rounded-lg"
                      onClick={() => handleNavigate("/profile")}
                    >
                      <Icon
                        // icon="bi:person-fill-gear"
                        icon="bi:person-gear"
                        width={22}
                        className="text-default-600"
                      />
                      <span className="text-sm">{t("Profile Settings")}</span>
                    </div>
                    {/* SubAccounts Section */}
                    <div
                      key="subaccounts"
                      className="flex items-center space-x-2 cursor-pointer hover:bg-content2 p-2 rounded-lg"
                      onClick={() => handleNavigate("/subaccounts")}
                    >
                      <Icon
                        // icon="mdi:person-plus"
                        icon="bi:person-plus"
                        width={22}
                        className="text-default-600"
                      />
                      <span className="text-sm">{t("Sub Accounts")}</span>
                    </div>
                  </div>

                  {/* Logout Section */}
                  <Button
                    className="w-full border-2 dark:text-white text-default-500 hover:border-danger-500 group"
                    radius="sm"
                    size="sm"
                    color="default"
                    variant="bordered"
                    onPress={logoutHandller}
                  >
                    <Icon
                      icon="humbleicons:logout"
                      width={20}
                      className="group-hover:text-danger-500"
                    />
                    <span className="text-sm group-hover:text-danger-500">
                      {t("Log Out")}
                    </span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
}
