import React, { lazy, Suspense } from "react";
import Crumb from "../../../components/Breadcrumb/Crumb.jsx";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner.jsx";
import { useTranslation } from "react-i18next";

// Lazy load the TabsSwitcher component
const TabsSwitcher = lazy(() => import("./Tabs/TabsSwitcher.jsx"));

export default function SMSReportsPage() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col">
            {/* Breadcrumb */}
            <Crumb secondSib={t("SMS Reports & Overview")} />

            {/* Tabs */}
            <Suspense fallback={<LoadingSpinner />}>
                <TabsSwitcher />
            </Suspense>
        </div>
    );
}
