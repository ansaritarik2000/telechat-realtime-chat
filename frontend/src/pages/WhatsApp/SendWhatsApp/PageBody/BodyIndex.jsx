import React, { lazy, Suspense } from "react";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { t } from "i18next";
// Lazy load the components
const CampaignIndex = lazy(() => import("./Campaign/LaunchIndex"));

export default function BodyIndex() {
    return (
        <div>
            <Suspense fallback={<LoadingSpinner />}>
                <CampaignIndex />
            </Suspense>
        </div>
    );
}
