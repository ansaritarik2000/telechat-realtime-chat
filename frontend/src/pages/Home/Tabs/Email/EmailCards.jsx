import React from "react";
import GreenCard from "../../../../components/StatsCards/GreenCard";
import BlueCard from "../../../../components/StatsCards/BlueCard";
import RedCard from "../../../../components/StatsCards/RedCard";
import YellowCard from "../../../../components/StatsCards/YellowCard";
import Expenses from "../Expenses";

const ChartLabels = ["Transactional", "Promotional"];
const ChartValues = [1, 1.5];

const TextLabels = [
  {
    key: "transactional",
    label: "Transactional",
    icon: "icon-park-solid:transaction",
    color: "primary",
  },
  {
    key: "protomotional",
    label: "Protomotional",
    icon: "material-symbols:id-card",
    color: "success",
  },
];

export default function EmailCards() {
  return (
    <div className="w-full flex gap-4">
      <div className="w-1/2 grid grid-cols-2 gap-4">
        {/* Success Card */}
        <BlueCard number="4075" percentage="40%" />

        {/* Delivered Card */}
        <GreenCard number="4070" />

        {/* Failed Card */}
        <RedCard number="2" percentage="-99%" />

        {/* Awaited Card */}
        <YellowCard number="2" percentage="98%" />
      </div>

      <Expenses
        chartLabels={ChartLabels}
        textLabels={TextLabels}
        chartValues={ChartValues}
      />
    </div>
  );
}
