import React, { lazy, Suspense } from "react";
import { Tabs, Tab } from "@heroui/react";
import { useLocation } from "react-router-dom";
import { ChartIcon, DetailsReportIcon } from "../../../../utils/ReusableIcons";
// import MetricCards from "./MetricCards";
import Crumb from "../../../../components/Breadcrumb/Crumb";
import MetricCards from "../../../../components/StatsCards/MetricCards";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import ReportsContainer from "../../../../components/Common/ReportsContainer";
// import LinkShortnerStats from "../../../../components/StatsCards/LinkShortnerStats";

// Lazy load the components
const ReportCards = lazy(() => import("./ReportCards"));
const DetailedTable = lazy(() => import("./DetailedTable/Index"));
const ClickerTable = lazy(() => import("./ClickerDataTable/ClickerIndex"));

export default function SMSDetailedReport() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const campaignName = queryParams.get("campaignName");

  return (
    <div className="flex flex-col gap-4">
      <Crumb
        secondSib="SMS Reports & Overview"
        secondURL="/smsreports"
        thirdSib={`Detailed Report for ${campaignName}`}
      />

      <ReportsContainer>
        <Suspense fallback={<LoadingSpinner />}>
          <ReportCards />
        </Suspense>

        {/* Metric Cards */}
        <MetricCards invalidCount="350" duplicateCount="150" />

        {/* Detailed Report Table & Clicker Data */}
        <div>
          <Tabs size="sm" variant="bordered">
            <Tab
              key="detailed_report"
              title={
                <div className="flex items-center gap-1">
                  <DetailsReportIcon size="1.5em" />
                  Detailed Report
                </div>
              }
            >
              <Suspense fallback={<LoadingSpinner />}>
                <DetailedTable />
              </Suspense>
            </Tab>

            <Tab
              key="clicker_report"
              title={
                <div className="flex items-center gap-1">
                  <ChartIcon size="1.5em" />
                  Clicker Report
                </div>
              }
            >
              <div className="flex flex-col gap-6">
                {/* Link Shortner Stats */}
                {/* <LinkShortnerStats
                  totalVisits={"123456"}
                  uniqueVisits={"4528"}
                  topCountry={"India"}
                /> */}

                <Suspense fallback={<LoadingSpinner />}>
                  <ClickerTable />
                </Suspense>
              </div>
            </Tab>
          </Tabs>
        </div>
      </ReportsContainer>
    </div>
  );
}
