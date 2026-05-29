import React, { useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import { useSearchParams } from "react-router-dom";
import { getRcsDetailsStats } from "../../../../services/Rcs/getRcsStatsService";
import { useTranslation } from "react-i18next";

export default function ReportCards() {
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

    // get campaign_id froom search query params
    const [searchParams] = useSearchParams();
    const campaign_id = searchParams.get("campaign_id");
    const { t } = useTranslation();

    // this use effect are used for get rcs stats data
    useEffect(() => {
        if (campaign_id) {
            const fetchData = async () => {
                try {
                    const response = await getRcsDetailsStats(campaign_id);
                    if (response.status === "SUCCESS") {
                        // current campaign stats
                        const currentCampaignStats = response.data.current;

                        // percentage increment stat
                        const percentIncrementStats =
                            response.data.percentageIncrease;

                        setRcsSats({
                            ...rcsStats,
                            // total
                            totalAwaiting: currentCampaignStats.totalAwaiting,
                            totalDelivered: currentCampaignStats.totalDelivered,
                            totalFailed: currentCampaignStats.totalFailed,
                            totalSubmitted: currentCampaignStats.totalSubmitted,
                            // percentage increase number compare then previous campaign
                            percentageIncreaseSubmitted:
                                percentIncrementStats?.submitted?.percentage,
                            percentageIncreaseAwaiting:
                                percentIncrementStats?.awaiting?.percentage,
                            percentageIncreaseDelivered:
                                percentIncrementStats?.delivered?.percentage,
                            percentageIncreaseFailed:
                                percentIncrementStats?.failed?.percentage,
                            // perecentage increase icon minus or plus or blank
                            iconPercentageAwaiting:
                                percentIncrementStats?.awaiting?.icon,
                            iconPercentageDelivered:
                                percentIncrementStats?.delivered?.icon,
                            iconPercentageFailed:
                                percentIncrementStats?.failed?.icon,
                            iconPercentageSubmitted:
                                percentIncrementStats?.submitted?.icon,
                        });
                    } else {
                        console.log("error", "error in fetching rcs stats");
                    }
                } catch (error) {
                    console.log("error", error);
                }
            };

            fetchData();
        }
    }, [campaign_id]);

    return (
        <div className="w-full flex gap-4">
            {/* Success Card */}
            <div className="w-1/4 bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-200 rounded-md px-8 py-8 flex items-center justify-between shadow-lg relative">
                <div className="flex flex-col gap-4">
                    <h1 className="font-semibold text-md text-primary-900">
                        {t("Submitted Numbers")}
                    </h1>
                    <p className="text-5xl font-bold text-primary-800">
                        {totalSubmitted}
                    </p>
                    <p className="text-sm font-semibold text-primary-800">
                        <span
                            className={
                                // dynamic percentage color
                                iconPercentageSubmitted === "-"
                                    ? "text-danger"
                                    : "text-success"
                            }>
                            {iconPercentageSubmitted}
                            {percentageIncreaseSubmitted}%
                        </span>{" "}
                        {t("Vs last campaign")}
                    </p>
                </div>
                <div className="absolute right-8">
                    <Icon
                        icon="streamline:money-graph-arrow-increase-ascend-growth-up-arrow-stats-graph-right-grow"
                        width="3em"
                        height="3em"
                        className="text-primary"
                    />
                </div>
            </div>

            {/* Delivered Card */}
            <div className="w-1/4 bg-gradient-to-r from-success-50 to-success-100 border-2 border-success-200 rounded-md px-8 py-8 flex items-center justify-between shadow-lg relative">
                <div className="flex flex-col gap-4">
                    <h1 className="font-semibold text-md text-success-900">
                        {t("Delivered Numbers")}
                    </h1>
                    <p className="text-5xl font-bold text-success-800">
                        {totalDelivered}
                    </p>
                    <p className="text-sm font-semibold text-success-800">
                        <span
                            className={
                                // dynamic percentage color
                                iconPercentageDelivered === "-"
                                    ? "text-danger"
                                    : "text-success"
                            }>
                            {iconPercentageDelivered}
                            {percentageIncreaseDelivered}%
                        </span>{" "}
                        {t("Vs last campaign")}
                    </p>
                </div>
                <div className="absolute right-8">
                    <Icon
                        icon="material-symbols:bar-chart"
                        width="3em"
                        height="3em"
                        className="text-success"
                    />
                </div>
            </div>

            {/* Failed Card */}
            <div className="w-1/4 bg-gradient-to-r from-danger-50 to-danger-100 border-2 border-danger-200 rounded-md px-8 py-8 flex items-center justify-between shadow-lg relative">
                <div className="flex flex-col gap-4">
                    <h1 className="font-semibold text-md text-danger-900">
                        {t("Failed Numbers")}
                    </h1>
                    <p className="text-5xl font-bold text-danger-800">
                        {totalFailed}
                    </p>
                    <p className="text-sm font-semibold text-danger-800">
                        <span
                            className={
                                // dynamic percentage color
                                iconPercentageFailed === "-"
                                    ? "text-danger"
                                    : "text-success"
                            }>
                            {iconPercentageFailed}
                            {percentageIncreaseFailed}%
                        </span>{" "}
                        {t("Vs last campaign")}
                    </p>
                </div>
                <div className="absolute right-8">
                    <Icon
                        icon="streamline:money-graph-arrow-decrease-down-stats-graph-descend-right-arrow"
                        width="3em"
                        height="3em"
                        className="text-danger"
                    />
                </div>
            </div>

            {/* Awaited Card */}
            <div className="w-1/4 bg-gradient-to-r from-warning-50 to-warning-100 border-2 border-warning-200 rounded-md px-8 py-8 flex items-center justify-between shadow-lg relative">
                <div className="flex flex-col gap-4">
                    <h1 className="font-semibold text-md text-warning-900">
                        {t("Awaited Numbers")}
                    </h1>
                    <p className="text-5xl font-bold text-warning-800">
                        {totalAwaiting}
                    </p>
                    <p className="text-sm font-semibold text-warning-800">
                        <span
                            className={
                                // dynamic percentage color
                                iconPercentageAwaiting === "-"
                                    ? "text-danger"
                                    : "text-success"
                            }>
                            {iconPercentageAwaiting}
                            {percentageIncreaseAwaiting}%
                        </span>{" "}
                        {t("Vs last campaign")}
                    </p>
                </div>
                <div className="absolute right-8">
                    <Icon
                        icon="streamline:interface-signal-graph-heart-line-beat-square-graph-stats"
                        width="3em"
                        height="3em"
                        className="text-warning"
                    />
                </div>
            </div>
        </div>
    );
}
