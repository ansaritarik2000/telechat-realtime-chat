import React, { lazy, Suspense } from "react";
import { Tabs, Tab } from "@heroui/react";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

// Lazy load the tab components
const History = lazy(() => import("./History/History"));
const BillingInfo = lazy(() => import("./BillingInfo/BillingInfo"));
const CreditsUsage = lazy(() => import("./Usage/CreditsUsage"));

export default function TabsSwitcher() {
  const [selected, setSelected] = React.useState("history");

  const handleTabChange = (key) => {
    setSelected(key);
  };

  return (
    <div className="flex flex-col gap-4 py-4">
      <Tabs
        aria-label="Tabs"
        selectedKey={selected}
        onSelectionChange={handleTabChange}
        variant="underlined"
        color="success"
        size="lg"
      >
        <Tab key="history" id="history" title="History">
          <Suspense fallback={<LoadingSpinner />}>
            <History />
          </Suspense>
        </Tab>
        <Tab key="usage" id="usage" title="Usage">
          <Suspense fallback={<LoadingSpinner />}>
            <CreditsUsage />
          </Suspense>
        </Tab>
        <Tab key="billinginfo" id="billinginfo" title="Billing Info">
          <Suspense fallback={<LoadingSpinner />}>
            <BillingInfo />
          </Suspense>
        </Tab>
      </Tabs>
    </div>
  );
}
