import React, { useState } from "react";
import { Input, Select, SelectItem, Tabs, Tab, Chip } from "@heroui/react";
import SMSService from "./SMS";
import RCSService from "./RCS";
import WhatsApp from "./WhatsApp";
import EmailService from "./Email";
import { Icon } from "@iconify-icon/react";

export default function Pricing() {
  const [selected, setSelected] = useState("sms");

  // const handleTabChange = (key) => {
  //   setSelected(key);
  // };

  return (
    <div className="px-10 flex flex-col gap-4">
      <Tabs
        aria-label="Tabs"
        // style={{ color: "white" }}
        selectedKey={selected}
        onSelectionChange={setSelected}
        size="md"
        radius="md"
        className="w-full"
      >
        <Tab
          key="sms"
          title={
            <div className="flex items-center gap-1">
              <Icon
                icon="ph:chat-dots-duotone"
                width={"1.4em"}
                className={
                  selected === "sms" ? "text-success" : "light:text-default-500"
                }
              />
              <span>SMS</span>
            </div>
          }
        >
          <SMSService />
        </Tab>

        <Tab
          key="rcs"
          title={
            <div className="flex items-center gap-1">
              <Icon
                icon="pepicons-print:text-bubbles"
                width={"1.4em"}
                className={
                  selected === "rcs" ? "text-success" : "light:text-default-500"
                }
              />
              <span>RCS</span>
            </div>
          }
        >
          <RCSService />
        </Tab>

        <Tab
          key="wa"
          title={
            <div className="flex items-center gap-1">
              <Icon
                icon="prime:whatsapp"
                width={"1.5em"}
                className={
                  selected === "wa" ? "text-success" : "light:text-default-500"
                }
              />
              <span>WhatsApp</span>
            </div>
          }
        >
          <WhatsApp />
        </Tab>

        <Tab
          key="email"
          title={
            <div className="flex items-center gap-1">
              <Icon
                icon="ic:outline-email"
                width={"1.4em"}
                className={
                  selected === "ivr" ? "text-success" : "light:text-default-500"
                }
              />
              <span>Email</span>
            </div>
          }
        >
          <EmailService />
        </Tab>
      </Tabs>

      <div className="text-sm text-default-400 -mt-5">
        <span className="text-primary">*</span> Selected rates are applicable to
        each individual message. If left blank defaults to rates set by Telepie
      </div>
    </div>
  );
}
