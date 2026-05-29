import React, { useState } from "react";
import InputField from "./InputField";
import { Select, SelectItem, Checkbox } from "@heroui/react";
import { Input } from "@heroui/react";

export const intervals = [
  { key: "5 minutes", label: "5 minutes" },
  { key: "10 minutes", label: "10 minutes" },
  { key: "15 minutes", label: "15 minutes" },
];

export default function SplitCampaign() {
  const [splitCampaign, setSplitCampaign] = useState(false);
  const [interval, setInterval] = useState([]);

  return (
    <div className="flex gap-8 flex-col">
      {/* Split Campaign Checkbox */}
      <Checkbox
        size="md"
        color="success"
        checked={splitCampaign}
        onChange={(e) => setSplitCampaign(e.target.checked)}
      >
        Split Campaign
      </Checkbox>

      {splitCampaign && (
        <div className="flex space-x-4 justify-center items-center">
          {/* Batch Size */}
          <div className="w-1/2">
            <Input size="sm" type="text" label="Batch Size" />
          </div>

          {/* Interval */}

          <div className="w-1/2">
            <div className="w-1/2">
              <Select
                label="Interval"
                // variant="bordered"
                // placeholder="Select the template"
                size="sm"
                selectedKeys={interval}
                className="max-w-xs"
                onSelectionChange={setInterval}
              >
                {intervals.map((interval) => (
                  <SelectItem key={interval.key}>{interval.label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
