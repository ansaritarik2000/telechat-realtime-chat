import React from "react";
import GreenCard from "../../../../components/StatsCards/GreenCard";
import BlueCard from "../../../../components/StatsCards/BlueCard";
import RedCard from "../../../../components/StatsCards/RedCard";
import YellowCard from "../../../../components/StatsCards/YellowCard";
import Expenses from "../Expenses";

const ChartLabels = ["Marketing", "Services", "Utility", "Authentication"];

const ChartValues = [3, 4, 6, 5];

const TextLabels = [
  {
    key: "marketing",
    label: "Marketing",
    icon: "icon-park-solid:transaction",
    color: "primary",
  },
  {
    key: "services",
    label: "Services",
    icon: "material-symbols:id-card",
    color: "success",
  },
  {
    key: "utility",
    label: "Utility",
    icon: "mingcute:briefcase-fill",
    color: "warning",
  },
  {
    key: "authentication",
    label: "Authentication",
    icon: "majesticons:document",
    color: "danger",
  },
];

export default function WhatsAppCards() {
  return (
    <div className="w-full flex gap-4">
      <div className="w-1/2 grid grid-cols-2 gap-4">
        {/* Success Card */}
        <BlueCard number="8795" percentage="2%" />

        {/* Delivered Card */}
        <GreenCard number="8795" percentage="100%" />

        {/* Failed Card */}
        <RedCard number="0" percentage="0%" />

        {/* Awaited Card */}
        <YellowCard number="0" percentage="0%" />
      </div>

      {/* Right Col */}
      <Expenses
        chartLabels={ChartLabels}
        textLabels={TextLabels}
        chartValues={ChartValues}
      />
    </div>
  );
}
