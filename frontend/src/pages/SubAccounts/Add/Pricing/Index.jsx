import React, { useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import SMSService from "./SMS";
import RCSService from "./RCS";
import WhatsApp from "./WhatsApp";
import EmailService from "./Email";
import { Icon } from "@iconify-icon/react";
import { useTranslation } from "react-i18next";

// Common TabTitle component
const TabTitle = ({ icon, label, isSelected }) => (
  <div className="flex items-center gap-1">
    <Icon
      icon={icon}
      width={"1.4em"}
      className={isSelected ? "text-success" : "light:text-default-500"}
    />
    <span>{label}</span>
  </div>
);

// Tab items array
const tabItems = [
  {
    key: "sms",
    icon: "ph:chat-dots-duotone",
    label: "SMS",
    content: <SMSService />,
  },
  {
    key: "rcs",
    icon: "pepicons-print:text-bubbles",
    label: "RCS",
    content: <RCSService />,
  },
  {
    key: "wa",
    icon: "prime:whatsapp",
    label: "WhatsApp",
    content: <WhatsApp />,
  },
  {
    key: "email",
    icon: "ic:outline-email",
    label: "Email",
    content: <EmailService />,
  },
];

export default function Pricing() {
  const [selected, setSelected] = useState("sms");
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <Tabs
        aria-label="Tabs"
        selectedKey={selected}
        onSelectionChange={setSelected}
        size="md"
        radius="md"
        className="w-full"
      >
        {tabItems.map((item) => (
          <Tab
            key={item.key}
            title={
              <TabTitle
                icon={item.icon}
                label={t(item.label)}
                isSelected={selected === item.key}
              />
            }
          >
            {item.content}
          </Tab>
        ))}
      </Tabs>

      <div className="text-sm text-default-400 -mt-5">
        *{t("Selected rates are applicable to each individual message.")}
        {t("If left blank defaults to rates set by Telepie")}
      </div>
    </div>
  );
}
