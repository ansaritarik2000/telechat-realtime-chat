import React, { Suspense, lazy, useEffect } from "react";
import { Tabs, Tab } from "@heroui/react";
import ReportsTable from "./CampaignTable/Index.jsx";
import CreditHistoryTable from "./CreditHistoryTable/Index.jsx";
import HeaderAndTemplateTable from "./HeaderAndTemplate/Index.jsx";
import CreditsHistoryTable from "./CreditHistoryTable/Index.jsx";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner.jsx";
import { useTranslation } from "react-i18next";
import PrebuiltTab from "../../CreateTemplate/Tabs/PrebuiltTab.jsx";
import EmailInboxReport from "./InboxHealth/Index.jsx";
import { Icon } from "@iconify-icon/react";
import { useQueryState } from "nuqs";
import { useNavigate } from "react-router-dom";

export default function TabsSwitcher() {
    const [selected, setSelected] = useQueryState("tab", {
        defaultValue: "campaign",
    });
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleTabChange = (key) => {
        setSelected(key);
    };
    useEffect(() => {
        navigate(`?tab=${selected}`);
    }, [selected, navigate]);
    return (
        <div className="flex flex-col gap-4 py-4">
            <Tabs
                aria-label="Tabs"
                selectedKey={selected}
                onSelectionChange={handleTabChange}
                variant="bordered"
                size="sm"
                radius="lg"
            >
                <Tab
                    key="campaign"
                    title={
                        <Title title={t("Campaign")} icon="noto:loudspeaker" />
                    }
                >
                    <Suspense fallback={<LoadingSpinner />}>
                        <ReportsTable hasRangeCal={true} />
                    </Suspense>
                </Tab>

                <Tab
                    key="senderid"
                    title={
                        <Title
                            title={t("Templates")}
                            icon="twemoji:file-folder"
                        />
                    }
                >
                    <Suspense fallback={<LoadingSpinner />}>
                        <PrebuiltTab />
                    </Suspense>
                </Tab>

                <Tab
                    key="InboxHealth"
                    title={
                        <Title
                            title={t("Inbox Health")}
                            icon="fluent-emoji-flat:inbox-tray"
                        />
                    }
                >
                    <Suspense fallback={<LoadingSpinner />}>
                        <EmailInboxReport />
                    </Suspense>
                </Tab>

                <Tab
                    key="credithistory"
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
