import React, { lazy, Suspense } from "react";
import Crumb from "../../../components/Breadcrumb/Crumb.jsx";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner.jsx";
const TabsSwitcher = lazy(() => import("./Tabs/TabsSwitcher.jsx"));

export default function WhatsAppReportsPage() {
  return (
    <div className="flex flex-col">
      {/* Breadcrumb */}
      <Crumb secondSib="WhatsApp Reports" />

      {/* Tabs Switcher */}
      <Suspense fallback={<LoadingSpinner />}>
        <TabsSwitcher />
      </Suspense>
    </div>
  );
}
