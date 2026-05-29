import React, { useState } from "react";
import { Checkbox } from "@heroui/react";
import CampDatePicker from "./CampDatePicker";

export default function ScheduleCampaign() {
  const [scheduleCampaign, setScheduleCampaign] = useState(false);

  return (
    <div className="flex space-x-4 items-center dark:text-white">
      <Checkbox
        size="md"
        color="success"
        checked={scheduleCampaign}
        onChange={(e) => setScheduleCampaign(e.target.checked)}
      >
        Schedule Campaign
      </Checkbox>

      {scheduleCampaign && <CampDatePicker />}
    </div>
  );
}
