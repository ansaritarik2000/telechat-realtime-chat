import React from "react";
import ReportCards from "./ReportCards";
import DetailedTable from "./DetailedTable/Index";
import { useLocation } from "react-router-dom";
import Crumb from "../../../../components/Breadcrumb/Crumb";
import MetricCards from "../../../../components/StatsCards/MetricCards";

export default function RCSDetailedReport() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const campaignName = queryParams.get("campaignName");

    return (
        <div className="flex flex-col gap-4">
            <Crumb
                secondSib="RCS Reports & Overview"
                secondURL="/rcsreports"
                thirdSib={`Detailed Report for ${campaignName}`}
            />

            <section className="px-2 flex flex-col gap-6">
                <div className="p-6 border border-default rounded-lg shadow-sm flex flex-col gap-8 bg-gray-100/40 dark:bg-content2">
                    <ReportCards />

                    <MetricCards invalidCount="350" duplicateCount="150" />

                    <DetailedTable />
                </div>
            </section>
        </div>
    );
}
