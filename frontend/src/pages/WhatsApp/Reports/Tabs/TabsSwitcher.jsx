import React, { lazy, Suspense, useEffect } from "react";
import { Tabs, Tab } from "@heroui/react";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner.jsx";
import { Icon } from "@iconify-icon/react";
import AgentsIndex from "./Agents/AgentTaskIndex.jsx";
import SettingsIndex from "./Settings/SettingsIndex.jsx";
import WhatsAppInbox from "./Inbox/WhatsAppIndex.jsx";
import { useQueryState } from "nuqs";
import { useNavigate } from "react-router-dom";
// Lazy load the components
const ReportsTable = lazy(() => import("./CampaignTable/Index.jsx"));
const TemplateTable = lazy(() => import("./TemplateTable/Index.jsx"));
const CreditsHistoryTable = lazy(() =>
  import("./CreditHistoryTable/Index.jsx")
);

export default function TabsSwitcher() {
  const [selected, setSelected] = useQueryState("tab", { defaultValue: "campaign" });
  const navigate = useNavigate();
  const handleTabChange = (key) => {
    setSelected(key);
  };
  useEffect(() => {
    navigate(`?tab=${selected}`);
  }, [selected, navigate]);
  return (
    <div className="flex flex-col gap-4 pt-2">
      <Tabs
        aria-label="Tabs"
        selectedKey={selected}
        onSelectionChange={handleTabChange}
        variant="bordered"
        color="success"
        size="sm"
        radius="lg"
      >
        <Tab
          key="campaign"
          id="reports"
          title={<Title title="Campaign" icon="noto:loudspeaker" />}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <ReportsTable hasRangeCal={true} />
          </Suspense>
        </Tab>

        {/* Inbox */}
        <Tab
          key="inbox"
          id="inbox"
          title={<Title title="Inbox" icon="fluent-emoji-flat:inbox-tray" />}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <WhatsAppInbox />
          </Suspense>
        </Tab>

        {/* Agents */}
        <Tab
          key="agentask"
          id="agentask"
          title={
            <Title
              title="Agent Tasks"
              icon="fluent-emoji:person-pouting-light"
            />
          }
        >
          <AgentsIndex />
        </Tab>

        <Tab
          key="templates"
        
          title={<Title title="Templates" icon="twemoji:file-folder" />}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <TemplateTable />
          </Suspense>
        </Tab>

        <Tab
          key="credithistory"
          id="credithistory"
          title={<Title title="Credit History" icon="noto:credit-card" />}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <CreditsHistoryTable />
          </Suspense>
        </Tab>

        {/* Settings */}
        <Tab
          key="settings"
          id="settings"
          title={<Title title="Settings" icon="noto:gear" />}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <SettingsIndex />
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
