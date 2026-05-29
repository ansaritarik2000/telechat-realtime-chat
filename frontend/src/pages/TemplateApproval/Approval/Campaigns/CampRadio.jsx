import React from "react";
import { Radio, RadioGroup } from "@heroui/react";

export default function CampRadio() {
  const Credits = {
    promo: 245556,
    transc: 87739,
  };

  return (
    <div>
      <RadioGroup
        label="Select Campaign Type:"
        orientation="horizontal"
        defaultValue="promotional"
        color="success"
        className="font-medium"
      >
        <Radio value="promotional">
          <span>
            Promotional{" "}
            <span className="text-gray-400 text-xs">
              ({Credits.promo} TeleCredits)
            </span>
          </span>
        </Radio>
        <Radio value="transactional">
          <span>
            Transactional{" "}
            <span className="text-gray-400 text-xs">
              ({Credits.transc} TeleCredits)
            </span>
          </span>
        </Radio>
      </RadioGroup>
    </div>
  );
}
