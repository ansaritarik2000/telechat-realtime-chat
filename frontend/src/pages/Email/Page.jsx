import React, { Suspense, lazy, useEffect, useState } from "react";
import Crumb from "../../components/Breadcrumb/Crumb";
import DatePickerComp from "../../components/DatePicker/DatePicker";
import { useTranslation } from "react-i18next";
import MeterCard from "../../components/StatsCards/MeterCard";
import axios from "axios";
// Lazy load the chart components
const ColumnChart = lazy(() => import("../../components/charts/ColumnChart"));
const SplineChart = lazy(() => import("../../components/charts/SplineChart"));
import DashboardDatePicker from "../../components/DatePicker/DashboardDatePicker";
import { useEmailDashStore } from "../../store/emailCampaign/dashboardDate";
import { formatDateRangeDashboard } from "./CreateTemplate/Tabs/Buttons/ActionButtonFun";
import { axiosServerInstance } from "../../utils/axios/config";

export default function EmailDashPage() {
    const { t } = useTranslation();
    const { emailDashboardDate, EmailDashboard, setEmailDashboard } =
        useEmailDashStore();
    const [start, setStart] = useState();
    const [end, setEnd] = useState();
    useEffect(() => {
        const date = formatDateRangeDashboard(emailDashboardDate);
        console.log("start", date.formattedStart, "and end", date.formattedEnd);

        const fetchData = async () => {
            const { setEmailDashboard } = useEmailDashStore.getState();
            try {
                const response = await axiosServerInstance.get(
                    `/email/get-statistics?startDate=${date.formattedStart}&endDate=${date.formattedEnd}`
                );

                setEmailDashboard(response.data);
                // const updatedState = useEmailDashStore.getState();
                // console.log('Updated EmailDashboard State:', updatedState.EmailDashboard);
            } catch (error) {
                console.log("Getting Error from Daterange", error);
                throw error;
            }
        };
        fetchData();
    }, [emailDashboardDate]);

    return (
        <div className="px-10 py-4">
            {/* Breadcrumb and Date Picker */}
            <Crumb secondSib={t("Email Dashboard")} />

            {/* Date Picker */}
            {/* <DatePickerComp  /> */}
            <DashboardDatePicker />
            {/* Main Grid Layout */}
            <div className="flex flex-col gap-4">
                {/* Column Chart */}
                <div className="col-span-3 border rounded-md p-4">
                    <p className="text-default-800 font-semibold">
                        {t("Weekly Report")}
                    </p>
                    <Suspense fallback={<div>Loading Column Chart...</div>}>
                        <ColumnChart />
                    </Suspense>
                </div>

                {/* Meter Charts */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4 h-44">
                    {/* Meter Card */}
                    <MeterCard
                        label="Open Rate"
                        color="success"
                        icon="ph:envelope-simple-open"
                        value={EmailDashboard.totalOpens}
                        percent={EmailDashboard.openRate}
                    />

                    <MeterCard
                        label="Bounce Rate"
                        color="primary"
                        icon="fluent:cursor-click-24-regular"
                        value={EmailDashboard.totalBounces}
                        percent={EmailDashboard.bounceRate}
                    />

                    <MeterCard
                        label="Spam Rate"
                        color="danger"
                        icon="hugeicons:spam"
                        value={EmailDashboard.totalClicks}
                        percent={EmailDashboard.clickRate}
                    />
                </div>

                {/* Spline Chart */}
                <div className="col-span-3 border rounded-md p-4">
                    <p className="text-default-800 font-semibold">
                        {t("Hourly Report")}
                    </p>
                    <Suspense fallback={<div>Loading Spline Chart...</div>}>
                        <SplineChart />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
