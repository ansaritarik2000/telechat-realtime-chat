import React, { Suspense, lazy } from "react";
import { Tabs, Tab } from "@heroui/react";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner.jsx";
import CampaignReportsTable from "./CampaignTable/Index.jsx";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify-icon/react";
import { useQueryState } from "nuqs";
// Lazy load the tables

const HeaderAndTemplateIndex = lazy(() =>
    import("./HeaderAndTemplate/Index.jsx")
);
const CreditsHistoryTable = lazy(() =>
    import("./CreditHistoryTable/Index.jsx")
);

export default function TabsSwitcher() {
    const [tab, setTab] = useQueryState("tab", { defaultValue: "sms-reports" });
    const { t } = useTranslation();

    const handleTabChange = (key) => {
        setTab(key);
    };

    return (
        <div className="flex flex-col gap-4 py-4">
            <Tabs
                aria-label="Tabs"
                style={{ color: "white" }}
                selectedKey={tab}
                onSelectionChange={handleTabChange}
                variant="bordered"
                color="warning"
                size="sm"
                radius="lg"
            >
                <Tab
                    key="sms-reports"
                    id="reports"
                    title={
                        <Title title={t("Campaign")} icon="noto:loudspeaker" />
                    }
                >
                    <CampaignReportsTable hasRangeCal={true} />
                </Tab>

                <Tab
                    key="template-header"
                    id="senderid"
                    title={
                        <Title
                            title={t("Template & Header")}
                            icon="twemoji:file-folder"
                        />
                    }
                >
                    <Suspense fallback={<LoadingSpinner />}>
                        <HeaderAndTemplateIndex hasRangeCal={true} />
                    </Suspense>
                </Tab>

                <Tab
                    key="credit-history"
                    id="credithistory"
                    title={
                        <Title
                            title={t("Credit History")}
                            icon="noto:credit-card"
                        />
                    }
                >
                    <Suspense fallback={<LoadingSpinner />}>
                        <CreditsHistoryTable />
                    </Suspense>
                </Tab>
            </Tabs>
        </div>
    );
}

// Title Component
const Title = ({ title, icon }) => {
    return (
        <div className={`flex items-center justify-center space-x-2`}>
            <Icon icon={icon} width="1.2em" height="1.2em" />
            <p>{title}</p>
        </div>
    );
};
