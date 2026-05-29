import React, { lazy, Suspense } from "react";
import Crumb from "../../../components/Breadcrumb/Crumb";
import { useTranslation } from "react-i18next";
import DashboardDatePicker from "../../../components/DatePicker/DashboardDatePicker";

// Lazy load the chart components
const SplineChart = lazy(() =>
    import("../../../components/charts/RCS/RcsHourlyReportChart")
);
const ColumnChart = lazy(() =>
    import("../../../components/charts/RCS/RcsWeeklyReportChart")
);
const RadarChart = lazy(() =>
    import("../../../components/charts/RCS/RcsYearlyReportChart")
);

export default function RCSPage() {
    const { t } = useTranslation();
    return (
        <div className="px-4 py-1">
            <Crumb secondSib="RCS Dashboard" />

            {/* Date picker */}
            <DashboardDatePicker />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="col-span-4 border rounded-md p-4">
                    <p className="text-default-800 font-semibold">
                        {t("Weekly Report ")}
                    </p>
                    {/* Use Suspense to wrap lazy-loaded components */}
                    <Suspense fallback={<div>Loading Column Chart...</div>}>
                        <ColumnChart />
                    </Suspense>
                </div>
                <div className="col-span-2  border rounded-md p-4">
                    <p className="text-default-800 font-semibold">
                        {t("Hourly Report")}
                    </p>
                    {/* Use Suspense to wrap lazy-loaded components */}
                    <Suspense fallback={<div>Loading Spline Chart...</div>}>
                        <SplineChart />
                    </Suspense>
                </div>
                <div className="col-span-2  border rounded-md p-4">
                    <p className="text-default-800 font-semibold">
                        {t("Monthly Report")}
                    </p>
                    <Suspense fallback={<div>Loading Radar Chart...</div>}>
                        <RadarChart />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
