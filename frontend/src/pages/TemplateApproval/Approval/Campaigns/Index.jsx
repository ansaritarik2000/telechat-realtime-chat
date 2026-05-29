import React from "react";
import CampRadio from "./CampRadio";
import InputField from "./InputField";
import ScheduleCampaign from "./Scheduler";
import SplitCampaign from "./SplitCampaign";

export default function Campaigns() {
  return (
    <div className="flex flex-col gap-8">
      {/* Campaign Radio Button */}
      <CampRadio />

      {/* Campaign Name */}
      <InputField
        title="Campaign Name"
        fieldtype="name"
        helper="Enter campaign name for better reporting"
      />

      {/* Business Name */}
      <InputField
        title="Business Name"
        fieldtype="name"
        helper="Enter business name for better reporting"
      />

      {/* Schedule Campaign */}
      <ScheduleCampaign />

      {/* Split Campaign */}
      <SplitCampaign />
    </div>
  );
}
