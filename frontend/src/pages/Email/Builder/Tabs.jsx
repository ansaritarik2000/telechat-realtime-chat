import React from "react";
import { Tabs, Tab, Tooltip } from "@heroui/react";
import ElementsSidebar from "./ElementsSidebar";
import SettingsIndex from "./Settings/Settings";
import { Icon } from "@iconify/react";
import { useSelectedTab } from "./Index";
import VariablesIndex from "./Variables/Index";

export default function TabsComponent() {
  const { selectedTab, setSelectedTab } = useSelectedTab();
  return (
    <div className="min-w-full absolute right-4 px-1 py-2  flex justify-center items-center flex-col bg-white rounded-3xl ">
      <Tabs
        aria-label="Tabs"
        variant="flat"
        color="default"
        radius="full"
        selectedKey={selectedTab}
        onSelectionChange={setSelectedTab}
        classNames={{
          tabList: "min-w-full relative ",
          tab: "max-w-full  px-6 ",
          tabContent: "group-data-[selected=true]:text-success ",
        }}
      >
        <Tab
          key="elements"
          title={
            <Tooltip content="Elements">
              <Icon icon="solar:widget-add-broken" width="24" height="24" />
            </Tooltip>
          }
          className="w-full "
        >
          <ElementsSidebar />
        </Tab>

        <Tab
          key="settings"
          title={
            <Tooltip content="Settings">
              <Icon icon="meteor-icons:gear" width="24" height="22" />
            </Tooltip>
          }
          className="w-full"
        >
          <SettingsIndex />
        </Tab>

        <Tab
          key="variables"
          title={
            <Tooltip content="Variables">
              <Icon
                icon="gis:tag-o"
                width="28"
                height="28"
                className="rotate-45"
              />
            </Tooltip>
          }
          className="w-full"
        >
          <div className="h-[82vh]">
            <VariablesIndex />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
