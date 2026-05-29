import React, { Suspense, lazy } from "react";

import Crumb from "../../../components/Breadcrumb/Crumb";
import DatePiker from "../../../components/DatePicker/DatePiker";
import DashboardDatePicker from "../../../components/DatePicker/DashboardDatePicker";
import { useTranslation } from "react-i18next";

// Lazy load the chart components
const SplineChart = lazy(() =>
  import("../../../components/charts/SMS/SmsHourlyReportChart")
);
const ColumnChart = lazy(() =>
  import("../../../components/charts/SMS/SmsWeeklyReportChart")
);
const RadarChart = lazy(() =>
  import("../../../components/charts/SMS/SmsYearlyReportChart")
);

export default function SMSDash() {
  const { t } = useTranslation();
  return (
    <div className="px-4 py-1">
      {/* Breadcrumb */}
      <Crumb secondSib={t("SMS Dashboard")} />

      {/* Date Picker */}
      {/* <DatePiker /> */}
      <DashboardDatePicker />

      {/* Body */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="col-span-4 border rounded-md p-4 shadow-lg">
          <p className="text-default-800 font-semibold">
            {t("Weekly Report ")}
          </p>
          <Suspense fallback={<div>Loading Column Chart...</div>}>
            <ColumnChart />
          </Suspense>
        </div>
        <div className="col-span-2  border rounded-md p-4 shadow-lg">
          <p className="text-default-800 font-semibold">{t("Hourly Report")}</p>
          <Suspense fallback={<div>Loading Spline Chart...</div>}>
            <SplineChart />
          </Suspense>
        </div>
        <div className="col-span-2  border rounded-md p-4 shadow-lg">
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
