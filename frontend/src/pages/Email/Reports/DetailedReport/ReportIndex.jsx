import React from "react";
import ReportCards from "./ReportCards";
import DetailedTable from "./DetailedTable/Index";
import { useLocation } from "react-router-dom";
import Crumb from "../../../../components/Breadcrumb/Crumb";
import ReportsContainer from "../../../../components/Common/ReportsContainer";
import MetricCards from "../../../../components/StatsCards/MetricCards";

export default function RCSDetailedReport() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const campaignName = queryParams.get("campaignName");
    return (
        <section className=" flex flex-col gap-4">
            <Crumb
                secondSib="Email Reports & Overview"
                secondURL="/emailreports"
                thirdSib={`Detailed Report for ${campaignName}`}
            />

            <ReportsContainer>
                <ReportCards />

                <MetricCards invalidCount="352" duplicateCount="120" />

                <DetailedTable />
            </ReportsContainer>
        </section>
    );
}
