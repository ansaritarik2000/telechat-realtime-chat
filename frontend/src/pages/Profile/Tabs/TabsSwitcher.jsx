import React, { useState, Suspense } from "react";
import { Tabs, Tab } from "@heroui/react";
import { Icon } from "@iconify-icon/react";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner.jsx";
import { useTranslation } from "react-i18next";

// Lazy loading the Profile and Security components
const Profile = React.lazy(() => import("./Profile/ProfileIndex.jsx"));
const Security = React.lazy(() => import("./Security/SecurityIndex.jsx"));
const Teams = React.lazy(() => import("./Teams/TeamsIndex.jsx"));

export default function TabsSwitcher() {
  const [selected, setSelected] = useState("security");
  const { t } = useTranslation();

  const handleTabChange = (key) => {
    setSelected(key);
  };

  return (
    <div className="flex flex-col gap-4 h-full ">
      <Tabs
        aria-label="Tabs"
        selectedKey={selected}
        onSelectionChange={handleTabChange}
        size="lg"
        variant="underlined"
        classNames={{
          tabList:
            "gap-6 w-full rounded-none flex bg-white  py-3 justify-end pr-6  border-divider",
          cursor: "w-full bg-success",
          tab: "max-w-fit  pr-3",
        }}
      >
        <Tab
          key="profile"
          id="profile"
          title={
            <div className="flex items-center gap-1">
              <Icon
                icon="iconamoon:profile-duotone"
                width={"1.4em"}
                className={
                  selected === "profile"
                    ? "text-success"
                    : "light:text-default-500"
                }
              />
              <span>{t("Profile")}</span>
            </div>
          }
        >
          <Suspense fallback={<LoadingSpinner />}>
            <Profile />
          </Suspense>
        </Tab>

        <Tab
          key="security"
          id="security"
          title={
            <div className="flex items-center gap-1">
              <Icon
                icon="iconamoon:shield-yes-duotone"
                width={"1.4em"}
                className={
                  selected === "security"
                    ? "text-success"
                    : "light:text-default-500"
                }
              />
              <span>{t("Security & Alerts")}</span>
            </div>
          }
        >
          <Suspense fallback={<LoadingSpinner />}>
            <Security />
          </Suspense>
        </Tab>

        {/* Teams Tab */}

        <Tab
          key="teams"
          id="teams"
          title={
            <div className="flex items-center gap-1">
              <Icon
                icon="solar:users-group-two-rounded-line-duotone"
                width={"1.4em"}
                className={
                  selected === "teams"
                    ? "text-success"
                    : "light:text-default-500"
                }
              />
              <span>{t("Teams")}</span>
            </div>
          }
        >
          <Suspense fallback={<LoadingSpinner />}>
            <Teams />
          </Suspense>
        </Tab>
      </Tabs>
    </div>
  );
}
