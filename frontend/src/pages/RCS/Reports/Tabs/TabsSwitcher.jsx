import React, { lazy, Suspense } from "react";

import { Tabs, Tab } from "@heroui/react";
import ReportsTable from "./CampaignTable/Index.jsx";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner.jsx";
import { useTranslation } from "react-i18next";
import { Icon } from "@iconify-icon/react";
import { useQueryState } from "nuqs";

// Lazy load the components
const RCSTemplates = lazy(() => import("./Templates/Index.jsx"));
const RCSBots = lazy(() => import("./Bots/Index.jsx"));
const CreditsHistoryTable = lazy(() =>
    import("./CreditHistoryTable/Index.jsx")
);
// const RCSInbox = lazy(() => import("./Inbox/RCSInboxIndex.jsx"));
const RCSChatInbox = lazy(() => import("./Inbox/RCSChatInbox.jsx"));

// Title Component
const Title = ({ title, icon }) => {
    return (
        <div className={`flex items-center justify-center space-x-2`}>
            <Icon icon={icon} width="1.2em" height="1.2em" />
            <p>{title}</p>
        </div>
    );
};

export default function TabsSwitcher() {
    const [tab, setTab] = useQueryState("tab", { defaultValue: "rcs-reports" });

    const { t } = useTranslation();

    const handleTabChange = (key) => {
        setTab(key);
    };

    return (
        <div className="flex flex-col h-[90vh]  py-4 ">
            <Tabs
                aria-label="Tabs"
                selectedKey={tab}
                onSelectionChange={handleTabChange}
                variant="bordered"
                color="primary"
                size="sm"
                radius="lg">
                <Tab
                    key="rcs-reports"
                    id="rcs-reports"
                    title={
                        <Title title={t("Reports")} icon="noto:loudspeaker" />
                    }>
                    {/* <div className="h-[85vh] rounded-xl p-4 border dark:border-default bg-gray-50 dark:bg-background">
          </div> */}
                    <ReportsTable hasRangeCal={true} />
                </Tab>

                <Tab
                    key="rcs-inbox"
                    id="rcs-inbox"
                    title={
                        <Title
                            title={t("Inbox")}
                            icon="fluent-emoji-flat:inbox-tray"
                        />
                    }>
                    <Suspense fallback={<LoadingSpinner />}>
                        <RCSChatInbox />
                    </Suspense>
                </Tab>

                <Tab
                    key="rcs-templates"
                    id="rcs-templates"
                    title={
                        <Title
                            title={t("Templates")}
                            icon="twemoji:file-folder"
                        />
                    }>
                    <Suspense fallback={<LoadingSpinner />}>
                        <RCSTemplates />
                    </Suspense>
                </Tab>

                <Tab
                    key="rcs-bot"
                    id="rcs-bot"
                    title={
                        <Title
                            title={t("Bots")}
                            icon="fluent-emoji-flat:robot"
                        />
                    }>
                    <Suspense fallback={<LoadingSpinner />}>
                        <RCSBots />
                    </Suspense>
                </Tab>

                <Tab
                    key="rcs-credit-history"
                    id="rcs-credit-history"
                    title={
                        <Title
                            title={t("Credit History")}
                            icon="noto:credit-card"
                        />
                    }>
                    <Suspense fallback={<LoadingSpinner />}>
                        <CreditsHistoryTable />
                    </Suspense>
                </Tab>
            </Tabs>
        </div>
    );
}
