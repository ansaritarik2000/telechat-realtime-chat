import React, { lazy, Suspense, useEffect, useState } from "react";
import { Icon } from "@iconify-icon/react";
import MeterCard from "../../../../components/StatsCards/MeterCard";
const OpenChart = lazy(() => import("./OpenChart"));
const ClickChart = lazy(() => import("./ClickChart"));
const SpamChart = lazy(() => import("./SpamChart"));
import {
    successChartData,
    failedChartData,
    awaitedChartData,
} from "./ChartData";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { axiosServerInstance } from "../../../../utils/axios/config";

export default function ReportCards() {
    const [URLSearchParams] = useSearchParams();
    const [users, setUsers] = useState({});
    const [submittedCredits, setSubmittedCredits] = useState(0);
    const [deliveredCredits, setDeliveredCredits] = useState(0);
    // const  campaign_id  =  URLSearchParams.get('campaign_id')
    useEffect(() => {
        const campaign_id = URLSearchParams.get("campaign_id");
        console.log("campaign_id:", campaign_id);
        const fetchData = async () => {
            try {
                const res = await axiosServerInstance.get(
                    `/email/send-email-campaign/${campaign_id}`
                );
                const data = res.data.statusCounts;
                setUsers(data);
                setSubmittedCredits(data.total);
                setDeliveredCredits(data.delivered);
            } catch (error) {
                console.log("error", error.message);
                throw error;
            }
        };
        fetchData();
    }, []);
    // console.log(users,'bob')
    return (
        <div>
            {/* First set of cards */}
            <div className="grid grid-cols-4 gap-4 w-full">
                {/* Submitted Emails Card */}
                <div className="col-span-1 bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-200 rounded-md px-8 py-8 flex items-center justify-between shadow-lg relative">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-semibold text-md text-primary-900">
                            Submitted Emails
                        </h1>
                        <p className="text-5xl font-bold text-primary-800">
                            {submittedCredits}
                        </p>
                        <p className="text-sm font-semibold text-primary-800">
                            <span className="text-success">+20%</span> Vs last
                            campaign
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

                {/* Delivered Emails Card */}
                <div className="col-span-1 bg-gradient-to-r from-success-50 to-success-100 border-2 border-success-200 rounded-md px-8 py-8 flex items-center justify-between shadow-lg relative">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-semibold text-md text-success-900">
                            Delivered Emails
                        </h1>
                        <p className="text-5xl font-bold text-success-800">
                            {deliveredCredits}
                        </p>
                        <p className="text-sm font-semibold text-success-800">
                            <span className="text-success">+10%</span> Vs last
                            campaign
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

                {/* Failed Emails Card */}
                <div className="col-span-1 bg-gradient-to-r from-danger-50 to-danger-100 border-2 border-danger-200 rounded-md px-8 py-8 flex items-center justify-between shadow-lg relative">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-semibold text-md text-danger-900">
                            Failed Emails
                        </h1>
                        <p className="text-5xl font-bold text-danger-800">
                            {users.failed}
                        </p>
                        <p className="text-sm font-semibold text-danger-800">
                            <span className="text-danger">-70%</span> Vs last
                            campaign
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

                {/* Awaited Emails Card */}
                <div className="col-span-1 bg-gradient-to-r from-warning-50 to-warning-100 border-2 border-warning-200 rounded-md px-8 py-8 flex items-center justify-between shadow-lg relative">
                    <div className="flex flex-col gap-4">
                        <h1 className="font-semibold text-md text-warning-900">
                            Awaited Emails
                        </h1>
                        <p className="text-5xl font-bold text-warning-800">
                            {users.failed}
                        </p>
                        <p className="text-sm font-semibold text-warning-800">
                            <span className="text-danger">-10%</span> Vs last
                            campaign
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

            <div className="mt-8 grid grid-cols-3 gap-4 w-full">
                {/* Meter Cards */}
                <MeterCard
                    icon="ph:envelope-simple-open"
                    label="Open Rate"
                    color="success"
                    value={users.delivered}
                    percent={(users.delivered / users.total) * 100}
                />
                <MeterCard
                    icon="fluent:cursor-click-24-regular"
                    color="primary"
                    label="Click Rate"
                    value={users.open}
                    percent={(users.open / users.total) * 100}
                />
                <MeterCard
                    icon="hugeicons:spam"
                    color="danger"
                    label="Spam Rate"
                    value={users.failed}
                    percent={(users.failed / users.total) * 100}
                />

                {/* Open Chart */}
                {/* <ChartWrapper
          icon="ph:envelope-simple-open"
          label="Open Rate"
          color="success"
          suspenseComponent={
            <OpenChart
              percentage={(users.delivered / users.total) * 100}
              current={users.delivered}
              total={users.total}
            />
          }
        /> */}

                {/* Click Chart */}
                {/* <ChartWrapper
          icon="fluent:cursor-click-24-regular"
          color="primary"
          label="Click Rate"
          suspenseComponent={
            <ClickChart
              percentage={(users.open / users.total) * 100}
              current={users.open}
              total={users.total}
            />
          }
        /> */}

                {/* Spam Chart */}
                {/* <ChartWrapper
          icon="hugeicons:spam"
          color="danger"
          label="Spam Rate"
          suspenseComponent={
            <SpamChart
              percentage={(users.failed / users.total) * 100}
              current={users.failed}
              total={users.total}
            />
          }
        /> */}
            </div>
        </div>
    );
}

const ChartWrapper = ({ icon, suspenseComponent, label, color }) => {
    return (
        <div className="col-span-1 relative p-6 rounded-md border-2 dark:border-content2  shadow-sm h-52">
            <div className="flex justify-between items-center ">
                <p className="text-md font-semibold ">{label}</p>
                <Icon
                    icon={icon}
                    width="2em"
                    height="2em"
                    className={`text-${color}-500`}
                />
            </div>

            <div className="-mt-4 h-full w-full flex justify-center items-center ">
                <Suspense fallback={<div>Loading chart...</div>}>
                    {suspenseComponent}
                </Suspense>
            </div>
        </div>
    );
};
