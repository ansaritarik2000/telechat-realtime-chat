import React, { useState } from "react";
import { Input, Select, SelectItem } from "@heroui/react";
import SMSService from "./SMS";
import RCSService from "./RCS";

const services = [
  { key: "sms", label: "SMS" },
  { key: "rcs", label: "RCS" },
  { key: "IVR", label: "IVR" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "telegram", label: "Telegram" },
];

export default function UpdateCredits() {
  const [selectedService, setSelectedService] = useState("sms");

  const renderTemplate = () => {
    switch (selectedService) {
      case "sms":
        return <SMSService />;
      case "rcs":
        return <RCSService />;
      // Add cases for IVR, WhatsApp, Telegram as needed
      default:
        return null;
    }
  };

  return (
    <div className="mx-10 flex flex-col space-y-8">
      <div>
        <Select
          isRequired
          label="Service"
          variant="flat"
          size="lg"
          className="w-2/3"
          defaultSelectedKeys={["sms"]}
          radius="sm"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          {services.map((service) => (
            <SelectItem key={service.key} value={service.key}>
              {service.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Render selected service template */}
      {renderTemplate()}
    </div>
  );
}
