import React, { lazy, Suspense } from "react";
import Crumb from "../../components/Breadcrumb/Crumb";
import DashboardDatePicker from "../../components/charts/whatsapp/DashboardDatePicker";

// Lazy load the chart components
const ColumnChart = lazy(() => import("../../components/charts/whatsapp/ColumnChart"));
const SplineChart = lazy(() => import("../../components/charts/whatsapp/SplineChart"));
const RadarChart = lazy(() => import("../../components/charts/whatsapp/RadarChart"));

export default function WhatsAppDashPage() {
    return (
        <div className="px-10 py-1">
            <Crumb secondSib="WhatsApp Dashboard" />
            <DashboardDatePicker />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="col-span-4 border rounded-md p-4">
                    <p className="text-default-800 font-semibold">
                        Weekly Report
                    </p>
                    <Suspense fallback={<div>Loading Column Chart...</div>}>
                        <ColumnChart />
                    </Suspense>
                </div>

                <div className="col-span-2  border rounded-md p-4">
                    <p className="text-default-800 font-semibold">
                        Hourly Report
                    </p>
                    <Suspense fallback={<div>Loading Spline Chart...</div>}>
                        <SplineChart />
                    </Suspense>
                </div>
                <div className="col-span-2  border rounded-md p-4">
                    <p className="text-default-800 font-semibold">
                        Monthly Report
                    </p>
                    <Suspense fallback={<div>Loading Spline Chart...</div>}>
                        <RadarChart />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
