import React, { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import MetaIndex from "./MetaAPI/MetaIndex";
import OptIndex from "./OptIn/OptIndex";
import UserFlowIndex from "./UserFlows/UserFlowIndex";
import ChatWidget from "./ChatWidget/Widget";

const TabItems = [
  { key: "meta", title: "Meta API", content: <MetaIndex /> },
  { key: "optin", title: "Opt In/Out", content: <OptIndex /> },
  { key: "chatwidget", title: "Chat Widget", content: <ChatWidget /> },
  { key: "userflows", title: "User Flows", content: <UserFlowIndex /> },
];

export default function SettingsIndex() {
  const [selected, setSelected] = useState("chatwidget");

  return (
    <div>
      <Tabs
        aria-label="Settings Tabs"
        selectedKey={selected}
        onSelectionChange={setSelected}
        variant="underlined"
      >
        {TabItems.map((item) => (
          <Tab key={item.key} title={item.title}>
            {item.content}
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
