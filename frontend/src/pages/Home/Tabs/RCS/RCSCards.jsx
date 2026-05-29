import React, { useEffect, useState } from "react";
import GreenCard from "../../../../components/StatsCards/GreenCard";
import BlueCard from "../../../../components/StatsCards/BlueCard";
import RedCard from "../../../../components/StatsCards/RedCard";
import YellowCard from "../../../../components/StatsCards/YellowCard";
import Expenses from "../Expenses";
import { getRcsAllDetailsStats } from "../../../../services/Rcs/getRcsStatsService";

const ChartLabels = [
  "Basic RBM",
  "Single RBM",
  "A2P Conversation",
  "P2A Conversation",
];

const ChartValues = [4, 6, 3, 5];

const TextLabels = [
  {
    key: "basicrbm",
    label: "Basic RBM",
    icon: "icon-park-solid:transaction",
    color: "primary",
  },
  {
    key: "singlerbm",
    label: "Single RBM",
    icon: "material-symbols:id-card",
    color: "success",
  },
  {
    key: "a2pconversation",
    label: "A2P Conversation",
    icon: "mingcute:briefcase-fill",
    color: "warning",
  },
  {
    key: "p2aconversation",
    label: "P2A Conversation",
    icon: "majesticons:document",
    color: "danger",
  },
];

export default function RCSCards() {
  const [rcsStats, setRcsSats] = useState({
    totalSubmitted: 0,
    totalDelivered: 0,
    totalFailed: 0,
    totalAwaiting: 0,
    percentageIncreaseSubmitted: 0,
    percentageIncreaseDelivered: 0,
    percentageIncreaseFailed: 0,
    percentageIncreaseAwaiting: 0,
    iconPercentageAwaiting: "",
    iconPercentageDelivered: "",
    iconPercentageFailed: "",
    iconPercentageSubmitted: "",
  });

  const {
    totalAwaiting,
    totalDelivered,
    totalFailed,
    totalSubmitted,
    percentageIncreaseAwaiting,
    percentageIncreaseDelivered,
    percentageIncreaseFailed,
    percentageIncreaseSubmitted,
    iconPercentageAwaiting,
    iconPercentageDelivered,
    iconPercentageFailed,
    iconPercentageSubmitted,
  } = rcsStats;

  // this use effect are used for get rcs stats data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRcsAllDetailsStats();
        if (response.status === "SUCCESS") {
          // current campaign stats
          const totalCampaignStats = response.data.totalAllCampaigns;

          // percentage increment stat
          const percentIncrementStats =
            response.data.percentageIncreaseLastCampaign;

          setRcsSats({
            ...rcsStats,

            // total numbers stats (today compaign)
            totalAwaiting: totalCampaignStats.totalAwaiting,
            totalDelivered: totalCampaignStats.totalDelivered,
            totalFailed: totalCampaignStats.totalFailed,
            totalSubmitted: totalCampaignStats.totalSubmitted,

            // latest compaign and  previous compaign coparision percentage
            percentageIncreaseSubmitted:
              percentIncrementStats?.submitted?.percentage,
            percentageIncreaseAwaiting:
              percentIncrementStats?.awaiting?.percentage,
            percentageIncreaseDelivered:
              percentIncrementStats?.delivered?.percentage,
            percentageIncreaseFailed: percentIncrementStats?.failed?.percentage,

            // latest compaign and previous compaign coparision icon
            iconPercentageAwaiting: percentIncrementStats?.awaiting?.icon,
            iconPercentageDelivered: percentIncrementStats?.delivered?.icon,
            iconPercentageFailed: percentIncrementStats?.failed?.icon,
            iconPercentageSubmitted: percentIncrementStats?.submitted?.icon,
          });
        } else {
          console.log("error", "error in fetching rcs stats");
        }
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex gap-4">
      <div className="w-1/2 grid grid-cols-2 gap-4">
        {/* Submitted Card */}
        <BlueCard
          number={totalSubmitted}
          percentage={percentageIncreaseSubmitted}
          iconPercentageSubmitted={iconPercentageSubmitted}
        />

        {/* Delivered Card */}
        <GreenCard
          number={totalDelivered}
          percentage={percentageIncreaseDelivered}
          iconPercentageDelivered={iconPercentageDelivered}
        />

        {/* Failed Card */}
        <RedCard
          number={totalFailed}
          percentage={percentageIncreaseFailed}
          iconPercentageFailed={iconPercentageFailed}
        />

        {/* Awaited Card */}
        <YellowCard
          number={totalAwaiting}
          percentage={percentageIncreaseAwaiting}
          iconPercentageAwaiting={iconPercentageAwaiting}
        />
      </div>

      {/* Right Col */}
      <Expenses
        textLabels={TextLabels}
        chartLabels={ChartLabels}
        chartValues={ChartValues}
      />
    </div>
  );
}
