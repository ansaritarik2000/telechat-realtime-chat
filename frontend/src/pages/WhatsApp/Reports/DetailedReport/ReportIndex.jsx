import React from "react";
import ReportCards from "./ReportCards";
import { useLocation } from "react-router-dom";
import DetailedTable from "./DetailedTable/Index";
import Crumb from "../../../../components/Breadcrumb/Crumb";
import ReportsContainer from "../../../../components/Common/ReportsContainer";
import MetricCards from "../../../../components/StatsCards/MetricCards";

export default function WhatsAppDetailedReport() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const campaignName = queryParams.get("campaignName");

    return (
        <div className="flex flex-col gap-4">
            <Crumb
                secondSib="WA Reports & Overview"
                secondURL="/wareports"
                thirdSib={`Detailed Report for ${campaignName}`}
            />

            <ReportsContainer>
                <ReportCards />

                <MetricCards invalidCount="350" duplicateCount="150" />

                <DetailedTable />
            </ReportsContainer>
        </div>
    );
}
