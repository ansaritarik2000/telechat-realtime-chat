import React, { useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import FrequencyCaps from "./FrequencyCaps";

export default function ServiceTabsSwitcher() {
  const [selectedTab, setSelectedTab] = useState("sms");
  return (
    <div className="mt-2">
      <Tabs
        aria-label="Service Tabs"
        size="lg"
        variant="underlined"
        color="success"
        defaultSelectedKey={selectedTab}
        classNames={{
          tabList: "gap-6 w-full relative  p-0 ",
        }}
      >
        {/* SMS Tab */}
        <Tab key="sms" title="SMS">
          <FrequencyCaps serviceType="SMS" />
        </Tab>

        {/* RCS Tab */}
        <Tab key="rcs" title="RCS">
          <FrequencyCaps serviceType="RCS" />
        </Tab>

        {/* Email Tab */}
        <Tab key="email" title="Email">
          <FrequencyCaps serviceType="Email" />
        </Tab>

        {/* Whatsapp Tab */}
        <Tab key="whatsapp" title="Whatsapp">
          <FrequencyCaps serviceType="Whatsapp" />
        </Tab>
      </Tabs>
    </div>
  );
}
