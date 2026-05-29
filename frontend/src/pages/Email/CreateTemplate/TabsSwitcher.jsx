import React, { Suspense, lazy } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

// Lazy load the tab components
const CampaignPage = lazy(() => import("./Tabs/CampaignPage/Page"));

export default function EmailTabsSwitcher() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <CampaignPage />
        </Suspense>
    );
}
